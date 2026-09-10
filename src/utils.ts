export function fetchJsonData<T = any>(sourceFile: string): Promise<T> {
  return fetch(sourceFile).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${sourceFile}: ${res.statusText}`);
    return res.json();
  });
}

export function loadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
  });
}

export function onScrolledIntoView(
  node: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  threshold = 0.35
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
          observer.disconnect();
        }
      });
    },
    { root: null, threshold }
  );
  observer.observe(node);
  return () => observer.disconnect();
}

let webglSupportCached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (webglSupportCached !== null) return webglSupportCached;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    webglSupportCached = Boolean(gl);
    return webglSupportCached;
  } catch {
    webglSupportCached = false;
    return false;
  }
}
