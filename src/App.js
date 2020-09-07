import './features/session';

import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Router, Switch } from 'react-router-dom';
import { AdminApp } from 'admin/AdminApp';
import { PATHS as ADMIN_PATHS } from 'admin/AdminAppPaths';
import { MainLayout } from 'layout/mainLayout';
import { Routes } from 'routes';

import { history } from 'libs/history';

import { ErrorBoundary } from './AppError';

import 'assets/styles/index.scss';

const App = () => {
  return (
    <ErrorBoundary>
      <Router history={history}>
        <Switch>
          <Route path={ADMIN_PATHS.ROOT}>
            <AdminApp />
          </Route>
          <Route>
            <MainLayout>
              <Routes />
            </MainLayout>
          </Route>
        </Switch>
      </Router>
    </ErrorBoundary>
  );
};

// eslint-disable-next-line import/no-default-export
export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
