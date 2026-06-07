import assert from "node:assert/strict";
import { spawn } from "node:child_process";

function frame(message) {
  const json = JSON.stringify(message);
  return `Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`;
}

function parseFrames(text) {
  const results = [];
  let rest = text;
  while (rest.includes("\r\n\r\n")) {
    const headerEnd = rest.indexOf("\r\n\r\n");
    const header = rest.slice(0, headerEnd);
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) break;
    const length = Number(match[1]);
    const bodyStart = headerEnd + 4;
    const body = rest.slice(bodyStart, bodyStart + length);
    if (body.length < length) break;
    results.push(JSON.parse(body));
    rest = rest.slice(bodyStart + length);
  }
  return results;
}

console.log("Starting MCP Smoke Tests...");

const child = spawn(process.execPath, ["mcp/server.js"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let stdout = "";
let stderr = "";
child.stdout.on("data", (chunk) => {
  stdout += chunk.toString("utf8");
});
child.stderr.on("data", (chunk) => {
  stderr += chunk.toString("utf8");
});

// Write initialize request
child.stdin.write(
  frame({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  })
);

// Write tools call request
child.stdin.write(
  frame({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "credit_score_agent",
      arguments: {
        txSuccessRate: 98.4,
        completedTasks: 42,
        solventAssetUsd: 12450,
        governanceRate: 94.0,
        walletAgeDays: 184,
        unresolvedDisputes: 0,
        hasLiquidationHistory: false
      },
    },
  })
);

// Write resource read request
child.stdin.write(
  frame({
    jsonrpc: "2.0",
    id: 3,
    method: "resources/read",
    params: {
      uri: "pharos-passport://skill",
    },
  })
);

child.stdin.end();

await new Promise((resolve) => child.on("close", resolve));

assert.equal(stderr, "");
const messages = parseFrames(stdout);
assert.equal(messages.length, 3);
assert.equal(messages[0].result.serverInfo.name, "pharos-agent-credit-passport");
assert.match(messages[1].result.content[0].text, /"score": 896/);
assert.match(messages[2].result.contents[0].text, /name: pharos-agent-credit-passport/);

console.log("MCP smoke test passed successfully! ✅");
process.exit(0);
