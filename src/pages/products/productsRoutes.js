import { PATHS } from 'AppPaths';

import { Products } from './Products';
import { ProductsByCategory } from './ProductsByCategory';
import { SearchPage } from './SearchPage';

export const productsRoutes = [
  {
    path: PATHS.PRODUCTS,
    exact: true,
    component: Products,
  },
  {
    path: PATHS.SEARCH(':page'),
    exact: true,
    component: SearchPage,
  },
  {
    path: PATHS.CATEGORY(':category', ':page'),
    exact: true,
    component: ProductsByCategory,
  },
];
