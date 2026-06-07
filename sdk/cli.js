#!/usr/bin/env node

import fs from "node:fs";
import { resolve } from "node:path";
import { evaluateProfile, renderPassportMarkdown } from "./index.js";

const args = process.argv.slice(2);
const command = args[0];
const filePath = args[1];

if (command !== "score" || !filePath) {
  console.log("Usage: node sdk/cli.js score <path_to_json_profile>");
  console.log("Example: node sdk/cli.js score demos/verified-agent.json");
  process.exit(1);
}

try {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found at ${absolutePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, "utf8");
  const profile = JSON.parse(rawData);

  console.log(`\nAnalyzing Agent Signals...\n`);
  const passport = evaluateProfile(profile);
  const markdownReport = renderPassportMarkdown(passport);

  console.log(markdownReport);
  console.log(`\nAnalysis Completed Successfully.\n`);
} catch (error) {
  console.error(`Error running audit CLI:`, error.message);
  process.exit(1);
}
