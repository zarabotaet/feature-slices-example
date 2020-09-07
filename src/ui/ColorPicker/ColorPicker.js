import React, { Suspense, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  Portal,
  useDialogState,
} from 'reakit';

import { Spinner } from 'ui';

import { ReactComponent as IconColorPicker } from 'assets/images/icon/colorPicker.svg';

import style from './colorPicker.module.scss';

const ColorBox = React.lazy(() =>
  import('./ColorBox').then(i => ({
    default: i.ColorBox,
  })),
);

export function ColorPicker({ addItem }) {
  const [color, setcolor] = useState('#000');
  const dialog = useDialogState();
  const onChange = color => {
    setcolor(color.hex);
  };
  const onSubmitColor = () => {
    addItem(color);
    dialog.hide();
  };
  return (
    <Suspense
      fallback={
        <div className={style.colorPicker}>
          <Spinner dark />
        </div>
      }
    >
      <DialogDisclosure {...dialog} className={style.colorPicker}>
        <IconColorPicker />
      </DialogDisclosure>
      <Portal>
        <DialogBackdrop {...dialog} className={style.colorOverlay} />
      </Portal>
      <Dialog {...dialog} className={style.colorBox} aria-label="color-picker">
        <ColorBox
          onChange={onChange}
          color={color}
          onSubmitColor={onSubmitColor}
        />
      </Dialog>
    </Suspense>
  );
}
