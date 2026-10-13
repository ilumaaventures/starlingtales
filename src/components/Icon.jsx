import React from 'react';

export default function Icon({ name, className = '' }) {
  const iconProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </>
    ),
    user: (
      <>
        <path d="M19 21a7 7 0 0 0-14 0" />
        <circle cx="12" cy="8" r="4" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    heart: (
      <path d="M20.8 5.9c-1.5-2-4.5-2.3-6.3-.5L12 7.9 9.5 5.4C7.7 3.6 4.7 3.9 3.2 5.9c-1.4 1.9-1 4.7.7 6.3L12 20l8.1-7.8c1.7-1.6 2.1-4.4.7-6.3Z" />
    ),
    leaf: (
      <>
        <path d="M5 21c8-2 13-8 14-18-9 1-15 6-16 14 0 2 1 4 2 4Z" />
        <path d="M4 20c3-5 7-8 13-11" />
      </>
    ),
    gift: (
      <>
        <path d="M20 12v9H4v-9" />
        <path d="M2 7h20v5H2z" />
        <path d="M12 22V7" />
        <path d="M12 7H8.5A2.5 2.5 0 1 1 12 3.5V7Z" />
        <path d="M12 7h3.5A2.5 2.5 0 1 0 12 3.5V7Z" />
      </>
    ),
    star: (
      <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z" />
    ),
    bird: (
      <>
        <path d="M4 16c5.8.4 10.3-2.1 13.5-7.5" />
        <path d="M7 15c.9 2.4 3 4 6 4 3.6 0 6.5-2.9 6.5-6.5 0-1.4-.4-2.6-1.1-3.7" />
        <path d="M14 8c-1.4-2.1-3.4-3.3-6-3.5 1.1 1.8 2.1 3.4 3 4.8" />
        <path d="m18 8 3-1.5-2.4 3.2" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    truck: (
      <>
        <path d="M10 17H5V6h11v11h-2" />
        <path d="M16 9h3l3 4v4h-3" />
        <circle cx="7.5" cy="17.5" r="1.8" />
        <circle cx="17.5" cy="17.5" r="1.8" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.2-4.8L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.2 4.8L20 16" />
        <path d="M20 20v-4h-4" />
      </>
    ),
    box: (
      <>
        <path d="M21 8 12 3 3 8l9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    ),
  };

  return <svg {...iconProps}>{paths[name]}</svg>;
}
