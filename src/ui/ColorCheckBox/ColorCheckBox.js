import React from 'react';
import { Button } from 'reakit';
import clsx from 'clsx';

import { parseColor } from './util';

import { ReactComponent as Checked } from 'assets/images/icon/checkMark.svg';

import style from './colorCheckBox.module.scss';

export function ColorCheckBox({ color, checked, onClick, noBorder }) {
  return (
    <Button
      className={clsx({ [style.checkBoxWrap]: !noBorder })}
      onClick={onClick}
    >
      <div
        className={style.checkBox}
        style={{
          backgroundColor: color,
        }}
      >
        {checked && <Checked width={13} height={13} fill={parseColor(color)} />}
      </div>
    </Button>
  );
}
