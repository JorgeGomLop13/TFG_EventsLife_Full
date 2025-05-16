import { Env } from '@core/types/env';

export const environment: Env = {
  appVersion: `${require('../../package.json').version}-dev`,
  production: false,
  // eslint-disable-next-line no-template-curly-in-string
  apiBaseUrl: 'http://localhost:3000/api'
};
