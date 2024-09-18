import { useCallback } from 'react';
import { useJsonData } from './useJsonData';
import type { RequestCallback, FormId, RequestOptions, UseSubscribeEmailReturn } from './types';

function useSubscribeEmail(formIdOrUrl: FormId, options: RequestOptions = {}): UseSubscribeEmailReturn {
  const { dataState: subscribeState, sendData, __dangerousUpdateState } = useJsonData(formIdOrUrl, options);

  const subscribe = useCallback(
    (emailToSubsribe: string, callbackOnComplete?: RequestCallback) => {
      const email = String(emailToSubsribe).trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        __dangerousUpdateState(
          { status: 'error', error: new Error('Invalid email address'), data: { email } },
          callbackOnComplete
        );
        return;
      }

      sendData(callbackOnComplete, { email });
    },
    [formIdOrUrl]
  );

  return { subscribeState, subscribe };
}

export { useSubscribeEmail };
