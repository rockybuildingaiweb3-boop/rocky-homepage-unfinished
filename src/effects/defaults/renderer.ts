import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils';

export class MeshRenderer {
  container: HTMLElement;
  scene: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  animFrameId: number | null = null;
  isDestroyed = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
  }

  get dimensions(): { width: number; height: number; aspect: number } {
    const width = window.innerWidth;
    const height = Math.max(this.container.getBoundingClientRect().height, 100);
    const aspect = width / height;
    return { width, height, aspect };
  }

  setup(): boolean {
    if (!isWebGLAvailable()) {
      return false;
    }
    try {
      const fov =
        (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;
      this.camera = new THREE.PerspectiveCamera(
        fov,
        this.dimensions.aspect,
        1,
        2000
      );
      this.camera.position.set(0, 0, 1000);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setSize(this.dimensions.width, this.dimensions.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Style work content canvas locally, isolated from any background atmosphere
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.pointerEvents = 'none';
      this.renderer.domElement.style.zIndex = '5';
      this.renderer.domElement.className = 'work-three-canvas';

      this.container.appendChild(this.renderer.domElement);

      window.addEventListener('resize', this.windowResize);
      this.render();
      return true;
    } catch (err) {
      console.warn('Could not initialize WebGL Work ImageRenderer:', err);
      return false;
    }
  }

  windowResize = (): void => {
    if (this.isDestroyed || !this.camera || !this.renderer) return;
    this.camera.aspect = this.dimensions.aspect;
    this.camera.fov =
      (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
  };

  render(): void {
    if (this.isDestroyed) return;
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    this.animFrameId = requestAnimationFrame(() => this.render());
  }

  destroy(): void {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.windowResize);
    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }
}
