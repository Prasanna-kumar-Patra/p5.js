let currentLevel = 0;
let gates = [];
let inputs = [];
let outputs = [];
let connections = [];
let dragging = null;
let dragOffset = { x: 0, y: 0 };
let flowParticles = [];
let isAnimating = false;
let animationStartTime = 0;
const ANIMATION_DURATION = 1000; // 1 second for flow animation
let isPlayMode = true;
let isTeacherMode = false;
let savedQuestion = null;
let initialized = false;
let levels = [
    {
        gates: [{ x: 400, y: 200, type: 'AND' }],
        inputs: [
            { x: 200, y: 150, value: 0 },
            { x: 200, y: 250, value: 1 }
        ],
        outputs: [{ x: 600, y: 200, value: 0 }],
        explanation: "An AND gate outputs 1 when both inputs are 1, otherwise it outputs 0."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 200, value: 1 },
            { x: 200, y: 300, value: 0 }
        ],
        outputs: [
            { x: 600, y: 150, value: 1 },
            { x: 600, y: 250, value: 0 }
        ],
        explanation: "Multiple AND gates can be used in parallel. Each gate processes its own inputs independently."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 400, y: 350, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 0 },
            { x: 200, y: 200, value: 1 },
            { x: 200, y: 250, value: 1 },
            { x: 200, y: 300, value: 0 },
            { x: 200, y: 350, value: 1 }
        ],
        outputs: [
            { x: 600, y: 150, value: 0 },
            { x: 600, y: 250, value: 1 },
            { x: 600, y: 350, value: 0 }
        ],
        explanation: "Three AND gates in parallel. Each gate requires both of its inputs to be 1 to output 1."
    },
    {
        gates: [
            { x: 400, y: 200, type: 'AND' },
            { x: 500, y: 200, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 250, value: 1 },
            { x: 300, y: 200, value: 0 }
        ],
        outputs: [
            { x: 600, y: 200, value: 0 }
        ],
        explanation: "Two AND gates in series. The output of the first gate becomes an input to the second gate."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 500, y: 200, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 300, y: 200, value: 1 }
        ],
        outputs: [
            { x: 600, y: 200, value: 0 }
        ],
        explanation: "A combination of parallel and series AND gates. The final output depends on all inputs."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 400, y: 350, type: 'AND' },
            { x: 500, y: 250, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 200, y: 300, value: 1 },
            { x: 200, y: 350, value: 0 },
            { x: 300, y: 250, value: 1 }
        ],
        outputs: [
            { x: 600, y: 250, value: 0 }
        ],
        explanation: "A complex arrangement with three parallel AND gates feeding into a fourth gate."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 500, y: 150, type: 'AND' },
            { x: 500, y: 250, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 300, y: 150, value: 1 },
            { x: 300, y: 250, value: 0 }
        ],
        outputs: [
            { x: 600, y: 150, value: 1 },
            { x: 600, y: 250, value: 0 }
        ],
        explanation: "A 2x2 grid of AND gates. Each output depends on the inputs to its corresponding gate."
    },
    {
        gates: [
            { x: 400, y: 200, type: 'AND' },
            { x: 500, y: 150, type: 'AND' },
            { x: 500, y: 250, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 250, value: 1 },
            { x: 300, y: 150, value: 0 },
            { x: 300, y: 250, value: 1 },
            { x: 400, y: 200, value: 1 }
        ],
        outputs: [
            { x: 600, y: 150, value: 0 },
            { x: 600, y: 250, value: 1 }
        ],
        explanation: "A branching circuit where one AND gate feeds into two others in parallel."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 400, y: 350, type: 'AND' },
            { x: 500, y: 200, type: 'AND' },
            { x: 500, y: 300, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 200, y: 300, value: 1 },
            { x: 200, y: 350, value: 0 },
            { x: 300, y: 200, value: 1 },
            { x: 300, y: 300, value: 0 }
        ],
        outputs: [
            { x: 600, y: 200, value: 0 },
            { x: 600, y: 300, value: 0 }
        ],
        explanation: "A complex circuit with five AND gates arranged in a pattern that tests multiple combinations."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 500, y: 200, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 300, y: 200, value: 1 }
        ],
        outputs: [
            { x: 600, y: 200, value: 1 }
        ],
        explanation: "A challenge level with three AND gates. The output will be 1 only if specific combinations of inputs are set correctly."
    },
    {
        gates: [
            { x: 400, y: 150, type: 'AND' },
            { x: 400, y: 250, type: 'AND' },
            { x: 400, y: 350, type: 'AND' },
            { x: 500, y: 200, type: 'AND' },
            { x: 500, y: 300, type: 'AND' },
            { x: 600, y: 250, type: 'AND' }
        ],
        inputs: [
            { x: 200, y: 100, value: 1 },
            { x: 200, y: 150, value: 1 },
            { x: 200, y: 200, value: 0 },
            { x: 200, y: 250, value: 1 },
            { x: 200, y: 300, value: 1 },
            { x: 200, y: 350, value: 0 },
            { x: 300, y: 200, value: 1 },
            { x: 300, y: 300, value: 0 },
            { x: 400, y: 250, value: 1 }
        ],
        outputs: [
            { x: 700, y: 250, value: 0 }
        ],
        explanation: "The final challenge! A complex circuit with six AND gates arranged in a pattern that tests your understanding of AND gate logic."
    }
];

// Add current gate type variable
let currentGateType = 'AND';

// Add variables for tracking check state
let hasCheckedAnswer = false;

// Add gate-specific explanations
const gateExplanations = {
    'AND': "An AND gate outputs 1 when all inputs are 1, otherwise it outputs 0.",
    'OR': "An OR gate outputs 1 when at least one input is 1, otherwise it outputs 0.",
    'NOT': "A NOT gate inverts the input: outputs 1 when input is 0, and outputs 0 when input is 1.",
    'NAND': "A NAND gate outputs 0 when all inputs are 1, otherwise it outputs 1.",
    'NOR': "A NOR gate outputs 1 when all inputs are 0, otherwise it outputs 0.",
    'XOR': "An XOR gate outputs 1 when an odd number of inputs are 1, otherwise it outputs 0.",
    'XNOR': "An XNOR gate outputs 1 when an even number of inputs are 1, otherwise it outputs 0."
};

// Update color constants to match SVG exactly
const COLORS = {
    primaryBlue: 'rgb(41.18%, 32.16%, 74.12%)',  // #695BBD
    primaryTeal: 'rgb(38.04%, 76.86%, 72.16%)', // #61C4B3
    primaryTealDark: 'rgb(15.29%, 60.78%, 55.29%)', // #27A89A
    grayLight: 'rgb(70.2%, 70.2%, 70.2%)', // #B3B3B3
    grayDark: 'rgb(29.8%, 29.8%, 29.8%)', // #4C4C4C
    white: '#FFFFFF',
    black: '#000000',
    // Signal colors
    signalOne: {
        fill: 'rgb(41.18%, 32.16%, 74.12%)',  // Blue fill for signal 1
        border: 'rgb(21.57%, 16.47%, 54.51%)'  // Darker blue border
    },
    signalZero: {
        fill: 'rgb(100%, 39.61%, 39.61%)',  // Red fill for signal 0
        border: 'rgb(80%, 19.61%, 19.61%)'  // Darker red border
    },
    outputCorrect: 'rgb(41.18%, 32.16%, 74.12%)',
    outputIncorrect: 'rgb(29.8%, 29.8%, 29.8%)'
};

// Add animation state tracking
let animationStates = new Map(); // Track animation state for each connection
let lastSignalValues = new Map(); // Track last signal values for each connection
let animationGroups = []; // Track groups of connections that need to be animated
let currentGroupIndex = 0; // Track current animation group
let currentConnectionIndex = 0; // Track current connection within a group
let isFirstGroupComplete = false; // Track if first group has completed

function preload() {
    // p5.js preload function - runs first
}

function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');
    loadLevel(currentLevel);
    // Initialize in play mode
    isPlayMode = true;
    isTeacherMode = false;
    // Call windowLoad directly since we know the DOM is ready
    windowLoad();
}

function windowLoad() {
    if (!initialized) {
        initializeControls();
    }
}

function initializeControls() {
    // Check if all required elements exist first
    const requiredElements = {
        modeToggle: document.querySelector('.mode-toggle'),
        restartBtn: document.getElementById('restart'),
        checkBtn: document.getElementById('check'),
        nextBtn: document.getElementById('next'),
        prevBtn: document.getElementById('prev-question'),
        showAnswerBtn: document.getElementById('show-answer'),
        modeIndicator: document.querySelector('.mode-indicator')
    };

    // If any required element is missing, try again later
    if (!Object.values(requiredElements).every(el => el)) {
        console.log('Waiting for DOM elements...');
        return;
    }

    initialized = true;

    // Setup mode toggle with initial play mode
    requiredElements.modeToggle.addEventListener('click', () => {
        const isTest = requiredElements.modeToggle.classList.contains('test');
        requiredElements.modeToggle.classList.toggle('test');
        requiredElements.modeToggle.classList.toggle('live');
        if (isTest) {
            setPlayMode();
        } else {
            setTestMode();
        }
    });

    // Initialize in play mode
    requiredElements.modeToggle.classList.remove('test');
    requiredElements.modeToggle.classList.add('live');
    setPlayMode();

    // Hide check and show-answer buttons initially
    const checkBtn = document.getElementById('check');
    const showAnswerBtn = document.getElementById('show-answer');
    if (checkBtn) checkBtn.style.display = 'none';
    if (showAnswerBtn) showAnswerBtn.style.display = 'none';

    // Setup control buttons
    requiredElements.restartBtn.addEventListener('click', () => {
        loadLevel(currentLevel);
        if (isTeacherMode) {
            randomizeInputs();
        }
    });

    requiredElements.checkBtn.addEventListener('click', checkAnswer);
    requiredElements.showAnswerBtn.addEventListener('click', showAnswer);
    requiredElements.nextBtn.addEventListener('click', nextLevel);

    // Setup question navigation
    requiredElements.prevBtn.addEventListener('click', () => {
        if (currentLevel > 0) {
            currentLevel--;
            loadLevel(currentLevel);
            updateQuestionNavigation();
        }
    });

    // Setup gate selector
    const gateButtons = document.querySelectorAll('.gate-button');
    gateButtons.forEach(button => {
        button.addEventListener('click', () => {
            gateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentGateType = button.dataset.gate;
            updateExplanation();
            loadLevel(currentLevel); // Reload level with new gate type
        });
    });

    // Initial question navigation update
    updateQuestionNavigation();

    // Add CSS for answer hints if not already present
    if (!document.getElementById('answer-hint-styles')) {
        const style = document.createElement('style');
        style.id = 'answer-hint-styles';
        style.textContent = `
            .answer-hint {
                position: absolute;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 1000;
                white-space: nowrap;
                text-align: center;
                min-width: 30px;
            }
            .answer-hint.incorrect {
                background-color: #f44336;
                color: white;
            }
            .answer-hint.incorrect-text {
                background-color: transparent;
                color: #f44336;
                font-weight: bold;
            }
            .answer-hint.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

function setPlayMode() {
    isPlayMode = true;
    isTeacherMode = false;
    hasCheckedAnswer = false; // Reset check state
    const modeIndicator = document.querySelector('.mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = 'Live Mode';
    }
    document.querySelector('.mode-selector').classList.add('play-mode');
    document.querySelector('.mode-selector').classList.remove('test-mode');

    enableAllInputs();
    loadLevel(currentLevel);

    // Hide check and show-answer buttons in play mode
    const checkBtn = document.getElementById('check');
    const showAnswerBtn = document.getElementById('show-answer');
    if (checkBtn) checkBtn.style.display = 'none';
    if (showAnswerBtn) showAnswerBtn.style.display = 'none';

    stopRandomInputChanges();
}

function setTestMode() {
    isPlayMode = false;
    isTeacherMode = true;
    hasCheckedAnswer = false; // Reset check state
    const modeIndicator = document.querySelector('.mode-indicator');
    if (modeIndicator) {
        modeIndicator.textContent = 'Test Mode';
    }
    document.querySelector('.mode-selector').classList.add('test-mode');
    document.querySelector('.mode-selector').classList.remove('play-mode');

    enableAllInputs();
    outputs.forEach(output => output.locked = false);

    // Show check and show-answer buttons in test mode
    const checkBtn = document.getElementById('check');
    const showAnswerBtn = document.getElementById('show-answer');
    if (checkBtn) checkBtn.style.display = 'inline-block';
    if (showAnswerBtn) showAnswerBtn.style.display = 'inline-block';

    // Randomize inputs once
    randomizeInputs();
}

function enableAllInputs() {
    inputs.forEach(input => input.locked = false);
    outputs.forEach(output => output.locked = false);
}

function lockInputs() {
    inputs.forEach(input => input.locked = true);
}

function draw() {
    background(240);

    // Draw connections
    stroke(100, 149, 237);
    strokeWeight(3);
    for (let conn of connections) {
        if (conn) {  // Only draw valid connections
            drawConnection(conn);
        }
    }

    // Draw flow particles
    if (isAnimating) {
        updateAndDrawParticles();
    }

    // Draw gates
    for (let gate of gates) {
        drawGate(gate);
    }

    // Draw inputs
    for (let input of inputs) {
        drawInput(input);
    }

    // Draw outputs
    for (let output of outputs) {
        drawOutput(output);
    }
}

function drawConnection(conn) {
    // Check if connection is valid
    if (!conn || !conn.start || !conn.end) {
        console.warn('Invalid connection object:', conn);
        return;
    }

    // Get connection ID for tracking animation state
    const connId = `${conn.start.x},${conn.start.y}-${conn.end.x},${conn.end.y}`;

    // Determine the signal value for this connection
    let signalValue = getInputValue(conn.start);

    // Check if this is an output connection (RHS)
    const isOutputConnection = conn.end && outputs.some(output =>
        output &&
        abs(conn.end.x - output.x) < 1 &&
        abs(conn.end.y - output.y) < 1
    );

    // Initialize animation state if needed
    if (!animationStates.has(connId)) {
        animationStates.set(connId, {
            progress: 0,
            isAnimating: false,
            signalValue: signalValue
        });
        lastSignalValues.set(connId, signalValue);
    }

    // Check if we should start animation
    const lastValue = lastSignalValues.get(connId);
    const shouldAnimate = (
        (isPlayMode && signalValue !== lastValue) || // Value changed in play mode
        (isTeacherMode && (hasCheckedAnswer || savedQuestion !== null)) // Show answer or check in test mode
    );

    if (shouldAnimate) {
        // Find the group this connection belongs to
        const groupIndex = findConnectionGroup(conn);
        if (groupIndex !== -1 && !animationGroups[groupIndex].includes(connId)) {
            animationGroups[groupIndex].push(connId);
            lastSignalValues.set(connId, signalValue);
        }
    }

    // Set base line style
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();

    // Calculate the bend point
    let bendX, bendY;
    if (abs(conn.end.x - conn.start.x) > abs(conn.end.y - conn.start.y)) {
        bendX = conn.start.x + (conn.end.x - conn.start.x) * 0.8;
        bendY = conn.start.y;
    } else {
        bendX = conn.start.x;
        bendY = conn.start.y + (conn.end.y - conn.start.y) * 0.8;
    }

    // Draw the base path with appropriate color
    const baseColor = isTeacherMode && isOutputConnection ?
        COLORS.grayLight :
        (signalValue === 1 ? COLORS.signalOne.fill : COLORS.signalZero.fill);

    stroke(baseColor);
    strokeWeight(2);
    beginShape();
    vertex(conn.start.x, conn.start.y);
    vertex(bendX, bendY);
    vertex(conn.end.x, conn.end.y);
    endShape();

    // Draw direction arrow
    let midX = (bendX + conn.end.x) / 2;
    let midY = (bendY + conn.end.y) / 2;
    let angle = atan2(conn.end.y - bendY, conn.end.x - bendX);

    push();
    translate(midX, midY);
    rotate(angle);
    fill(baseColor);
    noStroke();
    triangle(-8, -4, -8, 4, 0, 0);
    pop();

    // Draw animation if needed
    if (animationStates.get(connId).isAnimating) {
        drawBorderFill(conn, bendX, bendY, signalValue, connId);
    }
}

function findConnectionGroup(conn) {
    // Find if this is an input connection
    const isInputConnection = inputs.some(input =>
        abs(conn.start.x - input.x) < 1 && abs(conn.start.y - input.y) < 1
    );

    if (isInputConnection) {
        return 0; // Input connections are in first group
    }

    // Find if this is a gate output connection
    const isGateOutput = gates.some(gate =>
        abs(conn.start.x - (gate.x + 30)) < 1 && abs(conn.start.y - gate.y) < 30
    );

    if (isGateOutput) {
        return 1; // Gate output connections are in second group
    }

    return -1; // Unknown connection type
}

function drawBorderFill(conn, bendX, bendY, signalValue, connId) {
    const animationSpeed = 0.015;
    const state = animationStates.get(connId);
    state.progress += animationSpeed;

    if (state.progress >= 1) {
        state.isAnimating = false;
        state.progress = 1;

        const currentGroup = animationGroups[currentGroupIndex];

        if (!isFirstGroupComplete) {
            // For first group (inputs), check if all connections are done
            const allDone = currentGroup.every(id =>
                animationStates.get(id).progress >= 1
            );

            if (allDone) {
                isFirstGroupComplete = true;
                currentGroupIndex++;
                currentConnectionIndex = 0;

                // Start first connection of next group (gate outputs)
                if (currentGroupIndex < animationGroups.length &&
                    animationGroups[currentGroupIndex].length > 0) {
                    const nextConnId = animationGroups[currentGroupIndex][currentConnectionIndex];
                    animationStates.get(nextConnId).isAnimating = true;
                }
            }
        } else {
            // For subsequent groups, move to next connection
            currentConnectionIndex++;

            if (currentConnectionIndex < currentGroup.length) {
                // Start next connection in current group
                const nextConnId = currentGroup[currentConnectionIndex];
                animationStates.get(nextConnId).isAnimating = true;
            } else {
                // Move to next group if current group is complete
                currentGroupIndex++;
                currentConnectionIndex = 0;

                if (currentGroupIndex < animationGroups.length &&
                    animationGroups[currentGroupIndex].length > 0) {
                    const nextConnId = animationGroups[currentGroupIndex][currentConnectionIndex];
                    animationStates.get(nextConnId).isAnimating = true;
                }
            }
        }
    }

    push();
    noFill();

    // Set colors based on signal value
    const colors = signalValue === 1 ? COLORS.signalOne : COLORS.signalZero;
    const fillColor = colors.fill;
    const borderColor = colors.border;

    // Calculate path segments
    const firstSegmentLength = dist(conn.start.x, conn.start.y, bendX, bendY);
    const secondSegmentLength = dist(bendX, bendY, conn.end.x, conn.end.y);
    const totalLength = firstSegmentLength + secondSegmentLength;
    const currentLength = totalLength * state.progress;

    // Draw the border fill
    if (currentLength <= firstSegmentLength) {
        // First segment (start to bend)
        const t = currentLength / firstSegmentLength;
        const x = lerp(conn.start.x, bendX, t);
        const y = lerp(conn.start.y, bendY, t);

        // Draw the filled portion
        stroke(fillColor);
        strokeWeight(6);
        line(conn.start.x, conn.start.y, x, y);

        // Draw the border
        stroke(borderColor);
        strokeWeight(2);
        line(x, y, bendX, bendY);
        line(bendX, bendY, conn.end.x, conn.end.y);
    } else {
        // First segment is complete, working on second segment
        const remainingLength = currentLength - firstSegmentLength;
        const t = remainingLength / secondSegmentLength;
        const x = lerp(bendX, conn.end.x, t);
        const y = lerp(bendY, conn.end.y, t);

        // Draw the complete first segment
        stroke(fillColor);
        strokeWeight(6);
        line(conn.start.x, conn.start.y, bendX, bendY);

        // Draw the filled portion of second segment
        line(bendX, bendY, x, y);

        // Draw the remaining border
        stroke(borderColor);
        strokeWeight(2);
        line(x, y, conn.end.x, conn.end.y);
    }

    // Add subtle glow at the current position
    if (currentLength <= firstSegmentLength) {
        const t = currentLength / firstSegmentLength;
        const x = lerp(conn.start.x, bendX, t);
        const y = lerp(conn.start.y, bendY, t);

        push();
        noStroke();
        for (let i = 0; i < 2; i++) {
            const alpha = map(i, 0, 1, 50, 0);
            fill(red(fillColor), green(fillColor), blue(fillColor), alpha);
            circle(x, y, 10 - i * 2);
        }
        pop();
    } else {
        const remainingLength = currentLength - firstSegmentLength;
        const t = remainingLength / secondSegmentLength;
        const x = lerp(bendX, conn.end.x, t);
        const y = lerp(bendY, conn.end.y, t);

        push();
        noStroke();
        for (let i = 0; i < 2; i++) {
            const alpha = map(i, 0, 1, 50, 0);
            fill(red(fillColor), green(fillColor), blue(fillColor), alpha);
            circle(x, y, 10 - i * 2);
        }
        pop();
    }

    pop();
}

// Remove the old progressive fill function since we're using border fill now
function drawProgressiveFill(conn, bendX, bendY) {
    // This function is replaced by drawBorderFill
}

// Remove the old lightning effect function since we're using progressive fill now
function drawLightningEffect(conn, bendX, bendY) {
    // This function is replaced by drawBorderFill
}

// Remove the particle system since we're using lightning effect instead
function updateAndDrawParticles() {
    // This function is now empty as we're using the lightning effect
}

// Update the startFlowAnimation function to use the new effect
function startFlowAnimation() {
    // No need for particle initialization anymore
    // The lightning effect is handled in drawConnection
}

function getInputValue(point) {
    if (!point) return 0;

    // Find if this point is an input
    const input = inputs.find(input =>
        input &&
        input.x === point.x &&
        input.y === point.y
    );
    if (input) {
        return input.value;
    }

    // If not found, check if it's a gate output
    const gate = gates.find(gate =>
        gate &&
        abs(point.x - (gate.x + 30)) < 1
    );
    if (gate) {
        const gateIndex = gates.indexOf(gate);
        return calculateExpectedOutput(gateIndex);
    }

    return 0;
}

function drawGate(gate) {
    push();
    translate(gate.x, gate.y);

    // Gate body - using teal color from SVG
    fill(COLORS.primaryTeal);
    stroke(COLORS.primaryTealDark);
    strokeWeight(2);
    strokeCap(ROUND);
    strokeJoin(ROUND);

    // Draw rounded rectangle for gate body with SVG-like corners
    rectMode(CENTER);
    rect(0, 0, 48, 32, 4);

    // Gate text
    fill(COLORS.black);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    textFont('CoFo Brilliant, system-ui, sans-serif');
    text(currentGateType, 0, 0);
    pop();
}

function drawInput(input) {
    push();
    translate(input.x, input.y);

    // Input circle with modern styling
    if (input.value === 1) {
        fill(COLORS.signalOne.fill);
        stroke(COLORS.signalOne.border);
    } else {
        fill(COLORS.signalZero.fill);
        stroke(COLORS.signalZero.border);
    }
    strokeWeight(2);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    circle(0, 0, 24);

    // Value text
    fill(COLORS.white);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    textFont('CoFo Brilliant, system-ui, sans-serif');
    text(input.value, 0, 0);

    // Draw checkmark if correct in test mode
    if (isTeacherMode && input.isCorrect) {
        push();
        translate(20, -20);
        fill(COLORS.grayLight);
        noStroke();
        circle(0, 0, 16);
        stroke(COLORS.white);
        strokeWeight(2);
        line(-5, 0, -2, 3);
        line(-2, 3, 4, -3);
        pop();
    }

    pop();
}

function drawOutput(output) {
    push();
    translate(output.x, output.y);

    // Output square with modern styling
    if (isTeacherMode && hasCheckedAnswer) {
        const expectedOutput = calculateExpectedOutput(outputs.indexOf(output));
        const isCorrect = output.value === expectedOutput;
        fill(isCorrect ? COLORS.outputCorrect : COLORS.outputIncorrect);
        stroke(isCorrect ? COLORS.outputCorrect : COLORS.outputIncorrect);
    } else {
        fill(output.value ? COLORS.signalOne.fill : COLORS.signalZero.fill);
        stroke(output.value ? COLORS.signalOne.border : COLORS.signalZero.border);
    }
    strokeWeight(2);
    strokeCap(ROUND);
    strokeJoin(ROUND);

    // Draw rounded rectangle for output
    rectMode(CENTER);
    rect(0, 0, 44, 44, 6);

    // Value text
    fill(COLORS.white);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(22);
    textFont('CoFo Brilliant, system-ui, sans-serif');
    text(output.value, 0, 0);

    // Draw checkmark for correct answers
    if (isTeacherMode && hasCheckedAnswer && output.value === calculateExpectedOutput(outputs.indexOf(output))) {
        push();
        translate(20, -20);
        fill(COLORS.grayLight);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, 16, 16, 4);
        stroke(COLORS.white);
        strokeWeight(2);
        line(-5, 0, -2, 3);
        line(-2, 3, 4, -3);
        pop();
    }

    pop();
}

function mousePressed() {
    // Check if clicking an input
    for (let input of inputs) {
        if (dist(mouseX, mouseY, input.x, input.y) < 15) {
            if (!input.locked) {
                input.value = 1 - input.value;

                // Only update outputs in play mode
                if (isPlayMode) {
                    // Clear animation states
                    animationStates.clear();
                    lastSignalValues.clear();
                    animationGroups = [];
                    currentGroupIndex = 0;
                    currentConnectionIndex = 0;
                    isFirstGroupComplete = false;

                    // Create groups for different connection types
                    animationGroups[0] = []; // Input connections
                    animationGroups[1] = []; // Gate output connections

                    // Organize connections into groups
                    connections.forEach(conn => {
                        const connId = `${conn.start.x},${conn.start.y}-${conn.end.x},${conn.end.y}`;
                        const groupIndex = findConnectionGroup(conn);

                        if (groupIndex !== -1) {
                            animationGroups[groupIndex].push(connId);

                            // Initialize animation state
                            animationStates.set(connId, {
                                progress: 0,
                                isAnimating: false,
                                signalValue: getInputValue(conn.start)
                            });
                            lastSignalValues.set(connId, getInputValue(conn.start));
                        }
                    });

                    // Start first group (input connections)
                    if (animationGroups[0].length > 0) {
                        animationGroups[0].forEach(id => {
                            animationStates.get(id).isAnimating = true;
                        });
                    }

                    updateOutputs();
                }

                // In test mode, mark this input as user-set
                if (isTeacherMode) {
                    input.userSet = true;
                }
            }
            return;
        }
    }

    // Check if clicking an output (only in test mode)
    if (isTeacherMode) {
        for (let output of outputs) {
            if (dist(mouseX, mouseY, output.x, output.y) < 15) {
                if (!output.locked) {
                    output.value = 1 - output.value;
                    output.userSet = true;
                }
                return;
            }
        }
    }
}

function updateOutputs() {
    // In test mode, only update outputs that haven't been set by the user
    if (isTeacherMode) {
        outputs.forEach((output, index) => {
            if (!output.userSet) {
                output.value = calculateExpectedOutput(index);
            }
        });
    } else {
        // In play mode, update all outputs
        outputs.forEach((output, index) => {
            output.value = calculateExpectedOutput(index);
        });
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;

    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function checkAnswer() {
    hasCheckedAnswer = true;
    let correct = true;

    if (!outputs || outputs.length === 0) {
        console.error('No outputs defined for current level');
        return;
    }

    if (isTeacherMode) {
        // In test mode, check if outputs match the current level's expected outputs
        outputs.forEach((output, index) => {
            if (!output) {
                console.error(`Output at index ${index} is undefined`);
                correct = false;
                return;
            }
            let expectedOutput = calculateExpectedOutput(index);
            if (output.value !== expectedOutput) {
                correct = false;
            }
        });

        // Update input correctness flags
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
                if (!input) return;
                const connectedGate = findConnectedGate(input);
                if (connectedGate) {
                    const gateIndex = gates.indexOf(connectedGate);
                    if (gateIndex !== -1) {
                        const expectedOutput = calculateExpectedOutput(gateIndex);
                        const actualOutput = outputs[gateIndex]?.value;
                        input.isCorrect = expectedOutput === actualOutput;
                    }
                }
            });
        }
    } else {
        // In play mode, check against the level's predefined outputs
        if (!levels[currentLevel] || !levels[currentLevel].outputs) {
            console.error('No predefined outputs for current level');
            return;
        }

        outputs.forEach((output, index) => {
            if (!output || !levels[currentLevel].outputs[index]) {
                console.error(`Missing output data at index ${index}`);
                correct = false;
                return;
            }
            if (output.value !== levels[currentLevel].outputs[index].value) {
                correct = false;
            }
        });
    }

    if (correct) {
        showToast('Correct! Click Next to continue.', 'success');
        const nextBtn = document.getElementById('next');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    } else {
        showToast('Some answers are incorrect. Click Show Answer to see the correct values.', 'error');
    }
}

function showAnswer() {
    // Remove any existing answer hints
    removeAnswerHints();

    let allCorrect = true;

    // Show hints only for incorrect outputs
    outputs.forEach((output, index) => {
        let expectedOutput;
        if (isTeacherMode) {
            expectedOutput = calculateExpectedOutput(index);
        } else {
            expectedOutput = levels[currentLevel].outputs[index].value;
        }

        // Only show hint if the answer is incorrect
        if (output.value !== expectedOutput) {
            allCorrect = false;
            const hint = document.createElement('div');
            hint.className = 'answer-hint incorrect';
            hint.style.top = `${output.y - 30}px`; // Position above the output box
            hint.style.left = `${output.x - 15}px`; // Center align with output box
            hint.textContent = `${expectedOutput}`;

            // Create additional hint for "Incorrect" text
            const incorrectHint = document.createElement('div');
            incorrectHint.className = 'answer-hint incorrect-text';
            incorrectHint.style.top = `${output.y + 30}px`; // Position below the output box
            incorrectHint.style.left = `${output.x - 30}px`; // Center align with output box
            incorrectHint.textContent = 'Incorrect';

            document.getElementById('canvas-container').appendChild(hint);
            document.getElementById('canvas-container').appendChild(incorrectHint);
            setTimeout(() => {
                hint.classList.add('show');
                incorrectHint.classList.add('show');
            }, 10);
        }
    });

    // If all answers are correct, show a success message
    if (allCorrect) {
        showToast('All answers are correct!', 'success');
    }

    // Remove hints after 3 seconds
    setTimeout(removeAnswerHints, 3000);
}

function removeAnswerHints() {
    const hints = document.querySelectorAll('.answer-hint');
    hints.forEach(hint => {
        hint.classList.remove('show');
        setTimeout(() => hint.remove(), 300);
    });
}

function findConnectedGate(input) {
    // Find the gate that this input is connected to
    const connection = connections.find(conn =>
        conn.start.x === input.x && conn.start.y === input.y
    );
    if (connection) {
        return gates.find(gate =>
            abs(connection.end.x - (gate.x - 30)) < 1 &&
            abs(connection.end.y - gate.y) < 30
        );
    }
    return null;
}

function calculateExpectedOutput(outputIndex) {
    if (!gates || !gates[outputIndex]) {
        console.error(`No gate found at index ${outputIndex}`);
        return 0;
    }

    const gateInputs = getGateInputs(outputIndex);
    if (!gateInputs || gateInputs.length === 0) {
        console.error(`No inputs found for gate at index ${outputIndex}`);
        return 0;
    }

    switch (currentGateType) {
        case 'AND':
            return gateInputs.every(v => v === 1) ? 1 : 0;
        case 'OR':
            return gateInputs.some(v => v === 1) ? 1 : 0;
        case 'NOT':
            return gateInputs[0] === 0 ? 1 : 0;
        case 'NAND':
            return gateInputs.every(v => v === 1) ? 0 : 1;
        case 'NOR':
            return gateInputs.some(v => v === 1) ? 0 : 1;
        case 'XOR':
            return gateInputs.filter(v => v === 1).length % 2 === 1 ? 1 : 0;
        case 'XNOR':
            return gateInputs.filter(v => v === 1).length % 2 === 0 ? 1 : 0;
        default:
            console.error(`Unknown gate type: ${currentGateType}`);
            return 0;
    }
}

function getGateInputs(outputIndex) {
    if (!gates || !gates[outputIndex]) {
        return [];
    }

    const gate = gates[outputIndex];
    return connections
        .filter(conn =>
            conn &&
            conn.end &&
            gate &&
            abs(conn.end.x - (gate.x - 30)) < 1 &&
            abs(conn.end.y - gate.y) < 30
        )
        .map(conn => getInputValue(conn.start))
        .filter(value => value !== undefined);
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel(currentLevel);
        updateQuestionNavigation();
        if (isTeacherMode) {
            randomizeInputs();
        }
    } else {
        showToast('Congratulations! You\'ve completed all levels!', 'success');
    }
}

let randomInputInterval;

function startRandomInputChanges() {
    // Only randomize once when entering test mode
    randomizeInputs();
}

function stopRandomInputChanges() {
    if (randomInputInterval) {
        clearInterval(randomInputInterval);
        randomInputInterval = null;
    }
}

function randomizeInputs() {
    inputs.forEach(input => {
        if (!input.userSet) {
            input.value = Math.random() < 0.5 ? 0 : 1;
        }
    });
}

function updateQuestionNavigation() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next');
    const questionCount = document.getElementById('question-count');

    if (prevBtn && nextBtn && questionCount) {
        // Update button states
        prevBtn.disabled = currentLevel === 0;
        nextBtn.disabled = currentLevel === levels.length - 1;

        // Update button styles
        prevBtn.style.opacity = currentLevel === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentLevel === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.opacity = currentLevel === levels.length - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentLevel === levels.length - 1 ? 'not-allowed' : 'pointer';

        questionCount.textContent = `Question ${currentLevel + 1} of ${levels.length}`;
    }
}

function updateExplanation() {
    const explanation = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    if (explanation && explanationText) {
        explanation.style.display = 'block';
        explanationText.textContent = gateExplanations[currentGateType] || '';
    }
}

// Update the generatePathPoints function to return a proper connection object
function generatePathPoints(start, end) {
    if (!start || !end) {
        console.warn('Invalid start or end point:', { start, end });
        return null;
    }

    let bendX, bendY;

    if (abs(end.x - start.x) > abs(end.y - start.y)) {
        // Horizontal connection with vertical bend
        bendX = start.x + (end.x - start.x) * 0.8;
        bendY = start.y;
    } else {
        // Vertical connection with horizontal bend
        bendX = start.x;
        bendY = start.y + (end.y - start.y) * 0.8;
    }

    return {
        start: start,
        end: end,
        bendX: bendX,
        bendY: bendY
    };
}

function loadLevel(level) {
    if (level >= levels.length) return;

    // Reset check state when loading new level
    hasCheckedAnswer = false;

    gates = [...levels[level].gates];
    inputs = [...levels[level].inputs].map(input => ({
        ...input,
        isCorrect: false
    }));
    outputs = [...levels[level].outputs];
    connections = [];

    // Reset user-set flags when loading a new level
    inputs.forEach(input => {
        input.userSet = false;
        input.isCorrect = false;
    });
    outputs.forEach(output => output.userSet = false);

    // Create connections based on level
    if (level === 0) {
        // Level 0: Single AND gate with two inputs and one output
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, outputs[0])
        ];
    } else if (level === 1) {
        // Level 1: Two parallel AND gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[1], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, outputs[0]),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, outputs[1])
        ];
    } else if (level === 2) {
        // Level 2: Three parallel AND gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints(inputs[5], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, outputs[0]),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, outputs[1]),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, outputs[2])
        ];
    } else if (level === 3) {
        // Level 3: Two AND gates in series
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[1].x - 30, y: gates[1].y }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, outputs[0])
        ];
    } else if (level === 4) {
        // Level 4: Combination of parallel and series gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y }),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, outputs[0])
        ];
    } else if (level === 5) {
        // Level 5: Three parallel gates feeding into a fourth gate
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints(inputs[5], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[3].x - 30, y: gates[3].y - 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, { x: gates[3].x - 30, y: gates[3].y }),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, { x: gates[3].x - 30, y: gates[3].y + 10 }),
            generatePathPoints(inputs[6], { x: gates[3].x - 30, y: gates[3].y }),
            generatePathPoints({ x: gates[3].x + 30, y: gates[3].y }, outputs[0])
        ];
    } else if (level === 6) {
        // Level 6: 2x2 grid of AND gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints(inputs[5], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, outputs[0]),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, outputs[1])
        ];
    } else if (level === 7) {
        // Level 7: Branching circuit
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[1].x - 30, y: gates[1].y }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[2].x - 30, y: gates[2].y }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[3], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[0].x - 30, y: gates[0].y }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, outputs[0]),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, outputs[1])
        ];
    } else if (level === 8) {
        // Level 8: Five AND gates in a complex pattern
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints(inputs[5], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints(inputs[6], { x: gates[3].x - 30, y: gates[3].y - 10 }),
            generatePathPoints(inputs[7], { x: gates[4].x - 30, y: gates[4].y - 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[3].x - 30, y: gates[3].y + 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, { x: gates[3].x - 30, y: gates[3].y }),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, { x: gates[4].x - 30, y: gates[4].y + 10 }),
            generatePathPoints({ x: gates[3].x + 30, y: gates[3].y }, outputs[0]),
            generatePathPoints({ x: gates[4].x + 30, y: gates[4].y }, outputs[1])
        ];
    } else if (level === 9) {
        // Level 9: Challenge level with three gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y }),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, outputs[0])
        ];
    } else if (level === 10) {
        // Level 10: Final challenge with six gates
        connections = [
            generatePathPoints(inputs[0], { x: gates[0].x - 30, y: gates[0].y - 10 }),
            generatePathPoints(inputs[1], { x: gates[0].x - 30, y: gates[0].y + 10 }),
            generatePathPoints(inputs[2], { x: gates[1].x - 30, y: gates[1].y - 10 }),
            generatePathPoints(inputs[3], { x: gates[1].x - 30, y: gates[1].y + 10 }),
            generatePathPoints(inputs[4], { x: gates[2].x - 30, y: gates[2].y - 10 }),
            generatePathPoints(inputs[5], { x: gates[2].x - 30, y: gates[2].y + 10 }),
            generatePathPoints(inputs[6], { x: gates[3].x - 30, y: gates[3].y - 10 }),
            generatePathPoints(inputs[7], { x: gates[4].x - 30, y: gates[4].y - 10 }),
            generatePathPoints({ x: gates[0].x + 30, y: gates[0].y }, { x: gates[5].x - 30, y: gates[5].y - 10 }),
            generatePathPoints({ x: gates[1].x + 30, y: gates[1].y }, { x: gates[5].x - 30, y: gates[5].y }),
            generatePathPoints({ x: gates[2].x + 30, y: gates[2].y }, { x: gates[5].x - 30, y: gates[5].y + 10 }),
            generatePathPoints({ x: gates[3].x + 30, y: gates[3].y }, { x: gates[5].x - 30, y: gates[5].y }),
            generatePathPoints({ x: gates[4].x + 30, y: gates[4].y }, { x: gates[5].x - 30, y: gates[5].y }),
            generatePathPoints(inputs[8], { x: gates[5].x - 30, y: gates[5].y }),
            generatePathPoints({ x: gates[5].x + 30, y: gates[5].y }, outputs[0])
        ];
    }

    // Update explanation for current gate type
    updateExplanation();

    // Update navigation buttons
    updateQuestionNavigation();
} 