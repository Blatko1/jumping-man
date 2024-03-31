/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* global deltaTime:readonly, world ctx, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_HEIGHT,
  GRAVITY, player, highScore:writable, lastScore:writable */

class Player {
  constructor(pos, jumpSpeed, jumpingSprites, walkingSprites) {
    this.pressed_jump = false;
    this.pressed_left = false;
    this.pressed_right = false;
    this.pressed_down = false;

    this.pos = pos;
    this.moveSpeed = 350;
    this.jumpSpeed = jumpSpeed;
    this.velocity_y = 0;
    this.is_in_air = true;
    this.jump_height = 20;
    this.scale = 0.7;
    this.currentSprite = jumpingSprites[0];
    this.jumpingSprites = jumpingSprites;

    this.walkIndex = 0;
    this.walkingSprites = walkingSprites;
  }

  draw() {
    ctx.drawImage(
      this.currentSprite,
      this.pos.x - (this.currentSprite.width / 2) * this.scale,
      this.pos.y - this.currentSprite.height * this.scale,
      this.currentSprite.width * this.scale,
      this.currentSprite.height * this.scale,
    );
  }

  update() {
    this.process_input();

    if (this.pos.y > GROUND_HEIGHT) {
      this.is_in_air = true;
    }
    if (this.pos.y > CANVAS_HEIGHT + 200) {
      highScore = Math.max(world.score, highScore);
      lastScore = world.score;
      world.score = 0;
      this.pos.y = -200;
    }

    let tileAt = null;
    for (let i = 0; i < world.tiles.length; i += 1) {
      const tile = world.tiles[i];
      if (this.pos.x >= tile.x1 && this.pos.x <= tile.x2) {
        tileAt = tile;
        break;
      }
    }
    const lastY = this.pos.y;
    this.pos.y -= this.velocity_y * deltaTime * this.jumpSpeed;
    this.velocity_y -= GRAVITY * deltaTime * this.jumpSpeed;

    if (tileAt != null) {
      if (this.pos.y > GROUND_HEIGHT && lastY <= GROUND_HEIGHT) {
        this.pos.y = GROUND_HEIGHT;
        this.is_in_air = false;
        this.velocity_y = 0;
      }
    }

    const vel = Math.abs(this.velocity_y);
    if (this.is_in_air) {
      if (vel < 9) {
        this.currentSprite = this.jumpingSprites[3];
      } else if (vel < 16) {
        this.currentSprite = this.jumpingSprites[2];
      } else {
        this.currentSprite = this.jumpingSprites[1];
      }
    }
  }

  process_input() {
    if (this.pressed_jump) {
      if (!this.is_in_air) {
        player.is_in_air = true;
        player.velocity_y += this.jump_height;
      }
    }
    if (this.pressed_right) {
      this.pos.x += this.moveSpeed * deltaTime;
      if (this.pos.x > CANVAS_WIDTH - 50) {
        this.pos.x = CANVAS_WIDTH - 50;
      }
    }
    if (this.pressed_left) {
      this.pos.x -= this.moveSpeed * deltaTime;
      if (this.pos.x < 50) {
        this.pos.x = 50;
      }
    }
    if (this.pressed_down) {
      this.velocity_y -= GRAVITY * this.jumpSpeed * deltaTime * 1.5;
    }
  }

  alternateWalkingSprite() {
    if (!this.is_in_air) {
      if (this.walkIndex >= this.walkingSprites.length) {
        this.walkIndex = 0;
      }
      this.currentSprite = this.walkingSprites[this.walkIndex];
      this.walkIndex += 1;
    }
  }
}
