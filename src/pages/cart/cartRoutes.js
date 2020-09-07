import { PATHS } from 'AppPaths';

import { Cart } from './Cart';

export const cartRoutes = [
  {
    path: [PATHS.CART_PROPS(':orderId'), PATHS.CART],
    exact: true,
    component: Cart,
  },
];
