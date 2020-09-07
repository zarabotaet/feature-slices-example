import React from 'react';
import { Button as RButton } from 'reakit';
import clsx from 'clsx';

import { Spinner } from 'ui';
import { Row } from 'ui/Grid/Row';

import {
  button,
  buttonContentStretch,
  buttondark,
  buttoninline,
  buttoninverse,
  buttonLoading,
  buttonpostfix,
  buttonprefix,
  buttonsmall,
  buttontransparent,
  postfix,
  postfixIcon,
  prefix,
  prefixIcon,
} from './button.module.scss';

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      loading,
      inverse,
      transparent,
      dark,
      small,
      inline,
      prefixIcon: prefixIconComponent,
      postfixIcon: postfixIconComponent,
      prefix: prefixComponent,
      postfix: postfixComponent,
      as = 'button',
      ...rest
    },
    ref,
  ) => {
    return (
      <RButton
        disabled={loading}
        as={as}
        className={clsx(button, className, {
          [buttonLoading]: loading,
          [buttoninverse]: inverse,
          [buttontransparent]: transparent,
          [buttondark]: dark,
          [buttonsmall]: small,
          [buttoninline]: inline,
          [buttonprefix]: prefixComponent,
          [buttonpostfix]: postfixComponent,
        })}
        ref={ref}
        {...rest}
      >
        {prefixComponent && (
          <Row as="span" align="center" justify="center" className={prefix}>
            {prefixComponent}
          </Row>
        )}
        <Row align="center" justify="center" className={buttonContentStretch}>
          {prefixIconComponent && (
            <div className={prefixIcon}>{prefixIconComponent}</div>
          )}
          {loading ? <Spinner dark={inverse} /> : children}
          {postfixIconComponent && (
            <div className={postfixIcon}>{postfixIconComponent}</div>
          )}
        </Row>

        {postfixComponent && (
          <Row as="span" align="center" justify="center" className={postfix}>
            {postfixComponent}
          </Row>
        )}
      </RButton>
    );
  },
);
