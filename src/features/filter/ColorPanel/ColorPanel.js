import React from 'react';
import { Group } from 'reakit';
import { useList } from 'effector-react';

import { addColor, checkColorItem, colors$ } from '../filterModel';

import { ColorCheckBox, ColorPicker } from 'ui';

import style from './colorPanel.module.scss';

export function ColorPanel() {
  return (
    <div className={style.colorPanel}>
      <Group className={style.colorPicker}>
        {useList(colors$, ({ checked, color }) => (
          <ColorCheckBox
            key={color}
            color={color}
            checked={checked}
            onClick={() => checkColorItem(color)}
          />
        ))}
      </Group>
      <ColorPicker addItem={addColor} />
    </div>
  );
}
