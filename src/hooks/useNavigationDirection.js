import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ROOT_PATHS = ['/', '/find-dupes', '/saved', '/styleboards', '/profile'];

function getDepth(pathname) {
  return pathname === '/' ? 0 : pathname.split('/').filter(Boolean).length;
}

function isRootPath(pathname) {
  return ROOT_PATHS.includes(pathname);
}

/**
 * Returns current navigation direction: 'push' | 'pop' | 'tab'
 * Computed synchronously before render so AnimatePresence picks it up.
 */
export default function useNavigationDirection() {
  const location = useLocation();
  const prevRef = useRef(location.pathname);
  const directionRef = useRef('push');

  const prev = prevRef.current;
  const curr = location.pathname;

  if (curr !== prev) {
    const prevDepth = getDepth(prev);
    const currDepth = getDepth(curr);

    if (isRootPath(curr) && isRootPath(prev)) {
      directionRef.current = 'tab';
    } else if (currDepth > prevDepth) {
      directionRef.current = 'push';
    } else {
      directionRef.current = 'pop';
    }

    prevRef.current = curr;
  }

  return directionRef.current;
}