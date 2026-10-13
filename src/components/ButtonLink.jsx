import React from 'react';
import Icon from './Icon';

export default function ButtonLink({ children, href = '#collection' }) {
  return (
    <a className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-text-dark px-[22px] py-3.5 text-xs font-medium tracking-[0.17em] uppercase transition-colors duration-200 hover:bg-text-dark hover:text-cream focus-visible:bg-text-dark focus-visible:text-cream group" href={href} aria-label={children}>
      <span>{children}</span>
      <Icon name="heart" className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
    </a>
  );
}
