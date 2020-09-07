import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATHS as ADMIN_PATHS } from './AdminAppPaths';
import { Product } from './pages/NewProduct/Product';
import { Products } from './pages/Products';

const routesList = [
  {
    path: ADMIN_PATHS.PRODUCTS,
    exact: true,
    component: Products,
  },
  {
    path: ADMIN_PATHS.PRODUCT(':id'),
    exact: true,
    component: Product,
  },
];

export const Routes = () => (
  <Switch>
    {routesList.map((route, index) => (
      <Route key={index} {...route} />
    ))}
  </Switch>
);
