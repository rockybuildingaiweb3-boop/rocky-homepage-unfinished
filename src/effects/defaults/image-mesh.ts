import * as THREE from 'three';

export interface ImageMeshShaders {
  fragment: { vertical: string; horizontal: string };
  vertex: string;
}

export interface ImageMeshUniforms {
  uTexture?: { value: THREE.Texture | null };
  uMeshSize?: { value: THREE.Vector2 };
  uImgSize?: { value: THREE.Vector2 };
  uTime?: { value: number };
  uOffset?: { value: THREE.Vector2 };
  uAlpha?: { value: number };
}

export class ImageMesh {
  element: HTMLImageElement;
  dimensionsNode: HTMLElement;
  scene: THREE.Scene;
  offset: THREE.Vector2;
  sizes: THREE.Vector2;
  material: THREE.ShaderMaterial | null = null;
  geometry: THREE.BufferGeometry | null = null;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;
  activeFragmentShader = '';
  uniforms: ImageMeshUniforms;
  shaders: ImageMeshShaders;
  texture: THREE.Texture | null = null;

  constructor(
    element: HTMLImageElement,
    scene: THREE.Scene,
    shaders: ImageMeshShaders,
    dimensionsNode: HTMLElement,
    uniforms?: ImageMeshUniforms
  ) {
    this.element = element;
    this.scene = scene;
    this.shaders = shaders;
    this.uniforms = uniforms || {};
    this.dimensionsNode = dimensionsNode;
    this.offset = new THREE.Vector2(0, 0);
    this.sizes = new THREE.Vector2(0, 0);
    this.createMesh();
  }

  setDimensions(): void {
    const rect = this.dimensionsNode.getBoundingClientRect();
    this.sizes.set(rect.width, rect.height);
    this.offset.set(rect.left - window.innerWidth / 2 + rect.width / 2, 0);
  }

  createMesh(): void {
    this.setDimensions();
    this.geometry = new THREE.PlaneGeometry(1, 1, 4, 6);
    const rect = this.element.getBoundingClientRect();

    const loader = new THREE.TextureLoader();
    this.texture = loader.load(this.element.src);

    this.uniforms = {
      uTexture: { value: this.texture },
      uMeshSize: { value: new THREE.Vector2(this.sizes.x, this.sizes.y) },
      uImgSize: { value: new THREE.Vector2(rect.width, rect.height) },
      ...this.uniforms,
    };

    this.activeFragmentShader = this.loadFragmentShader;
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms as Record<string, THREE.IUniform>,
      vertexShader: this.shaders.vertex,
      fragmentShader: this.activeFragmentShader,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.scene.add(this.mesh);
  }

  render(): void {
    if (!this.mesh || !this.material) return;
    this.setDimensions();
    this.checkShader();
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    const rect = this.element.getBoundingClientRect();
    if (this.uniforms.uImgSize) {
      this.uniforms.uImgSize.value.set(rect.width, rect.height);
    }
    if (this.uniforms.uMeshSize) {
      this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);
    }
  }

  checkShader(): void {
    if (this.loadFragmentShader === this.activeFragmentShader || !this.mesh) return;
    this.activeFragmentShader = this.loadFragmentShader;
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms as Record<string, THREE.IUniform>,
      vertexShader: this.shaders.vertex,
      fragmentShader: this.activeFragmentShader,
      transparent: true,
    });
    this.mesh.material = this.material;
  }

  private get loadFragmentShader(): string {
    if (this.sizes.y > 0 && this.sizes.x / this.sizes.y < 1) {
      return this.shaders.fragment.horizontal;
    }
    return this.shaders.fragment.vertical;
  }

  destroy(): void {
    if (this.mesh) {
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
    if (this.element.parentElement) {
      this.element.parentElement.style.visibility = '';
    }
  }
}
