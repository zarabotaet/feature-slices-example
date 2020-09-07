import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { aboutRoutes } from 'pages/about/aboutRoutes';
import { cartRoutes } from 'pages/cart/cartRoutes';
import { checkoutRoutes } from 'pages/checkout/checkoutRoutes';
import { deliveryRoutes } from 'pages/delivery/deliveryRoutes';
import { errorRoutes } from 'pages/error/errorRoutes';
import { loginRoutes } from 'pages/login/loginRoutes';
import { mainRoutes } from 'pages/main/mainRoutes';
import { productRoutes } from 'pages/product/productRoutes';
import { productsRoutes } from 'pages/products/productsRoutes';

const routesList = [
  ...mainRoutes,
  ...loginRoutes,
  ...cartRoutes,
  ...checkoutRoutes,
  ...deliveryRoutes,
  ...productsRoutes,
  ...aboutRoutes,
  ...errorRoutes,
  ...productRoutes,
];

export const Routes = () => (
  <Switch>
    {routesList.map((route, index) => (
      <Route key={index} {...route} />
    ))}
  </Switch>
);
