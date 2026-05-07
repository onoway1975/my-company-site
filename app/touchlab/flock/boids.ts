/* ── Boid simulation (pure logic, no DOM) ── */

export interface Vec2 {
  x: number;
  y: number;
}

export interface BoidConfig {
  numBoids: number;
  visualRange: number;
  protectedRange: number;
  separationFactor: number;
  alignmentFactor: number;
  cohesionFactor: number;
  maxSpeed: number;
  minSpeed: number;
  edgeMargin: number;
  edgeTurnFactor: number;
  attractorFactor: number;
  attractorRange: number;
  repellerFactor: number;
  repellerRange: number;
}

export const DEFAULT_CONFIG: BoidConfig = {
  numBoids: 200,
  visualRange: 60,
  protectedRange: 12,
  separationFactor: 0.05,
  alignmentFactor: 0.05,
  cohesionFactor: 0.0008,
  maxSpeed: 4,
  minSpeed: 2,
  edgeMargin: 80,
  edgeTurnFactor: 0.3,
  attractorFactor: 0.005,
  attractorRange: 200,
  repellerFactor: 0.05,
  repellerRange: 150,
};

export const NUM_CHARACTERS = 34;

export class Boid {
  position: Vec2;
  velocity: Vec2;
  charIndex: number;
  colorPhase: number;
  sizeMul: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.position = { x, y };
    this.velocity = { x: vx, y: vy };
    this.charIndex = Math.floor(Math.random() * NUM_CHARACTERS);
    this.colorPhase = 0;
    this.sizeMul = 0.8 + Math.random() * 0.4;
  }

  update(
    allBoids: Boid[],
    attractor: Vec2 | null,
    repeller: Vec2 | null,
    config: BoidConfig,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    let xPosAvg = 0;
    let yPosAvg = 0;
    let xVelAvg = 0;
    let yVelAvg = 0;
    let neighborCount = 0;
    let xClose = 0;
    let yClose = 0;

    const visualRangeSq = config.visualRange * config.visualRange;
    const protectedRangeSq = config.protectedRange * config.protectedRange;

    for (let i = 0; i < allBoids.length; i++) {
      const other = allBoids[i];
      if (other === this) continue;

      const dx = this.position.x - other.position.x;
      const dy = this.position.y - other.position.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < visualRangeSq) {
        if (distSq < protectedRangeSq) {
          xClose += dx;
          yClose += dy;
        } else {
          xPosAvg += other.position.x;
          yPosAvg += other.position.y;
          xVelAvg += other.velocity.x;
          yVelAvg += other.velocity.y;
          neighborCount++;
        }
      }
    }

    // Alignment + Cohesion
    if (neighborCount > 0) {
      xPosAvg /= neighborCount;
      yPosAvg /= neighborCount;
      xVelAvg /= neighborCount;
      yVelAvg /= neighborCount;

      this.velocity.x +=
        (xPosAvg - this.position.x) * config.cohesionFactor +
        (xVelAvg - this.velocity.x) * config.alignmentFactor;
      this.velocity.y +=
        (yPosAvg - this.position.y) * config.cohesionFactor +
        (yVelAvg - this.velocity.y) * config.alignmentFactor;
    }

    // Separation
    this.velocity.x += xClose * config.separationFactor;
    this.velocity.y += yClose * config.separationFactor;

    // Attractor
    if (attractor) {
      const dx = attractor.x - this.position.x;
      const dy = attractor.y - this.position.y;
      const d = Math.hypot(dx, dy);
      if (d < config.attractorRange && d > 0) {
        const strength = config.attractorFactor * (config.attractorRange - d);
        this.velocity.x += (dx / d) * strength;
        this.velocity.y += (dy / d) * strength;
      }
    }

    // Repeller
    if (repeller) {
      const dx = this.position.x - repeller.x;
      const dy = this.position.y - repeller.y;
      const d = Math.hypot(dx, dy);
      if (d < config.repellerRange && d > 0) {
        const strength = config.repellerFactor * (config.repellerRange - d);
        this.velocity.x += (dx / d) * strength;
        this.velocity.y += (dy / d) * strength;
      }
    }

    // Edge avoidance
    if (this.position.x < config.edgeMargin) {
      this.velocity.x += config.edgeTurnFactor;
    }
    if (this.position.x > canvasWidth - config.edgeMargin) {
      this.velocity.x -= config.edgeTurnFactor;
    }
    if (this.position.y < config.edgeMargin) {
      this.velocity.y += config.edgeTurnFactor;
    }
    if (this.position.y > canvasHeight - config.edgeMargin) {
      this.velocity.y -= config.edgeTurnFactor;
    }

    // Speed clamp
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > config.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * config.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * config.maxSpeed;
    } else if (speed < config.minSpeed && speed > 0) {
      this.velocity.x = (this.velocity.x / speed) * config.minSpeed;
      this.velocity.y = (this.velocity.y / speed) * config.minSpeed;
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

/** Create N boids at random positions with random velocities */
export function createFlock(
  n: number,
  w: number,
  h: number,
  config: BoidConfig,
): Boid[] {
  const boids: Boid[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const angle = Math.random() * Math.PI * 2;
    const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
    boids.push(new Boid(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
  }
  return boids;
}
