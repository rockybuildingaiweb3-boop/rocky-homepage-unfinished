import * as THREE from 'three';
import { getFragmentShaders, vertexShader } from './shaders';

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
  clock: THREE.Clock;
  texture: THREE.Texture | null = null;

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

  constructor(element: HTMLImageElement, scene: THREE.Scene, dimensionsNode: HTMLElement) {
    this.element = element;
    this.scene = scene;
    this.dimensionsNode = dimensionsNode;
    this.offset = new THREE.Vector2(0, 0);
    this.sizes = new THREE.Vector2(0, 0);
    this.clock = new THREE.Clock();

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

    this.createMesh();
  }

  setDimensions(): void {
    const rect = this.dimensionsNode.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = rect.left;

    this.sizes.set(width, height);
    // Position relative to viewport center in Three.js coordinate system (1 unit = 1 pixel)
    this.offset.set(left - window.innerWidth / 2 + width / 2, 0);
  }

  createMesh(): void {
    this.setDimensions();

    // 32x32 subdivisions ensure smooth vertex deformation and wave ripple
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    const imgRect = this.element.getBoundingClientRect();
    const imgW = imgRect.width || this.sizes.x || 300;
    const imgH = imgRect.height || this.sizes.y || 400;

    const loader = new THREE.TextureLoader();
    this.texture = loader.load(this.element.src, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      if (this.material) {
        this.material.needsUpdate = true;
      }
    });

    this.uniforms.uTexture.value = this.texture;
    this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);
    this.uniforms.uImgSize.value.set(imgW, imgH);

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
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x || 1, this.sizes.y || 1, 1);
    this.scene.add(this.mesh);

    // Hide original image element so WebGL mesh renders seamlessly in its place
    this.element.style.opacity = '0';
  }

  render(speed: number): void {
    this.setDimensions();
    this.checkShader();

    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    const imgRect = this.element.getBoundingClientRect();
    this.uniforms.uImgSize.value.set(imgRect.width || this.sizes.x, imgRect.height || this.sizes.y);
    this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);

    // Warping and distortion effect driven by scroll velocity
    this.uniforms.uOffset.value.set(speed * -0.0003, Math.abs(speed * 0.00005));
    this.uniforms.uTime.value = this.clock.getElapsedTime() * 0.8;
  }

  checkShader(): void {
    const targetShader = this.loadFragmentShader;
    if (targetShader === this.activeFragmentShader) return;
    this.activeFragmentShader = targetShader;

    this.material.fragmentShader = this.activeFragmentShader;
    this.material.needsUpdate = true;
  }

  private get loadFragmentShader(): string {
    if (this.sizes.y > 0 && this.sizes.x / this.sizes.y < 1) {
      return this.shaders.fragment.horizontal;
    } else {
      return this.shaders.fragment.vertical;
    }
  }

  dispose(): void {
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
    }
    if (this.element) {
      this.element.style.opacity = '1';
    }
  }
}
