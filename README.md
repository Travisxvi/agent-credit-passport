# Pharos Agent Credit Passport

> **Portable credit and trust profiles for the AI agent economy on the Pharos network.**
> Created for the Pharos Agent Center Skill Builder Campaign.

---

## 💡 Overview

As autonomous AI agents, DAOs, and RealFi participants expand their presence on the blockchain, the need to interact, delegate capital, and collaborate increases. However, **before you can delegate funds or trust to an AI counterparty, you need a mechanism to verify their reliability.**

**Pharos Agent Credit Passport** is a portable credit scoring and trust profile system. It acts like a decentralized credit bureau for AI agents, analyzing historical on-chain and agent activity signals to generate a reusable trust profile containing a FICO-style credit score, trust grade, risk flags, and exposure limits.

## 🚀 Key Features

* **Visual Trust Dashboard:** A beautiful, responsive glassmorphic dark-mode interface presenting the agent's reputation analytics.
* **Typing Log Harvester (Terminal CLI):** Animates the raw "under-the-hood" connection to Pharos RPC nodes, simulating the signal aggregation process in real-time.
* **Credit Score Radial Gauge:** Satisfying dynamic visualization of the agent's trust ranking (out of 1000).
* **Observed Evidence Ledger:** Details audited signals including transaction success ratios, wallet age, completed tasks, and dispute histories.
* **Actionable Exposure Limits:** Recommends exact capital caps (e.g., maximum USDC allocations) based on computed risk factors.
* **Portable JSON Schema Export:** Generates standard machine-readable JSON credential payloads. Other Pharos skills or smart contracts can query these credentials programmatically to automate trust decisions.

---

## 🔍 How it Works

The Passport evaluates the following inputs to generate the Credit Score:
* **Wallet History:** General transaction activity and volume.
* **Execution Ratio:** Technical success vs. failure rates of executed smart contracts.
* **Task Completion:** Count of verified job completions recorded in the Agent Center.
* **Escrow Disputes:** Unresolved claims, defaults, or chargebacks.
* **DAO Participation:** Voting patterns and governance contribution frequency.
* **Solvent Balance (Asset Value):** Liquid native and stablecoin assets held to verify gas solvency.

---

## 🛠️ Repository Structure

* `index.html`: Main interface and modal container structures.
* `style.css`: Custom CSS variables, background drift animations, glassmorphic card classes, and progress rings.
* `app.js`: Houses mock profile datasets (`0xAgentAlpha`, `0xDAO_Oracle`, `0xRogueBot`), query parsers, typewriter console logic, and DOM renders.

---

## 💻 Local Quick Start

Since this app is built purely with modern Vanilla HTML, CSS, and JavaScript, you can run it locally without any package managers (`npm`/`yarn`) or compilers.

### Prerequisites
Make sure you have **Python 3** installed on your system.

### Running the App
1. Clone this repository:
   ```bash
   git clone https://github.com/Travisxvi/agent-credit-passport.git
   cd agent-credit-passport
   ```
2. Start the local server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to: **`http://localhost:8000`**

---

## 📄 JSON Schema Integration Sample

Other AI agents or DeFi smart contracts can ingest the generated passport schema. Below is a sample payload outputted by the trust engine:

```json
{
  "@context": "https://schema.pharos.xyz/credit-passport/v1",
  "type": "AgentCreditPassport",
  "receiptId": "PRP-10492-874",
  "timestamp": "2026-06-04T18:22:00Z",
  "subject": {
    "address": "0xAgentAlpha7c93fa8892ea0183b2ffbc9d173c249a",
    "solvencyAge": "184 Days"
  },
  "scoreSummary": {
    "creditScore": 874,
    "trustGrade": "A",
    "exposureCap": "1,500 USDC",
    "reliabilityRating": "96%",
    "riskProfile": "Low"
  }
}
```

---

## 🏆 Campaign Submission Details

* **Skill Name:** Pharos Agent Credit Passport
* **Supported Frameworks:** Claude Code, OpenClaw, Codex, custom node environments
* **Target Category:** Onchain reputation aggregator, wallet risk summary, RealFi trust oracle
