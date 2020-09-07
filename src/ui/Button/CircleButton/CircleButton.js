import React from 'react';
import { Button } from 'reakit';

import { Row, T8y } from 'ui';

import { ReactComponent as Cross } from 'assets/images/icon/cart/cross.svg';
import { ReactComponent as DecreaseIcon } from 'assets/images/icon/cart/minus.svg';
import { ReactComponent as IncreaseIcon } from 'assets/images/icon/cart/plus.svg';

import style from './circleButton.module.scss';

export function CircleButton({ size = 23, onClick, type = 'default', label }) {
  return (
    <Button as={Row} align="center" onClick={onClick} className={style.wrap}>
      <Row
        className={style.btn}
        align="center"
        justify="center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {iconSet[type]}
      </Row>
      {label && (
        <T8y variant="t2" as="span" className={style.label}>
          {label}
        </T8y>
      )}
    </Button>
  );
}

const iconSet = {
  decrease: <DecreaseIcon />,
  increase: <IncreaseIcon />,
  cross: <Cross />,
  default: null,
};
