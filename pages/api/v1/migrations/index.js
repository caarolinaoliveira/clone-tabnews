import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const alloweMethods = ["GET", "POST"];
  if (!alloweMethods.includes(request.method)) {
    return response.status(405);
  }
  let dbClient;
  try {
    dbClient = await database.getNewCliente();
    const defaultMigrationOption = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOption);
      await dbClient.end();

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOption,
        dryRun: false,
      });
      await dbClient.end();

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
