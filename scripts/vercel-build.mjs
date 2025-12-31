import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function run(bin, args) {
  const result = spawnSync(bin, args, {
    stdio: "inherit",
    env: process.env,
  });

  return result.status ?? 1;
}

function listMigrationDirs(migrationsDir) {
  if (!fs.existsSync(migrationsDir)) return [];
  const entries = fs.readdirSync(migrationsDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

function migrationsAreComplete(migrationsDir) {
  const dirs = listMigrationDirs(migrationsDir);
  if (dirs.length === 0) return { hasAny: false, complete: true, missing: [] };

  const missing = [];
  for (const dir of dirs) {
    const migrationSql = path.join(migrationsDir, dir, "migration.sql");
    if (!fs.existsSync(migrationSql)) missing.push(path.join("prisma", "migrations", dir, "migration.sql"));
  }

  return { hasAny: true, complete: missing.length === 0, missing };
}

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
const status = migrationsAreComplete(migrationsDir);

let prismaExit = 0;
if (status.hasAny && status.complete) {
  prismaExit = run("prisma", ["migrate", "deploy"]);
  if (prismaExit !== 0) {
    prismaExit = run("prisma", ["db", "push", "--accept-data-loss"]);
  }
} else {
  // Avoid Prisma P3015 noise when a migration directory is present but incomplete.
  if (status.missing.length > 0) {
    console.warn("Prisma migrations are incomplete. Missing files:");
    for (const p of status.missing) console.warn(`- ${p}`);
    console.warn("Falling back to `prisma db push --accept-data-loss`.\n");
  }
  prismaExit = run("prisma", ["db", "push", "--accept-data-loss"]);
}

if (prismaExit !== 0) process.exit(prismaExit);

const nextExit = run("next", ["build"]);
process.exit(nextExit);
