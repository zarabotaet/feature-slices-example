import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button as ButtonR, Group, Rover, useRoverState } from 'reakit';
import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  usePopoverState,
} from 'reakit/Popover';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { addDays, format, formatISO, isBefore, isEqual } from 'date-fns';

import { changeEndDay, changeStartDay } from 'features/cart';

import { history } from 'libs/history';

import { setCollection, setDelivery } from './model';

import { Button, Row, T8y } from 'ui';

import style from './delivery.module.scss';

export const DeliverySlots = ({
  prices,
  days,
  baseDate,
  multiHour,
  isThereFreeSlot,
  rangeSelectedDates,
}) => {
  const rover = useRoverState({ loop: true });

  return (
    <Group
      className={style.daysGrid}
      style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
    >
      {days?.map(day => {
        const isSelectedDay = isEqual(baseDate, day);
        const slots = prices[formatISO(day, { representation: 'date' })];

        return (
          <Rover
            as={Day}
            key={day}
            slots={slots}
            day={day}
            isSelectedDay={isSelectedDay}
            multiHour={multiHour}
            isThereFreeSlot={isThereFreeSlot}
            rangeSelectedDates={rangeSelectedDates}
            {...rover}
          />
        );
      })}
    </Group>
  );
};

const Day = React.forwardRef(function(
  {
    slots = [],
    day,
    isSelectedDay,
    multiHour,
    isThereFreeSlot,
    rangeSelectedDates,
    ...rest
  },
  ref,
) {
  const dayString = React.useMemo(() => format(day, 'EEEE')?.toUpperCase(), [
    day,
  ]);
  const fullDayString = React.useMemo(
    () => `${format(day, 'd')}, ${format(day, 'EEE')?.toUpperCase()}`,
    [day],
  );

  const freeSlot = multiHour && slots.find(({ price }) => price === 0);
  const filteredSlots = multiHour
    ? slots.filter(({ price }) => price !== 0)
    : slots;

  return (
    <ButtonR as="div" className={style.day} ref={ref} {...rest}>
      <T8y
        as={Row}
        align="center"
        justify="center"
        bold
        className={clsx(style.dayHeader, {
          [style.daySelectedHeader]: isSelectedDay,
        })}
      >
        {fullDayString}
      </T8y>
      <div
        className={clsx(style.dayGrid, {
          [style.gridVsFreeSlot]: isThereFreeSlot,
        })}
      >
        <div
          className={clsx(style.zebra, {
            [style.gridVsFreeSlot]: isThereFreeSlot,
          })}
        >
          {isThereFreeSlot && <div />}
          {Array.from({ length: 24 }, (_, i) => (
            <div className={style.zebraItem} key={i} />
          ))}
        </div>
        {freeSlot && (
          <ExtraFreeSlot
            slot={freeSlot}
            dayString={dayString}
            day={day}
            rangeSelectedDates={rangeSelectedDates}
          />
        )}
        {filteredSlots.map(slot => (
          <Slot
            key={slot.id}
            slot={slot}
            dayString={dayString}
            day={day}
            multiHour={multiHour}
            isThereFreeSlot={isThereFreeSlot}
            rangeSelectedDates={rangeSelectedDates}
          />
        ))}
      </div>
    </ButtonR>
  );
});

function ExtraFreeSlot({ slot, dayString, day, rangeSelectedDates }) {
  const start = Number(parsehours(slot?.start_date));
  const end = Number(parsehours(slot?.end_date)) || 24;
  const { type } = useParams();
  const { search } = useLocation();

  const onSelect = () => {
    if (type === 'delivery') {
      setDelivery(slot);
      if (!isBefore(day, rangeSelectedDates.endDate)) {
        changeEndDay(addDays(day, 1));
      }
      changeStartDay(day);
      history.push(PATHS.DELIVERY_TIME_SELECT('collection') + search);
    }

    if (type === 'collection') {
      setCollection(slot);
      changeEndDay(day);
      history.push(PATHS.CHECKOUT + search);
    }
  };

  return (
    <Row
      align="center"
      direction="column"
      noWrap
      className={clsx(style.popover, style.freeslot)}
    >
      <T8y color="light" variant="t3" bold className="pt-1">
        FREE SLOT
      </T8y>
      <T8y color="light" variant="t3">
        Between {`${start}:00`} and {`${end}:00`}
      </T8y>
      <T8y color="light" variant="t2" className="py-2" bold>
        +£{slot?.price}
      </T8y>
      <Button className="mt-auto" inverse small onClick={onSelect}>
        Select
      </Button>
    </Row>
  );
}

function Slot({
  slot,
  dayString,
  multiHour,
  isThereFreeSlot,
  day,
  rangeSelectedDates,
}) {
  const { type } = useParams();
  const popover = usePopoverState({
    placement: 'auto',
  });
  const { search } = useLocation();

  const start = Number(parsehours(slot?.start_date));
  const end = Number(parsehours(slot?.end_date)) || 24;

  const { fontSize, slotStyle } = React.useMemo(() => {
    if (!multiHour) {
      return { fontSize: 't3', slotStyle: {} };
    }

    const startH = start + 1 + Number(isThereFreeSlot);
    const endH = end + 1 + Number(isThereFreeSlot);
    const fontSize =
      endH - startH > 1 ? (endH - startH > 3 ? 't1' : 't2') : 't3';
    const slotStyle = multiHour ? { gridRow: `${startH}/${endH}` } : {};

    return { fontSize, slotStyle };
  }, [end, isThereFreeSlot, multiHour, start]);

  const onSelect = () => {
    if (type === 'delivery') {
      setDelivery(slot);
      if (!isBefore(day, rangeSelectedDates.endDate)) {
        changeEndDay(addDays(day, 1));
      }
      changeStartDay(day);
      popover.hide();
      history.push(PATHS.DELIVERY_TIME_SELECT('collection') + search);
    }

    if (type === 'collection') {
      setCollection(slot);
      changeEndDay(day);
      popover.hide();
      history.push(PATHS.CHECKOUT + search);
    }
  };

  return (
    <>
      <PopoverDisclosure
        as={Row}
        justify="center"
        align="center"
        className={clsx(style.slot, { [style.slotMulti]: multiHour })}
        style={slotStyle}
        {...popover}
      >
        <T8y as="span" variant={fontSize} color="primary">
          +£{slot?.price}
        </T8y>
      </PopoverDisclosure>
      <Popover {...popover} aria-label="popover">
        {props =>
          popover.visible && (
            <div className={style.popoverWrapper}>
              <Row
                align="center"
                direction="column"
                {...props}
                className={style.popover}
              >
                <PopoverArrow {...popover} />
                <T8y color="light" variant="t3" bold className="pt-3">
                  {dayString}
                </T8y>
                <T8y color="light" variant="t3">
                  Between {`${start}:00`} and {`${end}:00`}
                </T8y>
                <T8y color="light" variant="t2" className="py-2" bold>
                  +£{slot?.price}
                </T8y>
                <Button className="mt-2" inverse small onClick={onSelect}>
                  Select
                </Button>
              </Row>
            </div>
          )
        }
      </Popover>
    </>
  );
}
// don`t use Date-fns cose we must parse only string, and dont parse in Date object. Bug about clock change
function parsehours(str) {
  return str.split('T')[1].substring(0, 2);
}
