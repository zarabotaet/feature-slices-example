import React from 'react';
import { PATHS } from 'AppPaths';

import { history } from 'libs/history';

import { Error } from './pages/error/Error';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    if (process.env.NODE_ENV !== 'development') {
      history.push(PATHS.ERROR);
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError && process.env.NODE_ENV !== 'development') {
      return <Error />;
    }

    return children;
  }
}
