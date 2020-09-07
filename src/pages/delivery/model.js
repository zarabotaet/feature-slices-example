import { createEvent, createStore } from 'effector';
import withStorage from 'effector-storage';

const createStorageStore = withStorage(createStore);

export const setDelivery = createEvent();
export const setCollection = createEvent();

export const resetSlots = createEvent();

export const deliverySlot$ = createStorageStore({}, { key: 'delivery-slot' })
  .on(setDelivery, (_, e) => e)
  .on(resetSlots, () => ({}));
export const collectionSlot$ = createStorageStore(
  {},
  { key: 'collection-slot' },
)
  .on(setCollection, (_, e) => e)
  .on(resetSlots, () => ({}));
