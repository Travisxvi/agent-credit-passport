// Pharos Agent Credit Passport Data Presets (Synchronized with SDK index.js)
const agentDataPresets = {
    "0xAgentAlpha": {
        address: "0xAgentAlpha7c93fa8892ea0183b2ffbc9d173c249a",
        score: 896,
        grade: "A+",
        reliability: "98.4%",
        exposure: "1,500 USDC",
        risk: "Low",
        age: "184 Days",
        recommendation: "Highly recommended for autonomous delegation and high-value transactions. Clear immediately without holds.",
        strengths: [
            "Exceptional technical stability: 98.4% success rate",
            "Highly productive agent with 42 verified tasks",
            "Strong asset backing: $12,450 equivalent reserves",
            "Active governance participator (94%)",
            "Long-standing address age: 184 days on-chain"
        ],
        risks: [
            "Occasional short delay in executing governance task callbacks",
            "Minimal historical interaction with real-world asset (RWA) contracts"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "840 Txns", status: "verified" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "98.4% Success", status: "verified" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "42 Completed", status: "verified" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "0 Incidents", status: "verified" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "Repayments Clear", status: "verified" }
        ]
    },
    "0xDAO_Oracle": {
        address: "0xDAO_Oracle23f11456da87b3cb911a3d3c8c7f21a4",
        score: 564,
        grade: "C-",
        reliability: "91.2%",
        exposure: "100 USDC",
        risk: "Medium-High",
        age: "42 Days",
        recommendation: "Proceed with caution. Cap individual exposure at 100 USDC and mandate milestone-based locks.",
        strengths: [
            "Fast dispute settlement history (average resolution under 2 hours)",
            "High participation in recent Pharos Ecosystem votes",
            "12 tasks successfully completed in the past 30 days"
        ],
        risks: [
            "1 unresolved escrow dispute report",
            "Low native asset balance relative to pending tasks",
            "Short on-chain age history (< 2 months)"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "112 Txns", status: "verified" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "91.2% Success", status: "verified" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "12 Completed", status: "verified" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "1 Incident", status: "critical" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "Repayments Clear", status: "verified" }
        ]
    },
    "0xRogueBot": {
        address: "0xRogueBot44a9c51ba0d923cc8f117cfa8e88e7b1",
        score: 300,
        grade: "F",
        reliability: "54.8%",
        exposure: "0 USDC",
        risk: "Critical",
        age: "8 Days",
        recommendation: "BLOCKED. Risk metrics exceed allowed thresholds. Suspend all capital permissions immediately.",
        strengths: [
            "Quick script setup time"
        ],
        risks: [
            "Poor execution record: 54.8% transactions failed",
            "Gas vulnerability: extremely low reserves ($4)",
            "3 unresolved escrow dispute reports",
            "History of staking liquidation flagged in lending pools"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "32 Txns", status: "warning" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "54.8% Success", status: "critical" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "1 Completed", status: "warning" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "3 Incidents", status: "critical" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "Liquidation Flagged", status: "critical" }
        ]
    }
};

// Elements DOM Selection
const agentInput = document.getElementById('agentInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const terminalSection = document.getElementById('terminalSection');
const terminalLogs = document.getElementById('terminalLogs');
const dashboardSection = document.getElementById('dashboardSection');
const presetBtns = document.querySelectorAll('.preset-btn');

// Dashboard Update Targets
const passportScore = document.getElementById('passportScore');
const passportGrade = document.getElementById('passportGrade');
const passportReliability = document.getElementById('passportReliability');
const passportExposure = document.getElementById('passportExposure');
const passportRisk = document.getElementById('passportRisk');
const passportAge = document.getElementById('passportAge');
const scoreDial = document.getElementById('scoreDial');
const riskLevelIcon = document.getElementById('riskLevelIcon');
const recommendationBanner = document.getElementById('recommendationBanner');
const recIcon = document.getElementById('recIcon');
const passportRecommendation = document.getElementById('passportRecommendation');
const strengthsList = document.getElementById('strengthsList');
const risksList = document.getElementById('risksList');
const evidenceTableBody = document.getElementById('evidenceTableBody');
const passportReceipt = document.getElementById('passportReceipt');
const passportTimestamp = document.getElementById('passportTimestamp');

// Modal Elements
const jsonModal = document.getElementById('jsonModal');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const copySchemaBtn = document.getElementById('copySchemaBtn');
const jsonCode = document.getElementById('jsonCode');

// Toast Elements
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Setup Preset Event Listeners
presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Toggle Active
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Set Input Val
        const addr = btn.getAttribute('data-address');
        agentInput.value = addr;
        
        // Trigger simulation
        startEvaluation(addr);
    });
});

// Primary Button Click
analyzeBtn.addEventListener('click', () => {
    const inputVal = agentInput.value.trim();
    if (!inputVal) {
        showToast("Please enter an agent address or name.");
        return;
    }
    
    // Check if input value matches a preset, or parse a custom query
    let targetKey = "0xAgentAlpha"; // default fallback
    let matchFound = false;

    // Direct address search
    Object.keys(agentDataPresets).forEach(key => {
        if (inputVal.toLowerCase().includes(key.toLowerCase()) || 
            inputVal.toLowerCase().includes(agentDataPresets[key].address.toLowerCase())) {
            targetKey = key;
            matchFound = true;
        }
    });

    if (!matchFound) {
        // Generate pseudo-deterministic custom profile for any custom inputs
        generateCustomAgentPreset(inputVal);
        targetKey = "Custom_Agent";
    }

    startEvaluation(targetKey);
});

// Function to generate deterministic profiles using same formula as index.js
function generateCustomAgentPreset(inputAddress) {
    let hash = 0;
    for (let i = 0; i < inputAddress.length; i++) {
        hash = inputAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Derived values
    const txSuccessRate = Math.max(50, Math.min(100, 75 + (Math.abs(hash) % 26)));
    const completedTasks = Math.abs(hash) % 45;
    const solventAssetUsd = Math.abs(hash) % 5000;
    const governanceRate = Math.max(10, Math.min(100, 40 + (Math.abs(hash) % 61)));
    const walletAgeDays = Math.max(5, Math.min(365, 10 + (Math.abs(hash) % 355)));
    const unresolvedDisputes = Math.abs(hash) % 3 === 0 ? 1 : 0;
    const hasLiquidationHistory = Math.abs(hash) % 7 === 0;

    // Run identical score logic
    const txPoints = (txSuccessRate / 100) * 300;
    const taskPoints = Math.min(200, completedTasks * 4);
    const solvencyPoints = Math.min(200, (solventAssetUsd / 1000) * 200);
    const govPoints = (governanceRate / 100) * 150;
    const agePoints = Math.min(150, (walletAgeDays / 300) * 150);
    
    let baseScore = txPoints + taskPoints + solvencyPoints + govPoints + agePoints;
    let penalties = unresolvedDisputes * 100;
    if (txSuccessRate < 70) penalties += 150;
    if (hasLiquidationHistory) penalties += 150;

    const score = Math.max(300, Math.min(1000, Math.round(baseScore - penalties)));

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

    if (unresolvedDisputes > 1 || hasLiquidationHistory) {
        grade = "F"; riskLevel = "Critical"; exposureLimit = "0 USDC";
    } else if (walletAgeDays < 10 && exposureLimit !== "0 USDC") {
        exposureLimit = "50 USDC"; riskLevel = "Medium";
    }

    // Build recommendation
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

    const strengths = [];
    const risks = [];

    if (txSuccessRate >= 95) strengths.push(`Exceptional technical stability: ${txSuccessRate}% success rate`);
    else if (txSuccessRate < 75) risks.push(`Poor execution record: ${txSuccessRate}% transactions failed`);
    if (completedTasks >= 20) strengths.push(`Highly productive agent with ${completedTasks} verified tasks`);
    if (solventAssetUsd >= 2000) strengths.push(`Strong asset backing: $${Math.round(solventAssetUsd)} equivalent reserves`);
    if (unresolvedDisputes > 0) risks.push(`${unresolvedDisputes} unresolved escrow dispute reports`);
    if (hasLiquidationHistory) risks.push("History of staking liquidation flagged in lending pools");
    if (walletAgeDays >= 180) strengths.push(`Long-standing address age: ${walletAgeDays} days on-chain`);

    if (strengths.length === 0) strengths.push("Basic network address operational status active.");
    if (risks.length === 0) risks.push("No outstanding critical risk indicators detected.");

    agentDataPresets["Custom_Agent"] = {
        address: inputAddress.startsWith("0x") ? inputAddress : `0x${inputAddress.slice(0, 10)}...${inputAddress.slice(-8)}`,
        score,
        grade,
        reliability: `${txSuccessRate}%`,
        exposure: exposureLimit,
        risk: riskLevel,
        age: `${walletAgeDays} Days`,
        recommendation,
        strengths,
        risks,
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: `${Math.abs(hash) % 150 + 10} Txns`, status: walletAgeDays > 30 ? "verified" : "warning" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: `${txSuccessRate}% Success`, status: txSuccessRate >= 90 ? "verified" : "warning" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: `${completedTasks} Completed`, status: completedTasks > 5 ? "verified" : "warning" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: `${unresolvedDisputes} Incidents`, status: unresolvedDisputes === 0 ? "verified" : "critical" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: hasLiquidationHistory ? "Liquidation Flagged" : "Repayments Clear", status: hasLiquidationHistory ? "critical" : "verified" }
        ]
    };
}

// Simulated Harvesting Terminal Log Sequence
function startEvaluation(agentKey) {
    const data = agentDataPresets[agentKey];
    
    // UI Reset
    dashboardSection.classList.add('hidden');
    terminalSection.classList.remove('hidden');
    terminalLogs.innerHTML = "";
    
    const logs = [
        { text: `[SYSTEM] Initializing harvesting protocols for subject: ${data.address}`, type: "system" },
        { text: `[SYSTEM] Establishing peer-to-peer connection with Pharos Node RPC: https://rpc.pharos.xyz`, type: "system" },
        { text: `[ACTION] Scanning ledger database for historical address inputs...`, type: "info" },
        { text: `[SUCCESS] Wallet address confirmed active since epoch. Age: ${data.age}`, type: "success" },
        { text: `[ACTION] Fetching dynamic transaction list (0x100 blocks)...`, type: "info" },
        { text: `[INFO] Analytical audit yields ${data.reliability} execution success rate.`, type: "info" },
        { text: `[ACTION] Harvesting task escrow logs & resolution histories...`, type: "info" }
    ];

    // Dynamic warning logs depending on risk
    if (data.risk === "Critical") {
        logs.push({ text: `[WARNING] Detectable levels of failed contracts. Fault frequency high!`, type: "warning" });
        logs.push({ text: `[WARNING] Critical flag: Multiple active refund/dispute disputes.`, type: "warning" });
    } else if (data.risk === "Medium" || data.risk === "Medium-High" || data.risk === "High") {
        logs.push({ text: `[WARNING] Minor anomalies detected during transaction peak queues.`, type: "warning" });
    } else {
        logs.push({ text: `[SUCCESS] No outstanding faults, delays, or mixer withdrawals detected.`, type: "success" });
    }

    logs.push({ text: `[ACTION] Synthesizing Credit Passport schema...`, type: "info" });
    logs.push({ text: `[SUCCESS] Report verified. Score assigned: ${data.score}/1000. Grade: ${data.grade}.`, type: "success" });
    logs.push({ text: `[COMMAND] claw install --skill pharos-credit-passport --receipt cp_id_${Math.floor(Math.random() * 900000 + 100000)}`, type: "command" });

    let currentLine = 0;
    
    function printNextLog() {
        if (currentLine < logs.length) {
            const line = logs[currentLine];
            const logEl = document.createElement('div');
            logEl.className = `log-line ${line.type}`;
            
            const timestamp = new Date().toISOString().substring(11, 19);
            logEl.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${line.text}`;
            
            terminalLogs.appendChild(logEl);
            terminalLogs.scrollTop = terminalLogs.scrollHeight; // Autoscroll
            
            currentLine++;
            setTimeout(printNextLog, Math.random() * 250 + 100);
        } else {
            // Processing complete, transition to dashboard
            setTimeout(() => {
                terminalSection.classList.add('hidden');
                revealDashboard(data);
            }, 800);
        }
    }

    printNextLog();
}

// Reveal Dashboard and trigger score dial animation
function revealDashboard(data) {
    dashboardSection.classList.remove('hidden');
    
    // Inject General Info
    passportScore.textContent = data.score;
    passportGrade.textContent = data.grade;
    passportReliability.textContent = data.reliability;
    passportExposure.textContent = data.exposure;
    passportRisk.textContent = data.risk;
    passportAge.textContent = data.age;

    // Set Receipt info
    const receiptCode = `PRP-${Math.floor(Math.random() * 89999 + 10000)}-${data.score}`;
    passportReceipt.textContent = receiptCode;
    passportTimestamp.textContent = new Date().toUTCString();

    // Adjust score dial position
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (data.score / 1000) * circumference;
    
    scoreDial.style.strokeDashoffset = circumference;
    setTimeout(() => {
        scoreDial.style.strokeDashoffset = offset;
    }, 100);

    // Apply color logic to Risk Indicator
    riskLevelIcon.className = "metric-icon"; // Reset classes
    if (data.risk === "Low") {
        riskLevelIcon.classList.add("green");
    } else if (data.risk === "Low-Medium") {
        riskLevelIcon.classList.add("blue");
    } else if (data.risk === "Medium" || data.risk === "Medium-High") {
        riskLevelIcon.classList.add("orange");
    } else {
        riskLevelIcon.classList.add("red");
    }

    // Update recommendation banner colors
    recommendationBanner.className = "recommendation-banner glassmorphic"; // reset
    recIcon.className = ""; // reset
    if (data.risk === "Low") {
        recommendationBanner.classList.add("success-banner");
        recIcon.setAttribute("data-lucide", "check-circle");
    } else if (data.risk === "Low-Medium") {
        recommendationBanner.classList.add("success-banner"); // blue-ish
        recIcon.setAttribute("data-lucide", "info");
    } else if (data.risk === "Medium" || data.risk === "Medium-High" || data.risk === "High") {
        recommendationBanner.classList.add("warning-banner");
        recIcon.setAttribute("data-lucide", "alert-circle");
    } else {
        recommendationBanner.classList.add("danger-banner");
        recIcon.setAttribute("data-lucide", "alert-triangle");
    }
    passportRecommendation.textContent = data.recommendation;

    lucide.createIcons();

    // Populate strengths & risks list
    strengthsList.innerHTML = "";
    data.strengths.forEach(str => {
        const li = document.createElement('li');
        li.textContent = str;
        strengthsList.appendChild(li);
    });

    risksList.innerHTML = "";
    data.risks.forEach(risk => {
        const li = document.createElement('li');
        li.textContent = risk;
        risksList.appendChild(li);
    });

    // Populate table rows
    evidenceTableBody.innerHTML = "";
    data.evidence.forEach(row => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = "verified";
        let statusIcon = "check-circle-2";
        if (row.status === "warning") {
            statusBadgeClass = "warning";
            statusIcon = "alert-circle";
        } else if (row.status === "critical") {
            statusBadgeClass = "critical";
            statusIcon = "alert-triangle";
        }

        tr.innerHTML = `
            <td>${row.signal}</td>
            <td style="color: var(--text-secondary);">${row.category}</td>
            <td style="font-weight: 600;">${row.value}</td>
            <td>
                <span class="status-badge ${statusBadgeClass}">
                    <i data-lucide="${statusIcon}" style="width:12px; height:12px;"></i>
                    ${row.status.toUpperCase()}
                </span>
            </td>
        `;
        evidenceTableBody.appendChild(tr);
    });
    
    lucide.createIcons();

    // Attach raw JSON text for Modal usage
    const jsonOutput = {
        "@context": "https://schema.pharos.xyz/credit-passport/v1",
        "type": "AgentCreditPassport",
        "receiptId": receiptCode,
        "timestamp": new Date().toISOString(),
        "subject": {
            "address": data.address,
            "solvencyAge": data.age
        },
        "scoreSummary": {
            "creditScore": data.score,
            "trustGrade": data.grade,
            "exposureCap": data.exposure,
            "reliabilityRating": data.reliability,
            "riskProfile": data.risk
        },
        "auditedEvidence": data.evidence.map(e => ({
            "signal": e.signal,
            "category": e.category,
            "observedValue": e.value,
            "status": e.status.toUpperCase()
        }))
    };
    jsonCode.textContent = JSON.stringify(jsonOutput, null, 2);
}

// Modal Toggle Logic
exportJsonBtn.addEventListener('click', () => {
    jsonModal.classList.add('active');
});

modalCloseBtn.addEventListener('click', () => {
    jsonModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === jsonModal) {
        jsonModal.classList.remove('active');
    }
});

// Copy JSON Schema to Clipboard
copySchemaBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonCode.textContent)
        .then(() => {
            showToast("JSON Schema copied to clipboard!");
            jsonModal.classList.remove('active');
        })
        .catch(err => {
            console.error("Clipboard write error: ", err);
            showToast("Failed to copy schema.");
        });
});

function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    startEvaluation("0xAgentAlpha");
});
