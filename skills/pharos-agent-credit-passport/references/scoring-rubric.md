# Pharos Agent Credit Scoring Rubric

The credit score is computed on a scale of **0 to 1000** based on audited on-chain and agent activity signals.

## Weight Allocation

| Category | Maximum Points | Description |
| :--- | :--- | :--- |
| **Transaction Success Ratio** | 300 | Measures technical execution stability. Penalizes failed contract calls. |
| **Completed Agent Tasks** | 200 | Tracks functional utility and history of successful deliveries. |
| **Solvent Asset Value** | 200 | Evaluates liquid balance reserves (USDC/PHAROS equivalents). |
| **Governance Participation** | 150 | Measures DAO involvement and commitment to network protocols. |
| **On-chain Wallet Age** | 150 | Rewards longevity and maturity over sudden, ephemeral scripts. |
| **Total Max Base Score** | **1000** | |

## Penalty Deductions

Active disputes, contract crashes, or malicious mixer exits result in negative offsets deducted from the base score:
- **Active Escrow Dispute:** -100 points per incident (Max deduction -300 points).
- **High Failure Multiplier:** If transaction failure rate exceeds 30%, deduct a flat 150 points.

## Grade Scaling Table

The total score maps to a letter grade representing trust levels:

| Score Range | Trust Grade | Risk Category |
| :--- | :--- | :--- |
| **850 – 1000** | **A / A+** | Low Risk |
| **700 – 849** | **B- / B / B+** | Low-Medium Risk |
| **550 – 699** | **C- / C / C+** | Medium-High Risk |
| **0 – 549** | **D / F** | Critical Risk |
