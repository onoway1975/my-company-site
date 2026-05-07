"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { QUAD_VERT, REACTION_FRAG, SEED_FRAG, DISPLAY_FRAG } from "./shaders";

/* ── Pattern presets ── */

export const PATTERNS = {
  "01": { feed: 0.022, kill: 0.051, color: [40, 40, 40] },
  "02": { feed: 0.029, kill: 0.057, color: [180, 100, 30] },
  "03": { feed: 0.039, kill: 0.058, color: [200, 140, 60] },
  "04": { feed: 0.055, kill: 0.062, color: [220, 100, 100] },
} as const;

export type PatternName = keyof typeof PATTERNS;

/* ── WebGL helpers ── */

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return p;
}

function createFBO(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { tex, fb };
}

/* ── Component ── */

interface Props {
  pattern: PatternName;
  onResetRef: React.MutableRefObject<(() => void) | null>;
  onSaveRef: React.MutableRefObject<(() => void) | null>;
}

export default function StripesCanvas({ pattern, onResetRef, onSaveRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const stateRef = useRef<{
    fbos: ReturnType<typeof createFBO>[];
    current: number;
    reactionProg: WebGLProgram;
    seedProg: WebGLProgram;
    displayProg: WebGLProgram;
    w: number;
    h: number;
    needsSeed: { x: number; y: number } | null;
  } | null>(null);
  const rafRef = useRef<number>(0);
  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", {
      preserveDrawingBuffer: true,
      antialias: false,
    })!;
    if (!gl) return;

    // Enable float textures
    const ext = gl.getExtension("OES_texture_float");
    if (!ext) {
      console.warn("OES_texture_float not supported");
      return;
    }

    glRef.current = gl;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width / 2);
      canvas.height = Math.floor(rect.height / 2);
    };
    resize();

    const w = canvas.width;
    const h = canvas.height;

    // Quad buffer
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    // Programs
    const reactionProg = createProgram(gl, QUAD_VERT, REACTION_FRAG);
    const seedProg = createProgram(gl, QUAD_VERT, SEED_FRAG);
    const displayProg = createProgram(gl, QUAD_VERT, DISPLAY_FRAG);

    // FBOs
    const fbos = [createFBO(gl, w, h), createFBO(gl, w, h)];

    // Fill initial state: A=1.0, B=0.0
    const initData = new Float32Array(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      initData[i * 4] = 1.0;
      initData[i * 4 + 1] = 0.0;
      initData[i * 4 + 2] = 0.0;
      initData[i * 4 + 3] = 1.0;
    }
    // Add center seed (radius ~5% of canvas for fast initial growth)
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    const seedR = Math.max(12, Math.floor(Math.min(w, h) * 0.08));
    for (let dy = -seedR; dy <= seedR; dy++) {
      for (let dx = -seedR; dx <= seedR; dx++) {
        if (dx * dx + dy * dy <= seedR * seedR) {
          const idx = ((cy + dy) * w + (cx + dx)) * 4;
          if (idx >= 0 && idx < initData.length) {
            initData[idx + 1] = 1.0;
          }
        }
      }
    }

    for (const fbo of fbos) {
      gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, initData);
    }

    stateRef.current = {
      fbos,
      current: 0,
      reactionProg,
      seedProg,
      displayProg,
      w,
      h,
      needsSeed: null,
    };

    // Setup attribute for all programs
    const setupAttr = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    // Render loop
    const step = () => {
      const st = stateRef.current;
      if (!st) return;
      const { fbos, reactionProg, seedProg, displayProg } = st;
      const pat = PATTERNS[patternRef.current];

      gl.viewport(0, 0, st.w, st.h);

      // Seed injection
      if (st.needsSeed) {
        const src = fbos[st.current];
        const dst = fbos[1 - st.current];

        gl.useProgram(seedProg);
        setupAttr(seedProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform1i(gl.getUniformLocation(seedProg, "u_prev"), 0);
        gl.uniform2f(gl.getUniformLocation(seedProg, "u_seed"), st.needsSeed.x, st.needsSeed.y);
        gl.uniform1f(gl.getUniformLocation(seedProg, "u_seed_size"), 0.03);

        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        st.current = 1 - st.current;
        st.needsSeed = null;
      }

      // Reaction-diffusion steps
      const stepsPerFrame = 8;
      for (let i = 0; i < stepsPerFrame; i++) {
        const src = fbos[st.current];
        const dst = fbos[1 - st.current];

        gl.useProgram(reactionProg);
        setupAttr(reactionProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform1i(gl.getUniformLocation(reactionProg, "u_prev"), 0);
        gl.uniform2f(gl.getUniformLocation(reactionProg, "u_resolution"), st.w, st.h);
        gl.uniform1f(gl.getUniformLocation(reactionProg, "u_feed"), pat.feed);
        gl.uniform1f(gl.getUniformLocation(reactionProg, "u_kill"), pat.kill);
        gl.uniform1f(gl.getUniformLocation(reactionProg, "u_dA"), 1.0);
        gl.uniform1f(gl.getUniformLocation(reactionProg, "u_dB"), 0.5);

        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        st.current = 1 - st.current;
      }

      // Display
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(displayProg);
      setupAttr(displayProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fbos[st.current].tex);
      gl.uniform1i(gl.getUniformLocation(displayProg, "u_state"), 0);
      gl.uniform3f(
        gl.getUniformLocation(displayProg, "u_color"),
        pat.color[0],
        pat.color[1],
        pat.color[2]
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    // Context lost/restored
    const handleLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", handleLost);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("webglcontextlost", handleLost);
    };
  }, []);

  // Pointer interaction
  const injectSeed = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const st = stateRef.current;
    if (!canvas || !st) return;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;
    st.needsSeed = { x, y };
  }, []);

  const pointerDown = useCallback(
    (e: React.PointerEvent) => {
      injectSeed(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [injectSeed]
  );

  const pointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pressure > 0) {
        injectSeed(e.clientX, e.clientY);
      }
    },
    [injectSeed]
  );

  // Reset
  onResetRef.current = useCallback(() => {
    const gl = glRef.current;
    const st = stateRef.current;
    if (!gl || !st) return;

    const initData = new Float32Array(st.w * st.h * 4);
    for (let i = 0; i < st.w * st.h; i++) {
      initData[i * 4] = 1.0;
      initData[i * 4 + 1] = 0.0;
      initData[i * 4 + 2] = 0.0;
      initData[i * 4 + 3] = 1.0;
    }
    // Plant center seed so pattern starts growing immediately
    const cx = Math.floor(st.w / 2);
    const cy = Math.floor(st.h / 2);
    const seedR = Math.max(10, Math.floor(Math.min(st.w, st.h) * 0.05));
    for (let dy = -seedR; dy <= seedR; dy++) {
      for (let dx = -seedR; dx <= seedR; dx++) {
        if (dx * dx + dy * dy <= seedR * seedR) {
          const idx = ((cy + dy) * st.w + (cx + dx)) * 4;
          if (idx >= 0 && idx < initData.length) {
            initData[idx + 1] = 1.0;
          }
        }
      }
    }
    for (const fbo of st.fbos) {
      gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, st.w, st.h, 0, gl.RGBA, gl.FLOAT, initData);
    }
    st.current = 0;
  }, []);

  // Save
  onSaveRef.current = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(dataUrl, "_blank");
    } else {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `stripes_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: "none" }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
    />
  );
}
