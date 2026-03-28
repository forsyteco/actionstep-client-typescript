# Actionstep Client TypeScript

TypeScript Actionstep API clients generated from the official OpenAPI YAML files using [Hey API](https://heyapi.dev/openapi-ts/).

This package generates one client module per Actionstep domain under `src/clients/<endpoint>` and exports them all through `src/index.ts`.

## Install

```bash
npm install @forsyteco/actionstep-client-typescript
```

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

1. Runs spec preflight checks against every `https://docs.actionstep.com/downloads/<endpoint>.yaml` URL.
2. Runs Hey API with one generation job per endpoint.
3. Refreshes `src/index.ts` and `src/clients/index.ts` barrel exports from the manifest.

## Manifest

The endpoint list is defined in `openapi/manifest.ts`.

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
