import * as THREE from 'three';
import { StudioImageMesh } from './StudioImageMesh';

export class StudioRenderer {
  container: HTMLElement;
  scene: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  meshItems: StudioImageMesh[] = [];
  images: HTMLImageElement[];
  isDisposed = false;

  constructor(container: HTMLElement, images: HTMLImageElement[]) {
    this.container = container;
    this.images = images;
    this.scene = new THREE.Scene();
    this.setup();
  }

  private get dimensions(): { width: number; height: number; aspect: number } {
    const width = window.innerWidth;
    const height = this.container.getBoundingClientRect().height || window.innerHeight;
    const aspect = width / (height || 1);
    return { width, height, aspect };
  }

  setup(): void {
    const dims = this.dimensions;
    const fov = (180 * (2 * Math.atan(dims.height / 2 / 1000))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(fov, dims.aspect, 1, 2000);
    this.camera.position.set(0, 0, 1000);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(dims.width, dims.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvas = this.renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    this.container.appendChild(canvas);

    // Create mesh items for each image element
    this.images.forEach((img) => {
      const parent = img.parentElement;
      if (parent) {
        const meshItem = new StudioImageMesh(img, this.scene, parent);
        this.meshItems.push(meshItem);
      }
    });

    window.addEventListener('resize', this.onResize, false);
  }

  onResize = (): void => {
    if (this.isDisposed || !this.renderer || !this.camera) return;
    const dims = this.dimensions;
    this.camera.aspect = dims.aspect;
    this.camera.fov = (180 * (2 * Math.atan(dims.height / 2 / 1000))) / Math.PI;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(dims.width, dims.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  render(speed: number): void {
    if (this.isDisposed || !this.renderer || !this.camera) return;

    for (let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].render(speed);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.isDisposed = true;
    window.removeEventListener('resize', this.onResize);

    for (const mesh of this.meshItems) {
      mesh.dispose();
    }
    this.meshItems = [];

    if (this.renderer) {
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }
}
