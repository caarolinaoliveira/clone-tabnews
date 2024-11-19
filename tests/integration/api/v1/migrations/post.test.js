import database from "infra/database";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch(
    "https://carolinaoliveira-dev.com.br/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(response.status).toBe(201);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  // teste 2 post
  const response2 = await fetch(
    "https://carolinaoliveira-dev.com.br/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(response2Body.length).toBe(0);
});
