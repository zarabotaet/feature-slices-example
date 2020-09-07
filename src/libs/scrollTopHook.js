import React from 'react';

export const useScrollToTop = (top = 0) => {
  React.useLayoutEffect(() => {
    window.scrollTo({
      top,
      left: 0,
      behavior: 'smooth',
    });
  }, [top]);
};
