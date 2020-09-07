import React from 'react';
import { Radio as RadioR } from 'reakit/Radio';
import clsx from 'clsx';

import { Row, T8y } from 'ui';

import style from './radio.module.scss';

export const Radio = React.forwardRef(
  ({ size = 1, text, value = '', className, ...rest }, ref) => {
    return (
      <Row
        align="center"
        as="label"
        className={clsx(style.label, className)}
        noWrap
      >
        <RadioR {...rest} value={value} ref={ref} />
        <div
          className={clsx(style.button, {
            [style.buttonActive]: rest.state === value,
          })}
          style={{
            width: `${size + 0.5}rem`,
            height: `${size + 0.5}rem`,
            marginRight: `${size / 2}rem`,
          }}
        />
        {text && <T8y variant={`t${4 - size}`}>{text}</T8y>}
      </Row>
    );
  },
);
