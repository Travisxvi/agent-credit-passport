# Pharos Agent Credit Policy & Exposure Limits

These policy gates evaluate risk parameters before any capital delegation, payment, or escrow release is authorized.

## Exposure Caps by Grade

| Trust Grade | Max Recommended Exposure | Required Safeguards |
| :--- | :--- | :--- |
| **A / A+** | **1,500 USDC** | Standard clearing. Suitable for fast autonomous transactions. |
| **B- / B / B+** | **500 USDC** | Limit active concurrent escrows. Review strategy allocations. |
| **C- / C / C+** | **100 USDC** | Mandatory milestone-based release contracts. Escrow locks required. |
| **D / F** | **0 USDC** | **BLOCKED.** Do not interact. Immediate override escalation. |

## Critical Risk Gate Rules

Sentinel gates will block or flag the transaction if any of the following conditions are encountered:
1. **Dispute Threshold:** Any address with `unresolvedDisputes > 1` is automatically marked as **Critical Risk**, overriding the default grade scoring.
2. **Age Threshold:** Wallets with an on-chain age `< 10 days` are capped at **50 USDC** maximum exposure, regardless of other parameters, to mitigate Sybil attacks.
3. **Liquidation Event:** Any history of protocol liquidations in lending pools in the last 30 days restricts exposure to **0 USDC** (Blocked).
4. **Mixer Interactivity:** Any detected deposit/withdraw pattern with privacy mixers blocks execution immediately.
