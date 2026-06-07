import assert from "node:assert/strict";
import { spawn } from "node:child_process";

function frame(message) {
  const json = JSON.stringify(message);
  return `Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`;
}

function parseFrames(buf) {
  const results = [];
  let offset = 0;
  while (offset < buf.length) {
    const text = buf.subarray(offset).toString("utf8");
    const headerEnd = text.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;
    const header = text.slice(0, headerEnd);
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) break;
    const contentLength = Number(match[1]);
    const headerBytes = Buffer.byteLength(text.slice(0, headerEnd + 4), "utf8");
    const bodyStart = offset + headerBytes;
    if (bodyStart + contentLength > buf.length) break;
    const body = buf.subarray(bodyStart, bodyStart + contentLength).toString("utf8");
    results.push(JSON.parse(body));
    offset = bodyStart + contentLength;
  }
  return results;
}

console.log("Starting MCP Smoke Tests...");

const child = spawn(process.execPath, ["mcp/server.js"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let stdoutChunks = [];
let stderr = "";
child.stdout.on("data", (chunk) => {
  stdoutChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
});
child.stderr.on("data", (chunk) => {
  stderr += chunk.toString("utf8");
});

// Combine all requests into a single write to avoid pipe-level race conditions
child.stdin.write(
  frame({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  }) +
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
  }) +
  frame({
    jsonrpc: "2.0",
    id: 3,
    method: "resources/read",
    params: {
      uri: "pharos-passport://skill",
    },
  })
);

// Allow the server event loop to process all messages before closing stdin
await new Promise((r) => setTimeout(r, 200));
child.stdin.end();

await new Promise((resolve) => child.on("close", resolve));

assert.equal(stderr, "");
const stdoutBuf = Buffer.concat(stdoutChunks);
const messages = parseFrames(stdoutBuf);
assert.equal(messages.length, 3);
assert.equal(messages[0].result.serverInfo.name, "pharos-agent-credit-passport");
assert.match(messages[1].result.content[0].text, /"score": 896/);
assert.match(messages[2].result.contents[0].text, /name: pharos-agent-credit-passport/);

console.log("MCP smoke test passed successfully! ✅");
process.exit(0);
