import { toast } from 'react-toastify';
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
} from 'effector';
import { createGate } from 'effector-react';
import FuzzySearch from 'fuzzy-search';

import { PRODUCTS } from 'admin/api';

const searcher = state =>
  new FuzzySearch(state, ['sku', 'name', 'slug'], { sort: true });

export const productsGate = createGate('');

export const changeSearchStr = createEvent();
export const updateProduct = createEvent();

export const changeSearchStrDebounced = createDebounce(changeSearchStr, 100);

const getAllProductsFx = createEffect({
  handler: async () => {
    const { data } = await PRODUCTS.getAll();
    return data.data;
  },
});

export const deleteProduct = createEvent();

export const allProducts$ = restore(getAllProductsFx, []);

export const touchProduct = createEvent();

export const cancelTouchProduct = createEvent();

export const touchedProducts$ = createStore([]);

const updateProductFx = createEffect({
  handler: async ({ id, params }) => {
    await PRODUCTS.update(id, params);
  },
});

updateProductFx.done.watch(({ params }) => {
  toast(`Product ${params?.params?.display_name} was updated`);
});

forward({
  from: updateProductFx.done.map(({ params }) => params?.params),
  to: updateProduct,
});
forward({
  from: updateProductFx.fail.map(({ params }) => params?.params),
  to: cancelTouchProduct,
});

updateProductFx.fail.watch(({ params }) => {
  toast.error(`Product ${params?.params?.display_name} wasn't updated`);
});

export const updateProductWithTouched = attach({
  effect: updateProductFx,
  source: touchedProducts$,
  mapParams: (id, touchedProducts) => {
    return { id, params: touchedProducts.find(({ id: ID }) => ID === id) };
  },
});

touchedProducts$
  .on(touchProduct, (s, p) => {
    return [...s.filter(e => e.id !== p.id), p];
  })
  .on(cancelTouchProduct, (s, { id }) => {
    return s.filter(e => e.id !== id);
  });

allProducts$.on(deleteProduct, (s, p) => s.filter(({ id }) => id !== p));

export const serchStr$ = restore(changeSearchStr, '');

const serchStrDebounced$ = restore(changeSearchStrDebounced, '');

export const serchPending$ = combine(
  serchStr$,
  serchStrDebounced$,
  (s, e) => s !== e,
);

export const filteredProducts$ = combine(
  allProducts$,
  serchStrDebounced$,
  (e, s) => {
    if (s.length < 3) {
      return e;
    }
    return searcher(e).search(s);
  },
);

guard({
  source: productsGate.open,
  filter: filteredProducts$.map(e => !e.length),
  target: getAllProductsFx,
});

// filter of products quantity showing
export const showProductsChanged = createEvent();
export const showProductsQuantity$ = restore(showProductsChanged, 50);

export const showProducts$ = combine(
  showProductsQuantity$,
  filteredProducts$,
  (e, s) => {
    if (!e) return s;
    return s.slice(0, e);
  },
);

showProducts$
  .on(touchedProducts$, (s, p) => {
    return s.map(e => {
      if (p.every(({ id }) => id !== e.id)) {
        const { touched, ...rest } = e;
        return rest;
      }
      return { ...e, touched: p.find(({ id }) => id === e.id) };
    });
  })
  .on(updateProduct, (s, p) =>
    s.map(e => {
      if (p.id !== e.id) return e;
      return { ...e, ...p };
    }),
  );

// helper
function createDebounce(callee, timeout) {
  let timeoutId: number;
  const tick = createEvent();
  let rejectPromise;

  const timer = createEffect().use(
    parameter =>
      new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = setTimeout(resolve, timeout, parameter);
      }),
  );

  timer.watch(() => {
    clearTimeout(timeoutId);
    rejectPromise();
  });

  forward({
    from: callee,
    to: timer,
  });

  forward({
    from: timer.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}
