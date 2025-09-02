import Events from "./events.js";
import GameStates from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const status = document.getElementById("status");
    const levelTitle = document.getElementById("title");
    const levelInfo = document.getElementById("subtile");

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
                    }, 1000);
                }
            }
            this.currentPath = null;
            this.isDragging = false;
        },
    };

    // Drawing
    const drawGame = () => GameStates.drawGame(ctx, state, canvas);

    // Level init
    const initGame = (level = 1) =>
        GameStates.initGame({
            level,
            ctx,
            canvas,
            levelInfo,
            levelTitle,
            state,
            drawGame,
            checkGameCompletion,
            status,
        });

    // Completion check
    const checkGameCompletion = () => GameStates.checkGameCompletion(state, status, initGame);

    // Controls
    const resetGame = () => GameStates.resetGame(state, initGame);
    const showHint = () => GameStates.showHint(state, status);

    // Register canvas listeners
    Events.register({ canvas, state, drawGame, checkGameCompletion, status });

    // Expose
    window.resetGame = resetGame;
    window.showHint = showHint;

    // Init
    initGame();
});
