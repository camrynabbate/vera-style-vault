import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh(onRefresh, containerRef) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(null);
  const THRESHOLD = 72;

  useEffect(() => {
    const el = containerRef?.current ?? window;
    const isWindow = el === window;

    const getScrollTop = () => isWindow ? window.scrollY : el.scrollTop;

    const onTouchStart = (e) => {
      if (getScrollTop() === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && getScrollTop() === 0) {
        e.preventDefault();
        setPullDistance(Math.min(dy * 0.5, THRESHOLD * 1.5));
        setIsPulling(dy > THRESHOLD);
      }
    };

    const onTouchEnd = () => {
      if (isPulling) onRefresh();
      startY.current = null;
      setPullDistance(0);
      setIsPulling(false);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh, isPulling, containerRef]);

  return { pullDistance, isPulling };
}