import Ball from "./ball.js";

const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#e67e22"];

const generateRandomLevel = (level, ctx, canvasWidth, canvasHeight) => {
    const balls = [];

    // Difficulty scaling
    const numColors = Math.min(3 + Math.floor(level / 10), colors.length);
    const ballsPerColor = Math.min(2 + Math.floor(level / 20), 4);
    const totalBalls = numColors * ballsPerColor;

    const positions = [];
    const minDistance = 80;
    const margin = 50;

    for (let i = 0; i < totalBalls; i++) {
        let valid = false,
            attempts = 0,
            x,
            y;
        while (!valid && attempts < 300) {
            x = margin + Math.random() * (canvasWidth - 2 * margin);
            y = margin + Math.random() * (canvasHeight - 2 * margin);
            valid = positions.every((pos) => Math.hypot(x - pos.x, y - pos.y) >= minDistance);
            attempts++;
        }
        if (valid) positions.push({ x, y });
    }

    let id = 0;
    for (let c = 0; c < numColors; c++) {
        for (let j = 0; j < ballsPerColor; j++) {
            if (positions[id]) {
                const pos = positions[id];
                balls.push(new Ball(pos.x, pos.y, colors[c], c, `ball_${id}`, ctx));
                id++;
            }
        }
    }

    return balls;
};

export default generateRandomLevel;
