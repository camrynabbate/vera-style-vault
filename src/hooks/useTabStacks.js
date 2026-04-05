import { useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ROOT_PATHS = ['/', '/find-dupes', '/saved', '/styleboards', '/profile'];

function getRootForPath(pathname) {
  if (pathname === '/') return '/';
  return ROOT_PATHS.find((r) => r !== '/' && pathname.startsWith(r)) ?? '/';
}

/**
 * Manages independent tab stacks.
 * Returns { navigateToTab, getTabPath }
 */
export default function useTabStacks() {
  // Map of rootPath → last full path visited within that tab
  const stackRef = useRef({});

  const location = useLocation();
  const navigate = useNavigate();

  // Keep the stack up-to-date whenever location changes
  const currentRoot = getRootForPath(location.pathname);
  stackRef.current[currentRoot] = location.pathname;

  const navigateToTab = useCallback((tabPath) => {
    const savedPath = stackRef.current[tabPath];
    navigate(savedPath && savedPath !== tabPath ? savedPath : tabPath);
  }, [navigate]);

  const getTabPath = useCallback((tabPath) => {
    return stackRef.current[tabPath] ?? tabPath;
  }, []);

  return { navigateToTab, getTabPath, getRootForPath };
}