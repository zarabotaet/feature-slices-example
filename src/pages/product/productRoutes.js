import { PATHS } from 'AppPaths';

import { Product } from './Product';

export const productRoutes = [
  {
    path: PATHS.PRODUCT(':id'),
    exact: true,
    component: Product,
  },
];
