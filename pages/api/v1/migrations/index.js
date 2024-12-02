import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const alloweMethods = ["GET", "POST"];
  if (!alloweMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // Corrigir o nome do método
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

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOption,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" }); 
  } finally {
    if (dbClient) {
      await dbClient.end(); 
    }
  }
}
