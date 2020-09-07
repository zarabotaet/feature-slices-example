import React from 'react';
import clsx from 'clsx';

import { T8y } from 'ui/Typography/Typography';

import style from './field.module.scss';

export const inputStyle = style.input;

export const Field = React.forwardRef(
  (
    {
      icon: Icon,
      legend,
      children,
      noBoxing,
      className = '',
      fieldClassName = '',
      noBorder,
      textarea,
      disabled,
      req,
      error,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={className} ref={ref} {...rest}>
        {legend && (
          <T8y
            as="span"
            className={clsx(style.legend, {
              [style.req]: req,
            })}
          >
            {legend}
          </T8y>
        )}
        {noBoxing ? (
          children
        ) : (
          <div
            className={clsx(style.field, fieldClassName, {
              [style.noBorder]: noBorder,
              [style.disabled]: disabled,
              [style.error]: error,
              [style.textarea]: textarea,
            })}
          >
            {Icon && <Icon className={style.icon} />}
            {children}
            {error && (
              <T8y variant="t3" color="danger" className={style.errorMsg}>
                {error}
              </T8y>
            )}
          </div>
        )}
      </div>
    );
  },
);
