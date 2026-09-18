export function fetchJsonData<T = any>(sourceFile: string): Promise<T> {
  return fetch(sourceFile).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${sourceFile}: ${res.statusText}`);
    return res.json();
  });
}

export function loadImage(src: string, timeoutMs = 3500): Promise<string> {
  return new Promise((resolve) => {
    let settled = false;
    const img = new Image();

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(src);
      }
    }, timeoutMs);

    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(src);
      }
    };

    img.onerror = (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        console.warn('Non-blocking asset fallback:', src, err);
        resolve(src);
      }
    };
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

export function devMsg() {
  const css = 'font-size: 1.2rem; font-weight: bold;';
  console.log('%cRocky Babcock — Portfolio', css + 'color: #22c55e;');
  console.log('%cCreative Technologist & Frontend Developer', css);
}

export function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

let _webglSupportCached: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (_webglSupportCached !== null) return _webglSupportCached;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    _webglSupportCached = Boolean(gl);
    return _webglSupportCached;
  } catch {
    _webglSupportCached = false;
    return false;
  }
}

