import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export function useSidebar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  // When screen size changes, adjust sidebar state
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  
  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  
  return {
    isOpen,
    isMobile,
    toggle,
    open,
    close
  };
}
