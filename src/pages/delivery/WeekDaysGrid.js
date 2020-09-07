import React from 'react';
import { Button } from 'reakit';
import clsx from 'clsx';
import {
  addDays,
  eachDayOfInterval,
  format,
  formatISO,
  isSameMonth,
  isSameYear,
  subDays,
} from 'date-fns';

import { DeliverySlots } from './DeliverySlots';

import { Row, T8y } from 'ui';

import style from './delivery.module.scss';

export const WeekDaysGrid = React.memo(function({
  multiHour,
  deliveryPrices,
  handleDate,
  baseDate,
  selectedDate,
  loading,
  setloading,
  rangeLength,
  rangeSelectedDates,
  canNavToPrevPeriod,
}) {
  const halfRangeLength = (rangeLength - 1) / 2;

  const prices = multiHour
    ? deliveryPrices.multiHourPrices
    : deliveryPrices.oneHourPrices;

  const isThereFreeSlot =
    rangeLength === 1
      ? prices?.[formatISO(selectedDate, { representation: 'date' })]?.some(
          ({ price }) => price === 0,
        )
      : Object.values(prices).some(slots =>
          slots.some(({ price }) => price === 0),
        );

  const range = React.useMemo(
    () => ({
      start: subDays(selectedDate, halfRangeLength),
      end: addDays(selectedDate, halfRangeLength),
    }),
    [halfRangeLength, selectedDate],
  );

  const days = React.useMemo(() => eachDayOfInterval(range), [range]);

  const goNextRange = React.useCallback(
    () => handleDate(addDays(selectedDate, rangeLength)),
    [rangeLength, selectedDate, handleDate],
  );
  const goPrevRange = React.useCallback(
    () => handleDate(subDays(selectedDate, rangeLength)),
    [rangeLength, selectedDate, handleDate],
  );

  return (
    <div
      className={clsx(style.pickerContainer, 'container-lg container-fluid')}
    >
      <PickerHeader {...range} loading={loading} />
      <div className={style.pickerGrid}>
        <NavPrev
          onClick={goPrevRange}
          isThereFreeSlot={isThereFreeSlot}
          disabled={!canNavToPrevPeriod}
        />
        <DeliverySlots
          multiHour={multiHour}
          prices={prices}
          days={days}
          baseDate={baseDate}
          isThereFreeSlot={isThereFreeSlot}
          rangeSelectedDates={rangeSelectedDates}
        />
        <NavNext onClick={goNextRange} />
      </div>
    </div>
  );
});

function PickerHeader({ start, end, loading }) {
  const yearString = React.useMemo(() => getYearString(start, end), [
    start,
    end,
  ]);
  const monthString = React.useMemo(() => getMonthString(start, end), [
    start,
    end,
  ]);

  return (
    <Row
      justify="center"
      align="center"
      as={T8y}
      bold
      variant="t1"
      className={clsx(style.pickerHeader, {
        [style.pickerHeaderLoading]: loading,
      })}
    >
      {monthString} {yearString}
    </Row>
  );
}

function NavPrev({ onClick, isThereFreeSlot, disabled }) {
  return (
    <Button
      as="div"
      className={style.pickerNav}
      onClick={disabled ? () => {} : onClick}
    >
      <Row
        justify="center"
        align="center"
        className={clsx(style.pickerNavArrPrev, {
          [style.pickerNavArrPrevDisabled]: disabled,
        })}
      />
      <Timeline isThereFreeSlot={isThereFreeSlot} />
    </Button>
  );
}
function NavNext({ onClick }) {
  return (
    <Button as="div" className={style.pickerNav} onClick={onClick}>
      <Row justify="center" align="center" className={style.pickerNavArrNext} />
    </Button>
  );
}

function Timeline({ isThereFreeSlot }) {
  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${i}:00`),
    [],
  );
  return (
    <div
      className={clsx(style.pickerTimeline, {
        [style.gridVsFreeSlot]: isThereFreeSlot,
      })}
    >
      {isThereFreeSlot && <div />}
      {hours.map(hour => (
        <T8y variant="t3" key={hour} className={style.pickerTimelineSlot}>
          {hour}
        </T8y>
      ))}
    </div>
  );
}

function getYearString(start, end) {
  if (isSameYear(start, end)) {
    return format(start, 'yyyy');
  }

  return `${format(start, 'yyyy')}-${format(end, 'yyyy')}`;
}

function getMonthString(start, end) {
  if (isSameMonth(start, end)) {
    return format(start, 'MMMM')?.toUpperCase();
  }

  return `${format(start, 'MMM')}-${format(end, 'MMM')}`?.toUpperCase();
}
