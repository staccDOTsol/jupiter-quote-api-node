import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
