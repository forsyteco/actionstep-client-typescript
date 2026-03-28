import type { UserConfig } from '@hey-api/openapi-ts';
import { actionstepSpecManifest } from './openapi/manifest';

const sharedPlugins: NonNullable<UserConfig['plugins']> = [
  '@hey-api/client-fetch',
  '@hey-api/typescript',
  {
    name: '@hey-api/sdk',
  },
  '@hey-api/schemas',
];

const configs: UserConfig[] = actionstepSpecManifest.map(({ endpoint, url }) => ({
  input: url,
  output: {
    format: 'prettier',
    path: `src/clients/${endpoint}`,
  },
  plugins: sharedPlugins,
}));

export default configs;
