import React, { useContext, useRef } from 'react';
import {
  Button as ButtonR,
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from 'reakit';
import { useDatepicker, useDay, useMonth } from '@datepicker-react/hooks';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import clsx from 'clsx';
import { addDays } from 'date-fns';
import { useStore } from 'effector-react';

import {
  changeDatesRange,
  changeFocusedPickerDay,
  end_date$,
  picker_state$,
  start_date$,
} from 'features/cart';

import { Button, Field, inputStyle, Row } from 'ui';

import { ReactComponent as Close } from 'assets/images/icon/cross.svg';
import { ReactComponent as DateTo } from 'assets/images/icon/end-day.svg';
import { ReactComponent as DateFrom } from 'assets/images/icon/start-day.svg';

import style from './datePicker.module.scss';

// TODO remove to feature
export const DatePickerInput = ({ edge, legend, className, ...rest }) => {
  const start = useStore(start_date$);
  const end = useStore(end_date$);

  const currentDate = edge === 'start' ? start : end;
  const currentPlaceholder = edge === 'start' ? 'Start date' : 'End date';
  return (
    <Field
      icon={edge === 'start' ? DateFrom : DateTo}
      className={className}
      legend={legend}
      {...rest}
    >
      <DatePickerDisclosure
        edge={edge}
        className={inputStyle}
        disabled={rest?.disabled}
      >
        {currentDate || currentPlaceholder}
      </DatePickerDisclosure>
    </Field>
  );
};

export const DatePickerDisclosure = ({
  children,
  className,
  disabled,
  edge = 'start',
  as = 'button',
  ...rest
}) => {
  const dialog = useDialogState();
  const state = useStore(picker_state$);

  const handleDateChange = React.useCallback(
    e => {
      if (e.startDate && e.endDate) {
        dialog.hide();
      }
      changeDatesRange(e);
    },
    [dialog],
  );

  return (
    <>
      <DialogDisclosure
        as={as}
        disabled={disabled}
        {...rest}
        {...dialog}
        className={className}
        onClick={() => {
          dialog.show();
          changeFocusedPickerDay(edge);
        }}
      >
        {children}
      </DialogDisclosure>
      <DialogBackdrop {...dialog} className={style.overlay}>
        <Dialog {...dialog} tabIndex={0} aria-label="Calendar">
          <DatePickerCalendar
            onclose={dialog.hide}
            visible={dialog.visible}
            calendarState={state}
            handleDateChange={handleDateChange}
          />
        </Dialog>
      </DialogBackdrop>
    </>
  );
};

function DatePickerCalendar({
  onclose,
  calendarState,
  handleDateChange,
  visible,
}) {
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onResetDates,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
  } = useDatepicker({
    startDate: calendarState.startDate,
    endDate: calendarState.endDate,
    focusedInput: calendarState.focusedInput,
    onDatesChange: handleDateChange,
    numberOfMonths: 2,
    minBookingDate: addDays(new Date(), 1),
    minBookingDays: 2,
  });
  const ref = React.useRef();

  React.useEffect(() => {
    const scrollBox = ref.current;
    if (visible) {
      disableBodyScroll(scrollBox);
    }
    return () => enableBodyScroll(scrollBox);
  }, [visible]);

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
      }}
    >
      <div className={style.picker} ref={ref}>
        <Row align="center" justify="stretch" className={style.row}>
          <div className={style.title}>Select Hire Period</div>
          <ButtonR as={Close} onClick={onclose} className={style.close} />
        </Row>
        <Row justify="stretch" className={style.row}>
          <Button transparent onClick={goToPreviousMonths}>
            Previous
          </Button>
          <Button
            transparent
            onClick={() => {
              onResetDates();
              changeFocusedPickerDay('start');
            }}
          >
            Reset
          </Button>
          <Button transparent onClick={goToNextMonths}>
            Next
          </Button>
        </Row>

        {activeMonths.map(month => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
      </div>
    </DatepickerContext.Provider>
  );
}

function Month({ year, month, firstDayOfWeek }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });

  return (
    <div className={style.row}>
      <div className={style.monthlabel}>{monthLabel}</div>
      <Row>
        {weekdayLabels.map(dayLabel => (
          <div key={dayLabel} className={style.weekdaylabel}>
            {dayLabel}
          </div>
        ))}
      </Row>
      <Row>
        {days.map((day, i) => (
          <Day
            date={day.date}
            key={`${i}-${day?.dayLabel}`}
            day={day.dayLabel}
          />
        ))}
      </Row>
    </div>
  );
}

function Day({ day, date }) {
  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
  } = useContext(DatepickerContext);
  const {
    isSelected,
    isSelectedStartOrEnd,
    disabledDate,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex,
    isWithinHoverRange,
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef,
  });

  if (!day) {
    return <div className={style.dayBlank}></div>;
  }

  return (
    <ButtonR
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      ref={dayRef}
      className={clsx(style.day, {
        [style.dayselected]: isSelected || isSelectedStartOrEnd,
        [style.range]: isWithinHoverRange,
        [style.disabled]: disabledDate,
      })}
    >
      {day}
    </ButtonR>
  );
}

const DatepickerContext = React.createContext();
