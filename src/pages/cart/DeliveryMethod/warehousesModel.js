import { createEffect, createEvent, guard, restore } from 'effector';
import { createGate } from 'effector-react';

import { deliveryMethod$ } from 'features/cart';

import { WAREHOUSES } from 'api';

export const selectWarehouse = createEvent();

export const WarehousesGate = createGate('warehouses');

const getWarehousesFx = createEffect({
  handler: async () => {
    const { data } = await WAREHOUSES.getWarehouses();
    return data;
  },
});

export const warehouses$ = restore(getWarehousesFx, []);
export const selectedWarehous$ = restore(selectWarehouse, {});

selectedWarehous$.on(deliveryMethod$, (s, p) => {
  if (p.method === 'delivery') return [];
  return s;
});

guard({
  source: WarehousesGate.open,
  filter: warehouses$.map(e => !e.length),
  target: getWarehousesFx,
});
