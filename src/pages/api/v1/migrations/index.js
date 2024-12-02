import migrateRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const method = request.method;

  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(method)) {
    return response.status(405).json({ error: `Method ${method} not allowed` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationsOptions = {
      dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (method === "GET") {
      const pendingMigrations = await migrateRunner(migrationsOptions);

      return response.status(200).json(pendingMigrations);
    } else if (method === "POST") {
      const migratedMigrations = await migrateRunner({
        ...migrationsOptions,
        dryRun: false,
      });

      const migratedMigrationsStatus =
        migratedMigrations.length > 0 ? 201 : 200;

      return response.status(migratedMigrationsStatus).json(migratedMigrations);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
