import React from 'react';

export function GetStartedButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 bg-text-dark text-cream hover:bg-blue-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-soft ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export default GetStartedButton;
