import React from 'react';
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  DisclosureContent,
  useDialogState,
} from 'reakit';
import clsx from 'clsx';

import { Row, T8y } from 'ui';

import { ReactComponent as Cross } from 'assets/images/icon/cross.svg';

import style from './modal.module.scss';

export const Modal = ({
  children,
  title,
  disclosure = title,
  width: maxWidth,
  dialogState,
  lazyRender,
}) => {
  const dialog = useDialogState();

  const dialogCurrentState = dialogState || dialog;

  const ref = React.useRef();

  React.useEffect(() => {
    if (dialogCurrentState.visible) {
      ref.current.focus();
    }
  }, [dialogCurrentState.visible]);

  const header = React.useMemo(
    () =>
      title ? (
        <Row align="center" justify="stretch" className={style.header}>
          <T8y color="light" variant="t1" bold>
            {title}
          </T8y>
          <Button
            onClick={dialogCurrentState.hide}
            className={style.close}
            width={18}
            height={18}
            ref={ref}
          >
            <Cross />
          </Button>
        </Row>
      ) : (
        <Button
          onClick={dialogCurrentState.hide}
          className={clsx(style.close, style.closeabsolute)}
          width={18}
          height={18}
          ref={ref}
        >
          <Cross fill="#2e2e2e" />
        </Button>
      ),
    [dialogCurrentState.hide, title],
  );

  return (
    <>
      <DialogDisclosure {...dialogCurrentState} as="div">
        {disclosure}
      </DialogDisclosure>
      {lazyRender ? (
        <DisclosureContent>
          {props =>
            dialogCurrentState.visible && (
              <DialogBackdrop
                {...dialogCurrentState}
                className={style.backdrop}
              >
                <Dialog
                  {...dialogCurrentState}
                  aria-label={title}
                  className={style.container}
                  style={{ maxWidth }}
                >
                  {header}
                  {children}
                </Dialog>
              </DialogBackdrop>
            )
          }
        </DisclosureContent>
      ) : (
        <DialogBackdrop {...dialogCurrentState} className={style.backdrop}>
          <Dialog
            {...dialogCurrentState}
            aria-label={title}
            className={style.container}
            style={{ maxWidth }}
          >
            {header}
            {children}
          </Dialog>
        </DialogBackdrop>
      )}
    </>
  );
};
