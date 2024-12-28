let qp = 0;
let ss = 0;
let qpPerClick = 1;
let collectors = {
    "Subatomic Tunneler": { count: 0, efficiency: 0.1, baseCost: 50, costMultiplier: 1.1 },
    "Quantum Entangler": { count: 0, efficiency: 1, baseCost: 250, costMultiplier: 1.2 }
};
let upgrades = {
    "Click Efficiency": { level: 0, effect: 1, baseCost: 10, costMultiplier: 1.5 },
    "Click Amplifier": { level: 0, effect: 5, baseCost: 100, costMultiplier: 2 }
};
let engineProgress = 0;

// Initialize game state (no loading from localStorage)
function initializeGame() {
    qp = 0;
    ss = 0;
    qpPerClick = 1;
    collectors = {
        "Subatomic Tunneler": { count: 0, efficiency: 0.1, baseCost: 50, costMultiplier: 1.1 },
        "Quantum Entangler": { count: 0, efficiency: 1, baseCost: 250, costMultiplier: 1.2 }
    };
    upgrades = {
        "Click Efficiency": { level: 0, effect: 1, baseCost: 10, costMultiplier: 1.5 },
        "Click Amplifier": { level: 0, effect: 5, baseCost: 100, costMultiplier: 2 }
    };
    engineProgress = 0;
    updateDisplay();
}

// Save game state (not used in this version, but you might need it later)
function saveGame() {
    // Not saving to localStorage in this version
}

// Update the displayed values
function updateDisplay() {
    document.getElementById('qpCount').textContent = formatNumber(qp);
    document.getElementById('ssCount').textContent = formatNumber(ss);
    document.getElementById('energyPerClick').textContent = formatNumber(qpPerClick);
    document.getElementById('engineProgress').textContent = engineProgress;

    // Update upgrade buttons
    for (const upgradeName in upgrades) {
        const upgrade = upgrades[upgradeName];
        const button = document.querySelector(`[data-type="click"][data-name="${upgradeName}"]`);
        if (button) {
            const nextCost = calculateUpgradeCost(upgradeName);
            button.textContent = `Buy ${upgradeName} (Level: ${upgrade.level}, Cost: ${formatNumber(nextCost)} QP, +${upgrade.effect} QP/Click)`;
            button.dataset.cost = nextCost;
        }
    }

    // Update collector buttons
    for (const collectorName in collectors) {
        const collector = collectors[collectorName];
        const button = document.querySelector(`[data-type="collector"][data-name="${collectorName}"]`);
        if (button) {
            const nextCost = calculateCollectorCost(collectorName);
            button.textContent = `Buy ${collectorName} (Count: ${collector.count}, Cost: ${formatNumber(nextCost)} QP, +${collector.efficiency} QP/Second)`;
            button.dataset.cost = nextCost;
        }
    }
}

// Calculate the cost of the next upgrade level
function calculateUpgradeCost(upgradeName) {
    const upgrade = upgrades[upgradeName];
    return upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level);
}

// Calculate the cost of the next collector
function calculateCollectorCost(collectorName) {
    const collector = collectors[collectorName];
    return collector.baseCost * Math.pow(collector.costMultiplier, collector.count);
}

// Format large numbers
function formatNumber(number) {
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const magnitude = Math.floor(Math.log10(number + 1) / 3);
    if (magnitude < suffixes.length) {
        return (number / Math.pow(10, magnitude * 3)).toFixed(2) + suffixes[magnitude];
    } else {
        return number.toExponential(2);
    }
}

// Handle clicking
document.getElementById('clickButton').addEventListener('click', () => {
    qp += qpPerClick;
    updateDisplay();
});

// Handle buying upgrades
document.querySelectorAll('[data-type="click"]').forEach(button => {
    button.addEventListener('click', function() {
        const upgradeName = this.dataset.name;
        const cost = calculateUpgradeCost(upgradeName);

        if (qp >= cost) {
            qp -= cost;
            upgrades[upgradeName].level++;
            qpPerClick += upgrades[upgradeName].effect;
            updateDisplay();
        }
    });
});

// Handle buying collectors
document.querySelectorAll('[data-type="collector"]').forEach(button => {
    button.addEventListener('click', function() {
        const collectorName = this.dataset.name;
        const cost = calculateCollectorCost(collectorName);

        if (qp >= cost) {
            qp -= cost;
            collectors[collectorName].count++;
            updateDisplay();
        }
    });
});

// Handle Cosmic Collapse
document.getElementById('cosmicCollapseButton').addEventListener('click', () => {
    if (qp >= 1000) { // Condition for Cosmic Collapse
        const qpAtCollapse = qp;
        ss++;

        // Multiplicative bonus (example: 5% per shard)
        const ssMultiplier = 1 + (ss * 0.2);

        // Scaling bonus based on QP at collapse (example)
        const scalingBonus = Math.log10(qpAtCollapse) / 10;

        qpPerClick = (1 + scalingBonus) * ssMultiplier; // Apply both bonuses

        // Reset other values
        qp = 0;
        for (const collectorName in collectors) {
            collectors[collectorName].count = 0;
        }
        for (const upgradeName in upgrades) {
            upgrades[upgradeName].level = 0;
        }
        engineProgress = 0;

        updateDisplay();
    } else {
        alert("You need at least 1000 QP to perform a Cosmic Collapse!");
    }
});

// Handle powering the Singularity Engine
document.getElementById('powerEngineButton').addEventListener('click', () => {
    const cost = 1000;
    if (qp >= cost && engineProgress < 1000) {
        qp -= cost;
        engineProgress += 10; // Example increment
        if (engineProgress > 1000) engineProgress = 1000;
        updateDisplay();
        if (engineProgress >= 1000) {
            alert("Congratulations! You have significantly powered the Singularity Engine. This represents a major milestone, but the true potential is far greater...");
        }
    }
});

// Automated QP generation
setInterval(() => {
    let qpToAdd = 0;
    for (const collector in collectors) {
        qpToAdd += collectors[collector].count * collectors[collector].efficiency;
    }
    qp += qpToAdd;
    updateDisplay();
}, 1000);

// Initialize the game on startup (instead of loadGame)
initializeGame();