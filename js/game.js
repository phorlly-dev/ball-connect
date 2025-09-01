import Ball from "./ball.js";

// Utility functions
const doLinesIntersect = (p1, p2, p3, p4) => {
    const [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y];
    const [x3, y3, x4, y4] = [p3.x, p3.y, p4.x, p4.y];

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denominator) < 0.0001) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    return t > 0.1 && t < 0.9 && u > 0.1 && u < 0.9;
};

const distanceFromPointToLine = (px, py, x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
};

export { distanceFromPointToLine, doLinesIntersect };
