# Actionstep Client TypeScript

TypeScript Actionstep API clients generated from the official OpenAPI YAML files using [Hey API](https://heyapi.dev/openapi-ts/).

This package generates one client module per Actionstep domain under `src/clients/<endpoint>` and exports them all through `src/index.ts`.

## Install

```bash
npm install @forsyteco/actionstep-client-typescript
```

## OAuth-first quickstart (request-scoped)

```ts
import {
  createRequestScopedClient,
  exchangeAuthorizationCode,
  getActiontypes,
  requestWithResponse,
  refreshToken,
} from "@forsyteco/actionstep-client-typescript";

const exchanged = await exchangeAuthorizationCode({
  tokenUrl: process.env.ACTIONSTEP_TOKEN_URL!,
  clientId: process.env.ACTIONSTEP_CLIENT_ID!,
  clientSecret: process.env.ACTIONSTEP_CLIENT_SECRET!,
  code: authCodeFromCallback,
  redirectUri: process.env.ACTIONSTEP_REDIRECT_URI!,
});

const refreshed = await refreshToken({
  tokenUrl: process.env.ACTIONSTEP_TOKEN_URL!,
  clientId: process.env.ACTIONSTEP_CLIENT_ID!,
  clientSecret: process.env.ACTIONSTEP_CLIENT_SECRET!,
  refreshToken: exchanged.refresh_token!,
});

const scoped = createRequestScopedClient({
  baseUrl: process.env.ACTIONSTEP_BASE_URL!,
  auth: refreshed.access_token!,
});

const actionTypes = await getActiontypes({
  client: scoped.client,
  headers: scoped.headers,
  query: { pageSize: "10" },
  throwOnError: true,
});

const uploadResponse = await requestWithResponse(scoped, {
  method: "POST",
  url: "/files",
  body: { name: "example.pdf" },
});

console.log(uploadResponse.status, uploadResponse.data);
```

Use `createRequestScopedClient()` per request. This avoids request-path reliance on mutable shared singleton state and keeps auth/baseUrl scoped to the current integration call.

## Development

```bash
npm install
npm run generate
npm run lint
npm run build
```

## Regenerate Clients

```bash
npm run generate
```

The generation flow:

1. Runs spec preflight checks against remote endpoint specs and local legacy supplemental specs.
2. Runs Hey API with one generation job per endpoint.
3. Refreshes `src/index.ts` and `src/clients/index.ts` barrel exports from the manifest.

## Manifest

The endpoint list is defined in `openapi/manifest.ts`.

### Legacy supplemental endpoints

Actionstep notes that they are currently migrating API docs into the new endpoint resources site and still maintain legacy endpoint documentation while that migration is in progress.

Because `actiondocuments`, `files`, and `participanttypes` are required by `forsyteco-api` but are not currently available as downloadable endpoint YAMLs from `/downloads`, this package includes supplemental legacy specs in `openapi/legacy/`:

- `openapi/legacy/actiondocuments.yaml`
- `openapi/legacy/files.yaml`
- `openapi/legacy/participanttypes.yaml`

In `openapi/manifest.ts`, these are explicitly marked with `source: 'legacy'` so they remain visible and easy to replace with official download specs when Actionstep publishes them.

Add/remove endpoints in that file, then rerun:

```bash
npm run generate
```

- Generated clients are intended to be treated as build artifacts.
- Re-run generation whenever Actionstep updates their published YAML specs.

## Publish Checklist

```bash
npm run generate
npm run pack:check
npm run publish:public
```

`prepack` runs automatically during pack/publish, so lint/build happen before publishing without committing `dist`.

## Release Commands

```bash
# choose one semantic version bump
npm run release:patch
npm run release:minor
npm run release:major
```

## CI Publish (npm token)

Set `NPM_TOKEN` in your CI secret store, then run:

```bash
npm ci
npm run generate
npm run lint
npm run build
npm run pack:check
npm run publish:public
```
