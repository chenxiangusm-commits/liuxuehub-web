import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = resolve(__dirname, "..");
const repoRoot = resolve(webRoot, "..");

const target = join(webRoot, "src", "data", "master_database.json");
const appSource = join(repoRoot, "database", "app");
const appTarget = join(webRoot, "src", "data", "database");

if (!existsSync(appSource)) {
  throw new Error(`Split app database not found: ${appSource}`);
}

mkdirSync(dirname(target), { recursive: true });
rmSync(target, { force: true });

rmSync(appTarget, { recursive: true, force: true });
cpSync(appSource, appTarget, { recursive: true });

if (existsSync(appTarget)) {
  const schoolsSize = (statSync(join(appTarget, "schools.json")).size / 1024).toFixed(1);
  const indexSize = (statSync(join(appTarget, "programs_index.json")).size / 1024 / 1024).toFixed(2);
  const filterIndexSize = (statSync(join(appTarget, "program_filter_indexes.json")).size / 1024 / 1024).toFixed(2);
  console.log(`Synced split app database to ${appTarget}`);
  console.log(`Runtime indexes: schools=${schoolsSize} KB, programs_index=${indexSize} MB, program_filter_indexes=${filterIndexSize} MB`);
}
