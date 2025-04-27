import { useEffect, RefObject } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  excludeRefs: RefObject<HTMLElement>[] = []
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Check if the click is outside the main ref
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      // Check if the click is inside any of the excluded refs
      for (const excludeRef of excludeRefs) {
        if (excludeRef.current && excludeRef.current.contains(target)) {
          return;
        }
      }
      
      handler();
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}