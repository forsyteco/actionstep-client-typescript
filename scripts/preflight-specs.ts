import { actionstepSpecManifest } from '../openapi/manifest';

type CheckResult = {
  endpoint: string;
  status: number;
  ok: boolean;
  contentType: string | null;
};

async function checkSpec(url: string, endpoint: string): Promise<CheckResult> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/yaml, text/yaml, text/plain, */*',
    },
  });

  return {
    endpoint,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get('content-type'),
  };
}

async function main() {
  const checks = await Promise.allSettled(
    actionstepSpecManifest.map(({ endpoint, url }) => checkSpec(url, endpoint)),
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
      console.error(`preflight: ${endpoint} failed with HTTP ${status}`);
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
