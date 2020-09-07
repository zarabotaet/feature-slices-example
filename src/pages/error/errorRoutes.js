import { PATHS } from 'AppPaths';

import { Error } from './Error';

export const errorRoutes = [
  {
    path: PATHS.ERROR,
    exact: true,
    component: Error,
  },
];
