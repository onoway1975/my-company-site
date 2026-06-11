/* chara-model.js — みどりキャラ 3D model builder (shared)
   Usage: window.CharaModel.build() -> { group, parts } 
   Body geometry is SHARED across all built characters (for global spike FX).
   CharaModel.applySpikes(amp, dir, seed) deforms the shared body geometry. */
(function(){
  "use strict";

  const COL = {
    green:   0x6cba62,
    greenDk: 0x3aa830,
    ink:     0x241916,
    white:   0xfdfdfb,
    gray:    0x565554,
  };

  let G5=null, MAT=null;
  function gradTex(stops){
    const c=document.createElement('canvas');c.width=stops;c.height=1;
    const g=c.getContext('2d');
    for(let i=0;i<stops;i++){const v=Math.round(255*Math.min(1,Math.pow(i/(stops-1),0.95)*0.96+0.04));g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(i,0,1,1);}
    const t=new THREE.CanvasTexture(c);t.minFilter=THREE.NearestFilter;t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;
    return t;
  }
  function toon(color, opts){
    opts=opts||{};
    const m=new THREE.MeshToonMaterial({color:color, gradientMap:G5});
    if(opts.emissive){m.emissive=new THREE.Color(opts.emissive);m.emissiveIntensity=opts.emissiveIntensity||0.15;}
    if(opts.doubleSide){m.side=THREE.DoubleSide;}
    return m;
  }
  function initMats(){
    if(MAT) return;
    G5 = gradTex(5);
    MAT = {
      body:  toon(COL.green,  {emissive:0x214a1c, emissiveIntensity:0.06}),
      arm:   toon(COL.greenDk,{emissive:0x15360f, emissiveIntensity:0.06}),
      ink:   toon(COL.ink),
      white: toon(COL.white,  {emissive:0xe7e4dc, emissiveIntensity:0.10}),
      whiteDS: toon(COL.white,{emissive:0xe7e4dc, emissiveIntensity:0.10, doubleSide:true}),
      gray:  toon(COL.gray),
    };
  }

  // ---------- geometry helpers ----------
  function smoothstep(t){return t*t*(3-2*t);}
  function blobGeo(rx,ry,rz, taperBottom, taperTop, detail){
    const seg = detail||72;
    const g = new THREE.SphereGeometry(1, seg, Math.round(seg*0.75));
    const p = g.attributes.position, nrm = g.attributes.normal;
    const v = new THREE.Vector3();
    for(let i=0;i<p.count;i++){
      v.fromBufferAttribute(p,i);
      const t = (v.y+1)/2;
      const taper = taperBottom + (taperTop-taperBottom)*smoothstep(t);
      const ux=v.x, uy=v.y, uz=v.z; // unit sphere coords
      p.setXYZ(i, ux*rx*taper, uy*ry, uz*rz*taper);
      // analytic ellipsoid normal (smooth — avoids triangulation ripple)
      const nx=ux/(rx*taper), ny=uy/ry, nz=uz/(rz*taper);
      const il=1/Math.sqrt(nx*nx+ny*ny+nz*nz);
      nrm.setXYZ(i, nx*il, ny*il, nz*il);
    }
    p.needsUpdate = true; nrm.needsUpdate = true;
    return g;
  }
  function ellipsoid(rx,ry,rz,detail){
    const g=new THREE.SphereGeometry(1,detail||48,detail||36);
    g.scale(rx,ry,rz);
    return g;
  }
  function eyeHighlightGeo(){
    const hw=0.255, N=44, pts=[];
    const yCB=-0.30, yCT=-0.04, tip=0.21, bc=0.47;
    for(let i=0;i<=N;i++){const u=-1+2*i/N; pts.push(new THREE.Vector2(u*hw, yCB+bc*u*u));}
    for(let i=N;i>=0;i--){const u=-1+2*i/N; pts.push(new THREE.Vector2(u*hw, yCT+tip*u*u));}
    return new THREE.ShapeGeometry(new THREE.Shape(pts), 1);
  }
  function smileTube(width, droop, radius){
    const pts=[];
    for(let i=0;i<=16;i++){const t=i/16; const x=(t-0.5)*width;
      const y=-droop*Math.sin(Math.PI*t); pts.push(new THREE.Vector3(x,y,0));}
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, radius, 10, false);
  }
  function mesh(geo,mat,cast){
    const m=new THREE.Mesh(geo,mat);
    m.castShadow = cast!==false; m.receiveShadow=false;
    return m;
  }

  // ---------- shared body geometry (spike-deformable) ----------
  let bodyGeo=null, baseP=null, baseN=null, spikeR=null, spiked=false;
  function getBodyGeo(){
    if(bodyGeo) return bodyGeo;
    bodyGeo = blobGeo(1.45, 1.30, 1.18, 0.80, 1.06, 64);
    baseP = bodyGeo.attributes.position.array.slice();
    baseN = bodyGeo.attributes.normal.array.slice();
    // per-vertex stable random (from base position hash)
    const n=bodyGeo.attributes.position.count;
    spikeR=new Float32Array(n);
    for(let i=0;i<n;i++){
      const x=baseP[i*3],y=baseP[i*3+1],z=baseP[i*3+2];
      spikeR[i]=Math.abs(Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453)%1;
    }
    return bodyGeo;
  }

  /* makeSpikes: pick random surface vertices as spike centers (biased toward dir).
     Returns [{cx,cy,cz,nx,ny,nz,len,r}] for applySpikes. */
  function makeSpikes(dir, count){
    getBodyGeo();
    const n=bodyGeo.attributes.position.count;
    const spikes=[]; let tries=0;
    while(spikes.length<count && tries<500){
      tries++;
      const i=(Math.random()*n)|0, j=i*3;
      const nx=baseN[j], ny=baseN[j+1], nz=baseN[j+2];
      if(dir){
        const d=nx*dir.x+ny*dir.y+nz*dir.z;
        if(d<0 && Math.random()<0.8) continue;
        if(d<0.35 && Math.random()<0.4) continue;
      }
      if(ny<-0.75 && Math.random()<0.7) continue; // keep the underside mostly clean
      spikes.push({cx:baseP[j],cy:baseP[j+1],cz:baseP[j+2], nx,ny,nz,
        len:.9+Math.random()*1.5, r:.30+Math.random()*.28});
    }
    return spikes;
  }

  /* applySpikes: amp 0..1, spikes from makeSpikes(). Each spike pulls nearby surface
     out along the spike's normal with a sharp falloff — needle cones, "ビビッと". */
  function applySpikes(amp, spikes){
    if(!bodyGeo) return;
    const pos = bodyGeo.attributes.position;
    if(amp<=0.004 || !spikes || !spikes.length){
      if(spiked){ pos.array.set(baseP); pos.needsUpdate=true; spiked=false; }
      return;
    }
    spiked=true;
    const arr=pos.array, ns=spikes.length;
    for(let i=0,n=pos.count;i<n;i++){
      const j=i*3;
      const bx=baseP[j], by=baseP[j+1], bz=baseP[j+2];
      let best=0, bs=null;
      for(let k=0;k<ns;k++){
        const s=spikes[k];
        const dx=bx-s.cx, dy=by-s.cy, dz=bz-s.cz;
        const d2=dx*dx+dy*dy+dz*dz;
        if(d2>s.r*s.r) continue;
        const u=1-Math.sqrt(d2)/s.r;
        const w=u*u*u*s.len;
        if(w>best){best=w;bs=s;}
      }
      if(best>0){
        const k2=amp*best;
        arr[j]  = bx + bs.nx*k2;
        arr[j+1]= by + bs.ny*k2;
        arr[j+2]= bz + bs.nz*k2;
      }else{
        arr[j]=bx; arr[j+1]=by; arr[j+2]=bz;
      }
    }
    pos.needsUpdate=true;
  }

  // ---------- cached part geometries ----------
  let geos=null;
  function getGeos(){
    if(geos) return geos;
    geos={
      eyeBall: ellipsoid(0.37,0.51,0.21,40),
      eyeHi:   eyeHighlightGeo(),
      belly:   ellipsoid(0.66,0.64,0.58,40),
      mark:    ellipsoid(0.028,0.075,0.03,12),
      dot:     ellipsoid(0.035,0.035,0.035,12),
      smile:   smileTube(0.40,0.10,0.028),
      leg:     new THREE.CylinderGeometry(0.20,0.215,0.42,20),
      ankle:   ellipsoid(0.27,0.26,0.30,22),
      toe:     ellipsoid(0.235,0.205,0.34,22),
      tip:     ellipsoid(0.18,0.16,0.16,16),
      cap:     ellipsoid(0.165,0.165,0.165,16),
    };
    // arm tubes
    function armGeo(s){
      const pts=[
        new THREE.Vector3(s*1.02, 0.10, 0.55),
        new THREE.Vector3(s*1.06, -0.18, 0.78),
        new THREE.Vector3(s*0.88, -0.46, 0.96),
        new THREE.Vector3(s*0.62, -0.62, 1.02),
        new THREE.Vector3(s*0.44, -0.74, 1.00),
      ];
      return {geo:new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, 0.165, 14, false), end:pts[pts.length-1]};
    }
    geos.armL=armGeo(-1); geos.armR=armGeo(1);
    return geos;
  }

  // ---------- build ----------
  function build(){
    initMats();
    const G=getGeos();
    const group=new THREE.Group(); group.name="Chara";
    const parts={};

    const body=mesh(getBodyGeo(), MAT.body);
    body.name="Body"; body.position.y=0.18; body.receiveShadow=true;
    group.add(body); parts.body=body;

    function makeEye(side){
      const g=new THREE.Group(); g.name="Eye_"+(side<0?"L":"R");
      const black=mesh(G.eyeBall, MAT.ink); black.name="EyeBall"; g.add(black);
      const hi=mesh(G.eyeHi, MAT.whiteDS, true); hi.name="EyeHighlight";
      hi.position.set(0,0.05,0.212); g.add(hi);
      g.position.set(side*0.52, 0.57, 0.93);
      g.rotation.set(-0.04, side*0.12, -side*0.10);
      return g;
    }
    parts.eyeL=makeEye(-1); parts.eyeR=makeEye(1);
    group.add(parts.eyeL, parts.eyeR);

    const belly=new THREE.Group(); belly.name="Belly";
    const bb=mesh(G.belly, MAT.white); bb.name="BellyBall"; bb.receiveShadow=true; belly.add(bb);
    const mk1=mesh(G.mark, MAT.gray, true); mk1.position.set(-0.13,0.18,0.56); mk1.rotation.z=0.5; belly.add(mk1);
    const mk2=mesh(G.mark, MAT.gray, true); mk2.position.set(0.02,0.215,0.56); mk2.rotation.z=0.5; belly.add(mk2);
    const dt=mesh(G.dot, MAT.gray, true); dt.position.set(0.17,0.16,0.55); belly.add(dt);
    const sm=mesh(G.smile, MAT.gray, true); sm.position.set(0.02,0.0,0.55); belly.add(sm);
    belly.position.set(0,-0.34,0.86);
    group.add(belly); parts.belly=belly;

    function makeArm(side){
      const A=side<0?G.armL:G.armR;
      const grp=new THREE.Group(); grp.name="Arm_"+(side<0?"L":"R");
      const m=mesh(A.geo, MAT.arm);
      const cap=mesh(G.cap, MAT.arm); cap.position.copy(A.end);
      grp.add(m,cap);
      return grp;
    }
    parts.armL=makeArm(-1); parts.armR=makeArm(1);
    group.add(parts.armL, parts.armR);

    function makeBoot(side){
      const g=new THREE.Group(); g.name="Boot_"+(side<0?"L":"R");
      const leg=mesh(G.leg, MAT.ink); leg.position.y=-0.02; g.add(leg);
      const ankle=mesh(G.ankle, MAT.ink); ankle.position.set(0,-0.26,0.02); g.add(ankle);
      const toe=mesh(G.toe, MAT.ink); toe.position.set(0,-0.30,0.28); g.add(toe);
      const tip=mesh(G.tip, MAT.ink); tip.position.set(0,-0.27,0.50); g.add(tip);
      g.position.set(side*0.52, -1.18, 0.06);
      g.rotation.y=side*0.18;
      return g;
    }
    parts.bootL=makeBoot(-1); parts.bootR=makeBoot(1);
    group.add(parts.bootL, parts.bootR);

    return {group, parts};
  }

  window.CharaModel = {
    build, applySpikes, makeSpikes,
    get materials(){ initMats(); return MAT; },
    colors: COL,
  };
})();
