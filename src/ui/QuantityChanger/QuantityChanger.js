import React from 'react';
import clsx from 'clsx';

import { CircleButton, Row } from 'ui';

import style from './quantityChanger.module.scss';

export function QuantityChanger({
  startCount = 0,
  changeCount,
  small,
  maxDigits = 5,
}) {
  return (
    <Row
      align="center"
      noWrap
      className={clsx(style.wrap, { [style.small]: small })}
    >
      <CircleButton
        type="decrease"
        size={small && 11}
        onClick={() =>
          changeCount(Number(startCount) === 1 ? 1 : Number(startCount) - 1)
        }
      />
      <input
        type="number"
        min="1"
        value={startCount}
        onChange={e => {
          if (
            (e.target.value.match(/^[1-9]\d*$/g) &&
              e.target.value.length <= maxDigits) ||
            e.target.value === ''
          ) {
            changeCount(e.target.value);
          }
        }}
        onBlur={e => {
          if (e.target.value !== '') return;
          changeCount(1);
        }}
      />
      <CircleButton
        type="increase"
        size={small && 11}
        onClick={() => changeCount(Number(startCount) + 1)}
      />
    </Row>
  );
}
