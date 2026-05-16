import { readFile } from 'node:fs/promises';
import { actionstepSpecManifest } from '../openapi/manifest';

type CheckResult = {
  endpoint: string;
  status: number | 'legacy';
  ok: boolean;
  contentType: string | null;
};

async function checkSpec(entry: (typeof actionstepSpecManifest)[number]): Promise<CheckResult> {
  if (entry.source === 'legacy') {
    const source = await readFile(entry.input, 'utf8');
    const hasOpenApiMarker =
      source.includes('openapi:') || source.includes('swagger:');
    const hasPathsMarker = source.includes('paths:');
    const hasEndpointPath = source.includes(`/${entry.endpoint}`);
    if (!hasOpenApiMarker || !hasPathsMarker || !hasEndpointPath) {
      return {
        endpoint: entry.endpoint,
        status: 'legacy',
        ok: false,
        contentType: null,
      };
    }
    return {
      endpoint: entry.endpoint,
      status: 'legacy',
      ok: true,
      contentType: 'text/yaml',
    };
  }

  const response = await fetch(entry.input, {
    headers: {
      Accept: 'application/yaml, text/yaml, text/plain, */*',
    },
  });
  return {
    endpoint: entry.endpoint,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get('content-type'),
  };
}

async function main() {
  const checks = await Promise.allSettled(
    actionstepSpecManifest.map((entry) => checkSpec(entry)),
  );

  let failed = 0;

  for (const item of checks) {
    if (item.status === 'rejected') {
      failed += 1;
      console.error(`preflight: request failed - ${item.reason}`);
      continue;
    }

    const { endpoint, status, ok, contentType } = item.value;
    if (!ok) {
      failed += 1;
      console.error(
        status === 'legacy'
          ? `preflight: ${endpoint} legacy spec failed validation`
          : `preflight: ${endpoint} failed with HTTP ${status}`,
      );
      continue;
    }

    console.log(
      `preflight: ${endpoint} OK (${status}) content-type=${contentType ?? 'unknown'}`,
    );
  }

  if (failed > 0) {
    throw new Error(`Spec preflight failed for ${failed} endpoint(s).`);
  }
}

void main();
