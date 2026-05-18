import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequestScopedClient, requestData, requestWithResponse } from "./transport";

test("createRequestScopedClient should return request-scoped client and JSON:API headers", () => {
  const scoped = createRequestScopedClient({
    auth: "token-value",
    baseUrl: "https://eu.actionstep.com/api",
  });

  assert.equal(scoped.baseUrl, "https://eu.actionstep.com/api/rest");
  assert.equal(scoped.auth, "Bearer token-value");
  assert.equal(scoped.headers.Authorization, "Bearer token-value");
  assert.equal(scoped.headers.Accept, "application/vnd.api+json");
});

test("requestData should return parsed JSON payload", async () => {
  let receivedRequest: Request | undefined;
  const scoped = createRequestScopedClient({
    auth: "token-value",
    baseUrl: "https://eu.actionstep.com/api",
    fetch: async (input, init) => {
      receivedRequest = new Request(input, init);
      return new Response(JSON.stringify({ actiontypes: [{ id: "at-1" }] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    },
  });

  const response = await requestData<{ actiontypes: Array<{ id: string }> }>(scoped, {
    method: "GET",
    query: { pageSize: 10 },
    url: "/actiontypes",
  });

  assert.deepEqual(response, { actiontypes: [{ id: "at-1" }] });
  assert.ok(receivedRequest);
  assert.match(receivedRequest?.url ?? "", /\/rest\/actiontypes\?pageSize=10$/);
});

test("requestWithResponse should include status and data", async () => {
  const scoped = createRequestScopedClient({
    auth: "token-value",
    baseUrl: "https://eu.actionstep.com/api",
    fetch: async () =>
      new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }),
  });

  const response = await requestWithResponse<{ ok: boolean }>(scoped, {
    method: "POST",
    url: "/files",
  });

  assert.equal(response.status, 201);
  assert.deepEqual(response.data, { ok: true });
});
