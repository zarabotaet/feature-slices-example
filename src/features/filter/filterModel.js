import { PATHS } from 'AppPaths';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';

import { history } from 'libs/history';
import { LANDING } from 'api';

export const checkColorItem = createEvent();
export const addColor = createEvent();
export const changePackage = createEvent();
export const changeSortby = createEvent();
export const changeSearchStr = createEvent();

const getPackagesDataFx = createEffect({
  handler: async () => {
    const { data } = await LANDING.getPackages();
    return data.data;
  },
});

export const packagesData$ = createStore([{ name: 'All', slug: 'all' }]).on(
  getPackagesDataFx.doneData,
  (s, p) => {
    const tdata = p.map(({ value, src }) => ({
      slug: value,
      name: value,
    }));
    return s.concat(tdata);
  },
);

export const packages$ = createStore([]).on(
  getPackagesDataFx.doneData,
  (s, p) => p.map(({ value, src }) => ({ value, src })),
);

const selectedPackage$ = packagesData$
  .map(s => s[0])
  .on(
    sample(
      packagesData$,
      changePackage,
      (s, selectedName) => s.find(({ name }) => selectedName === name) || s[0],
    ),
    (s, p) => p,
  );

const selectedPackagesbySlug$ = selectedPackage$.map(({ slug }) => slug);

export const selectedPackageName$ = selectedPackage$.map(({ name }) => name);

export const sortbyData = [
  { slug: 'popular', name: 'Popularity' },
  { slug: 'price-low', name: 'Price (low to high)' },
  { slug: 'price-high', name: 'Price (high to low)' },
  { slug: 'date', name: 'New arrivals' },
];

export const selectedSortby$ = createStore(sortbyData[0].name).on(
  changeSortby,
  (s, p) => sortbyData.find(({ slug }) => slug === p).name,
);

const selectedSortbySlug$ = selectedSortby$.map(s => {
  const slug = sortbyData.find(({ name }) => name === s).slug;
  if (slug.startsWith('price')) return 'price';
  return slug;
});

export const orderSorting$ = selectedSortby$.map(s =>
  s === 'Price (low to high)' ? 'asc' : 'desc',
);

export const colors$ = createStore([
  '#E11F1F',
  '#FF6600',
  '#FFC700',
  '#39D413',
  '#00E0FF',
  '#0085FF',
  '#9E00FF',
  '#9D7965',
  '#FFFFFF',
  '#353535',
])
  .map(state => state.map(color => ({ color, checked: false })))
  .on(checkColorItem, (state, checkedColor) =>
    state.map(({ color, checked }) => ({
      color,
      checked: color === checkedColor ? !checked : checked,
    })),
  )
  .on(addColor, (state, color) => [...state, { checked: true, color }]);

export const checkedColors$ = colors$.map(store =>
  store.filter(item => item.checked).map(({ color }) => color),
);

export const searchStr$ = restore(changeSearchStr, '');

export const filter$ = combine({
  colors: checkedColors$,
  pkg: selectedPackagesbySlug$,
  sort: selectedSortbySlug$,
  order: orderSorting$,
  q: searchStr$,
});

export const filterSearchString$ = filter$.map(({ colors, pkg, sort, q }) => {
  return new URLSearchParams(
    Object.entries({
      colors,
      ...(packagesData$.defaultState[0].slug !== pkg && { pkg }),
      ...(selectedSortbySlug$.defaultState !== sort && { sort }),
      ...(searchStr$.defaultState !== q && { q }),
    }).filter(([, i]) => i?.length),
  );
});

filterSearchString$.updates.watch(filter => {
  // no IE
  if (
    history.location.pathname.startsWith(PATHS.PRODUCTS) ||
    history.location.pathname.includes(PATHS._SEARCH)
  ) {
    if (history.location.pathname.includes('page')) {
      history.replace(
        `${history.location.pathname.split('page')[0]}page/1?${filter}`,
      );
    }
    history.replace(`${history.location.pathname}?${filter}`);
  }
});

searchStr$.updates.watch(str => {
  if (!history.location.pathname.includes(PATHS._SEARCH)) {
    history.push(`${PATHS.SEARCH(1)}?q=${str}`);
  }
});

getPackagesDataFx();

getPackagesDataFx.finally.watch(parseSearchUrlToStore);

function parseSearchUrlToStore() {
  for (const [parameter, value] of new URLSearchParams(
    document.location.search,
  )) {
    switch (parameter) {
      case 'colors':
        value.split(',').forEach(color => {
          checkColorItem(color);
        });
        break;
      case 'sort':
        changeSortby(value === 'price' ? 'price-low' : value);
        break;
      case 'q':
        changeSearchStr(value);
        break;
      case 'pkg':
        changePackage(value);
        break;
      default:
        break;
    }
  }
}
