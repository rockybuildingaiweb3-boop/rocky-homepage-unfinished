export function loadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
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
