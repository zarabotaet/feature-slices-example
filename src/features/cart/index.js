import { END_DATE, START_DATE } from '@datepicker-react/hooks';
import { differenceInCalendarDays, isPast } from 'date-fns';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  guard,
  restore,
} from 'effector';
import withStorage from 'effector-storage';

import { CART, DISCOUNTS } from 'api';

const createStorageStore = withStorage(createStore);

export const addItemToCart = createEvent();
export const deleteItemFromCart = createEvent();
export const editItemInCart = createEvent();
export const editExtra = createEvent();
export const resetCart = createEvent();
export const resetCartDetails = createEvent();

export const changeSize = createEvent();

export const changePostCode = createEvent();
export const setPostcodeError = createEvent();
export const changePostCodeInput = changePostCode.prepend(e => e.target.value);

export const changeDatesRange = createEvent();
export const changeStartDay = createEvent();
export const changeEndDay = createEvent();
export const changeFocusedPickerDay = createEvent();

export const changeDeliveryMethod = createEvent();
export const changeDeliveryWarehouse = createEvent();

const getPostcodePriceFx = createEffect({
  handler: CART.getPostcodePrice,
});

export const getAllDisscountsFx = createEffect({
  handler: DISCOUNTS.getDiscounts,
});

export const allDiscounts$ = createStore([]).on(
  getAllDisscountsFx.doneData,
  (s, { data: { data } }) => data,
);

export const cart$ = createStorageStore([], { key: 'cart' })
  .on(addItemToCart, (s, p) => extendArray(s, p))
  .on(editItemInCart, (s, p) => {
    return s.map(item => (item.id === p.id ? { ...item, ...p } : item));
  })
  .on(editExtra, (s, { id, extra, type }) => {
    return s.map(item => (item.id === id ? { ...item, [type]: extra } : item));
  })
  .on(deleteItemFromCart, (s, p) => s.filter(({ id }) => id !== p))
  .on(resetCart, (s, p) => []);

export const cartLenght$ = cart$.map(e => e?.length);

export const deliveryMethod$ = createStorageStore(
  {
    method: 'delivery',
    warehouse: null,
  },
  { key: 'deliveryMethod' },
)
  .on(changeDeliveryMethod, (s, method) => ({
    ...s,
    method,
  }))
  .on(changeDeliveryWarehouse, (s, warehouse) => ({
    ...s,
    warehouse,
  }));

export const cartDetails$ = createStorageStore(
  {
    start: null,
    end: null,
    size: '',
    postcode: '',
  },
  { key: 'cartDetails' },
)
  .on(changeStartDay, (s, p) => ({
    ...s,
    start: p?.getTime(),
  }))
  .on(changeEndDay, (s, p) => ({
    ...s,
    end: p?.getTime(),
  }))
  .on(changeDatesRange, (s, { startDate, endDate }) => ({
    ...s,
    start: startDate?.getTime(),
    end: endDate?.getTime(),
  }))
  .on(changePostCode, (s, postcode) => {
    return {
      ...s,
      postcode,
    };
  })
  .on(changeSize, (s, size) => ({
    ...s,
    size,
  }))
  .reset(resetCartDetails);

export const postcode$ = restore(
  changePostCode,
  JSON.parse(localStorage.getItem('cartDetails'))?.postcode,
);

export const postcodePrice$ = createStore(null)
  .on(getPostcodePriceFx.doneData, (s, p) => '~ £' + p?.data?.data?.price)
  .on(postcode$.updates, (s, p) => {
    if (p.length < 5) {
      return null;
    }
  })
  .reset(getPostcodePriceFx.failData);

export const postcodeError$ = createStore(null)
  .on(getPostcodePriceFx.failData, (s, p) => {
    const errMsg = p?.response?.data?.errors?.postcode[0];
    if (
      errMsg ===
      'Unfortunately we will only deliver to addresses in England and Wales'
    ) {
      return 'This postcode falls outside our service area';
    }
  })
  .on(setPostcodeError, (s, p) => p)
  .on(postcode$.updates, (s, p) => {
    if (!p.length) {
      return null;
    }
    if (p.length < 5) {
      return 'Invalid postcode';
    }
  })
  .reset(getPostcodePriceFx.doneData);

export const size$ = restore(
  changeSize,
  JSON.parse(localStorage.getItem('cartDetails'))?.size || '1 - 50',
);

const focusedInput$ = createStore(START_DATE)
  .on(changeDatesRange, (s, { focusedInput, startDate, endDate }) => {
    if (startDate) return END_DATE;
    if (endDate) return START_DATE;
  })
  .on(changeFocusedPickerDay, (s, p) => {
    if (p === 'start') return START_DATE;
    if (p === 'end') return END_DATE;
  });

export const picker_state$ = combine(
  cartDetails$,
  focusedInput$,
  ({ start, end }, focusedInput) => ({
    startDate: getDate(start),
    endDate: getDate(end),
    focusedInput,
  }),
);

export const start_date$ = picker_state$.map(({ startDate }) =>
  formatDate(startDate),
);
export const end_date$ = picker_state$.map(({ endDate }) =>
  formatDate(endDate),
);

export const weeksOrder$ = picker_state$.map(({ startDate, endDate }) => {
  if (!startDate || !endDate) return null;
  return Math.ceil(((endDate - startDate) / (1000 * 3600 * 24) + 1) / 7);
});

export const selectedDiscount$ = combine(
  picker_state$,
  allDiscounts$,
  ({ startDate }, discounts) =>
    discounts
      .filter(
        ({ days }) =>
          differenceInCalendarDays(startDate, new Date()) > Number(days),
      )
      .reduce((acc, discount) => {
        if (Number(acc?.days) > Number(discount.days)) return acc;
        if (
          differenceInCalendarDays(startDate, new Date()) >
          Number(discount.days)
        )
          return discount;
        else return acc;
      }, {}) || {},
);

////////////////
////////////////
guard({
  source: postcode$.updates,
  filter: postcode => postcode.length > 4,
  target: getPostcodePriceFx,
});

getPostcodePriceFx(postcode$.getState());

getAllDisscountsFx();

function extendArray(arr, p) {
  return arr.some(({ id }) => id === p.id)
    ? arr.map(item => (item.id === p.id ? p : item))
    : arr.concat(p);
}

function formatDate(date) {
  if (!date) return null;
  return date
    ?.toLocaleString('en-GB')
    .slice(0)
    .split(',')[0];
}
function getDate(date) {
  if (!date) return null;
  return isPast(date) ? null : new Date(date);
}
