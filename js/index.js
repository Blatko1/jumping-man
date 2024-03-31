/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const canvas = document.getElementById('canvas');
canvas.focus();
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRAVITY = 1;
const GROUND_HEIGHT = CANVAS_HEIGHT * 0.7;

// eslint-disable-next-line prefer-const
let lastScore = 0;
// eslint-disable-next-line prefer-const
let highScore = 0;

const jumpSprites = document.getElementsByClassName('jumpSprite');
const walkSprites = document.getElementsByClassName('walkSprite');
const player = new Player({ x: 100, y: -400 }, 30, jumpSprites, walkSprites);

const groundTexture = document.getElementById('ground');
const backgrounds = document.getElementsByClassName('background');
const world = new World(groundTexture, backgrounds, 250);

let lastTime = performance.now();
let deltaTime = 1;
let secondTimer = performance.now();
let avgFPSTime = 0;
let frameCount = 0;
let FPSText = 'FPS: ';

function updateFPS() {
  const currentTime = performance.now();
  deltaTime = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;
  avgFPSTime += deltaTime;
  frameCount += 1;

  if (performance.now() - secondTimer > 1000) {
    FPSText = `FPS: ${(1.0 / (avgFPSTime / frameCount)).toFixed(2)}`;
    secondTimer = performance.now();
    frameCount = 0;
    avgFPSTime = 0;
  }
  ctx.fillText(FPSText, 10, 10);
}

function mainLoop() {
  requestAnimationFrame(mainLoop);

  // Update
  player.update();
  world.update();

  // Draw
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  world.draw();
  player.draw();

  updateFPS();
}

function keyDown(event) {
  const key = event.key.toLowerCase();
  if (key === ' ' || event.keyCode === 38) {
    event.preventDefault();
    player.pressed_jump = true;
  } else if (key === 'd' || event.keyCode === 39) {
    event.preventDefault();
    player.pressed_right = true;
  } else if (key === 'a' || event.keyCode === 37) {
    event.preventDefault();
    player.pressed_left = true;
  } else if (key === 's' || event.keyCode === 40) {
    event.preventDefault();
    player.pressed_down = true;
  }
}

function keyUp(event) {
  const key = event.key.toLowerCase();
  if (key === ' ' || event.keyCode === 38) {
    player.pressed_jump = false;
  } else if (key === 'd' || event.keyCode === 39) {
    player.pressed_right = false;
  } else if (key === 'a' || event.keyCode === 37) {
    player.pressed_left = false;
  } else if (key === 's' || event.keyCode === 40) {
    player.pressed_down = false;
  }
}

function onTouchStart(event) {
  if (event.touches[0]) {
    player.pressed_jump = true;
  }
}

function onTouchEnd(event) {
  if (event.changedTouches[0]) {
    player.pressed_jump = false;
  }
}

canvas.addEventListener('keydown', keyDown, false);
canvas.addEventListener('keyup', keyUp, false);
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener(
  'mousedown',
  () => {
    player.pressed_jump = true;
  },
  false,
);
canvas.addEventListener(
  'mouseup',
  () => {
    player.pressed_jump = false;
  },
  false,
);

document.body.onload = function onLoad() {
  mainLoop();
  setInterval(world.alternateBackground.bind(world), Math.random() * 5000 + 5000);
  setInterval(player.alternateWalkingSprite.bind(player), 100);
};
