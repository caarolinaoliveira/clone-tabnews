import database from "infra/database";
import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public");
});
// database.query("SELECT 1 + 1;");


test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("https://carolinaoliveira-dev.com.br/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
