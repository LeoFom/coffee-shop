import { ComponentPropsWithoutRef, ReactNode} from 'react';
import Link from "next/link";

interface CustomButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  href?: string;
  className?: string;
}

type ButtonProps = CustomButtonProps &
  ComponentPropsWithoutRef<'button'> &
  ComponentPropsWithoutRef<typeof Link>;

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {

  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300";

  const variants = {
    primary: "bg-brand-brown text-white hover:bg-opacity-90",
    outline: "border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white",
    ghost: "text-brand-brown hover:bg-brand-brown/10"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link
        className={combinedClassName}
        {...(props as ComponentPropsWithoutRef<typeof Link>)}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...(props as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  );
}