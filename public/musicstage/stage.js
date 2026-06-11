/* stage.js — みどりキャラ MUSIC STAGE (Next.js integration glue)
   Ported verbatim from the Chara Music Stage reference. The only changes vs. the
   original HTML are: (1) sizing tracks a container element instead of window, and
   (2) the whole thing is wrapped as window.CharaStageApp.init(root)/destroy() so a
   React client component can mount/unmount it cleanly (StrictMode-safe).
   Requires globals: THREE (r128) + THREE.OrbitControls + window.CharaModel. */
(function () {
  "use strict";

  let _cleanup = null;

  function init(root) {
    if (_cleanup) return; // already running
    if (!window.THREE || !window.CharaModel) {
      console.error("[CharaStage] THREE / CharaModel not loaded");
      return;
    }

    // ---- scoped DOM ----
    const app = root.querySelector("[data-canvas]");
    const sizeOf = () => ({
      w: app.clientWidth || 1,
      h: app.clientHeight || 1,
    });

    // ================= scene =================
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    let dim = sizeOf();
    renderer.setSize(dim.w, dim.h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    app.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.Fog(0x050507, 14, 26);

    const camera = new THREE.PerspectiveCamera(40, dim.w / dim.h, 0.1, 100);
    camera.position.set(0.3, 1.9, 10.8);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI * 0.55;
    controls.target.set(0, 0, -0.2);
    controls.autoRotate = false;

    // lights
    scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a1420, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 0.75);
    key.position.set(4.5, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 6;
    scene.add(key);
    const rimM = new THREE.DirectionalLight(0xff2da6, 0.0);
    rimM.position.set(-7, 3, -5);
    scene.add(rimM);
    const rimC = new THREE.DirectionalLight(0x35e0ff, 0.0);
    rimC.position.set(7, 2, -5);
    scene.add(rimC);
    const flash = new THREE.PointLight(0xffffff, 0, 18, 2);
    flash.position.set(0, 2.5, 2.5);
    scene.add(flash);

    // floor: shadow catcher + dotted rings
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.35 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.75;
    floor.receiveShadow = true;
    scene.add(floor);

    const rings = (function () {
      const c = document.createElement("canvas");
      c.width = c.height = 1024;
      const g = c.getContext("2d");
      for (let r = 60; r < 500; r += 44) {
        const n = Math.floor(r * 0.3);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const hue = (r * 0.55 + i * 2) % 360;
          g.fillStyle = `hsla(${hue},85%,62%,.85)`;
          g.beginPath();
          g.arc(512 + Math.cos(a) * r, 512 + Math.sin(a) * r, 3.2, 0, 7);
          g.fill();
        }
      }
      const t = new THREE.CanvasTexture(c);
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = -1.745;
      scene.add(m);
      return m;
    })();

    // soft glow sprite behind
    const glow = (function () {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d");
      const gr = g.createRadialGradient(128, 128, 4, 128, 128, 126);
      gr.addColorStop(0, "rgba(255,255,255,.9)");
      gr.addColorStop(0.4, "rgba(255,255,255,.25)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(c),
          color: 0x35305f,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      sp.scale.set(14, 14, 1);
      sp.position.set(0, 0.6, -3.5);
      scene.add(sp);
      return sp;
    })();

    // ================= characters =================
    const SLOTS = [
      [0, 0, 1.0],
      [-2.7, -0.7, 0.85],
      [2.7, -0.7, 0.85],
      [-1.6, -2.2, 0.7],
      [1.6, -2.2, 0.7],
      [-4.3, -2.4, 0.6],
      [4.3, -2.4, 0.6],
    ];
    const charas = [];
    function spawnChara(slotIdx) {
      const { group, parts } = CharaModel.build();
      const s = SLOTS[slotIdx];
      group.position.set(s[0], -1.75 + 1.9 * s[2], s[1]);
      group.scale.setScalar(0.001);
      scene.add(group);
      charas.push({
        root: group, parts, phase: Math.random() * 9, slot: slotIdx, scl: s[2], state: "in", t: 0,
        bounce: 0, accent: slotIdx % 2 ? 1 : 0,
        pos: { x: s[0], z: s[1] }, heading: Math.random() * Math.PI * 2, target: null,
        pauseT: 0.5 + Math.random() * 1.5, speed: 0.6, walkPhase: Math.random() * 6, walkAmp: 0, walkT: 0,
      });
    }
    function despawnChara() {
      for (let i = charas.length - 1; i >= 0; i--) {
        if (charas[i].state === "live") {
          charas[i].state = "out";
          charas[i].t = 0;
          return;
        }
      }
    }
    spawnChara(0); // main

    // ---- wandering ----
    const WB = { x: 4.6, zMin: -3.2, zMax: 1.2 };
    function pickTarget(from, self) {
      let best = null, bestScore = -1;
      for (let k = 0; k < 7; k++) {
        const x = (Math.random() * 2 - 1) * WB.x;
        const z = WB.zMin + Math.random() * (WB.zMax - WB.zMin);
        const d0 = Math.hypot(x - from.x, z - from.z);
        if (d0 < 1.2) continue;
        let minD = 99;
        for (const o of charas) {
          if (o === self) continue;
          minD = Math.min(minD, Math.hypot(x - o.pos.x, z - o.pos.z));
          if (o.target) minD = Math.min(minD, Math.hypot(x - o.target.x, z - o.target.z));
        }
        const score = minD + d0 * 0.25;
        if (score > bestScore) {
          bestScore = score;
          best = { x: x, z: z };
        }
      }
      return best || { x: (Math.random() * 2 - 1) * 3, z: -1.5 };
    }

    // ================= shards =================
    const SHARD_COLORS = [0xff2da6, 0xffe93c, 0x35e0ff, 0x6a5bff, 0xb6ff3c];
    const shardGeo = new THREE.BufferGeometry();
    shardGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0.5, 0, -0.43, -0.25, 0, 0.43, -0.25, 0]), 3));
    const shards = [];
    for (let i = 0; i < 56; i++) {
      const m = new THREE.Mesh(
        shardGeo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      );
      m.visible = false;
      scene.add(m);
      shards.push({ m, vel: new THREE.Vector3(), rot: new THREE.Vector3(), life: 0, age: 0 });
    }
    function emitShards(origin, dir, strength) {
      let n = Math.round(8 + strength * 10);
      for (const s of shards) {
        if (n <= 0) break;
        if (s.life > 0) continue;
        n--;
        s.m.visible = true;
        s.m.position.copy(origin);
        s.m.material.color.setHex(SHARD_COLORS[(Math.random() * SHARD_COLORS.length) | 0]);
        s.m.material.opacity = 0.95;
        const sc = 0.18 + Math.random() * 0.5;
        s.m.scale.setScalar(sc);
        const d = dir
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 2.2)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), (Math.random() - 0.5) * 1.6)
          .normalize();
        s.vel.copy(d).multiplyScalar(4 + Math.random() * 6 + strength * 3);
        s.rot.set(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4);
        s.life = 0.45 + Math.random() * 0.4;
        s.age = 0;
      }
    }
    function updateShards(dt) {
      for (const s of shards) {
        if (s.life <= 0) continue;
        s.age += dt;
        if (s.age >= s.life) {
          s.life = 0;
          s.m.visible = false;
          continue;
        }
        const k = 1 - s.age / s.life;
        s.m.position.addScaledVector(s.vel, dt);
        s.vel.multiplyScalar(1 - 2.5 * dt);
        s.m.rotation.x += s.rot.x * dt;
        s.m.rotation.y += s.rot.y * dt;
        s.m.rotation.z += s.rot.z * dt;
        s.m.material.opacity = 0.95 * k * k;
        s.m.scale.multiplyScalar(1 + 1.2 * dt);
      }
    }

    // ================= audio =================
    let actx = null, analyser = null, master = null, freq = null, prevFreq = null;
    let demoOn = false, audioEl = null, mediaSrc = null, currentSong = "", mode = null;
    const audioPool = [];
    let noiseBuf = null;
    function ensureCtx() {
      if (actx) return;
      actx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = actx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.55;
      analyser.connect(actx.destination);
      master = actx.createGain();
      master.gain.value = 0.9;
      master.connect(analyser);
      freq = new Uint8Array(analyser.frequencyBinCount);
      prevFreq = new Uint8Array(analyser.frequencyBinCount);
      const len = actx.sampleRate * 0.5;
      noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    }

    // ---- demo synth ----
    const NOTE = { A1: 55, C2: 65.41, D2: 73.42, E2: 82.41, G2: 98, A2: 110 };
    const BASSLINE = [NOTE.A1, NOTE.A1, NOTE.C2, NOTE.A1, NOTE.D2, NOTE.D2, NOTE.E2, NOTE.G2];
    const PENTA = [220, 261.6, 293.7, 329.6, 392, 440, 523.3];
    const demo = { bpm: 122, step: 0, next: 0, timer: null };
    function kick(t) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      g.gain.setValueAtTime(0.95, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.3);
    }
    function hat(t, open) {
      const s = actx.createBufferSource();
      s.buffer = noiseBuf;
      const f = actx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 7500;
      const g = actx.createGain();
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.2 : 0.05));
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(t);
      s.stop(t + 0.25);
    }
    function clap(t) {
      const s = actx.createBufferSource();
      s.buffer = noiseBuf;
      const f = actx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1800;
      f.Q.value = 0.9;
      const g = actx.createGain();
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(t);
      s.stop(t + 0.2);
    }
    function bass(t, fr) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle";
      o.frequency.value = fr;
      g.gain.setValueAtTime(0.34, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.24);
    }
    function pluck(t, fr) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine";
      o.frequency.value = fr;
      g.gain.setValueAtTime(0.13, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.32);
    }
    function demoSchedule(step, t) {
      if (step % 4 === 0) kick(t);
      if (step % 8 === 2 || step % 8 === 6) hat(t, step % 16 === 14);
      if (step % 16 === 8) clap(t);
      const bar = Math.floor(step / 16) % 2;
      if (step % 2 === 0) {
        const idx = (Math.floor(step / 2) + bar * 8) % BASSLINE.length;
        if (step % 4 !== 2) bass(t, BASSLINE[idx]);
      }
      if (step % 16 === 4 || step % 16 === 10 || step % 16 === 15) {
        pluck(t, PENTA[(Math.random() * PENTA.length) | 0]);
      }
    }
    function demoTick() {
      const spb = 60 / demo.bpm / 4;
      while (demo.next < actx.currentTime + 0.12) {
        demoSchedule(demo.step, demo.next);
        demo.next += spb;
        demo.step = (demo.step + 1) % 32;
      }
    }
    function startDemo() {
      ensureCtx();
      actx.resume();
      stopAllAudio();
      demoOn = true;
      mode = "demo";
      demo.step = 0;
      demo.next = actx.currentTime + 0.06;
      demo.timer = setInterval(demoTick, 25);
      btnDemo.classList.add("on");
      showPlay(true, "一時停止");
      songName.textContent = "デモビート 122BPM";
      try { localStorage.setItem("chara-stage-mode", "demo"); } catch (e) {}
    }
    function stopDemo() {
      demoOn = false;
      if (demo.timer) {
        clearInterval(demo.timer);
        demo.timer = null;
      }
      btnDemo.classList.remove("on");
    }

    // ---- file playback ----
    function stopAllFiles() {
      for (const a of audioPool) {
        try { a.pause(); } catch (e) {}
      }
    }
    function stopAllAudio() {
      stopDemo();
      stopAllFiles();
      hist.bass.length = 0;
      hist.flux.length = 0;
    }
    function loadTrack(url, name) {
      ensureCtx();
      actx.resume();
      stopAllAudio();
      if (audioEl) {
        if (mediaSrc) { try { mediaSrc.disconnect(); } catch (e) {} }
        const ix = audioPool.indexOf(audioEl);
        if (ix >= 0) audioPool.splice(ix, 1);
      }
      audioEl = new Audio();
      audioPool.push(audioEl);
      // url is a same-origin proxy (/api/musicstage/preview?u=...) so the
      // AnalyserNode can read the samples; no crossOrigin needed.
      audioEl.src = url;
      audioEl.loop = true;
      mediaSrc = actx.createMediaElementSource(audioEl);
      mediaSrc.connect(analyser);
      currentSong = name;
      mode = "file";
      audioEl.play().catch(function () {});
      songName.textContent = name;
      showPlay(true, "一時停止");
      toast("♪ " + name);
    }
    function isPlaying() {
      if (demoOn) return true;
      return !!(audioEl && !audioEl.paused);
    }

    // ================= analysis =================
    const hist = { bass: [], flux: [] };
    let lastBeat = 0, lastSpike = 0, energyS = 0, bassS = 0, midS = 0, trebS = 0;
    let SENS = 1;
    function bandAvg(a, b) {
      let s = 0;
      for (let i = a; i < b; i++) s += freq[i];
      return s / ((b - a) * 255);
    }
    function analyse(now) {
      const out = { beat: false, beatStr: 0, spike: false, spikeStr: 0 };
      if (!analyser || !isPlaying()) {
        energyS *= 0.92;
        bassS *= 0.88;
        midS *= 0.88;
        trebS *= 0.88;
        return out;
      }
      prevFreq.set(freq);
      analyser.getByteFrequencyData(freq);
      const bassV = bandAvg(1, 9), midV = bandAvg(12, 90), trebV = bandAvg(110, 420);
      const energy = bandAvg(1, 420);
      bassS += (bassV - bassS) * 0.25;
      midS += (midV - midS) * 0.2;
      trebS += (trebV - trebS) * 0.2;
      energyS += (energy - energyS) * 0.04;
      let flux = 0;
      for (let i = 1; i < 260; i++) {
        const d = freq[i] - prevFreq[i];
        if (d > 0) flux += d;
      }
      flux /= 260 * 255;
      hist.bass.push(bassV);
      if (hist.bass.length > 55) hist.bass.shift();
      hist.flux.push(flux);
      if (hist.flux.length > 55) hist.flux.shift();
      const bMean = hist.bass.reduce((a, b) => a + b, 0) / hist.bass.length;
      const fMean = hist.flux.reduce((a, b) => a + b, 0) / hist.flux.length;
      if (bassV > 0.1 && bassV > bMean * (1.18 / SENS) + 0.02 && now - lastBeat > 0.24) {
        lastBeat = now;
        out.beat = true;
        out.beatStr = Math.min(1, (bassV - bMean) * 4 * SENS);
      }
      if (flux > 0.015 && flux > fMean * (2.2 / SENS) + 0.01 && now - lastSpike > 0.9) {
        lastSpike = now;
        out.spike = true;
        out.spikeStr = Math.min(1, (flux - fMean) * 30 * SENS);
      }
      return out;
    }

    // ================= choreography =================
    let spikeAmp = 0, spikeSet = null, spikeDir = new THREE.Vector3(0, 0, 1);
    let fovPunch = 0, flashHue = 0;
    let lastCountChange = 0;
    const clock = new THREE.Clock();

    // ---- cinematic random camera drift ----
    const camRig = { manual: false, resumeT: -1, t: 0, dur: 11, from: null, to: null };
    function camSpherCurrent() {
      const off = camera.position.clone().sub(controls.target);
      const r = off.length();
      return {
        th: Math.atan2(off.x, off.z),
        ph: Math.acos(Math.max(-1, Math.min(1, off.y / r))),
        r: r, tx: controls.target.x, ty: controls.target.y,
      };
    }
    function pickCamDest() {
      return {
        th: (Math.random() * 2 - 1) * 1.0,
        ph: 1.02 + Math.random() * 0.46,
        r: 8.5 + Math.random() * 4.5,
        tx: (Math.random() * 2 - 1) * 0.9,
        ty: -0.1 + Math.random() * 0.7,
      };
    }
    const onCtrlStart = () => { camRig.manual = true; camRig.resumeT = -1; };
    const onCtrlEnd = () => { camRig.resumeT = clock.elapsedTime + 4; };
    controls.addEventListener("start", onCtrlStart);
    controls.addEventListener("end", onCtrlEnd);
    function updateCamRig(dt, t) {
      if (camRig.manual) {
        if (camRig.resumeT > 0 && t > camRig.resumeT) {
          camRig.manual = false;
          camRig.from = camSpherCurrent();
          camRig.to = pickCamDest();
          camRig.t = 0;
          camRig.dur = 9 + Math.random() * 7;
        }
        return;
      }
      if (!camRig.from) camRig.from = camSpherCurrent();
      if (!camRig.to) { camRig.to = pickCamDest(); camRig.t = 0; camRig.dur = 9 + Math.random() * 7; }
      camRig.t += dt * (0.8 + energyS * 1.8);
      const p0 = Math.min(1, camRig.t / camRig.dur);
      const p = p0 * p0 * (3 - 2 * p0);
      const F = camRig.from, T = camRig.to;
      const th = F.th + (T.th - F.th) * p, ph = F.ph + (T.ph - F.ph) * p, r = F.r + (T.r - F.r) * p;
      const mainC = charas[0];
      const fx = mainC ? mainC.pos.x * 0.55 : 0, fz = mainC ? mainC.pos.z * 0.4 : 0;
      controls.target.set(F.tx + (T.tx - F.tx) * p + fx, F.ty + (T.ty - F.ty) * p, fz - 0.2);
      camera.position.set(
        controls.target.x + Math.sin(th) * Math.sin(ph) * r,
        controls.target.y + Math.cos(ph) * r,
        controls.target.z + Math.cos(th) * Math.sin(ph) * r
      );
      for (const c of charas) {
        const d = camera.position.distanceTo(c.root.position);
        if (d < 3.6) {
          const away = camera.position.clone().sub(c.root.position).normalize();
          camera.position.addScaledVector(away, 3.6 - d);
        }
      }
      if (p0 >= 1) { camRig.from = camRig.to; camRig.to = pickCamDest(); camRig.t = 0; camRig.dur = 9 + Math.random() * 7; }
    }

    function blinkK(t, phase) {
      const cyc = (t + phase) % 3.6;
      if (cyc > 3.2) {
        const p = (cyc - 3.2) / 0.4;
        return Math.max(0.06, 1 - Math.sin(Math.min(p, 1) * Math.PI));
      }
      return 1;
    }

    let rafId = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const ev = analyse(t);

      if (ev.beat) {
        for (const c of charas) {
          if (c.state !== "live" && c.state !== "in") continue;
          c.bounce = Math.min(1, 0.55 + ev.beatStr * 0.6) * (c.accent ? 1 : 0.75);
          c.accent = 1 - c.accent;
        }
        fovPunch = Math.min(1, 0.4 + ev.beatStr * 0.7);
      }
      if (ev.spike) {
        spikeAmp = Math.min(1, 0.5 + ev.spikeStr * 0.7);
        const ang = Math.random() * Math.PI * 2;
        spikeDir.set(Math.cos(ang) * 0.9, (Math.random() - 0.2) * 0.7, Math.sin(ang) * 0.9).normalize();
        spikeSet = CharaModel.makeSpikes(spikeDir, 7 + Math.round(ev.spikeStr * 6));
        const main = charas[0];
        if (main) emitShards(new THREE.Vector3(main.root.position.x, main.root.position.y + 0.6, main.root.position.z), spikeDir, ev.spikeStr);
        flash.intensity = 0.35 + ev.spikeStr * 0.45;
        flashHue = (flashHue + 77) % 360;
        flash.color.setHSL(flashHue / 360, 0.8, 0.6);
      }

      const playing = isPlaying();
      const loud = bassS * 0.5 + midS * 0.35 + trebS * 0.15;
      const target = playing ? Math.max(1, Math.min(SLOTS.length, 1 + Math.round(Math.min(1, loud * 2.4 * SENS) * (SLOTS.length - 1)))) : 1;
      const liveCount = charas.filter((c) => c.state !== "out").length;
      if (t - lastCountChange > 0.4) {
        if (target > liveCount && liveCount < SLOTS.length) {
          const used = new Set(charas.filter((c) => c.state !== "out").map((c) => c.slot));
          for (let i = 0; i < SLOTS.length; i++) {
            if (!used.has(i)) { spawnChara(i); break; }
          }
          lastCountChange = t;
        } else if (target < liveCount && liveCount > 1) {
          const n = Math.min(3, liveCount - target);
          for (let k = 0; k < n; k++) {
            if (charas.filter((c) => c.state !== "out").length > 1) despawnChara();
          }
          lastCountChange = t;
        }
      }

      // ---- spikes decay (with electric buzz) ----
      spikeAmp = Math.max(0, spikeAmp - dt * 3.6);
      const buzz = 1 + 0.14 * Math.sin(t * 52) * spikeAmp;
      CharaModel.applySpikes(spikeAmp * (0.3 + 0.7 * spikeAmp) * buzz, spikeSet);

      // ---- separation ----
      for (let a = 0; a < charas.length; a++) {
        const A = charas[a];
        for (let b = a + 1; b < charas.length; b++) {
          const B = charas[b];
          const dx = B.pos.x - A.pos.x, dz = B.pos.z - A.pos.z;
          let d = Math.hypot(dx, dz);
          if (d < 1e-4) d = 1e-4;
          const min = 3.1 * (A.scl + B.scl) * 0.5;
          if (d < min) {
            const push = (min - d) * 0.5, ux = dx / d, uz = dz / d;
            A.pos.x -= ux * push * 0.5 - uz * push * 0.35;
            A.pos.z -= uz * push * 0.5 + ux * push * 0.35;
            B.pos.x += ux * push * 0.5 - uz * push * 0.35;
            B.pos.z += uz * push * 0.5 + ux * push * 0.35;
          }
        }
        A.pos.x = Math.max(-4.8, Math.min(4.8, A.pos.x));
        A.pos.z = Math.max(-3.4, Math.min(1.4, A.pos.z));
      }

      // ---- per-chara ----
      for (let i = charas.length - 1; i >= 0; i--) {
        const c = charas[i];
        c.t += dt;
        let s = c.scl;
        if (c.state === "in") {
          const p = Math.min(1, c.t / 0.5);
          const e = 1 + Math.pow(2, -8 * p) * Math.sin((p * 8 - 0.75) * 2.1) * 1.1;
          s = c.scl * (p < 1 ? p * e : 1);
          if (p >= 1) c.state = "live";
        } else if (c.state === "out") {
          const p = Math.min(1, c.t / 0.3);
          s = c.scl * (1 - p);
          if (p >= 1) { scene.remove(c.root); charas.splice(i, 1); continue; }
        }
        c.bounce = Math.max(0, c.bounce - dt * 3.2);
        const bn = c.bounce;

        let moving = false;
        if (c.state !== "out") {
          if (c.pauseT > 0) {
            c.pauseT -= dt;
            const desired0 = Math.atan2(camera.position.x - c.pos.x, camera.position.z - c.pos.z);
            let dh0 = desired0 - c.heading;
            while (dh0 > Math.PI) dh0 -= Math.PI * 2;
            while (dh0 < -Math.PI) dh0 += Math.PI * 2;
            c.heading += dh0 * Math.min(1, dt * 1.2);
          } else {
            if (!c.target) { c.target = pickTarget(c.pos, c); c.speed = 0.55 + Math.random() * 0.7; c.walkT = 0; }
            c.walkT = (c.walkT || 0) + dt;
            const dx = c.target.x - c.pos.x, dz = c.target.z - c.pos.z;
            const dist = Math.hypot(dx, dz);
            if (dist < 0.18 || c.walkT > 11) { c.target = null; c.pauseT = 0.5 + Math.random() * 1.6; }
            else {
              const desired = Math.atan2(dx, dz) + Math.sin(t * 0.7 + c.phase * 2.7) * 0.4;
              let dh = desired - c.heading;
              while (dh > Math.PI) dh -= Math.PI * 2;
              while (dh < -Math.PI) dh += Math.PI * 2;
              c.heading += dh * Math.min(1, dt * 3.5);
              const sp = c.speed * (0.75 + energyS * 2.5) * c.scl;
              c.pos.x += Math.sin(c.heading) * sp * dt;
              c.pos.z += Math.cos(c.heading) * sp * dt;
              c.walkPhase += dt * (6.5 + sp * 4);
              moving = true;
            }
          }
        }
        c.walkAmp += ((moving ? 1 : 0) - c.walkAmp) * Math.min(1, dt * 6);
        const wa = c.walkAmp, wp = c.walkPhase;

        const breathe = Math.sin(t * 1.5 + c.phase) * 0.018;
        const sqY = 1 - 0.12 * bn + breathe, sqX = 1 + 0.1 * bn - breathe * 0.6;
        c.root.scale.set(s * sqX, s * sqY, s * sqX);
        c.root.position.x = c.pos.x;
        c.root.position.z = c.pos.z;
        c.root.position.y =
          -1.75 + 1.9 * s * sqY + bn * bn * 0.45 * s + Math.sin(t * 1.1 + c.phase) * 0.03 + Math.abs(Math.sin(wp)) * 0.07 * s * wa;
        c.root.rotation.z = Math.sin(t * 1.3 + c.phase) * 0.02 + bn * Math.sin(t * 9 + c.phase) * 0.05 + Math.sin(wp) * 0.07 * wa;
        c.root.rotation.y =
          c.heading + Math.sin(t * 0.6 + c.phase) * 0.1 * (1 - wa) + (playing ? Math.sin(t * 0.9 + c.phase * 2) * 0.08 * midS * 3 * (1 - wa) : 0);
        const sw = Math.sin(t * 1.4 + c.phase) * 0.05 + midS * 1.4 * bn + trebS * 0.9 * Math.sin(t * 12 + c.phase);
        c.parts.armL.rotation.z = sw * 0.7;
        c.parts.armR.rotation.z = -sw * 0.7;
        const bk = blinkK(t, c.phase);
        c.parts.eyeL.scale.y = bk;
        c.parts.eyeR.scale.y = bk;
        c.parts.bootL.position.y = -1.18 + bn * 0.06 * (c.accent ? 1 : 0) + Math.max(0, Math.sin(wp)) * 0.15 * wa;
        c.parts.bootR.position.y = -1.18 + bn * 0.06 * (c.accent ? 0 : 1) + Math.max(0, Math.sin(wp + Math.PI)) * 0.15 * wa;
        c.parts.bootL.position.z = 0.06 + Math.sin(wp) * 0.13 * wa;
        c.parts.bootR.position.z = 0.06 + Math.sin(wp + Math.PI) * 0.13 * wa;
      }

      fovPunch = Math.max(0, fovPunch - dt * 3);
      camera.fov = 40 - fovPunch * 3.5;
      camera.updateProjectionMatrix();
      flash.intensity = Math.max(0, flash.intensity - dt * 5);
      rimM.intensity = 0.1 + bassS * 0.8;
      rimC.intensity = 0.08 + trebS * 1.1;
      rings.material.opacity = 0.08 + bassS * 0.55;
      rings.rotation.z += dt * (0.05 + energyS * 0.6);
      glow.material.opacity = 0.2 + energyS * 0.8;
      glow.material.color.setHSL((t * 0.02) % 1, 0.5, 0.25 + energyS * 0.5);
      updateCamRig(dt, t);

      updateShards(dt);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ================= UI =================
    const btnDemo = root.querySelector("[data-demo]");
    const btnPlay = root.querySelector("[data-play]");
    const playLabel = root.querySelector("[data-play-label]");
    const songName = root.querySelector("[data-song]");
    const sens = root.querySelector("[data-sens]");
    const toastEl = root.querySelector("[data-toast]");
    let toastT = null;
    function toast(m) {
      toastEl.textContent = m;
      toastEl.classList.add("show");
      clearTimeout(toastT);
      toastT = setTimeout(() => toastEl.classList.remove("show"), 2000);
    }
    function showPlay(show, label) {
      btnPlay.style.display = show ? "" : "none";
      if (label) playLabel.textContent = label;
    }

    const onDemo = () => {
      if (demoOn) {
        stopAllAudio();
        if (audioEl) { mode = "file"; songName.textContent = currentSong; showPlay(true, "再生"); }
        else { mode = null; songName.textContent = ""; showPlay(false); }
      } else startDemo();
    };
    const onPlay = () => {
      if (mode === "demo") {
        if (demoOn) { stopAllAudio(); showPlay(true, "再生"); }
        else startDemo();
      } else if (mode === "file" && audioEl) {
        if (audioEl.paused) { stopDemo(); stopAllFiles(); actx.resume(); audioEl.play(); showPlay(true, "一時停止"); }
        else { audioEl.pause(); showPlay(true, "再生"); }
      } else startDemo();
    };
    const onSens = () => {
      SENS = parseFloat(sens.value);
      try { localStorage.setItem("chara-stage-sens", sens.value); } catch (e) {}
    };
    btnDemo.addEventListener("click", onDemo);
    btnPlay.addEventListener("click", onPlay);
    sens.addEventListener("input", onSens);
    try {
      const sv = localStorage.getItem("chara-stage-sens");
      if (sv) { sens.value = sv; SENS = parseFloat(sv); }
    } catch (e) {}

    // ---- resize: track container, not window ----
    const ro = new ResizeObserver(() => {
      dim = sizeOf();
      camera.aspect = dim.w / dim.h;
      camera.updateProjectionMatrix();
      renderer.setSize(dim.w, dim.h);
    });
    ro.observe(app);

    // external handle (debug / site integration). loadTrack is called by the
    // React search UI to play a proxied iTunes preview through the stage.
    window.CharaStage = {
      scene, camera, controls, charas, renderer, loadTrack,
      getAudio: () => ({ state: actx ? actx.state : "none", t: actx ? actx.currentTime : 0, demoOn, mode }),
    };

    // ================= teardown =================
    _cleanup = function () {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.removeEventListener("start", onCtrlStart);
      controls.removeEventListener("end", onCtrlEnd);
      btnDemo.removeEventListener("click", onDemo);
      btnPlay.removeEventListener("click", onPlay);
      sens.removeEventListener("input", onSens);
      stopAllAudio();
      if (actx) { try { actx.close(); } catch (e) {} }
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      if (window.CharaStage) delete window.CharaStage;
    };
  }

  function destroy() {
    if (_cleanup) { _cleanup(); _cleanup = null; }
  }

  window.CharaStageApp = { init, destroy };
})();
