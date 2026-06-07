# Demo Guide & Video Script

Use this guideline to record a short demo video of the Pharos Agent Credit Passport skill.

## 1. Introduction (The Concept)
Explain what the project is:
> "Pharos Agent Credit Passport is a portable credit scoring and trust profile system for AI agents, wallets, and DAOs on the Pharos Network. It audits on-chain data to compute a FICO-style credit score so that other agents and users know if they can safely delegate capital to them."

## 2. Walkthrough the Repository
Point out the modular design of the project:
* `skills/pharos-agent-credit-passport/SKILL.md`: The markdown skill instructions loaded by the Pharos Skill Engine.
* `sdk/`: The core JavaScript scoring library and terminal CLI.
* `mcp/`: The stdio Model Context Protocol (MCP) server enabling integrations.
* `demos/`: Preset agent profiles representing Verified, Warning, and Rogue states.
* `index.html` / `style.css` / `app.js`: A premium web-based dashboard verifying these scores visually.

## 3. Run the CLI Demos in Terminal
Show the command line execution:
* Run tests to prove calculations:
  ```bash
  npm test
  ```
* Run a verified agent audit:
  ```bash
  npm run demo:verified
  ```
* Run a high-risk rogue bot audit (showing the F grade and blocked recommendation):
  ```bash
  npm run demo:rogue
  ```

## 4. Showcase the Visual Dashboard UI
* Launch the local server:
  ```bash
  python -m http.server 8000
  ```
* Open `http://localhost:8000` in the browser.
* Click through the presets (Verified, Warning, Rogue) to show:
  * The animated CLI harvester collecting logs.
  * The glowing radial score progress gauge.
  * The detailed strengths/risks lists and evidence tables.
  * The Actionable Advice banner changing colors.
  * The raw JSON receipt schema export modal.

## 5. Close
Summarize the fit for the campaign:
> "This provides a fundamental credit reputation layer for the Pharos agent economy, functional today through a Skill definition, JavaScript SDK, MCP tools, and a premium dashboard."
