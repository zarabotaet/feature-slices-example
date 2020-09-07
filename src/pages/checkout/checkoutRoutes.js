import { PATHS } from 'AppPaths';

import { Checkout } from './Checkout';
import { Success, SuccessPayLater } from './Success';

export const checkoutRoutes = [
  {
    path: PATHS.CHECKOUT,
    exact: true,
    component: Checkout,
  },
  {
    path: PATHS.SUCCESS,
    exact: true,
    component: Success,
  },
  {
    path: PATHS.SUCCESS_PAY_LATER,
    exact: true,
    component: SuccessPayLater,
  },
];
