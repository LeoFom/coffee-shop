import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300";

  const variants = {
    primary: "bg-brand-brown text-white hover:bg-opacity-90",
    outline: "border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white",
    ghost: "text-brand-brown hover:bg-brand-brown/10"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}