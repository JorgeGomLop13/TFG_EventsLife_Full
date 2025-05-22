import { Env } from '@core/types/env';

export const environment: Env = {
  appVersion: `${require('../../package.json').version}-dev`,
  production: false,
  // eslint-disable-next-line no-template-curly-in-string
  apiBaseUrl: 'http://127.0.0.1:8000/api'
};
