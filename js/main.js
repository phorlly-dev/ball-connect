import registerCanvasEvents from "./events.js";
import generateRandomLevel from "./levels.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");
const levelTitle = document.getElementById("levelTitle");
const levelInfo = document.getElementById("levelInfo");

const state = {
    balls: [],
    paths: [],
    currentPath: null,
    isDragging: false,
    gameCompleted: false,
    currentLevel: 1,
    autoAdvanceTimeout: null,
    ctx,
    getBallAt(x, y) {
        return this.balls.find((b) => b.isPointInside(x, y));
    },
    removePathsForBall(ball) {
        this.paths = this.paths.filter((p) => p.startBall !== ball && p.endBall !== ball);
        this.balls.forEach((b) => {
            if (b.connectedTo === ball) {
                b.connected = false;
                b.connectedTo = null;
            }
        });
        ball.connected = false;
        ball.connectedTo = null;
    },
    startPath(path) {
        this.currentPath = path;
        this.isDragging = true;
    },
    addPointToCurrentPath(x, y) {
        const last = this.currentPath.points[this.currentPath.points.length - 1];
        if (Math.hypot(x - last.x, y - last.y) > 8) this.currentPath.addPoint(x, y);
    },
    tryCompletePath(pos, statusEl, checkGameCompletion) {
        const endBall = this.getBallAt(pos.x, pos.y);
        if (
            endBall &&
            endBall !== this.currentPath.startBall &&
            endBall.colorIndex === this.currentPath.startBall.colorIndex &&
            !endBall.connected
        ) {
            this.currentPath.addPoint(endBall.x, endBall.y);
            this.currentPath.endBall = endBall;
            if (!this.currentPath.crossesBalls() && !this.currentPath.crossesPaths()) {
                this.currentPath.completed = true;
                this.paths.push(this.currentPath);
                this.currentPath.startBall.connected = this.currentPath.endBall.connected = true;
                this.currentPath.startBall.connectedTo = this.currentPath.endBall;
                this.currentPath.endBall.connectedTo = this.currentPath.startBall;
                checkGameCompletion();
            } else {
                statusEl.textContent = "❌ Path crosses obstacles! Try again.";
                statusEl.className = "status error";
                setTimeout(() => {
                    if (!this.gameCompleted) {
                        statusEl.textContent = "Draw flexible lines to connect same colors!";
                        statusEl.className = "status";
                    }
                }, 2000);
            }
        }
        this.currentPath = null;
        this.isDragging = false;
    },
};

// Drawing
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.paths.filter((p) => p.completed).forEach((p) => p.draw());
    if (state.currentPath) state.currentPath.draw();
    state.balls.forEach((b) => b.draw());
}

// Level init
function initGame(level = 1) {
    state.currentLevel = level;
    levelTitle.textContent = `Level ${level}`;

    state.balls = generateRandomLevel(level, ctx, canvas.width, canvas.height);

    state.paths = [];
    state.gameCompleted = false;
    status.textContent = "Draw flexible lines to connect same colors!";
    status.className = "status";

    const colorCount = [...new Set(state.balls.map((b) => b.colorIndex))].length;
    levelInfo.textContent = `Draw curved lines • Connect same colors • ${colorCount} colors`;

    if (state.autoAdvanceTimeout) {
        clearTimeout(state.autoAdvanceTimeout);
        state.autoAdvanceTimeout = null;
    }

    drawGame();
}

// Completion check
function checkGameCompletion() {
    const groups = {};
    state.balls.forEach((b) => (groups[b.colorIndex] = groups[b.colorIndex] || []).push(b));
    const allConnected = Object.values(groups).every((g) => g.length <= 1 || g.every((b) => b.connected));
    if (allConnected && state.paths.filter((p) => p.completed).length >= Object.keys(groups).length) {
        state.gameCompleted = true;
        status.textContent = `🎉 Level ${state.currentLevel} Completed! Auto-advancing...`;
        status.className = "status completed";
        state.autoAdvanceTimeout = setTimeout(() => {
            initGame(state.currentLevel + 1);
        }, 1000);
    }
}

// Controls
function resetGame() {
    if (state.autoAdvanceTimeout) {
        clearTimeout(state.autoAdvanceTimeout);
        state.autoAdvanceTimeout = null;
    }
    initGame(state.currentLevel);
}
function showHint() {
    const unconnected = state.balls.filter((b) => !b.connected);
    if (unconnected.length > 0) {
        status.textContent = `💡 Try connecting the ${
            ["red", "blue", "green", "orange", "purple"][unconnected[0].colorIndex] || "colored"
        } balls!`;
    } else {
        status.textContent = "💡 Draw smooth curves to avoid crossing!";
    }
    setTimeout(() => {
        if (!state.gameCompleted) {
            status.textContent = "Draw flexible lines to connect same colors!";
            status.className = "status";
        }
    }, 1000);
}

// Register canvas listeners
registerCanvasEvents(canvas, state, drawGame, checkGameCompletion, status);

// Expose
window.resetGame = resetGame;
window.showHint = showHint;

// Init
initGame();
