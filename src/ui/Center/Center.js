import React from 'react';
import clsx from 'clsx';

import { Row } from 'ui/Grid/Row';

import { center } from './center.module.scss';

export const Center = ({ children, className, ...rest }) => {
  return (
    <Row
      align="center"
      justify="center"
      className={clsx(center, className)}
      {...rest}
    >
      {children}
    </Row>
  );
};
