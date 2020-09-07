import {
  combine,
  createEffect,
  createStore,
  guard,
  merge,
  sample,
} from 'effector';
import { createGate } from 'effector-react';

import { filter$ } from 'features/filter';

import { PRODUCTS } from 'api';

export const searchGate = createGate('');

export const getProductsBySearchFx = createEffect({
  handler: async ({ filter, gateState }) => {
    const colors = filter.colors.toString();
    const q = filter.q !== '' && filter.q;
    const { order } = filter;

    const params = {
      slug: '',
      all: 1,
      page: gateState.params.page,
      sort: filter.sort,
      ...(colors && { colors }),
      ...(filter.pkg !== 'all' && { package: filter.pkg }),
      ...(q && { q }),
      ...(order && { order }),
    };
    const { data } = await PRODUCTS.getAll(params);
    return { items: data.data, meta: data.meta };
  },
});

export const productsBySearchPages$ = createStore(1).on(
  getProductsBySearchFx.doneData,
  (_, { meta }) => meta.last_page,
);

export const productsBySearch$ = createStore(Array(8)).on(
  getProductsBySearchFx.doneData,
  (s, { items }) => items,
);
export const isNothingFind$ = productsBySearch$.map(s => !s?.length);

guard({
  source: sample(
    combine({
      filter: filter$,
      gateState: searchGate.state,
    }),
    merge([searchGate.state.updates, searchGate.open]),
  ),
  filter: searchGate.status,
  target: getProductsBySearchFx,
});
