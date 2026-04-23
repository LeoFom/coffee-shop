import React, { ReactNode, ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';

// 1. Спільні стилі та пропси
interface BaseProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}

// 2. Тип саме для посилання (href - обов'язковий)
type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & {
  href: string; // Робимо href явним і обов'язковим
};

// 3. Тип саме для кнопки (href - заборонений)
type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<'button'> & {
  href?: never; // Це гарантує, що ми не передамо href випадково
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button(props: ButtonProps) {
  // Виносимо загальні властивості
  const {
    children,
    variant = 'primary',
    className = '',
    ...rest
  } = props;

  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300";

  const variants = {
    primary: "bg-brand-brown text-white hover:bg-opacity-90",
    outline: "border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white",
    ghost: "text-brand-brown hover:bg-brand-brown/10"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  // ТУТ ВІДБУВАЄТЬСЯ МАГІЯ TS (Type Narrowing)
  // Ми перевіряємо наявність href у rest
  if ('href' in rest) {
    // Тепер TS точно знає, що rest — це пропси для Link
    return (
      <Link
        className={combinedClassName}
        {...(rest as ComponentPropsWithoutRef<typeof Link>)}
      >
        {children}
      </Link>
    );
  }

  // Тут TS знає, що це звичайна кнопка
  return (
    <button
      className={combinedClassName}
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    >
      {children}
    </button>
  );
}