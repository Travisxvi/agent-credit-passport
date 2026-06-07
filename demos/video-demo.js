#!/usr/bin/env node

import fs from "node:fs";
import { evaluateProfile, renderPassportMarkdown } from "../sdk/index.js";

const verified = JSON.parse(fs.readFileSync("demos/verified-agent.json", "utf8"));
const rogue = JSON.parse(fs.readFileSync("demos/rogue-agent.json", "utf8"));

console.log("============================================================");
console.log("PHAROS AGENT CREDIT PASSPORT - HACKATHON VIDEO FLOW");
console.log("============================================================");
console.log("");
console.log("Demo 1: High-reputation Verified Agent Credit Check");
console.log("Auditing 0xAgentAlpha...");
console.log("");
console.log(renderPassportMarkdown(evaluateProfile(verified)));
console.log("");
console.log("============================================================");
console.log("");
console.log("Demo 2: Critical-risk Rogue Bot Audit & Block");
console.log("Auditing 0xRogueBot...");
console.log("");
console.log(renderPassportMarkdown(evaluateProfile(rogue)));
console.log("");
console.log("============================================================");
console.log("Demo complete: Portable Trust Bureau profiles active.");
console.log("============================================================");
