// Unit test suite for Pharos Agent Credit Passport SDK

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

  // Load Demos
  const verified = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/verified-agent.json"), "utf8"));
  const warning = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/warning-agent.json"), "utf8"));
  const rogue = JSON.parse(fs.readFileSync(resolve(__dirname, "../demos/rogue-agent.json"), "utf8"));

  // Check scoreAgent
  const scoreV = scoreAgent(verified);
  const scoreW = scoreAgent(warning);
  const scoreR = scoreAgent(rogue);

  assertEqual(scoreV, 896, "Verified score calculation");
  assertEqual(scoreW, 564, "Warning score calculation");
  assertEqual(scoreR, 300, "Rogue score calculation");

  // Check evaluateProfile
  const evalV = evaluateProfile(verified);
  assertEqual(evalV.grade, "A+", "Verified trust grade");
  assertEqual(evalV.riskLevel, "Low", "Verified risk assessment");
  assertEqual(evalV.exposureLimit, "1,500 USDC", "Verified exposure limit");

  const evalW = evaluateProfile(warning);
  assertEqual(evalW.grade, "C-", "Warning trust grade");
  assertEqual(evalW.riskLevel, "Medium-High", "Warning risk assessment");
  assertEqual(evalW.exposureLimit, "100 USDC", "Warning exposure limit");

  const evalR = evaluateProfile(rogue);
  assertEqual(evalR.grade, "F", "Rogue trust grade");
  assertEqual(evalR.riskLevel, "Critical", "Rogue risk assessment");
  assertEqual(evalR.exposureLimit, "0 USDC", "Rogue exposure limit");

  console.log("SDK tests passed successfully! ✅");
}

try {
  runTests();
  process.exit(0);
} catch (error) {
  console.error("Test execution failed: ❌\n", error.message);
  process.exit(1);
}
