import * as THREE from 'three';
import { StudioImageMesh } from './StudioImageMesh';

export interface StudioRendererOptions {
  getTrackX?: () => number;
  onNeedsRender?: () => void;
}

export class StudioRenderer {
  container: HTMLElement;
  scene: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  meshItems: StudioImageMesh[] = [];
  images: HTMLImageElement[];
  isDisposed = false;

  private cachedWidth = 1200;
  private cachedHeight = 600;
  private cachedAspect = 2;
  private resizeObserver: ResizeObserver | null = null;
  private nodeToMesh = new Map<Element, StudioImageMesh>();
  private getTrackX: () => number;
  private onNeedsRender?: () => void;

  constructor(
    container: HTMLElement,
    images: HTMLImageElement[],
    options: StudioRendererOptions = {}
  ) {
    this.container = container;
    this.images = images;
    this.getTrackX = options.getTrackX ?? (() => 0);
    this.onNeedsRender = options.onNeedsRender;
    this.scene = new THREE.Scene();
    this.setup();
  }

  private measureContainerDimensions(): void {
    const width = window.innerWidth || 1200;
    const height =
      this.container.clientHeight ||
      this.container.getBoundingClientRect().height ||
      window.innerHeight ||
      600;
    this.cachedWidth = width;
    this.cachedHeight = height;
    this.cachedAspect = width / (height || 1);
  }

  setup(): void {
    this.measureContainerDimensions();
    const fov = (180 * (2 * Math.atan(this.cachedHeight / 2 / 1000))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(fov, this.cachedAspect, 1, 2000);
    this.camera.position.set(0, 0, 1000);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(this.cachedWidth, this.cachedHeight);
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

    const initialTrackX = this.getTrackX();

    // Create mesh items for each image element
    this.images.forEach((img) => {
      const parent = img.parentElement;
      if (parent) {
        const meshItem = new StudioImageMesh(
          img,
          this.scene,
          parent,
          initialTrackX,
          this.cachedWidth,
          this.onNeedsRender
        );
        this.meshItems.push(meshItem);
        this.nodeToMesh.set(parent, meshItem);
      }
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (this.isDisposed) return;
        const currentTrackX = this.getTrackX();
        let containerResized = false;

        for (const entry of entries) {
          if (entry.target === this.container) {
            containerResized = true;
          } else {
            const mesh = this.nodeToMesh.get(entry.target);
            if (mesh) {
              mesh.updateLayoutCache(currentTrackX, this.cachedWidth);
            }
          }
        }

        if (containerResized) {
          this.onResize();
        } else {
          this.onNeedsRender?.();
        }
      });

      this.resizeObserver.observe(this.container);
      for (const node of this.nodeToMesh.keys()) {
        this.resizeObserver.observe(node);
      }
    }

    window.addEventListener('resize', this.onResize, false);
  }

  /**
   * Synchronizes cached mesh dimensions when CSS transitions (reveal/expand) temporarily change card geometry.
   */
  syncLayout(currentTrackX?: number): void {
    if (this.isDisposed) return;
    const trackX = currentTrackX ?? this.getTrackX();
    for (let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].updateLayoutCache(trackX, this.cachedWidth);
    }
  }

  onResize = (): void => {
    if (this.isDisposed || !this.renderer || !this.camera) return;
    this.measureContainerDimensions();
    this.camera.aspect = this.cachedAspect;
    this.camera.fov = (180 * (2 * Math.atan(this.cachedHeight / 2 / 1000))) / Math.PI;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.cachedWidth, this.cachedHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.syncLayout(this.getTrackX());
    this.onNeedsRender?.();
  };

  render(speed: number, currentTrackX: number = this.getTrackX()): void {
    if (this.isDisposed || !this.renderer || !this.camera) return;

    let hasActiveMesh = false;
    for (let i = 0; i < this.meshItems.length; i++) {
      const mesh = this.meshItems[i];
      if (!mesh.hasFailed && mesh.hasLoaded) {
        hasActiveMesh = true;
        mesh.render(speed, currentTrackX, this.cachedWidth);
      }
    }

    if (!hasActiveMesh) return;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.isDisposed = true;
    window.removeEventListener('resize', this.onResize);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.nodeToMesh.clear();

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
