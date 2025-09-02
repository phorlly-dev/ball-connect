import FlexiblePath from "./flexible-path.js";

const Events = {
    getMousePosition(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    register({ canvas, state, drawGame, checkGameCompletion, status }) {
        const getMousePos = (e) => this.getMousePosition(e, canvas);

        canvas.addEventListener("mousedown", (e) => {
            if (state.gameCompleted) return;
            const pos = getMousePos(e);
            const ball = state.getBallAt(pos.x, pos.y);
            if (ball && !ball.connected) {
                state.removePathsForBall(ball);
                state.startPath(new FlexiblePath(ball, ball.color, state.ctx, state.balls, state.paths));
            }
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!state.isDragging || !state.currentPath) return;
            const pos = getMousePos(e);
            state.addPointToCurrentPath(pos.x, pos.y);
            drawGame();
        });

        canvas.addEventListener("mouseup", (e) => {
            if (!state.isDragging || !state.currentPath) return;
            state.tryCompletePath(getMousePos(e), status, checkGameCompletion);
            drawGame();
        });

        // Touch support
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const t = e.touches[0];
            canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: t.clientX, clientY: t.clientY }));
        });
        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const t = e.touches[0];
            canvas.dispatchEvent(new MouseEvent("mousemove", { clientX: t.clientX, clientY: t.clientY }));
        });
        canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            canvas.dispatchEvent(new MouseEvent("mouseup", {}));
        });
    },
};

export default Events;
