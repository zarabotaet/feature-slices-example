import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

// code below prevent history push state to same url as current
const prevHistoryPush = history.push;
let lastLocation = history.location;

history.listen(location => {
  lastLocation = location;
});
history.push = (pathname, state = {}) => {
  if (
    lastLocation === null ||
    pathname !==
      lastLocation.pathname + lastLocation.search + lastLocation.hash ||
    JSON.stringify(state) !== JSON.stringify(lastLocation.state)
  ) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    prevHistoryPush(pathname, state);
  }
};
