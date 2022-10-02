const canvas = document.getElementById("Main") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

interface Vec {
    x: number,
    y: number
}
interface Ball {
    position: Vec,
    velocity: Vec,
    size: number
}
interface Paddle {
    position: Vec,
    size: Vec,
}


var player: Paddle;
var enemy: Paddle;
var ball: Ball;
{
    const width = window.innerWidth;
    const height = window.innerHeight * .9;
    ball = {
        position: {x: width/2, y: height/2},
        velocity: {x: 7, y: 5},
        size: 15,
    };
    const paddleWidth = 20;
    const paddleHeight = 60;
    player = {
        position: {x: 20, y: height/2 - paddleHeight / 2},
        size: {x: paddleWidth, y: paddleHeight}
    }
    enemy = {
        position: {x: width - paddleWidth - 20, y: height/2 - paddleHeight / 2},
        size: {x: paddleWidth, y: paddleHeight}
    }
};

function AABB(ap: Vec, as: Vec, bp: Vec, bs: Vec): boolean {
    if (ap.x + as.x > bp.x && bp.x + bs.x > ap.x) {
        if (ap.y + as.y > bp.y && bp.y + bs.y > ap.y) {
            return true;
        }
    }
    return false;
}

setInterval(() => {
    const width = window.innerWidth;
    const height = window.innerHeight * .9;
    canvas.width = width;
    canvas.height = height;

    enemy.position.x = width - 20 - enemy.size.x - 1;

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
    if (ball.position.y < 0) {
        ball.position.y = 0;
        ball.velocity.y *= -1;
    }
    if (ball.position.y + ball.size > height) {
        ball.position.y = height - ball.size;
        ball.velocity.y *= -1;
    }

    enemy.position.y = ball.position.y;

    if (AABB(ball.position, {x: ball.size, y: ball.size}, enemy.position, enemy.size)) {
        ball.velocity.x *= -1;
        ball.position.x += ball.velocity.x;
    }
    if (AABB(ball.position, {x: ball.size, y: ball.size}, player.position, player.size)) {
        ball.velocity.x *= -1;
        ball.position.x += ball.velocity.x;
    }

    if (ball.position.x <  -10 || ball.position.x > width) {
        ball.position.x = width/2;
    }

    if (player.position.y + player.size.y > height) player.position.y = height - player.size.y;
    if (enemy.position.y + enemy.size.y > height) enemy.position.y = height - enemy.size.y;
    
    // drawing
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "black";
    context.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);
    context.fillRect(enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
    context.fillStyle = "red";
    context.fillRect(ball.position.x, ball.position.y, ball.size, ball.size);
}, 1000/50);
document.onmousemove = (ev) => {
    player.position.y = ev.pageY;
}
