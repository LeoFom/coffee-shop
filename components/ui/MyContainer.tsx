import { ReactNode } from 'react';

export default function MyContainer({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}