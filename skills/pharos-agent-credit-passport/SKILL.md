---
name: pharos-agent-credit-passport
description: Portable credit and reputation Skill for AI agents, wallets, DAOs, and RealFi participants on Pharos. Use when evaluating the trustworthiness, reliability, or transaction limits of an address before sending funds, escrowing assets, or delegating operations.
---

# Pharos Agent Credit Passport

Generate a portable credit, trust, and reputation profile for wallets, AI agents, DAOs, or counterparties on the Pharos network.

The Skill acts like a lightweight credit bureau for the agent economy. It gathers on-chain behavioral signals (such as wallet history, transaction success/failure ratios, governance votes, active disputes, and RealFi repayments) and converts them into a standardized Credit Passport. 

Use this Skill to ensure safety and set exposure limits before delegating capital, authorizing transactions, executing swaps, or entering multi-step escrow allocations.

## Core Principle

Agents need trust before they can manage capital. Pharos Agent Credit Passport provides a portable, evidence-backed trust layer.

## Audit Workflow

1. **Resolve Subject:** Extract the wallet or agent address from the user request or agent context.
2. **Harvest Signals:** Retrieve historical ledger logs, task completion metrics, and dispute registries.
3. **Run Credit Committee Debate:** Generate evaluations from the six bureau roles outlined in `references/agent-prompts.md`.
4. **Score Signals:** Calculate score parameters (0–1000) using the rubric in `references/scoring-rubric.md` or via the SDK.
5. **Enforce Policy:** Apply exposure limits and check for critical risk flags outlined in `references/policy-rules.md`.
6. **Produce Passport Output:** Package results into a structured human-readable markdown summary and export a programmatic JSON schema.

## Credit Bureau Committee Roles

- **Solvency Auditor:** Evaluates reserve values (USDC/PHAROS equivalents) and RWA repayments.
- **Technical Inspector:** Stress tests contract executions and transaction success ratios.
- **Reputation Keeper:** Audits completed tasks and governance/DAO participation.
- **Dispute Arbitrator:** Reviews unresolved dispute registries and refund histories.
- **Sybil Sentinel:** Measures address age and network creation history to catch spam scripts.
- **Exposure Controller:** Enforces final policy gates and recommends capital allocation exposure limits.

## Inputs

Required:
- `subjectAddress`: The Pharos wallet or agent address (0x...) to audit.

Optional:
- `intentAmountUsd`: The size of the planned transaction or capital delegation (used to verify if it exceeds the recommended exposure limit).
- `intentType`: The action planned (e.g. `escrow`, `transfer`, `realfi_stake`).

## Output Format

Return the Credit Passport result in this exact order:

1. **Passport Header:** Subject address, Receipt ID, and Timestamp.
2. **Trust Summary:**
   - Credit Score: (e.g., 742/1000)
   - Trust Grade: (e.g., B+)
   - Agent Reliability: (e.g., 81%)
   - Recommended Exposure Limit: (e.g., 250 USDC)
   - Risk Level: (Low, Medium, High, or Critical)
3. **Actionable Advice:** Direct advice regarding the planned intent (e.g., *"Proceed, but require milestone holds"*).
4. **Strengths:** 3-5 positive bullet points of on-chain credentials.
5. **Risk Observations:** 1-3 warning points indicating potential vulnerability.
6. **Credit Committee Debate:** One concise paragraph summarizing the evaluation of each auditor (Solvency, Technical, Reputation, Dispute, Sybil, Exposure).
7. **Harvester Evidence Log:** A clear table listing signals evaluated, observed values, and status.
8. **Portable Schema:** Code block containing the programmatic JSON receipt.

## SDK and MCP Integration

If the host environment supports Node.js, execute the audit via terminal:
```bash
node sdk/cli.js score demos/verified-agent.json
```

Expose the tools to external frameworks via stdio Model Context Protocol (MCP) server:
```bash
node mcp/server.js
```
