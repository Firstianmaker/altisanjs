import "dotenv/config";
import { execFileSync } from "node:child_process";
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith("_test")) throw new Error("TEST_DATABASE_URL must point to a separate database ending in _test.");
execFileSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
