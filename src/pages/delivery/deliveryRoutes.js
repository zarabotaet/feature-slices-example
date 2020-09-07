import { PATHS } from 'AppPaths';

import { Delivery } from './Delivery';

export const deliveryRoutes = [
  {
    path: PATHS.DELIVERY_TIME_SELECT(':type'),
    exact: true,
    component: Delivery,
  },
];
