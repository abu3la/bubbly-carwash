import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quiet';
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  const classes = ['bb-button', variant === 'quiet' ? 'bb-button--quiet' : '', className]
    .filter(Boolean)
    .join(' ');
  return <button className={classes} {...rest} />;
}
