// GAMING-004: Minimal GPU Particle System (MVP)
// Full implementation would use instanced rendering and GPU compute

export interface ParticleSystemConfig {
  id: string;
  count: number;
  position: [number, number, number];
  lifetime: number;
  velocity: { min: [number, number, number]; max: [number, number, number] };
  size: number;
  color: string;
}

export class ParticleSystem {
  private particles: Array<{
    position: [number, number, number];
    velocity: [number, number, number];
    age: number;
    lifetime: number;
  }> = [];

  constructor(private config: ParticleSystemConfig) {
    this.init();
  }

  private init() {
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        position: [...this.config.position] as [number, number, number],
        velocity: this.randomVelocity(),
        age: 0,
        lifetime: this.config.lifetime,
      });
    }
  }

  private randomVelocity(): [number, number, number] {
    const { min, max } = this.config.velocity;
    return [
      min[0] + Math.random() * (max[0] - min[0]),
      min[1] + Math.random() * (max[1] - min[1]),
      min[2] + Math.random() * (max[2] - min[2]),
    ];
  }

  update(deltaTime: number) {
    for (const particle of this.particles) {
      particle.age += deltaTime;
      
      if (particle.age >= particle.lifetime) {
        // Reset particle
        particle.position = [...this.config.position] as [number, number, number];
        particle.velocity = this.randomVelocity();
        particle.age = 0;
      } else {
        // Update position
        particle.position[0] += particle.velocity[0] * deltaTime;
        particle.position[1] += particle.velocity[1] * deltaTime;
        particle.position[2] += particle.velocity[2] * deltaTime;
        
        // Apply gravity
        particle.velocity[1] -= 9.81 * deltaTime;
      }
    }
  }

  getParticles() {
    return this.particles;
  }
}
