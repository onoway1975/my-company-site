export const QUAD_VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const REACTION_FRAG = `
precision highp float;
uniform sampler2D u_prev;
uniform vec2 u_resolution;
uniform float u_feed;
uniform float u_kill;
uniform float u_dA;
uniform float u_dB;
varying vec2 v_uv;

vec2 s(vec2 uv) {
  return texture2D(u_prev, clamp(uv, 0.0, 1.0)).xy;
}

void main() {
  vec2 p = 1.0 / u_resolution;
  vec2 c = s(v_uv);

  vec2 lap = s(v_uv + vec2(-p.x, -p.y)) * 0.05
           + s(v_uv + vec2( 0.0, -p.y)) * 0.20
           + s(v_uv + vec2( p.x, -p.y)) * 0.05
           + s(v_uv + vec2(-p.x,  0.0)) * 0.20
           + c * (-1.0)
           + s(v_uv + vec2( p.x,  0.0)) * 0.20
           + s(v_uv + vec2(-p.x,  p.y)) * 0.05
           + s(v_uv + vec2( 0.0,  p.y)) * 0.20
           + s(v_uv + vec2( p.x,  p.y)) * 0.05;

  float A = c.x;
  float B = c.y;
  float r = A * B * B;

  float nA = A + (u_dA * lap.x - r + u_feed * (1.0 - A));
  float nB = B + (u_dB * lap.y + r - (u_kill + u_feed) * B);

  gl_FragColor = vec4(clamp(nA, 0.0, 1.0), clamp(nB, 0.0, 1.0), 0.0, 1.0);
}
`;

export const SEED_FRAG = `
precision highp float;
uniform sampler2D u_prev;
uniform vec2 u_seed;
uniform float u_seed_size;
varying vec2 v_uv;

void main() {
  vec2 ab = texture2D(u_prev, v_uv).xy;
  float d = distance(v_uv, u_seed);
  if (d < u_seed_size) {
    ab.y = 1.0;
  }
  gl_FragColor = vec4(ab, 0.0, 1.0);
}
`;

export const DISPLAY_FRAG = `
precision highp float;
uniform sampler2D u_state;
uniform vec3 u_color;
varying vec2 v_uv;

void main() {
  float b = texture2D(u_state, v_uv).y;
  float t = smoothstep(0.15, 0.45, b);
  vec3 col = mix(vec3(1.0), u_color / 255.0, t);
  gl_FragColor = vec4(col, 1.0);
}
`;
