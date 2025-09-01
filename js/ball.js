class Ball {
    constructor(x, y, color, colorIndex, id, ctx) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.colorIndex = colorIndex;
        this.id = id;
        this.ctx = ctx;
        this.radius = 25;
        this.connected = false;
        this.connectedTo = null;
    }

    draw() {
        const ctx = this.ctx;

        // Shadow
        ctx.beginPath();
        ctx.arc(this.x + 2, this.y + 2, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fill();

        // Main ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Shine effect
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - 8, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.connected ? "#2c3e50" : "#bdc3c7";
        ctx.lineWidth = this.connected ? 4 : 3;
        ctx.stroke();

        // Inner glow when connected
        if (this.connected) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 2, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    isPointInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

export default Ball;
