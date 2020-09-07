import React from 'react';
import clsx from 'clsx';

import style from './typography.module.scss';

// *docs
// ** variants
// *** h1 , h2 , h3 , mainText, smallText
// ** color
// *** primary , secondary, light
// ** styles -> custom styles (rest for this)
export const T8y = React.forwardRef(
  (
    {
      children,
      variant = 't2',
      color = 'secondary',
      bold,
      regular,
      className,
      asLink,
      as: Component = 'div',
      ...rest
    },
    ref,
  ) => (
    <Component
      className={clsx(
        [style[`T8y-${variant}`], style[`T8yColor-${color}`], className],
        {
          [style.bold]: bold,
          [style.regular]: regular,
          [style.link]: asLink,
        },
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  ),
);
