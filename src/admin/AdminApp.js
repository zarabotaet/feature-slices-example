import React from 'react';

import { Layout } from './layout/Layout';

import { Row, Spinner } from 'ui';

const Routes = React.lazy(() =>
  import('./routes').then(i => ({
    default: i.Routes,
  })),
);

const Fallback = (
  <Row
    align="center"
    justify="center"
    style={{ width: '100vw', height: '100vh' }}
  >
    <Spinner dark size={5} />
  </Row>
);

export function AdminApp() {
  return (
    <React.Suspense fallback={Fallback}>
      <Layout>
        <Routes />
      </Layout>
    </React.Suspense>
  );
}
