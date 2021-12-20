const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");


const config = {
    width  : ( canvas.width = 500 ),
    height : ( canvas.height = 400 ),
    color  : "white",
    playerWidth  : 15,
    playerHeight : 70,
    margin : 20,
    ballSpeed  : 1,
    ballRadius : 5,
    velocityX  : 1,
    velocityY  : -1,
    lastWinner : null,
    fontSize   : 30,
    paddleSpeed : 20
};


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = config.playerWidth;
        this.height = config.playerHeight;
        this.score = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = config.color;
        ctx.rect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.closePath();
    }

    drawScore(x, y) {
        ctx.beginPath();
        ctx.fillStyle = config.color;
        ctx.font = `${config.fontSize}px Monospace`;
        ctx.fillText(this.score, x, y);
        ctx.closePath();
    }
}


class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = config.ballRadius;
        this.velocityX = config.velocityX;
        this.velocityY = config.velocityY;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = config.color;
        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
    }

}


const player1 = new Player(config.margin, config.height / 2 - (config.playerHeight / 2) );
const player2 = new Player(config.width - config.margin - config.playerWidth, config.height / 2 - (config.playerHeight / 2) );
const ball = new Ball(config.width / 2, config.height / 2);


function clear() {
    ctx.beginPath();
    ctx.clearRect(0, 0, config.width, config.height);
    ctx.closePath();
}


function draw() {
    player1.draw();
    player2.draw();
    ball.draw();
    player1.drawScore(config.width / 4, config.height /  6, config.color);
    player2.drawScore(3 * config.width / 4 - config.fontSize, config.height /  6, config.color);
}


function collision(player) {

    // player

    let left = player.x;
    let right = player.x + config.playerWidth;
    let top = player.y;
    let bottom = player.y + config.playerHeight;
    
    // ball

    ball.left = ball.x - config.ballRadius;
    ball.right = ball.x + config.ballRadius;
    ball.top = ball.y - config.ballRadius;
    ball.bottom = ball.y + config.ballRadius;

    return ball.right > left && ball.top < bottom && ball.left < right && ball.bottom > top;
}


function reset() {


    ball.x = config.width / 2;
    ball.y = config.height / 2;
    config.ballSpeed = 1;
    config.velocityX = 0;
    config.velocityY = 0;

    setTimeout(() => {
        config.velocityX = 1;
        config.velocityY = [-1, 1][Math.floor(Math.random() * 2)];
        config.velocityX = (config.lastWinner == 1) ? config.velocityX : -config.velocityX;
    }, 1000);


}



// Movements, collision detection, score and draw update
function update() {

    clear();
    draw();

    // wall collision

    if (ball.y + config.ballRadius > config.height || ball.y + config.ballRadius < config.ballRadius) {
        config.velocityY = -config.velocityY;
    }


    // player1
    if (ball.x - config.ballRadius < 0 ) {
        reset();
        player1.score += 1;
        config.lastWinner = 1;
    } 


    //player2
    if (ball.x + config.ballRadius > config.width) {
        reset();
        player2.score += 1;
        config.lastWinner = 2;
    }

    // which player
    let p = (ball.x > canvas.width / 2) ? player2 : player1;

    if ( collision(p) ) {


        let collide = (ball.y - (p.y + config.playerHeight / 2) );
        collide = collide / (config.playerHeight / 2);

        let angle = (Math.PI / 4) * collide;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        config.velocityX = direction * config.ballSpeed * Math.cos(angle);
        config.velocityY = config.ballSpeed * Math.sin(angle);


        config.ballSpeed += 1;
    }


    ball.x += config.velocityX;
    ball.y += config.velocityY;

    requestAnimationFrame(update);
}


window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowUp":
            if ( player2.y <= 0 ) {
            player2.y = 0;
            } else {
            player2.y -= config.paddleSpeed;
            }
            break;
        case "ArrowDown":
            if ( player2.y >= config.height - config.playerHeight ) {
            player2.y = config.height - config.playerHeight;
            } else {
            player2.y += config.paddleSpeed;
            }
            break; 

        case "KeyW":
            if ( player1.y <= 0 ) {
                player1.y = 0;
            } else {
                player1.y -= config.paddleSpeed;
            }
            break;
        case "KeyS":
            if ( player1.y >= config.height - config.playerHeight ) {
                player1.y = config.height - config.playerHeight;
            } else {
                player1.y += config.paddleSpeed;
            }
            break; 
    }
});




window.requestAnimationFrame(update);