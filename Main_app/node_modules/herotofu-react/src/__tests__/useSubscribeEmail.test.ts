import { renderHook, act, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { useSubscribeEmail } from '../useSubscribeEmail';

const MOCK_200_RESPONSE = { status: 200, body: JSON.stringify({ status: 200, message: 'OK' }) };
const MOCK_302_RESPONSE = { status: 302, body: JSON.stringify({ status: 302, message: 'Found' }) };
const MOCK_404_RESPONSE = { status: 404, body: JSON.stringify({ status: 404, message: 'Not Found' }) };
const MOCK_422_RESPONSE = { status: 422, body: JSON.stringify({ status: 422, message: 'Unprocessable Entity' }) };
const MOCK_429_RESPONSE = { status: 429, body: JSON.stringify({ status: 429, message: 'Too Many Requests' }) };
const MOCK_500_RESPONSE = { status: 500, body: JSON.stringify({ status: 500, message: 'Internal Error' }) };

describe('calling the useSubscribeEmail() hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });

  it('handles an invalid email', async () => {
    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'invalid' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('Invalid email address');

    await waitFor(() =>
      expect(result.current.subscribeState).toStrictEqual({ status: 'error', error: expectedError, data })
    );

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(0);
  });

  it('subscribes and trims email successfully', async () => {
    fetchMock.mockOnce(async () => MOCK_200_RESPONSE);

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-form-id'));
    const data = { email: 'joe.bloggs@example.com' };

    expect(result.current.subscribeState).toStrictEqual({ status: 'not_initialized' });
    expect(typeof result.current.subscribe).toBe('function');

    act(() => void result.current.subscribe(` ${data.email} \n `, callbackSpy));

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'success', data }));

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'success', data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles a 302 redirect', async () => {
    fetchMock.mockOnce(async () => MOCK_302_RESPONSE);

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'success', data }));

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'success', data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles a 404 error', async () => {
    fetchMock.mockOnce(async () => MOCK_404_RESPONSE);

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('Not Found');

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() =>
      expect(result.current.subscribeState).toStrictEqual({ status: 'error', error: expectedError, data })
    );

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles a 422 error', async () => {
    fetchMock.mockOnce(async () => MOCK_422_RESPONSE);

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('Please complete the captcha challenge');

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() =>
      expect(result.current.subscribeState).toStrictEqual({ status: 'error', error: expectedError, data })
    );

    expect(document.querySelector('form')?.getAttribute('target')).toBe('_blank');
    expect(document.querySelector('form')?.getAttribute('action')).toBe('https://public.herotofu.com/v1/test-id');

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles a 429 error and failed retry', async () => {
    fetchMock.mockOnce(async () => MOCK_429_RESPONSE);
    fetchMock.mockOnce(async () => MOCK_429_RESPONSE);

    act(() => jest.useFakeTimers());

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('Too Many Requests');

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    jest.advanceTimersByTime(11000);
    await waitFor(() =>
      expect(result.current.subscribeState).toStrictEqual({ status: 'error', error: expectedError, data })
    );

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    act(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
  });

  it('handles a 429 error and successful retry', async () => {
    fetchMock.mockOnce(async () => MOCK_429_RESPONSE);
    fetchMock.mockOnce(async () => MOCK_200_RESPONSE);

    act(() => jest.useFakeTimers());

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));

    jest.advanceTimersByTime(11000);

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'success', data }));

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'success', data });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    act(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
  });

  it('handles a timeout on abort controller', async () => {
    fetchMock.mockAbortOnce();

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('The operation was aborted. ');

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() => expect(result.current.subscribeState).toEqual({ status: 'error', error: expectedError, data }));

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('handles a 500 error', async () => {
    fetchMock.mockOnce(async () => MOCK_500_RESPONSE);

    const callbackSpy = jest.fn();
    const { result } = renderHook(() => useSubscribeEmail('test-id'));
    const data = { email: 'joe.bloggs@example.com' };

    act(() => void result.current.subscribe(data.email, callbackSpy));

    const expectedError = new Error('Internal Server Error');

    await waitFor(() => expect(result.current.subscribeState).toStrictEqual({ status: 'loading', data }));
    await waitFor(() => expect(result.current.subscribeState).toEqual({ status: 'error', error: expectedError, data }));

    expect(callbackSpy).toHaveBeenCalledWith({ status: 'error', error: expectedError, data });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
