import React from 'react';
import clsx from 'clsx';

import { container } from './grid.module.scss';

export function Container({ children, className }) {
  return <div className={clsx([container, className])}>{children}</div>;
}
