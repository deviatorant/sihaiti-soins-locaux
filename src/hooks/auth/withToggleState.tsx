
import React, { useState } from 'react';

// Higher-order component for creating components with toggle state
export const withToggleState = <P extends object>(
  Component: React.ComponentType<P & { isOpen: boolean; toggle: () => void }>
) => {
  const WithToggleState: React.FC<P & { defaultOpen?: boolean }> = ({ 
    defaultOpen = false, 
    ...props 
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggle = () => setIsOpen(!isOpen);
    
    return <Component {...props as P} isOpen={isOpen} toggle={toggle} />;
  };
  
  return WithToggleState;
};

export default withToggleState;
