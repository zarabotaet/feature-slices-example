import { createEffect, createStore } from 'effector';
import withStorage from 'effector-storage';

import { SESSION } from 'api';

const createStorageStore = withStorage(createStore);

const newSessionFx = createEffect({
  handler: async () => {
    const { data } = await SESSION.newSession();
    return data?.session_id;
  },
});

export const sessionId$ = createStorageStore('', {
  key: 'easyEventSessionId',
}).on(newSessionFx.doneData, (s, p) => p);

if (sessionId$.defaultState === '') {
  newSessionFx();
}
