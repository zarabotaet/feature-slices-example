import React from 'react';
import clsx from 'clsx';

import { dark, spinner } from './spinner.module.scss';

export function Spinner({ dark: Dark, children, size, className }) {
  return (
    <div
      className={clsx(spinner, className, { [dark]: Dark })}
      style={{ fontSize: size }}
    >
      {children}
    </div>
  );
}
