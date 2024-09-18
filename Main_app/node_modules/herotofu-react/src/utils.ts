import type { FormId, InjectedData } from './types';

const HEROTOFU_STATUS_RATELIMIT = 429;
const HEROTOFU_STATUS_SPAMBOT = 422;

function getFormEndpoint(formId: FormId): string {
  return formId.startsWith('https://') ? formId : `https://public.herotofu.com/v1/${formId}`;
}

function filterInjectedData(injectedData?: InjectedData) {
  return (
    Object.entries(injectedData || {})
      .filter(([, value]) => value !== undefined)
      .reduce((acc: typeof injectedData, [key, value]) => ({ ...acc, [key]: value }), {}) || {}
  );
}

async function fetchWithTimeout(resource: string, options: { timeout?: number } & Record<string, unknown> = {}) {
  const { timeout = 30000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    redirect: 'manual',
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
}

export { HEROTOFU_STATUS_RATELIMIT, HEROTOFU_STATUS_SPAMBOT, getFormEndpoint, filterInjectedData, fetchWithTimeout };
