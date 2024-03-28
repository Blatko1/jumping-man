const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const jump1 = document.getElementById("jump1");
const gravitational_accel = 1;

let pressed_S = false;
let pressed_D = false;
let pressed_A = false;
let pressed_W = false;
let pressed_space = false;

let player_x = 10;
let player_y = 200;
let player_in_air = false;
let up_force = 0;
let y_vel = 0;
let speed = 0.3;

function drawGame() {
    requestAnimationFrame(drawGame);
    clearScreen();
    process_input();
    drawPlayer();
}

function drawPlayer() {
    player_y -= y_vel * speed;
    y_vel -= gravitational_accel * speed;
    if (player_y > CANVAS_HEIGHT / 2) {
        player_in_air = false;
        y_vel = 0;
    }

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(player_x, player_y, 10, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.drawImage(jump1, player_x - jump1.width / 4, player_y - jump1.height/2, jump1.width / 2, jump1.height / 2);
}

function clearScreen() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function process_input() {
    if (pressed_space) {
        if (!player_in_air) {
            player_in_air = true;
            y_vel = 20;
        }
    }
    if (pressed_W) {
        player_y -= 1;
    }
    if (pressed_S) {
        player_y += 1;
    }
    if (pressed_A) {
        player_x -= 1;
    }
    if (pressed_D) {
        player_x += 1;
    }
}

document.body.addEventListener("keydown", keyDown);
document.body.addEventListener("keyup", keyUp);

function keyDown(event) {
    let key = event.key.toLowerCase();
    if (key == "w") {
        pressed_W = true;
    } else if (key == "a") {
        pressed_A = true;
    } else if (key == "s") {
        pressed_S = true;
    } else if (key == "d") {
        pressed_D = true;
    } else if (key == " ") {
        pressed_space = true;
    }
}

function keyUp(event) {
    let key = event.key.toLowerCase();
    if (key == "w") {
        pressed_W = false;
    } else if (key == "a") {
        pressed_A = false;
    } else if (key == "s") {
        pressed_S = false;
    } else if (key == "d") {
        pressed_D = false;
    } else if (key == " ") {
        pressed_space = false;
    }
}

drawGame();
