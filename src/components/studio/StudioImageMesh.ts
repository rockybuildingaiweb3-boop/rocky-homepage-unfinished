import * as THREE from 'three';
import { getFragmentShaders, vertexShader } from './shaders';
import { computeMeshCenterOffsetX } from './studioLoopLogic';

export class StudioImageMesh {
  element: HTMLImageElement;
  dimensionsNode: HTMLElement;
  scene: THREE.Scene;
  offset: THREE.Vector2;
  sizes: THREE.Vector2;
  material!: THREE.ShaderMaterial;
  geometry!: THREE.PlaneGeometry;
  mesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  activeFragmentShader: string = '';
  texture: THREE.Texture | null = null;

  cachedBaseLeft: number = 0;
  cachedWidth: number = 0;
  cachedHeight: number = 0;
  cachedImgWidth: number = 300;
  cachedImgHeight: number = 400;

  hasLoaded: boolean = false;
  hasFailed: boolean = false;
  isDisposed: boolean = false;
  private startTimeMs: number;
  private onTextureReady?: () => void;

  shaders: {
    fragment: { vertical: string; horizontal: string };
    vertex: string;
  };

  uniforms: {
    uTexture: { value: THREE.Texture | null };
    uMeshSize: { value: THREE.Vector2 };
    uImgSize: { value: THREE.Vector2 };
    uTime: { value: number };
    uOffset: { value: THREE.Vector2 };
    uAlpha: { value: number };
  };

  constructor(
    element: HTMLImageElement,
    scene: THREE.Scene,
    dimensionsNode: HTMLElement,
    initialTrackX: number = 0,
    viewportWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200,
    onTextureReady?: () => void
  ) {
    this.element = element;
    this.scene = scene;
    this.dimensionsNode = dimensionsNode;
    this.offset = new THREE.Vector2(0, 0);
    this.sizes = new THREE.Vector2(0, 0);
    this.startTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.onTextureReady = onTextureReady;

    const frags = getFragmentShaders();
    this.shaders = {
      vertex: vertexShader,
      fragment: {
        vertical: frags.vertical,
        horizontal: frags.horizontal,
      },
    };

    this.uniforms = {
      uTexture: { value: null },
      uMeshSize: { value: new THREE.Vector2(0, 0) },
      uImgSize: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
      uAlpha: { value: 0.85 },
    };

    this.createMesh(initialTrackX, viewportWidth);
  }

  /**
   * Measures DOM layout rects and caches base horizontal offset relative to trackX = 0.
   * Called only on init, ResizeObserver changes, or explicit transition sync — never on every steady frame.
   */
  updateLayoutCache(currentTrackX: number, viewportWidth: number): void {
    if (this.isDisposed) return;

    const rect = this.dimensionsNode.getBoundingClientRect();
    const imgRect = this.element.getBoundingClientRect();

    this.cachedWidth = rect.width;
    this.cachedHeight = rect.height;
    this.cachedBaseLeft = rect.left - currentTrackX;
    this.cachedImgWidth = imgRect.width || rect.width || 300;
    this.cachedImgHeight = imgRect.height || rect.height || 400;

    this.sizes.set(this.cachedWidth, this.cachedHeight);
    this.uniforms.uMeshSize.value.set(this.cachedWidth, this.cachedHeight);
    this.uniforms.uImgSize.value.set(this.cachedImgWidth, this.cachedImgHeight);

    if (this.mesh) {
      this.mesh.scale.set(this.cachedWidth || 1, this.cachedHeight || 1, 1);
    }

    this.applyCachedPosition(currentTrackX, viewportWidth);
  }

  applyCachedPosition(currentTrackX: number, viewportWidth: number): void {
    const offsetX = computeMeshCenterOffsetX(
      this.cachedBaseLeft,
      currentTrackX,
      this.cachedWidth,
      viewportWidth
    );
    this.offset.set(offsetX, 0);
    if (this.mesh) {
      this.mesh.position.set(offsetX, 0, 0);
    }
  }

  createMesh(initialTrackX: number, viewportWidth: number): void {
    // 32x32 subdivisions ensure smooth vertex deformation and wave ripple
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    this.activeFragmentShader = this.loadFragmentShader;
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.shaders.vertex,
      fragmentShader: this.activeFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // Keep mesh hidden until texture finishes loading so original HTML <img> remains visible with zero flash
    this.mesh.visible = false;
    this.updateLayoutCache(initialTrackX, viewportWidth);
    this.scene.add(this.mesh);

    const loader = new THREE.TextureLoader();
    this.texture = loader.load(
      this.element.src,
      (tex) => {
        if (this.isDisposed) {
          tex.dispose();
          return;
        }
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        this.hasLoaded = true;
        this.hasFailed = false;
        this.checkShader();
        if (this.material) {
          this.material.needsUpdate = true;
        }
        if (this.mesh) {
          this.mesh.visible = true;
        }
        // Hide original HTML <img> only after WebGL texture succeeds
        this.element.style.opacity = '0';
        this.onTextureReady?.();
      },
      undefined,
      () => {
        if (this.isDisposed) return;
        this.hasFailed = true;
        this.hasLoaded = false;
        if (this.mesh) {
          this.mesh.visible = false;
          this.scene.remove(this.mesh);
        }
        if (this.texture) {
          this.texture.dispose();
          this.texture = null;
        }
        this.uniforms.uTexture.value = null;
        // Fallback cleanly to the original HTML <img>
        this.element.style.opacity = '1';
        this.onTextureReady?.();
      }
    );

    this.uniforms.uTexture.value = this.texture;
  }

  render(speed: number, currentTrackX: number, viewportWidth: number): void {
    if (this.isDisposed || this.hasFailed || !this.hasLoaded || !this.mesh) return;

    this.applyCachedPosition(currentTrackX, viewportWidth);
    this.checkShader();

    // Warping and distortion effect driven by velocity (calibrated to reference)
    const factorX = -0.00012;
    const factorY = 0.00003;
    const clampedOffsetX = Math.max(-0.25, Math.min(0.25, speed * factorX));
    const clampedOffsetY = Math.max(0, Math.min(0.08, Math.abs(speed * factorY)));
    this.uniforms.uOffset.value.set(clampedOffsetX, clampedOffsetY);
    this.uniforms.uTime.value = (performance.now() - this.startTimeMs) * 0.0008;
  }

  checkShader(): void {
    const targetShader = this.loadFragmentShader;
    if (targetShader === this.activeFragmentShader) return;
    this.activeFragmentShader = targetShader;

    if (this.material) {
      this.material.fragmentShader = this.activeFragmentShader;
      this.material.needsUpdate = true;
    }
  }

  private get loadFragmentShader(): string {
    if (this.sizes.y > 0 && this.sizes.x / this.sizes.y < 1) {
      return this.shaders.fragment.horizontal;
    } else {
      return this.shaders.fragment.vertical;
    }
  }

  dispose(): void {
    this.isDisposed = true;
    if (this.mesh && this.scene) {
      this.scene.remove(this.mesh);
    }
    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
    if (this.element) {
      this.element.style.opacity = '1';
    }
  }
}
