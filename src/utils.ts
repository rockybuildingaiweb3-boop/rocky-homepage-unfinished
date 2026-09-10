export function loadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
  });
}

export function devMsg(): void {
  if (import.meta.env.DEV) {
    console.info('Rocky homepage development mode');
  }
}
