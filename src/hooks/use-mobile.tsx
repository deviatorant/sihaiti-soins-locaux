
import React, { useState } from 'react';

// Current exports from the file that we need to preserve
export const useMobile = () => {
  const [isMobile] = useState(window.innerWidth < 768);
  return isMobile;
};

// Adding the missing withToggleState HOC
export const withToggleState = <P extends object>(
  Component: React.ComponentType<P & { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }>
) => {
  return (props: P) => {
    const [isOpen, setIsOpen] = useState(false);
    return <Component {...props} isOpen={isOpen} setIsOpen={setIsOpen} />;
  };
};
