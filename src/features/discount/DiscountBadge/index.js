import React from 'react';
import {
  addDays,
  differenceInCalendarDays,
  endOfToday,
  formatDistanceStrict,
} from 'date-fns';
import { useStore } from 'effector-react';

import { allDiscounts$, picker_state$, selectedDiscount$ } from 'features/cart';

import { Modal, Row, T8y } from 'ui';

import { ReactComponent as Discount } from 'assets/images/icon/discount.svg';
import { ReactComponent as DiscountHeader } from 'assets/images/icon/discountHeader.svg';

import style from './discountBadge.module.scss';

export function DiscountBadge() {
  const allDiscounts = useStore(allDiscounts$);

  return (
    <Modal
      width={380}
      title={
        <Row align="center">
          <DiscountHeader className="mr-2" />
          About discount
        </Row>
      }
      disclosure={<Badge />}
    >
      {allDiscounts.map((item, i) => (
        <p key={i} className={style.p}>
          <T8y as="span" color="primary">
            - {item.value}%
          </T8y>{' '}
          {item.name}
        </p>
      ))}
      <T8y color="primary">*Discount not available on “Pay later” orders</T8y>
    </Modal>
  );
}

export function Badge() {
  const { startDate } = useStore(picker_state$);
  const selectedDiscount = useStore(selectedDiscount$);

  const isDiscountSelected = selectedDiscount?.days;

  const discountRestTime = differenceInCalendarDays(
    startDate,
    addDays(new Date(), selectedDiscount.days),
  );

  const restStr =
    discountRestTime > 1
      ? formatDistanceStrict(
          startDate,
          addDays(new Date(), selectedDiscount.days - 1),
          {
            unit: 'day',
          },
        )
      : formatDistanceStrict(endOfToday(), new Date(), {
          unit: 'hour',
        });

  return (
    <div className={style.discounts}>
      <Discount />
      {isDiscountSelected ? (
        <T8y variant="t1" bold color="primary">
          Book now to get {selectedDiscount?.value}% off{' '}
          <T8y variant="t2" as="span" color="primary">
            Only for the next {restStr}!{' '}
            <T8y variant="t3" as="span" asLink color="primary">
              Learn more
            </T8y>
          </T8y>
        </T8y>
      ) : (
        <T8y color="primary" variant="t1">
          View our advance booking discounts
        </T8y>
      )}
    </div>
  );
}
