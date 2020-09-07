import React from 'react';
import clsx from 'clsx';

import style from './grid.module.scss';

export const Row = React.forwardRef(
  (
    {
      children,
      align = 'start',
      justify = 'start',
      direction = 'row',
      className,
      noWrap,
      inline,
      as: Component = 'div',
      ...rest
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          [
            style.row,
            style[`row-align-${align}`],
            style[`row-justify-${justify}`],
            style[`row-direction-${direction}`],
            className,
          ],
          {
            [style['row-noWrap']]: noWrap,
            [style['row-inline']]: inline,
          },
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);
