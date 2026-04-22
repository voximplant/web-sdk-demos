import { onBeforeUnmount, onMounted, type Ref } from 'vue';

const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  const mqStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const mqMinimal = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
  const iosStandalone =
    'standalone' in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mqStandalone || mqMinimal || iosStandalone;
};

/**
 * Returns the intrinsic size of an element. `scrollWidth`/`scrollHeight` are
 * preferred because they reflect the content size even when the element is
 * clipped by `overflow: hidden`. `getBoundingClientRect()` is used as a
 * fallback when the element is fully visible.
 */
const measureContentSize = (element: HTMLElement): { width: number; height: number } => {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(element.scrollWidth, Math.ceil(rect.width)),
    height: Math.max(element.scrollHeight, Math.ceil(rect.height)),
  };
};

/**
 * Resizes the browser window so its inner viewport matches the given
 * element's rendered content size. Only attempts the resize when the document
 * is running as an installed PWA (display-mode: standalone), because
 * `window.resizeTo` is a no-op for regular browser tabs.
 */
export const resizeWindowToElement = (element: HTMLElement | null | undefined): void => {
  if (typeof window === 'undefined') return;
  if (!isStandalone()) return;
  if (!element) return;

  const { width, height } = measureContentSize(element);
  if (width <= 0 || height <= 0) return;

  try {
    const chromeWidth = Math.max(0, window.outerWidth - window.innerWidth);
    const chromeHeight = Math.max(0, window.outerHeight - window.innerHeight);

    window.resizeTo(Math.round(width + chromeWidth), Math.round(height + chromeHeight));
  } catch {
    /* resizeTo is blocked in some contexts; silently ignore */
  }
};

/**
 * Keeps the window size locked to the rendered content of the provided
 * element while the component is mounted. Listens for size changes via
 * `ResizeObserver` and re-applies on display-mode transitions (e.g. when the
 * user installs the app as a PWA).
 */
export const useAppWindow = (elementRef: Ref<HTMLElement | null>): void => {
  const standaloneMedia =
    typeof window !== 'undefined' ? window.matchMedia('(display-mode: standalone)') : null;

  let resizeObserver: ResizeObserver | null = null;
  let rafId = 0;

  const scheduleResize = (): void => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      resizeWindowToElement(elementRef.value);
    });
  };

  const handleDisplayModeChange = (): void => {
    scheduleResize();
  };

  onMounted(() => {
    scheduleResize();
    standaloneMedia?.addEventListener('change', handleDisplayModeChange);

    if (typeof ResizeObserver !== 'undefined' && elementRef.value) {
      resizeObserver = new ResizeObserver(() => scheduleResize());
      resizeObserver.observe(elementRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    standaloneMedia?.removeEventListener('change', handleDisplayModeChange);
    resizeObserver?.disconnect();
    resizeObserver = null;
  });
};
