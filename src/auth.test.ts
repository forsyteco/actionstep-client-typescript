import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configureAuth,
  createJsonApiHeaders,
  createRestBaseUrl,
  exchangeAuthorizationCode,
  normalizeToken,
  refreshToken,
} from "./auth";

test("normalizeToken should add Bearer prefix when missing", () => {
  assert.equal(normalizeToken("token-value"), "Bearer token-value");
});

test("normalizeToken should preserve existing Bearer prefix", () => {
  assert.equal(normalizeToken("Bearer token-value"), "Bearer token-value");
});

test("createRestBaseUrl should append /rest when missing", () => {
  assert.equal(createRestBaseUrl("https://eu.actionstep.com/api"), "https://eu.actionstep.com/api/rest");
});

test("createRestBaseUrl should avoid duplicate /rest suffix", () => {
  assert.equal(
    createRestBaseUrl("https://eu.actionstep.com/api/rest/"),
    "https://eu.actionstep.com/api/rest"
  );
});

test("createJsonApiHeaders should return JSON:API headers", () => {
  assert.deepEqual(createJsonApiHeaders("token-value"), {
    Authorization: "Bearer token-value",
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  });
});

test("configureAuth should configure the provided client", () => {
  const receivedConfigs: Array<Record<string, unknown>> = [];
  const client = {
    setConfig: (config: Record<string, unknown>) => {
      receivedConfigs.push(config);
    },
  };

  const configured = configureAuth({
    client,
    baseUrl: "https://eu.actionstep.com/api",
    auth: "token-value",
  });

  assert.equal(receivedConfigs.length, 1);
  assert.deepEqual(receivedConfigs[0], configured);
  assert.equal(configured.baseUrl, "https://eu.actionstep.com/api/rest");
  assert.equal(configured.auth, "Bearer token-value");
});

test("exchangeAuthorizationCode should post form-encoded payload", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify({ access_token: "new-access", refresh_token: "new-refresh" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const response = await exchangeAuthorizationCode({
    tokenUrl: "https://auth.example.com/token",
    clientId: "client-id",
    clientSecret: "client-secret",
    code: "auth-code",
    redirectUri: "https://app.example.com/callback",
  });

  assert.equal(response.access_token, "new-access");
  assert.ok(request);
  assert.equal(request?.method, "POST");
  const bodyText = await request?.text();
  assert.match(bodyText ?? "", /grant_type=authorization_code/);
  assert.match(bodyText ?? "", /code=auth-code/);
});

test("refreshToken should post refresh_token grant payload", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify({ access_token: "new-access", refresh_token: "new-refresh" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const response = await refreshToken({
    tokenUrl: "https://auth.example.com/token",
    clientId: "client-id",
    clientSecret: "client-secret",
    refreshToken: "refresh-token",
  });

  assert.equal(response.refresh_token, "new-refresh");
  assert.ok(request);
  const bodyText = await request?.text();
  assert.match(bodyText ?? "", /grant_type=refresh_token/);
  assert.match(bodyText ?? "", /refresh_token=refresh-token/);
});
