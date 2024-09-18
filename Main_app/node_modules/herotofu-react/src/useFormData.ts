import { useState, useCallback, useRef } from 'react';
import {
  HEROTOFU_STATUS_RATELIMIT,
  HEROTOFU_STATUS_SPAMBOT,
  fetchWithTimeout,
  filterInjectedData,
  getFormEndpoint,
} from './utils';
import type {
  RequestCallback,
  RequestState,
  GetFormSubmitHandler,
  InjectedData,
  FormId,
  RequestOptions,
  UseFormDataReturn,
} from './types';

function useFormData(formIdOrUrl: FormId, options: RequestOptions = {}): UseFormDataReturn {
  const shouldBlockFormSubmit = useRef(false);
  const [formState, setFormState] = useState<RequestState>({ status: 'not_initialized' });

  const updateState = useCallback((newState: RequestState, callbackOnComplete?: RequestCallback) => {
    shouldBlockFormSubmit.current = newState.status === 'loading';
    setFormState(newState);

    if (newState.status === 'success' || newState.status === 'error') {
      callbackOnComplete?.(newState);
    }
  }, []);

  const getFormSubmitHandler: GetFormSubmitHandler = useCallback(
    (callbackOnComplete?: RequestCallback, injectedData?: InjectedData) => {
      return async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        if (shouldBlockFormSubmit.current) {
          return;
        }

        const data = extractFormData(formEvent, injectedData);
        updateState({ status: 'loading', data }, callbackOnComplete);

        try {
          let response = await fetchWithTimeout(getFormEndpoint(formIdOrUrl), {
            method: 'POST',
            body: data,
            ...options,
          });

          // Rate limit response, retry one more time after 10 seconds. Then return an error if it repeats
          if (response.status === HEROTOFU_STATUS_RATELIMIT) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            const retryResponse = await fetchWithTimeout(getFormEndpoint(formIdOrUrl), {
              method: 'POST',
              body: data,
              ...options,
            });

            if (retryResponse.status === HEROTOFU_STATUS_RATELIMIT) {
              throw new Error('Too Many Requests');
            }

            response = retryResponse;
          }

          // It's likely a spam/bot submission, so bypass it to validate via captcha challenge old-school style
          if (response.status === HEROTOFU_STATUS_SPAMBOT) {
            submitHtmlForm(getFormEndpoint(formIdOrUrl), formEvent, injectedData);
            throw new Error('Please complete the captcha challenge');
          }

          // Something went wrong, the status is not within the 200-399 range
          if ((response.status < 200 || response.status >= 400) && response.type !== 'opaqueredirect') {
            throw new Error(response.statusText);
          }

          updateState({ status: 'success', data }, callbackOnComplete);
        } catch (err: any) {
          updateState({ status: 'error', error: err, data }, callbackOnComplete);
        }
      };
    },
    [formIdOrUrl]
  );

  return { formState, getFormSubmitHandler, __dangerousUpdateState: updateState };
}

function extractFormData(formEvent: React.FormEvent, injectedData?: InjectedData) {
  const form = formEvent.target as HTMLFormElement;
  const formData = new FormData(form);

  Object.entries(filterInjectedData(injectedData)).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  return formData;
}

function submitHtmlForm(formAction: string, formEvent: React.FormEvent, injectedData?: InjectedData) {
  const form = formEvent.target as HTMLFormElement;

  // Append dynamically passed values to the form
  Object.entries(filterInjectedData(injectedData)).forEach(([key, value]) => {
    // Create hidden elements for each key and append them to the form
    const el = document.createElement('input');
    el.type = 'hidden';
    el.name = key;
    el.value = String(value);

    form.appendChild(el);
  });

  // Let's submit the form again and spammer/bot will be redirected to another page automatically
  // Submitting via javascript will bypass calling this function again
  form.setAttribute('action', formAction);
  form.setAttribute('target', '_blank');
  form.setAttribute('method', 'POST');
  form.setAttribute('enctype', 'multipart/form-data');

  form.submit();
}

export { useFormData };
