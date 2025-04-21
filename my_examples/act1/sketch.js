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
        drawConnection(conn);
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

// Add path points for each connection
function generatePathPoints(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const midX = start.x + dx / 2;

    // Create control points for the Bezier curve
    const ctrl1X = start.x + dx / 4;
    const ctrl1Y = start.y + (Math.random() - 0.5) * 40;
    const ctrl2X = start.x + (dx * 3 / 4);
    const ctrl2Y = end.y + (Math.random() - 0.5) * 40;

    return {
        start: start,
        end: end,
        ctrl1: { x: ctrl1X, y: ctrl1Y },
        ctrl2: { x: ctrl2X, y: ctrl2Y }
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

function drawConnection(conn) {
    // Determine the signal value for this connection
    let signalValue = getInputValue(conn.start);

    // Check if this is an output connection (RHS)
    const isOutputConnection = conn.end && outputs.some(output =>
        output &&
        abs(conn.end.x - output.x) < 1 &&
        abs(conn.end.y - output.y) < 1
    );

    // Set color based on mode and connection type
    if (isTeacherMode && isOutputConnection) {
        // In test mode, keep output connections gray
        stroke('#808080'); // Gray
        strokeWeight(3);
    } else {
        // For input connections or in play mode, use signal-based colors
        if (signalValue === 1) {
            stroke('#4CAF50'); // Green for 1
            strokeWeight(4);
        } else {
            stroke('#f44336'); // Red for 0
            strokeWeight(3);
        }
    }

    // Draw the curved path
    noFill();
    bezier(
        conn.start.x, conn.start.y,
        conn.ctrl1.x, conn.ctrl1.y,
        conn.ctrl2.x, conn.ctrl2.y,
        conn.end.x, conn.end.y
    );

    // Draw direction arrow at the midpoint
    let t = 0.5;
    let midX = bezierPoint(conn.start.x, conn.ctrl1.x, conn.ctrl2.x, conn.end.x, t);
    let midY = bezierPoint(conn.start.y, conn.ctrl1.y, conn.ctrl2.y, conn.end.y, t);
    let tangentX = bezierTangent(conn.start.x, conn.ctrl1.x, conn.ctrl2.x, conn.end.x, t);
    let tangentY = bezierTangent(conn.start.y, conn.ctrl1.y, conn.ctrl2.y, conn.end.y, t);

    let angle = atan2(tangentY, tangentX);

    push();
    translate(midX, midY);
    rotate(angle);
    // Use the same color for the arrow as the line
    fill(isTeacherMode && isOutputConnection ? '#808080' : (signalValue === 1 ? '#4CAF50' : '#f44336'));
    noStroke();
    triangle(-8, -4, -8, 4, 0, 0);
    pop();
}

function startFlowAnimation() {
    isAnimating = true;
    animationStartTime = millis();
    flowParticles = [];

    // Create particles for each connection
    for (let conn of connections) {
        let dx = conn.end.x - conn.start.x;
        let dy = conn.end.y - conn.start.y;
        let distance = sqrt(dx * dx + dy * dy);
        let numParticles = floor(distance / 20); // One particle every 20 pixels

        for (let i = 0; i < numParticles; i++) {
            flowParticles.push({
                connection: conn,
                progress: i / numParticles,
                value: getInputValue(conn.start)
            });
        }
    }
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

function updateAndDrawParticles() {
    let currentTime = millis();
    let progress = (currentTime - animationStartTime) / ANIMATION_DURATION;

    if (progress >= 1) {
        isAnimating = false;
        return;
    }

    for (let particle of flowParticles) {
        let p = (particle.progress + progress) % 1;

        // Calculate position along Bezier curve
        let x = bezierPoint(
            particle.connection.start.x,
            particle.connection.ctrl1.x,
            particle.connection.ctrl2.x,
            particle.connection.end.x,
            p
        );
        let y = bezierPoint(
            particle.connection.start.y,
            particle.connection.ctrl1.y,
            particle.connection.ctrl2.y,
            particle.connection.end.y,
            p
        );

        // Draw particle with more distinct colors
        noStroke();
        fill(particle.value ? '#4169E1' : '#696969');
        circle(x, y, 8);

        // Add glow effect for 1 signals
        if (particle.value) {
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = '#4169E1';
            circle(x, y, 8);
            drawingContext.shadowBlur = 0;
        }
    }
}

function drawGate(gate) {
    push();
    translate(gate.x, gate.y);

    // Gate body
    fill(127, 255, 212);
    stroke(0);
    strokeWeight(2);
    rect(-30, -20, 60, 40, 5);

    // Text
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text(currentGateType, 0, 0);
    pop();
}

function drawInput(input) {
    push();
    translate(input.x, input.y);

    // Input circle with more distinct colors
    fill(input.value ? '#4169E1' : '#696969'); // Royal Blue for 1, Dim Gray for 0
    stroke(0);
    strokeWeight(2);
    circle(0, 0, 30);

    // Value text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(input.value, 0, 0);

    // Draw checkmark if correct in test mode
    if (isTeacherMode && input.isCorrect) {
        push();
        translate(20, -20);
        fill('#4CAF50');
        noStroke();
        circle(0, 0, 20);
        stroke(255);
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

    // Output square with colors based on check state
    if (isTeacherMode && hasCheckedAnswer) {
        const expectedOutput = calculateExpectedOutput(outputs.indexOf(output));
        const isCorrect = output.value === expectedOutput;
        fill(isCorrect ? '#4CAF50' : '#f44336'); // Green for correct, Red for incorrect
    } else {
        fill(output.value ? '#4169E1' : '#696969'); // Normal colors
    }

    stroke(0);
    strokeWeight(2);
    rect(-15, -15, 30, 30);

    // Value text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(output.value, 0, 0);

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
                    updateOutputs();
                    startFlowAnimation();
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
                    output.userSet = true; // Mark output as user-set
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