import { PATHS } from 'AppPaths';

import { Login } from './';

export const loginRoutes = [
  {
    path: PATHS.LOGIN,
    exact: true,
    component: Login,
  },
];
