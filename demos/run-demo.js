#!/usr/bin/env node

import fs from "node:fs";
import { resolve } from "node:path";
import { evaluateProfile, renderPassportMarkdown } from "../sdk/index.js";

const args = process.argv.slice(2);
const filePath = args[0] || "demos/verified-agent.json";

try {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found at ${absolutePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, "utf8");
  const profile = JSON.parse(rawData);

  const evaluation = evaluateProfile(profile);
  console.log(renderPassportMarkdown(evaluation));
} catch (error) {
  console.error("Error running demo:", error.message);
  process.exit(1);
}
