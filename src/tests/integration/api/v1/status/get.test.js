import orchestrator from "../orchestrator.js";

beforeAll(async () => await orchestrator.waitForAllServices());

describe("GET to /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retryven current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");

      expect(response.status).toBe(200);

      const responseBory = await response.json();

      const parsedUpdateAt = new Date(responseBory.update_at).toISOString();
      expect(responseBory.update_at).toEqual(parsedUpdateAt);

      expect(responseBory.dependencies).toBeDefined();

      expect(responseBory.dependencies.database).toBeDefined();

      expect(responseBory.dependencies.database.version).toBe("16.6");
      expect(responseBory.dependencies.database.max_connections).toBe(112);
      expect(responseBory.dependencies.database.opened_connections).toBe(1);
    });
  });
});
