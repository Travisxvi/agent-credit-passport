# Pharos Skill Builder Campaign Submission

Skill name:
`pharos-agent-credit-passport`

Short description:
Pharos Agent Credit Passport is a portable credit and reputation Skill for AI agents, wallets, DAOs, and RealFi participants on Pharos. It analyzes structured on-chain and agent activity signals (wallet activity, transaction success/failure ratios, completed tasks, governance participation, and unresolved disputes) to generate a reusable trust profile containing a FICO-style credit score, trust grade, risk flags, recommended exposure limits, and an evidence-backed report. Other Skills, smart contracts, or DAOs can query this passport programmatically before lending, delegating, paying, or collaborating.

Campaign category fit:
- Primary category: Onchain analytics Skill & Wallet risk summary.
- Also relevant to RealFi product interaction Skill, agent onboarding Skill, and DAO delegation helpers.

Functional proof:
The repository includes a working JavaScript SDK, terminal CLI command runner, runnable presets/demos, a stdio MCP server, and a beautiful premium web dashboard UI (glassmorphism/radial gauge) that connects to the same scoring algorithms. `npm test` runs local unit verification on calculations.

GitHub link:
https://github.com/Travisxvi/agent-credit-passport

Email address:
[Add your email address before posting]

Demo link, video, or screenshots:
[Add your demo video or screenshots link before posting]

The repo includes runnable demos:
```bash
npm run demo:verified
npm run demo:warning
npm run demo:rogue
```

Instructions:
1. Clone the repository: `git clone https://github.com/Travisxvi/agent-credit-passport.git`
2. Run `npm test` to verify score calculations and grade evaluations.
3. Run `npm run demo:verified` to see a high-score verified agent audit.
4. Run `npm run demo:warning` to see a mid-risk agent evaluation.
5. Run `npm run demo:rogue` to see a critical risk rogue bot block.
6. Install the Skill by copying `skills/pharos-agent-credit-passport` into your Pharos Skill Engine skills directory.
7. For MCP clients (such as Claude Code or Codex), execute `npm run mcp` or integrate with standard MCP configs.
8. To run the visual dashboard interface locally:
   - Start local hosting: `python -m http.server 8000`
   - Open browser at `http://localhost:8000`

Supported frameworks:
Pharos Skill Engine, Claude Code, Codex/OpenAI-compatible Skills, JavaScript SDK integrations, and stdio MCP clients.

Additional notes/dependencies:
Node.js 18+ recommended. Core SDK, CLI, and MCP server are dependency-free for minimal footprint. Static frontend uses Lucide icons from CDN.
