import React from 'react';

export default function Botanical({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M32 150C70 117 98 77 118 28" />
      <path d="M61 120C45 117 35 106 29 88c18 2 30 12 36 28" />
      <path d="M82 93C68 86 62 73 62 55c18 7 26 20 24 38" />
      <path d="M101 62c-9-12-9-26 0-43 13 13 16 27 5 43" />
      <path d="M102 82c17 0 31-7 43-22-18-4-32 1-43 22" />
      <path d="M78 116c19 5 36 1 51-12-18-8-35-4-51 12" />
    </svg>
  );
}
