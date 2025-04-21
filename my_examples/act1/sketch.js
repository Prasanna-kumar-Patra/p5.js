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

function preload() {
    // p5.js preload function - runs first
}

function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');
    loadLevel(currentLevel);
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
        modeIndicator: document.querySelector('.mode-indicator'),
        saveChangesBtn: document.getElementById('save-changes')
    };

    // If any required element is missing, try again later
    if (!Object.values(requiredElements).every(el => el)) {
        console.log('Waiting for DOM elements...');
        return;
    }

    initialized = true;

    // Setup mode toggle
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

    // Setup gate selector
    const gateButtons = document.querySelectorAll('.gate-button');
    gateButtons.forEach(button => {
        button.addEventListener('click', () => {
            gateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentGateType = button.dataset.gate;
            loadLevel(currentLevel); // Reload level with new gate type
        });
    });

    // Setup control buttons
    requiredElements.restartBtn.addEventListener('click', () => {
        loadLevel(currentLevel);
    });

    requiredElements.checkBtn.addEventListener('click', () => {
        startFlowAnimation();
        setTimeout(checkAnswer, ANIMATION_DURATION + 200);
    });

    requiredElements.nextBtn.addEventListener('click', nextLevel);

    // Add event listeners for question navigation
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const questionCount = document.getElementById('question-count');

    if (prevBtn && nextBtn && questionCount) {
        prevBtn.addEventListener('click', () => {
            if (currentLevel > 0) {
                currentLevel--;
                loadLevel(currentLevel);
                updateQuestionNavigation();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentLevel < levels.length - 1) {
                currentLevel++;
                loadLevel(currentLevel);
                updateQuestionNavigation();
            }
        });
    }

    // Add event listener for show answer button
    const showAnswerBtn = document.getElementById('show-answer');
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', showAnswer);
    }

    // Initial question navigation update
    updateQuestionNavigation();
}

function setPlayMode() {
    isPlayMode = true;
    isTeacherMode = false;
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

    gates = [...levels[level].gates];
    inputs = [...levels[level].inputs];
    outputs = [...levels[level].outputs];
    connections = [];

    // Reset user-set flags when loading a new level
    inputs.forEach(input => input.userSet = false);
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

    // Show explanation
    const explanation = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    if (explanation && explanationText) {
        explanation.style.display = 'block';
        explanationText.textContent = levels[level].explanation;
    }
}

function drawConnection(conn) {
    // Determine the signal value for this connection
    let signalValue = getInputValue(conn.start);

    // Set color based on signal value
    if (signalValue === 1) {
        stroke(65, 105, 225); // Royal Blue for 1
        strokeWeight(4);
    } else {
        stroke(169, 169, 169); // Dark Gray for 0
        strokeWeight(3);
        drawDashedBezier(
            conn.start.x, conn.start.y,
            conn.ctrl1.x, conn.ctrl1.y,
            conn.ctrl2.x, conn.ctrl2.y,
            conn.end.x, conn.end.y,
            10 // dash length
        );
        return; // Skip normal bezier drawing for 0 signals
    }

    // Draw the curved path for signal 1
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
    fill(signalValue === 1 ? 65 : 169);
    noStroke();
    triangle(-8, -4, -8, 4, 0, 0);
    pop();
}

// Function to draw dashed bezier curves
function drawDashedBezier(x1, y1, x2, y2, x3, y3, x4, y4, dashLength) {
    let steps = 50;
    let px = x1;
    let py = y1;
    let drawLine = true;

    for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = bezierPoint(x1, x2, x3, x4, t);
        let y = bezierPoint(y1, y2, y3, y4, t);

        let d = dist(px, py, x, y);
        if (d >= dashLength) {
            if (drawLine) {
                line(px, py, x, y);
            }
            px = x;
            py = y;
            drawLine = !drawLine;
        }
    }
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
    // Find if this point is an input or connected to a gate
    for (let input of inputs) {
        if (input.x === point.x && input.y === point.y) {
            return input.value;
        }
    }
    // If not found, check if it's a gate output
    for (let gate of gates) {
        if (abs(point.x - (gate.x + 30)) < 1) { // Gate output point
            let gateInputs = connections.filter(c =>
                abs(c.end.x - (gate.x - 30)) < 1 &&
                abs(c.end.y - gate.y) < 30
            ).map(c => getInputValue(c.start));
            return gateInputs.every(v => v === 1) ? 1 : 0;
        }
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
    pop();
}

function drawOutput(output) {
    push();
    translate(output.x, output.y);

    // Output square with more distinct colors
    fill(output.value ? '#4169E1' : '#696969'); // Royal Blue for 1, Dim Gray for 0
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
    let correct = true;
    if (isTeacherMode) {
        // In test mode, check if outputs match the current level's expected outputs
        for (let i = 0; i < outputs.length; i++) {
            let expectedOutput = calculateExpectedOutput(i);
            if (outputs[i].value !== expectedOutput) {
                correct = false;
                break;
            }
        }
    } else {
        // In play mode, check against the level's predefined outputs
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].value !== levels[currentLevel].outputs[i].value) {
                correct = false;
                break;
            }
        }
    }

    if (correct) {
        showToast('Correct! Click Next to continue.', 'success');
        const nextBtn = document.getElementById('next');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    } else {
        showToast('Try again!', 'error');
    }
}

function showAnswer() {
    // Show the correct answer without changing the current state
    if (isTeacherMode) {
        // In test mode, show the expected outputs
        outputs.forEach((output, index) => {
            const expectedOutput = calculateExpectedOutput(index);
            showToast(`Output ${index + 1} should be ${expectedOutput}`, 'info');
        });
    } else {
        // In play mode, show the level's predefined outputs
        outputs.forEach((output, index) => {
            const expectedOutput = levels[currentLevel].outputs[index].value;
            showToast(`Output ${index + 1} should be ${expectedOutput}`, 'info');
        });
    }
}

function calculateExpectedOutput(outputIndex) {
    const gateInputs = getGateInputs(outputIndex);
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
            return 0;
    }
}

function getGateInputs(outputIndex) {
    // Get all inputs connected to the gate for this output
    const gate = gates[outputIndex];
    return connections
        .filter(conn =>
            abs(conn.end.x - (gate.x - 30)) < 1 &&
            abs(conn.end.y - gate.y) < 30
        )
        .map(conn => getInputValue(conn.start));
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel(currentLevel);
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
    const nextBtn = document.getElementById('next-question');
    const questionCount = document.getElementById('question-count');

    if (prevBtn && nextBtn && questionCount) {
        prevBtn.disabled = currentLevel === 0;
        nextBtn.disabled = currentLevel === levels.length - 1;
        questionCount.textContent = `Question ${currentLevel + 1} of ${levels.length}`;
    }
} 