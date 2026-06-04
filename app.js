// Pharos Agent Credit Passport Data Presets
const agentDataPresets = {
    "0xAgentAlpha": {
        address: "0xAgentAlpha7c93fa8892ea0183b2ffbc9d173c249a",
        score: 874,
        grade: "A",
        reliability: "96%",
        exposure: "1,500 USDC",
        risk: "Low",
        age: "184 Days",
        recommendation: "Highly recommended for autonomous delegation and high-value transactions. Asset backing and task completion rates are exceptional. Escrow deposits can be cleared without manual escrow hold.",
        strengths: [
            "98.4% transaction success rate over 840 txs",
            "Zero defaults on 5 governance-authorized loans",
            "Consistent task delivery: 42 verified agent jobs completed",
            "No recorded dispute requests or active reports",
            "Maintains liquidity balance above 5,000 native PHAROS"
        ],
        risks: [
            "Occasional short delay in executing governance task callbacks",
            "Minimal historical interaction with real-world asset (RWA) contracts"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "840 Txns (High)", status: "verified" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "98.4% Success", status: "verified" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "42 Finished", status: "verified" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "0 Incidents", status: "verified" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "5 Active Repaid", status: "verified" },
            { signal: "Governance Activity", category: "DAO Participation", value: "94% Votes Cast", status: "verified" },
            { signal: "Solvent Asset Value (AV)", category: "Liquidity", value: "12,450 USDC Eq.", status: "verified" }
        ]
    },
    "0xDAO_Oracle": {
        address: "0xDAO_Oracle23f11456da87b3cb911a3d3c8c7f21a4",
        score: 685,
        grade: "B-",
        reliability: "78%",
        exposure: "300 USDC",
        risk: "Medium",
        age: "42 Days",
        recommendation: "Approved for moderate capital exposure. Cap individual task funding at 300 USDC. Require a multi-sig or intent escrow contract to hold funds until delivery is verified.",
        strengths: [
            "Fast dispute settlement history (average resolution under 2 hours)",
            "High participation in recent Pharos Ecosystem votes",
            "12 tasks successfully completed in the past 30 days"
        ],
        risks: [
            "2 failed contract interactions detected during network congestion",
            "Low native asset balance relative to pending tasks",
            "Short on-chain age history (< 2 months)"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "112 Txns (Medium)", status: "verified" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "91.2% Success", status: "warning" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "12 Finished", status: "verified" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "1 Dispute (Settled)", status: "warning" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "No Records Found", status: "warning" },
            { signal: "Governance Activity", category: "DAO Participation", value: "81% Votes Cast", status: "verified" },
            { signal: "Solvent Asset Value (AV)", category: "Liquidity", value: "1,240 USDC Eq.", status: "warning" }
        ]
    },
    "0xRogueBot": {
        address: "0xRogueBot44a9c51ba0d923cc8f117cfa8e88e7b1",
        score: 342,
        grade: "D-",
        reliability: "39%",
        exposure: "0 USDC",
        risk: "Critical",
        age: "8 Days",
        recommendation: "DO NOT interact or delegate funds. Risk signals indicate potential script abuse, high liquidation frequencies, and multiple failed interactions. Do not authorize escrow releases.",
        strengths: [
            "Quick script setup time"
        ],
        risks: [
            "7 failed transaction spikes within a single block sequence",
            "Multiple reports of non-delivery of automated oracle payouts",
            "Suspicious asset outflows to unverified mixer wallets",
            "Solvent balance dangerously close to gas limits"
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "32 Txns (Low)", status: "critical" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: "54.8% Failed Rates", status: "critical" },
            { signal: "Completed Agent Tasks", category: "Reputation", value: "1 Task Completed", status: "critical" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "3 Unresolved Disputes", status: "critical" },
            { signal: "RealFi Staking/Repayment", category: "Solvency", value: "Liquidation Flagged", status: "critical" },
            { signal: "Governance Activity", category: "DAO Participation", value: "0% Votes Cast", status: "critical" },
            { signal: "Solvent Asset Value (AV)", category: "Liquidity", value: "4.20 USDC Eq.", status: "critical" }
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

// Function to generate deterministic profiles for arbitrary entries
function generateCustomAgentPreset(inputAddress) {
    // Generate some deterministic scores using hash logic
    let hash = 0;
    for (let i = 0; i < inputAddress.length; i++) {
        hash = inputAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = Math.abs(hash % 450) + 450; // scores between 450 and 900
    
    let grade = "B";
    let risk = "Medium";
    let statusVal = "warning";
    let reliability = "74%";
    let exposure = "250 USDC";
    
    if (score >= 800) {
        grade = "A-"; risk = "Low"; statusVal = "verified"; reliability = "91%"; exposure = "1,000 USDC";
    } else if (score < 600) {
        grade = "C+"; risk = "High"; statusVal = "critical"; reliability = "58%"; exposure = "50 USDC";
    }

    agentDataPresets["Custom_Agent"] = {
        address: inputAddress.startsWith("0x") ? inputAddress : `0x${inputAddress.slice(0, 10)}...${inputAddress.slice(-8)}`,
        score: score,
        grade: grade,
        reliability: reliability,
        exposure: exposure,
        risk: risk,
        age: `${Math.abs(hash % 300) + 12} Days`,
        recommendation: `Procedurally generated trust report. Risk level is ${risk.toUpperCase()}. We recommend checking secondary sources. Exposure capped at ${exposure} with milestone escrows.`,
        strengths: [
            `Active network address with transaction cycles`,
            `No terminal systemic failures reported in the last 48 hours`,
            `Maintains average execution latency below 800ms`
        ],
        risks: [
            `Unverified contract compiler source matches`,
            `Relatively low staking backing observed in current epoch`
        ],
        evidence: [
            { signal: "Wallet Activity History", category: "Liquidity", value: "Signal Active", status: "verified" },
            { signal: "Tx Success/Failure Ratio", category: "Technical", value: `${Math.abs(hash % 10) + 88}% Success`, status: statusVal },
            { signal: "Completed Agent Tasks", category: "Reputation", value: `${Math.abs(hash % 20) + 2} Verified Jobs`, status: "verified" },
            { signal: "Dispute & Dispute Refunds", category: "Disputes", value: "None Flagged", status: "verified" },
            { signal: "Governance Activity", category: "DAO Participation", value: "Incomplete Vote History", status: statusVal }
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
    } else if (data.risk === "Medium") {
        logs.push({ text: `[WARNING] Minor anomalies detected during transaction peak queues.`, type: "warning" });
    } else {
        logs.push({ text: `[SUCCESS] No outstanding faults, delays, or mixer withdrawals detected.`, type: "success" });
    }

    logs.push({ text: `[ACTION] Synthesizing Credit Passport schema...`, type: "info" });
    logs.push({ text: `[SUCCESS] Report verified. Score assigned: ${data.score}/1000. Grade: ${data.grade}.`, type: "success" });
    logs.push({ text: `[COMMAND] claw install --skill pharos-credit-passport --receipt cp_id_${Math.floor(Math.random() * 900000 + 100000)}`, type: "command" });

    // Print logs sequentially with typewriter delay effect
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
    
    // Reset dial first then draw (makes a satisfying fill effect)
    scoreDial.style.strokeDashoffset = circumference;
    setTimeout(() => {
        scoreDial.style.strokeDashoffset = offset;
    }, 100);

    // Apply color logic to Risk Indicator
    riskLevelIcon.className = "metric-icon"; // Reset classes
    if (data.risk === "Low") {
        riskLevelIcon.classList.add("green");
    } else if (data.risk === "Medium") {
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
    } else if (data.risk === "Medium") {
        recommendationBanner.classList.add("warning-banner");
        recIcon.setAttribute("data-lucide", "alert-circle");
    } else {
        recommendationBanner.classList.add("danger-banner");
        recIcon.setAttribute("data-lucide", "alert-triangle");
    }
    passportRecommendation.textContent = data.recommendation;

    // Re-draw icons inside dynamically created elements
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
    
    // Refresh newly added Lucide icons in table
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

// Click outside close modal
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

// Helper: Toast alerts
function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    
    // Auto Dismiss
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Auto run first preset on load
window.addEventListener('DOMContentLoaded', () => {
    startEvaluation("0xAgentAlpha");
});
