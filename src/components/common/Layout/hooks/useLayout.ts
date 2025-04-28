import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UseLayoutReturn {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export const useLayout = (): UseLayoutReturn => {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, [setIsCollapsed]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // En móviles, mantener el sidebar colapsado por defecto
  useEffect(() => {
    if (isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [isMobile, isCollapsed, setIsCollapsed]);

  return {
    isCollapsed,
    toggleSidebar,
    isMobile,
  };
};