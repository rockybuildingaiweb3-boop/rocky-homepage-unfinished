import * as THREE from 'three';
import { ImageMesh } from '../defaults/image-mesh';
import { fragmentShader, vertexShader } from './shaders';

export class SliderImageMesh extends ImageMesh {
  speed = 0;
  clock: THREE.Clock;
  getSpeed: () => number;

  constructor(
    element: HTMLImageElement,
    scene: THREE.Scene,
    getSpeed: () => number
  ) {
    const shaders = {
      vertex: vertexShader,
      fragment: {
        vertical: fragmentShader().vertical,
        horizontal: fragmentShader().horizontal,
      },
    };

    const uniforms = {
      uTime: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
      uAlpha: { value: 0.7 },
    };

    super(element, scene, shaders, element.parentElement!, uniforms);
    this.clock = new THREE.Clock();
    this.getSpeed = getSpeed;
  }

  createMesh(): void {
    super.createMesh();
    // Hide original image element so the Three.js shader-warped mesh renders in place
    if (this.element.parentElement) {
      this.element.parentElement.style.visibility = 'hidden';
    }
  }

  render(): void {
    super.render();
    this.speed = this.getSpeed();
    if (this.uniforms.uOffset) {
      this.uniforms.uOffset.value.set(
        this.speed * -0.0003,
        Math.abs(this.speed * 0.00005)
      );
    }
    if (this.uniforms.uTime) {
      this.uniforms.uTime.value = this.clock.getElapsedTime() * 0.8;
    }
  }

  destroy(): void {
    if (this.element.parentElement) {
      this.element.parentElement.style.visibility = 'visible';
    }
    super.destroy();
  }
}
