'use client';

import { ArrowLeft } from 'lucide-react';

export type BackButtonProps = {
  onBack: () => void;
  canGoBack?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  className?: string;
};

export default function BackButton({
  onBack,
  canGoBack = true,
  className,
}: BackButtonProps) {
  const baseClassName =
    'absolute bottom-8 right-8 z-40 flex items-center gap-4 outline-none focus:outline-none active:outline-none';

  const stroke = '#1d8bf8';

  return (
    <nav
      className={className ? `${baseClassName} ${className}` : baseClassName}
      aria-label="Back and forward"
    >
      <ArrowLeft
        className={canGoBack ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
        stroke={stroke}
        size={32}
        onClick={canGoBack ? onBack : undefined}
        aria-label="Back"
      />
    
    </nav>
  );
}
