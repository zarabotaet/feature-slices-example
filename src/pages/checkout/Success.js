import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';

import { Button, Container, Row, T8y } from 'ui';

import { ReactComponent as IconSuccess } from 'assets/images/icon/order-success.svg';

import style from './success.module.scss';

export function Success() {
  return (
    <Container>
      <div className={style.wrap}>
        <T8y as="h3" variant="h2" className={style.header}>
          Your order has been placed successfully
        </T8y>
        <Row align="center" noWrap className={style.text}>
          <IconSuccess />
          <T8y as="p" variant="t1">
            You should receive an email confirmation detailing your order
            shortly.
          </T8y>
        </Row>
        <Row justify="center">
          <Button as={Link} to={PATHS.ROOT} className={style.button} inline>
            Go to mainpage
          </Button>
        </Row>
      </div>
    </Container>
  );
}
export function SuccessPayLater() {
  return (
    <Container>
      <div className={style.wrap}>
        <T8y as="h3" variant="h2" className={style.header}>
          Your enquiry has been placed successfully
        </T8y>
        <Row align="center" noWrap className={style.text}>
          <IconSuccess />
          <T8y as="p" variant="t1">
            You will shortly receive an email with your hire quote. You can use
            that quote to place the order when you`re ready.
          </T8y>
        </Row>
        <Row justify="center">
          <Button as={Link} to={PATHS.ROOT} className={style.button} inline>
            Go to mainpage
          </Button>
        </Row>
      </div>
    </Container>
  );
}
