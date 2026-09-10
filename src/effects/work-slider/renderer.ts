import { MeshRenderer } from '../defaults/renderer';
import { SliderImageMesh } from './item';

export class ImageRenderer extends MeshRenderer {
  meshItems: SliderImageMesh[];
  images: HTMLImageElement[];
  getSpeed: () => number;

  constructor(
    container: HTMLElement,
    images: HTMLImageElement[],
    getSpeed: () => number = () => 0
  ) {
    super(container);
    this.images = images;
    this.meshItems = [];
    this.getSpeed = getSpeed;
    this.setup();
  }

  setup(): boolean {
    // Assign SliderImageMesh instances to each loaded image before starting render loop
    this.images.forEach((img) => {
      try {
        if (img && img.parentElement) {
          const meshItem = new SliderImageMesh(img, this.scene, this.getSpeed);
          this.meshItems.push(meshItem);
        }
      } catch (err) {
        console.warn('Error creating SliderImageMesh for image:', err);
      }
    });

    const initialized = super.setup();
    if (!initialized) return false;

    return true;
  }

  render(): void {
    if (this.isDestroyed) return;
    for (let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].render();
    }
    super.render();
  }

  destroy(): void {
    this.meshItems.forEach((item) => {
      try {
        item.destroy();
      } catch {
        // Ignore disposal errors
      }
    });
    this.meshItems = [];
    super.destroy();
  }
}
