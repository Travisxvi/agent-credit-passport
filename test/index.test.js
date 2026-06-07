// Pharos Agent Credit Passport - SDK Unit Tests

import fs from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreAgent, evaluateProfile } from "../sdk/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Assertion Failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function runTests() {
  console.log("Starting SDK Unit Tests...");

  // 1. Load Demos
  const verified = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/verified-agent.json"), "utf8"));
  const warning = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/warning-agent.json"), "utf8"));
  const rogue = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/rogue-agent.json"), "utf8"));

  // 2. Test scoreAgent Calculations
  const scoreV = scoreAgent(verified);
  const scoreW = scoreAgent(warning);
  const scoreR = scoreAgent(rogue);

  console.log(`Verified Agent Calculated Score: ${scoreV}`);
  console.log(`Warning Agent Calculated Score: ${scoreW}`);
  console.log(`Rogue Agent Calculated Score: ${scoreR}`);

  assertEqual(scoreV, 896, "Verified Agent Score calculation");
  assertEqual(scoreW, 564, "Warning Agent Score calculation");
  assertEqual(scoreR, 300, "Rogue Agent Score calculation");

  // 3. Test evaluateProfile logic
  const evalV = evaluateProfile(verified);
  assertEqual(evalV.grade, "A+", "Verified Agent Trust Grade");
  assertEqual(evalV.riskLevel, "Low", "Verified Agent Risk Level");
  assertEqual(evalV.exposureLimit, "1,500 USDC", "Verified Agent Exposure Limit");

  const evalW = evaluateProfile(warning);
  assertEqual(evalW.grade, "C-", "Warning Agent Trust Grade");
  assertEqual(evalW.riskLevel, "Medium-High", "Warning Agent Risk Level");
  assertEqual(evalW.exposureLimit, "100 USDC", "Warning Agent Exposure Limit");

  const evalR = evaluateProfile(rogue);
  assertEqual(evalR.grade, "F", "Rogue Agent Trust Grade");
  assertEqual(evalR.riskLevel, "Critical", "Rogue Agent Risk Level");
  assertEqual(evalR.exposureLimit, "0 USDC", "Rogue Agent Exposure Limit");

  console.log("\nAll assertions passed successfully! ✅");
}

try {
  runTests();
  process.exit(0);
} catch (error) {
  console.error("\nTest execution failed: ❌\n", error.message);
  process.exit(1);
}
