import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, RadioGroup, useRadioState } from 'reakit';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { addDays, formatISO, isBefore, isEqual, set, subDays } from 'date-fns';
import { useStore } from 'effector-react';

import { picker_state$, postcodePrice$ } from 'features/cart';

import { useMatchMedia } from 'libs/useMatchMedia';
import { CHECKOUT } from 'api';

import { WeekDaysGrid } from './WeekDaysGrid';

import { Row, Spinner, T8y } from 'ui';

import style from '../product/product.module.scss';
import {
  radioButton,
  radioButtonActive,
  radioLabel,
} from './delivery.module.scss';

export const Delivery = ({ match }) => {
  const multiHourSlotType = useRadioState({ state: true });
  const { endDate, startDate } = useStore(picker_state$);
  const [deliveryPrices, setDeliveryPrices] = React.useState(null);
  const [loading, setloading] = React.useState(false);
  const isDelivery = match.params.type === 'delivery';

  const baseDate = isDelivery ? startDate : endDate;

  const [currentBaseDate, setcurrentBaseDate] = React.useState(baseDate);

  const availableStartDate = isDelivery
    ? convertDateToNulltime(new Date())
    : convertDateToNulltime(startDate);

  const [canNavToPrevPeriod, setcanNavToPrevPeriod] = React.useState(true);

  const isTablet = useMatchMedia('(max-width: 1024px)');
  const isMobile = useMatchMedia('(max-width: 768px)');
  const isSmMobile = useMatchMedia('(max-width: 400px)');

  const rangeLength = {
    [true]: 7,
    [isTablet]: 5,
    [isMobile]: 3,
    [isSmMobile]: 1,
  }[true];

  const halfrange = (rangeLength - 1) / 2;

  React.useEffect(() => {
    handleDate(baseDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.type]);

  React.useEffect(() => {
    if (
      isEqual(
        convertDateToNulltime(subDays(currentBaseDate, halfrange + 1)),
        availableStartDate,
      )
    ) {
      setcanNavToPrevPeriod(false);
    } else {
      setcanNavToPrevPeriod(true);
    }
  }, [rangeLength, currentBaseDate, halfrange, availableStartDate]);

  const handleDate = React.useCallback(
    async date => {
      const isTryGoToBeforeStartDateAvailable = isBefore(
        subDays(date, halfrange + 1),
        availableStartDate,
      );

      const availabledate = {
        [true]: date,
        [isTryGoToBeforeStartDateAvailable]: addDays(
          availableStartDate,
          halfrange + 1,
        ),
      }[true];

      const dateStr = formatISO(availabledate, { representation: 'date' });

      try {
        setloading(true);
        const {
          data: { data },
        } = await CHECKOUT.getDeliverySlots(dateStr);

        setDeliveryPrices({
          multiHourPrices: data?.delivery_multihours_prices,
          oneHourPrices: data?.delivery_hours_prices,
        });
        setloading(false);

        setcurrentBaseDate(availabledate);
      } catch (e) {
        setloading(false);
        console.warn(e);
      }
    },
    [availableStartDate, halfrange],
  );

  return (
    <>
      <div className="container pt-5">
        <Breadcrumbs />
        <T8y variant="h1" as="h1" color="primary">
          Please select {match.params.type} time
        </T8y>
        <TabList multiHourSlotType={multiHourSlotType} match={match} />
      </div>
      {deliveryPrices ? (
        <WeekDaysGrid
          deliveryPrices={deliveryPrices}
          multiHour={multiHourSlotType.state}
          selectedDate={currentBaseDate}
          baseDate={baseDate}
          rangeSelectedDates={{ endDate, startDate }}
          handleDate={handleDate}
          rangeLength={rangeLength}
          canNavToPrevPeriod={canNavToPrevPeriod}
          loading={loading}
        />
      ) : (
        <Spinner dark size={5} className="my-5" />
      )}
    </>
  );
};

const Breadcrumbs = () => (
  <Row align="center">
    <T8y as={Link} to={PATHS.CART} variant="t2">
      Your quote
    </T8y>
    <T8y variant="t1" className={style.arrow}>
      →
    </T8y>
  </Row>
);

const TabList = ({ multiHourSlotType, match }) => {
  const postcodePrice = useStore(postcodePrice$);

  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center pb-3">
      <TabPanel
        multiHourSlotType={multiHourSlotType}
        type={match.params.type}
      />
      {postcodePrice && (
        <div className="ml-md-auto">
          Final price will be calculated with Base Price for your index (
          <T8y as="span" color="primary" bold>
            {postcodePrice}
          </T8y>
          ) + Slot Fee
        </div>
      )}
    </div>
  );
};

const TabPanel = ({ multiHourSlotType, type }) => {
  return (
    <RadioGroup
      as="div"
      className="d-block d-sm-flex py-4"
      {...multiHourSlotType}
      aria-label="type"
    >
      <Row align="center" as="label" className={radioLabel} noWrap>
        <Radio {...multiHourSlotType} value={true} />
        <RadioButton active={multiHourSlotType.state} />
        <T8y
          variant="t2"
          color={multiHourSlotType.state ? 'primary' : 'secondary'}
          className="ml-2"
          bold
        >
          multi-hour {type} slot
        </T8y>
      </Row>
      <Row
        align="center"
        as="label"
        className={clsx(radioLabel, 'ml-sm-3 ml-0')}
        noWrap
      >
        <Radio {...multiHourSlotType} value={false} />
        <RadioButton active={!multiHourSlotType.state} />
        <T8y
          variant="t2"
          color={!multiHourSlotType.state ? 'primary' : 'secondary'}
          className="ml-2"
          bold
        >
          1-hour {type} slot
        </T8y>
      </Row>
    </RadioGroup>
  );
};

const RadioButton = ({ active }) => (
  <div className={clsx(radioButton, { [radioButtonActive]: active })} />
);

function convertDateToNulltime(date) {
  return set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
}
