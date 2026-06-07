#!/usr/bin/env node

import { stdin, stdout } from "node:process";
import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateProfile, renderPassportMarkdown } from "../sdk/index.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = resolve(repoRoot, "skills/pharos-agent-credit-passport/SKILL.md");

let buffer = Buffer.alloc(0);
let responseFraming = "line";

const tools = [
  {
    name: "credit_score_agent",
    description: "Get the FICO-like Credit Score, Trust Grade, Risk Category, and Recommended Exposure Limit for an agent profile.",
    inputSchema: {
      type: "object",
      properties: {
        txSuccessRate: { type: "number", description: "Successful transaction percentage (0 to 100)" },
        completedTasks: { type: "number", description: "Number of successfully finished agent tasks" },
        solventAssetUsd: { type: "number", description: "Asset balance reserves in USD equivalent" },
        governanceRate: { type: "number", description: "Governance / DAO participation rate (0 to 100)" },
        walletAgeDays: { type: "number", description: "Wallet age on-chain in days" },
        unresolvedDisputes: { type: "number", description: "Count of unresolved dispute incidents" },
        hasLiquidationHistory: { type: "boolean", description: "True if subject has liquidation flags" }
      },
      required: ["txSuccessRate", "completedTasks", "solventAssetUsd"]
    }
  },
  {
    name: "generate_credit_passport",
    description: "Perform a complete credit audit and generate the full Markdown Credit Passport including strengths, risks, and evidence logs.",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Subject address to audit" },
        txSuccessRate: { type: "number", description: "Successful transaction percentage" },
        completedTasks: { type: "number", description: "Number of finished tasks" },
        solventAssetUsd: { type: "number", description: "USD balance reserves" },
        governanceRate: { type: "number", description: "Governance participation percentage" },
        walletAgeDays: { type: "number", description: "Address age in days" },
        unresolvedDisputes: { type: "number", description: "Count of dispute alerts" },
        hasLiquidationHistory: { type: "boolean", description: "Staking liquidation flag" }
      },
      required: ["address", "txSuccessRate", "completedTasks", "solventAssetUsd"]
    }
  }
];

function respond(id, result) {
  writeJson({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  writeJson({ jsonrpc: "2.0", id, error: { code, message } });
}

function writeJson(payload) {
  const json = JSON.stringify(payload);
  if (responseFraming === "header") {
    stdout.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
  } else {
    stdout.write(`${json}\n`);
  }
}

function textContent(value) {
  return {
    content: [
      {
        type: "text",
        text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

async function handle(message) {
  const { id, method, params = {} } = message;

  if (method === "initialize") {
    respond(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: "pharos-agent-credit-passport", version: "0.1.0" },
    });
    return;
  }

  if (method === "notifications/initialized") return;

  if (method === "tools/list") {
    respond(id, { tools });
    return;
  }

  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments || {};
    
    if (name === "credit_score_agent") {
      const evaluation = evaluateProfile(args);
      respond(id, textContent({
        address: evaluation.address,
        score: evaluation.score,
        grade: evaluation.grade,
        riskLevel: evaluation.riskLevel,
        exposureLimit: evaluation.exposureLimit
      }));
      return;
    }
    
    if (name === "generate_credit_passport") {
      const evaluation = evaluateProfile(args);
      const markdown = renderPassportMarkdown(evaluation);
      respond(id, textContent({
        receiptId: evaluation.receiptId,
        timestamp: evaluation.timestamp,
        markdownReport: markdown,
        evaluationData: evaluation
      }));
      return;
    }
    
    fail(id, -32602, `Unknown tool: ${name}`);
    return;
  }

  if (method === "resources/list") {
    respond(id, {
      resources: [
        {
          uri: "pharos-passport://skill",
          name: "Pharos Agent Credit Passport Skill Instructions",
          mimeType: "text/markdown",
          description: "Instructions for the Pharos Agent Center Skill.",
        },
      ],
    });
    return;
  }

  if (method === "resources/read") {
    if (params.uri !== "pharos-passport://skill") {
      fail(id, -32602, `Unknown resource: ${params.uri}`);
      return;
    }
    const text = fs.readFileSync(skillPath, "utf8");
    respond(id, {
      contents: [
        {
          uri: params.uri,
          mimeType: "text/markdown",
          text,
        },
      ],
    });
    return;
  }

  fail(id, -32601, `Unsupported method: ${method}`);
}

stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);
  parseBuffer();
});

function parseBuffer() {
  while (buffer.length > 0) {
    const text = buffer.toString("utf8");
    if (text.startsWith("Content-Length:")) {
      const headerEnd = text.indexOf("\r\n\r\n");
      if (headerEnd === -1) return;

      const header = text.slice(0, headerEnd);
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) {
        fail(null, -32700, "Missing Content-Length header.");
        buffer = Buffer.alloc(0);
        return;
      }

      const contentLength = Number(match[1]);
      const bodyStart = Buffer.byteLength(text.slice(0, headerEnd + 4), "utf8");
      if (buffer.length < bodyStart + contentLength) return;

      responseFraming = "header";
      const body = buffer.subarray(bodyStart, bodyStart + contentLength).toString("utf8");
      buffer = buffer.subarray(bodyStart + contentLength);
      dispatchJson(body);
      continue;
    }

    const newlineIndex = text.search(/\r?\n/);
    if (newlineIndex === -1) return;

    const line = text.slice(0, newlineIndex).trim();
    const newlineLength = text[newlineIndex] === "\r" && text[newlineIndex + 1] === "\n" ? 2 : 1;
    const consumed = Buffer.byteLength(text.slice(0, newlineIndex + newlineLength), "utf8");
    buffer = buffer.subarray(consumed);
    if (line) {
      responseFraming = "line";
      dispatchJson(line);
    }
  }
}

function dispatchJson(json) {
  try {
    const parsed = JSON.parse(json);
    const result = handle(parsed);
    if (result?.catch) result.catch((error) => fail(parsed.id ?? null, -32000, error.message));
  } catch (error) {
    fail(null, -32700, error.message);
  }
}
