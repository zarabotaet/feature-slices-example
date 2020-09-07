import React from 'react';
import { CustomPicker } from 'react-color';

import { Hue, Saturation } from 'react-color/lib/components/common';

import { ColorCheckBox } from 'ui';

import style from './colorPicker.module.scss';

const HeuPoint = () => <div className={style.huePoint} />;

export const ColorBox = CustomPicker(props => {
  return (
    <div className={style.colorBoxWrap}>
      <div className={style.saturation}>
        <Saturation {...props} />
      </div>
      <div className={style.rightBlock}>
        <ColorCheckBox
          color={props.hex}
          noBorder
          checked
          onClick={props.onSubmitColor}
        />
        <div className={style.hue}>
          <Hue {...props} direction="vertical" pointer={HeuPoint} />
        </div>
      </div>
    </div>
  );
});
