import React from 'react';
import Icon from './Icon';

export default function HeartDivider({ centered = true }) {
  return (
    <div className={`flex w-full max-w-[190px] items-center gap-3 text-blue-soft ${centered ? 'mx-auto' : ''}`} aria-hidden="true">
      <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
      <Icon name="heart" className="h-5 w-5" />
      <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
    </div>
  );
}
