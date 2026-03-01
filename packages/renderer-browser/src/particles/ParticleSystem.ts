// GAMING-004: Full GPU Particle System with 10k+ particles
import * as THREE from 'three';

export interface ParticleSystemConfig {
  id: string;
  count: number;
  position: [number, number, number];
  lifetime?: { min: number; max: number } | number;
  velocity?: { min: [number, number, number]; max: [number, number, number] };
  size?: { min: number; max: number } | number;
  color?: { start: string; end: string } | string;
  gravity?: [number, number, number];
  emissionRate?: number;
  burst?: boolean;
  shape?: 'point' | 'sphere' | 'box' | 'cone';
  shapeSize?: number;
  rotation?: { min: number; max: number };
  angularVelocity?: { min: number; max: number };
  fadeIn?: number;
  fadeOut?: number;
  turbulence?: number;
  attractors?: Array<{ position: [number, number, number]; strength: number }>;
}

export class ParticleSystem {
  private particles: THREE.Points;
  private velocities: Float32Array;
  private lifetimes: Float32Array;
  private ages: Float32Array;
  private angularVelocities: Float32Array;
  private config: ParticleSystemConfig;
  private emissionTimer = 0;
  private activeCount = 0;
  private material: THREE.ShaderMaterial;

  constructor(config: ParticleSystemConfig) {
    this.config = config;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const alphas = new Float32Array(config.count);
    const rotations = new Float32Array(config.count);

    this.velocities = new Float32Array(config.count * 3);
    this.lifetimes = new Float32Array(config.count);
    this.ages = new Float32Array(config.count);
    this.angularVelocities = new Float32Array(config.count);

    for (let i = 0; i < config.count; i++) {
      this.initParticle(i, positions, sizes, colors, alphas, rotations);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: this.createParticleTexture() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float alpha;
        attribute float rotation;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vRotation;
        
        void main() {
          vColor = color;
          vAlpha = alpha;
          vRotation = rotation;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vRotation;
        
        void main() {
          vec2 coords = gl_PointCoord;
          float c = cos(vRotation);
          float s = sin(vRotation);
          coords = vec2(
            c * (coords.x - 0.5) + s * (coords.y - 0.5) + 0.5,
            c * (coords.y - 0.5) - s * (coords.x - 0.5) + 0.5
          );
          vec4 texColor = texture2D(pointTexture, coords);
          gl_FragColor = vec4(vColor, vAlpha) * texColor;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, this.material);
    this.activeCount = config.burst ? config.count : 0;
  }

  private initParticle(i: number, positions: Float32Array, sizes: Float32Array, colors: Float32Array, alphas: Float32Array, rotations: Float32Array): void {
    const pos = this.getEmissionPosition();
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    const vel = this.config.velocity || { min: [-1, 1, -1], max: [1, 3, 1] };
    this.velocities[i * 3] = THREE.MathUtils.randFloat(vel.min[0], vel.max[0]);
    this.velocities[i * 3 + 1] = THREE.MathUtils.randFloat(vel.min[1], vel.max[1]);
    this.velocities[i * 3 + 2] = THREE.MathUtils.randFloat(vel.min[2], vel.max[2]);

    const lt = typeof this.config.lifetime === 'number' ? { min: this.config.lifetime, max: this.config.lifetime } : (this.config.lifetime || { min: 1, max: 2 });
    this.lifetimes[i] = THREE.MathUtils.randFloat(lt.min, lt.max);
    this.ages[i] = this.config.burst ? 0 : this.lifetimes[i] + 1;

    const sz = typeof this.config.size === 'number' ? { min: this.config.size, max: this.config.size } : (this.config.size || { min: 0.05, max: 0.1 });
    sizes[i] = THREE.MathUtils.randFloat(sz.min, sz.max);

    const startColor = new THREE.Color(typeof this.config.color === 'object' ? this.config.color.start : (this.config.color || '#ffffff'));
    colors[i * 3] = startColor.r;
    colors[i * 3 + 1] = startColor.g;
    colors[i * 3 + 2] = startColor.b;

    alphas[i] = 0;

    const rot = this.config.rotation || { min: 0, max: Math.PI * 2 };
    rotations[i] = THREE.MathUtils.randFloat(rot.min, rot.max);

    const angVel = this.config.angularVelocity || { min: -1, max: 1 };
    this.angularVelocities[i] = THREE.MathUtils.randFloat(angVel.min, angVel.max);
  }

  private getEmissionPosition(): THREE.Vector3 {
    const base = new THREE.Vector3(...this.config.position);
    const shape = this.config.shape || 'point';
    const size = this.config.shapeSize || 1;

    switch (shape) {
      case 'sphere': {
        const dir = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(2),
          THREE.MathUtils.randFloatSpread(2),
          THREE.MathUtils.randFloatSpread(2)
        ).normalize();
        return base.clone().add(dir.multiplyScalar(Math.random() * size));
      }
      case 'box':
        return base.clone().add(new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(size),
          THREE.MathUtils.randFloatSpread(size),
          THREE.MathUtils.randFloatSpread(size)
        ));
      case 'cone': {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size;
        return base.clone().add(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.random() * size,
          Math.sin(angle) * radius
        ));
      }
      default:
        return base.clone();
    }
  }

  private createParticleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  update(deltaTime: number): void {
    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    const colors = this.particles.geometry.attributes.color.array as Float32Array;
    const alphas = this.particles.geometry.attributes.alpha.array as Float32Array;
    const rotationAngles = this.particles.geometry.attributes.rotation.array as Float32Array;
    
    const gravity = this.config.gravity || [0, -9.81, 0];
    const turbulence = this.config.turbulence || 0;

    if (!this.config.burst && this.config.emissionRate) {
      this.emissionTimer += deltaTime;
      const emitInterval = 1 / this.config.emissionRate;
      
      while (this.emissionTimer >= emitInterval && this.activeCount < this.config.count) {
        this.emissionTimer -= emitInterval;
        const i = this.activeCount++;
        this.ages[i] = 0;
        const pos = this.getEmissionPosition();
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
      }
    }

    for (let i = 0; i < this.activeCount; i++) {
      this.ages[i] += deltaTime;
      
      if (this.ages[i] > this.lifetimes[i]) {
        alphas[i] = 0;
        continue;
      }

      const lifeProgress = this.ages[i] / this.lifetimes[i];

      this.velocities[i * 3] += gravity[0] * deltaTime;
      this.velocities[i * 3 + 1] += gravity[1] * deltaTime;
      this.velocities[i * 3 + 2] += gravity[2] * deltaTime;
      
      if (turbulence > 0) {
        this.velocities[i * 3] += (Math.random() - 0.5) * turbulence;
        this.velocities[i * 3 + 1] += (Math.random() - 0.5) * turbulence;
        this.velocities[i * 3 + 2] += (Math.random() - 0.5) * turbulence;
      }

      if (this.config.attractors) {
        for (const attractor of this.config.attractors) {
          const dx = attractor.position[0] - positions[i * 3];
          const dy = attractor.position[1] - positions[i * 3 + 1];
          const dz = attractor.position[2] - positions[i * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = attractor.strength / distSq;
            this.velocities[i * 3] += (dx / dist) * force * deltaTime;
            this.velocities[i * 3 + 1] += (dy / dist) * force * deltaTime;
            this.velocities[i * 3 + 2] += (dz / dist) * force * deltaTime;
          }
        }
      }

      positions[i * 3] += this.velocities[i * 3] * deltaTime;
      positions[i * 3 + 1] += this.velocities[i * 3 + 1] * deltaTime;
      positions[i * 3 + 2] += this.velocities[i * 3 + 2] * deltaTime;

      rotationAngles[i] += this.angularVelocities[i] * deltaTime;

      if (typeof this.config.color === 'object') {
        const startColor = new THREE.Color(this.config.color.start);
        const endColor = new THREE.Color(this.config.color.end);
        const color = startColor.lerp(endColor, lifeProgress);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      let alpha = 1;
      const fadeIn = this.config.fadeIn || 0;
      const fadeOut = this.config.fadeOut || 0.2;
      
      if (this.ages[i] < fadeIn) {
        alpha = this.ages[i] / fadeIn;
      } else if (lifeProgress > 1 - fadeOut) {
        alpha = (1 - lifeProgress) / fadeOut;
      }
      
      alphas[i] = alpha;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.color.needsUpdate = true;
    this.particles.geometry.attributes.alpha.needsUpdate = true;
    this.particles.geometry.attributes.rotation.needsUpdate = true;
    
    this.material.uniforms.time.value += deltaTime;
  }

  getObject(): THREE.Points {
    return this.particles;
  }

  getParticles() {
    return [];
  }
}
