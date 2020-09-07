import {
  combine,
  createEffect,
  createEvent,
  createStore,
  guard,
  merge,
  restore,
  sample,
} from 'effector';
import { createGate } from 'effector-react';

import { filter$ } from 'features/filter';

import { history } from 'libs/history';
import { CATREGORIES, PRODUCTS } from 'api';

export const categoryGate = createGate('');
export const productsGate = createGate('');

export const getAllCategoriesFx = createEffect({
  handler: async () => {
    const { data } = await CATREGORIES.getAll();
    return data.data;
  },
});
const getAllProductsFx = createEffect({
  handler: ({ categories$, filter$ }) =>
    Promise.all(
      categories$.map(async category => {
        const colors = filter$.colors.toString();
        const params = {
          slug: category.slug,
          sort: filter$.sort,
          order: filter$.order,
          ...(colors && { colors }),
          ...(filter$.pkg !== 'all' && { package: filter$.pkg }),
        };
        const { data } = await PRODUCTS.getAll(params);
        return { category, cards: data.data, meta: data.meta };
      }),
    ),
});
const getProductsByCategoryFx = createEffect({
  handler: async ({ filter, gateState, subCategoryState }) => {
    const colors = filter.colors.toString();
    const params = {
      slug: gateState.params.category,
      all: 1,
      page: gateState.params.page,
      order: filter.order,
      sort: filter.sort,
      ...(colors && { colors }),
      ...(filter.pkg !== 'all' && { package: filter.pkg }),
    };
    if (subCategoryState.length) {
      params.categories = subCategoryState.toString();
    }
    const { data } = await PRODUCTS.getAll(params);
    return { items: data.data, meta: data.meta };
  },
});

export const categories$ = restore(getAllCategoriesFx, []).map(state =>
  state.map(({ name, ...rest }) => ({
    name: firstCapital(name),
    ...rest,
  })),
);

export const allProducts$ = restore(getAllProductsFx, []);

export const productsByCategory$ = createStore([]).on(
  getProductsByCategoryFx.doneData,
  (_, { items }) => items,
);
export const productsTotalPages$ = createStore(7).on(
  getProductsByCategoryFx.doneData,
  (_, { meta }) => meta.last_page,
);

export const allProductsLoading$ = getAllProductsFx.pending;
export const productsByCategoryLoading$ = getProductsByCategoryFx.pending;

export const currentCategory$ = combine(
  categories$,
  categoryGate.state,
  (categories, { params }) => {
    return (
      categories.find(({ slug }) => slug === params?.category) ||
      categories.find(({ childs }) =>
        childs.some(({ slug }) => slug === params?.category),
      )
    );
  },
);
export const currentSubCategories$ = combine(
  categoryGate.state,
  currentCategory$,
  ({ params }, currentCategory) => {
    const subCtagoriesFromUrl = params?.category?.split('-and-');

    return (
      currentCategory?.childs?.map(subCategoryItem => {
        const checked = subCtagoriesFromUrl?.includes(subCategoryItem?.slug);
        return {
          subCategoryItem,
          checked,
        };
      }) || []
    );
  },
);

const currentSubCategoriesCheked$ = currentSubCategories$.map(store =>
  store
    .filter(item => item.checked)
    .map(({ subCategoryItem }) => subCategoryItem.id),
);

const currentSubCategoriesUrlString = combine(
  currentCategory$,
  currentSubCategories$,
  (currCategory, currentSubCategories) => {
    const currentSubCategoriesStr =
      currentSubCategories.find(({ checked }) => checked === true)
        ?.subCategoryItem.slug || currCategory?.slug;

    return encodeURI(currentSubCategoriesStr);
  },
);

currentSubCategoriesUrlString.updates.watch(setUrl);

export const checkSubCategory = createEvent();

currentSubCategories$.on(checkSubCategory, (state, id) =>
  state.map(({ subCategoryItem, checked }) => ({
    subCategoryItem,
    checked: id === subCategoryItem.id ? !checked : false,
  })),
);

// init
const categoriesAndFilter$ = combine({
  filter$,
  categories$,
});

guard({
  source: sample(
    categoriesAndFilter$,
    merge([getAllCategoriesFx.done, productsGate.open, filter$.updates]),
  ),
  filter: productsGate.status,
  target: getAllProductsFx,
});

guard({
  source: sample(
    combine({
      filter: filter$,
      gateState: categoryGate.state,
      subCategoryState: currentSubCategoriesCheked$,
    }),
    merge([
      categoryGate.state.updates,
      categoryGate.open,
      getAllCategoriesFx.done,
    ]),
  ),
  filter: categoryGate.status,
  target: getProductsByCategoryFx,
});

getAllCategoriesFx();

function firstCapital(str) {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}
function setUrl(str) {
  if (
    history.location.pathname.split('/')[2] !== str &&
    history.location.pathname.split('/')[1] === 'products'
  ) {
    history.replace(
      `/${history.location.pathname.split('/')[1]}/${str}/1${
        history.location.search
      }`,
    );
  }
}
