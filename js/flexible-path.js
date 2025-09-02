import GameStates from "./game.js";

class FlexiblePath {
    constructor(startBall, color, ctx, balls, paths) {
        this.startBall = startBall;
        this.endBall = null;
        this.color = color;
        this.ctx = ctx;
        this.balls = balls;
        this.paths = paths;
        this.points = [{ x: startBall.x, y: startBall.y }];
        this.completed = false;
    }

    addPoint(x, y) {
        this.points.push({ x, y });
    }

    draw() {
        const ctx = this.ctx;
        if (this.points.length < 2) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Glow
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        // Main line
        ctx.globalAlpha = 1;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        // Highlight
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    crossesBalls() {
        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            for (const ball of this.balls) {
                if (ball === this.startBall || ball === this.endBall) continue;
                const distance = GameStates.distanceFromPointToLine(ball.x, ball.y, p1.x, p1.y, p2.x, p2.y);
                if (distance < ball.radius - 5) return true;
            }
        }
        return false;
    }

    crossesPaths() {
        for (const otherPath of this.paths) {
            if (otherPath === this || !otherPath.completed) continue;
            for (let i = 0; i < this.points.length - 1; i++) {
                for (let j = 0; j < otherPath.points.length - 1; j++) {
                    if (
                        GameStates.doLinesIntersect(
                            this.points[i],
                            this.points[i + 1],
                            otherPath.points[j],
                            otherPath.points[j + 1]
                        )
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

export default FlexiblePath;
