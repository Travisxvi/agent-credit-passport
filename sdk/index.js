// Pharos Agent Credit Passport SDK Scoring Logic

const WEIGHTS = {
  txSuccess: 300,
  tasks: 200,
  solvency: 200,
  governance: 150,
  age: 150,
};

export function scoreAgent(profile = {}) {
  // Extract inputs with default fallbacks
  const txSuccessRate = Number(profile.txSuccessRate ?? 100);
  const completedTasks = Number(profile.completedTasks ?? 0);
  const solventAssetUsd = Number(profile.solventAssetUsd ?? 0);
  const governanceRate = Number(profile.governanceRate ?? 0);
  const walletAgeDays = Number(profile.walletAgeDays ?? 0);
  const unresolvedDisputes = Number(profile.unresolvedDisputes ?? 0);
  const hasLiquidationHistory = !!profile.hasLiquidationHistory;

  // 1. Transaction Success Ratio Points (Max 300)
  const txPoints = (txSuccessRate / 100) * WEIGHTS.txSuccess;

  // 2. Completed Agent Tasks (Max 200) - cap at 50 tasks for max points
  const taskPoints = Math.min(WEIGHTS.tasks, completedTasks * 4);

  // 3. Solvent Asset Value Points (Max 200) - cap at 1,000 USD equivalent for max points
  const solvencyPoints = Math.min(WEIGHTS.solvency, (solventAssetUsd / 1000) * WEIGHTS.solvency);

  // 4. Governance Participation (Max 150)
  const govPoints = (governanceRate / 100) * WEIGHTS.governance;

  // 5. On-chain Wallet Age (Max 150) - cap at 300 days for max points
  const agePoints = Math.min(WEIGHTS.age, (walletAgeDays / 300) * WEIGHTS.age);

  // Calculate Base Score
  let baseScore = txPoints + taskPoints + solvencyPoints + govPoints + agePoints;

  // Apply Penalties
  let penalties = 0;
  penalties += unresolvedDisputes * 100; // -100 points per dispute
  if (txSuccessRate < 70) {
    penalties += 150; // High failure multiplier penalty
  }
  if (hasLiquidationHistory) {
    penalties += 150; // Staking liquidation penalty
  }

  // Final Score (bounded between 300 and 1000)
  const score = Math.max(300, Math.min(1000, Math.round(baseScore - penalties)));
  return score;
}

export function evaluateProfile(profile = {}) {
  const score = scoreAgent(profile);
  
  // Calculate Grade
  let grade = "F";
  let riskLevel = "Critical";
  let exposureLimit = "0 USDC";
  
  if (score >= 900) {
    grade = "A+"; riskLevel = "Low"; exposureLimit = "1,500 USDC";
  } else if (score >= 850) {
    grade = "A"; riskLevel = "Low"; exposureLimit = "1,500 USDC";
  } else if (score >= 800) {
    grade = "B+"; riskLevel = "Low-Medium"; exposureLimit = "500 USDC";
  } else if (score >= 750) {
    grade = "B"; riskLevel = "Low-Medium"; exposureLimit = "500 USDC";
  } else if (score >= 700) {
    grade = "B-"; riskLevel = "Low-Medium"; exposureLimit = "500 USDC";
  } else if (score >= 650) {
    grade = "C+"; riskLevel = "Medium"; exposureLimit = "250 USDC";
  } else if (score >= 600) {
    grade = "C"; riskLevel = "Medium"; exposureLimit = "250 USDC";
  } else if (score >= 550) {
    grade = "C-"; riskLevel = "Medium-High"; exposureLimit = "100 USDC";
  } else if (score >= 450) {
    grade = "D"; riskLevel = "High"; exposureLimit = "50 USDC";
  }

  // Force critical state overrides
  const unresolvedDisputes = Number(profile.unresolvedDisputes ?? 0);
  const hasLiquidationHistory = !!profile.hasLiquidationHistory;
  const age = Number(profile.walletAgeDays ?? 0);

  let forcedCritical = false;
  if (unresolvedDisputes > 1 || hasLiquidationHistory) {
    grade = "F";
    riskLevel = "Critical";
    exposureLimit = "0 USDC";
    forcedCritical = true;
  } else if (age < 10 && exposureLimit !== "0 USDC") {
    // Sybil gate: young wallets capped
    exposureLimit = "50 USDC";
    riskLevel = "Medium";
  }

  // Build strengths vs risks lists
  const strengths = [];
  const risks = [];
  const evidence = [];

  // Populate dynamic elements
  if (profile.txSuccessRate >= 95) strengths.push(`Exceptional technical stability: ${profile.txSuccessRate}% success rate`);
  else if (profile.txSuccessRate < 75) risks.push(`Poor execution record: ${profile.txSuccessRate}% transactions failed`);

  if (profile.completedTasks >= 20) strengths.push(`Highly productive agent with ${profile.completedTasks} verified tasks`);
  else if (profile.completedTasks === 0) risks.push("New agent: zero verified task history");

  if (profile.solventAssetUsd >= 2000) strengths.push(`Strong asset backing: $${profile.solventAssetUsd.toLocaleString()} equivalent reserves`);
  else if (profile.solventAssetUsd < 100) risks.push(`Gas vulnerability: extremely low reserves ($${profile.solventAssetUsd})`);

  if (profile.governanceRate >= 80) strengths.push(`Active governance participator (${profile.governanceRate}%)`);
  if (unresolvedDisputes > 0) risks.push(`${unresolvedDisputes} unresolved escrow dispute reports`);
  if (hasLiquidationHistory) risks.push("History of staking liquidation flagged in lending pools");
  if (age >= 180) strengths.push(`Long-standing address age: ${age} days on-chain`);

  // Build recommendation text
  let recommendation = "";
  if (riskLevel === "Low") {
    recommendation = "Highly recommended for autonomous delegation and high-value transactions. Clear immediately without holds.";
  } else if (riskLevel === "Low-Medium") {
    recommendation = `Approved for moderate capital exposure up to ${exposureLimit}. Recommended to monitor active task limits.`;
  } else if (riskLevel === "Medium" || riskLevel === "Medium-High") {
    recommendation = `Proceed with caution. Cap individual exposure at ${exposureLimit} and mandate milestone-based locks.`;
  } else if (riskLevel === "High") {
    recommendation = `Restrict access. Capped at ${exposureLimit} max. Do not authorize concurrent actions.`;
  } else {
    recommendation = "BLOCKED. Risk metrics exceed allowed thresholds. Suspend all capital permissions immediately.";
  }

  // Format table evidence
  evidence.push({ signal: "Wallet Activity History", category: "Liquidity", value: `${profile.txCount || 0} Txns`, status: age > 30 ? "verified" : "warning" });
  evidence.push({ signal: "Tx Success/Failure Ratio", category: "Technical", value: `${profile.txSuccessRate}% Success`, status: profile.txSuccessRate >= 90 ? "verified" : (profile.txSuccessRate >= 70 ? "warning" : "critical") });
  evidence.push({ signal: "Completed Agent Tasks", category: "Reputation", value: `${profile.completedTasks} Completed`, status: profile.completedTasks > 5 ? "verified" : "warning" });
  evidence.push({ signal: "Dispute & Dispute Refunds", category: "Disputes", value: `${unresolvedDisputes} Incidents`, status: unresolvedDisputes === 0 ? "verified" : "critical" });
  evidence.push({ signal: "RealFi Staking/Repayment", category: "Solvency", value: hasLiquidationHistory ? "Liquidation Flagged" : "Repayments Clear", status: hasLiquidationHistory ? "critical" : "verified" });

  return {
    address: profile.address || "0xUnknown",
    score,
    grade,
    reliability: `${profile.txSuccessRate}%`,
    exposureLimit,
    riskLevel,
    age: `${age} Days`,
    recommendation,
    strengths,
    risks,
    evidence,
    receiptId: `PRP-${Math.floor(Math.random() * 89999 + 10000)}-${score}`,
    timestamp: new Date().toISOString(),
  };
}

export function renderPassportMarkdown(audit) {
  const statusEmoji = audit.riskLevel === "Low" ? "✅" : (audit.riskLevel === "Medium" ? "⚠️" : "❌");
  return [
    `# Pharos Agent Credit Passport`,
    `**Subject:** ${audit.address}`,
    `**Receipt ID:** ${audit.receiptId}`,
    `**Timestamp:** ${audit.timestamp}`,
    `---`,
    `## Trust Assessment Summary`,
    `- **Credit Score:** **${audit.score}/1000**`,
    `- **Trust Grade:** **${audit.grade}**`,
    `- **Risk Level:** **${audit.riskLevel.toUpperCase()}** ${statusEmoji}`,
    `- **Reliability Metric:** **${audit.reliability}**`,
    `- **Recommended Exposure Limit:** **${audit.exposureLimit}**`,
    `- **On-chain Wallet Age:** **${audit.age}**`,
    `---`,
    `## Actionable Advice`,
    `> ${audit.recommendation}`,
    `---`,
    `## Strengths`,
    ...audit.strengths.map(s => `- ${s}`),
    `---`,
    `## Risk Flags`,
    ...audit.risks.map(r => `- ${r}`),
    `---`,
    `## Evidence Log`,
    `| Signal Evaluated | Category | Value | Status |`,
    `| :--- | :--- | :--- | :--- |`,
    ...audit.evidence.map(e => `| ${e.signal} | ${e.category} | ${e.value} | ${e.status.toUpperCase()} |`),
  ].join("\n");
}
