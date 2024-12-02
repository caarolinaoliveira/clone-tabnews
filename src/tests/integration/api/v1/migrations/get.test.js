import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retryven pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");

      expect(response.status).toBe(200);

      const responseBory = await response.json();

      expect(Array.isArray(responseBory)).toBe(true);

      expect(responseBory.length).toBeGreaterThan(0);
    });
  });
});
