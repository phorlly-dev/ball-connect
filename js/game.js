import generateRandomLevel from "./levels.js";

const GameStates = {
    doLinesIntersect(p1, p2, p3, p4) {
        const [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y];
        const [x3, y3, x4, y4] = [p3.x, p3.y, p4.x, p4.y];

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denominator) < 0.0001) return false;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        return t > 0.1 && t < 0.9 && u > 0.1 && u < 0.9;
    },
    distanceFromPointToLine(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;

        return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
    },
    drawGame(ctx, state, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.paths.filter((p) => p.completed).forEach((p) => p.draw());
        if (state.currentPath) state.currentPath.draw();
        state.balls.forEach((b) => b.draw());
    },
    initGame({ level, state, ctx, canvas, drawGame, levelTitle, levelInfo, status }) {
        state.currentLevel = level;
        levelTitle.textContent = level;

        state.balls = generateRandomLevel(level, ctx, canvas);

        state.paths = [];
        state.gameCompleted = false;
        status.textContent = "Draw flexible lines to connect same colors!";
        status.className = "status";

        const colorCount = [...new Set(state.balls.map((b) => b.colorIndex))].length;
        levelInfo.textContent = colorCount;

        if (state.autoAdvanceTimeout) {
            clearTimeout(state.autoAdvanceTimeout);
            state.autoAdvanceTimeout = null;
        }

        drawGame();
    },
    checkGameCompletion(state, status, initGame) {
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
    },
    showHint(state, status) {
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
    },
    resetGame(state, initGame) {
        if (state.autoAdvanceTimeout) {
            clearTimeout(state.autoAdvanceTimeout);
            state.autoAdvanceTimeout = null;
        }
        initGame(state.currentLevel);
    },
};

export default GameStates;
