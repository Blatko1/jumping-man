class Player {
  constructor(pos, speed, jumpingSprites, walkingSprites) {
    this.pos = pos;
    this.speed = speed;
    this.velocity_y = 0;
    this.pressed_jump = false;
    this.is_in_air = true;
    this.jump_height = 20;
    this.scale = 0.7;
    this.current_sprite = jumpingSprites[0];
    this.jumpingSprites = jumpingSprites;
    this.walkingSprites = walkingSprites;
  }

  draw() {
    ctx.drawImage(
      this.current_sprite,
      this.pos.x - (this.current_sprite.width / 2) * this.scale,
      this.pos.y - this.current_sprite.height * this.scale,
      this.current_sprite.width * this.scale,
      this.current_sprite.height * this.scale
    );
  }

  update() {
    this.process_input();

    if (this.pos.y > GROUND_HEIGHT) {
      this.is_in_air = true
    }
    if (this.pos.y > CANVAS_HEIGHT + 200) {
      this.pos.y = -200
    }

    let tileAt = null;
    for (let i = 0; i < world.tiles.length; i++) {
      let tile = world.tiles[i];
      if (this.pos.x >= tile.x1 && this.pos.x <= tile.x2) {
        tileAt = tile;
        break;
      }
    }
    let lastY = this.pos.y
    this.pos.y -= this.velocity_y * deltaTime * this.speed;
    this.velocity_y -= GRAVITY * deltaTime * this.speed;

    if (tileAt != null) {
      if (
        this.pos.y >
        GROUND_HEIGHT && lastY <= GROUND_HEIGHT
      ) {
        this.pos.y = GROUND_HEIGHT;
        this.is_in_air = false
        this.velocity_y = 0;
      }
    }

    let vel = Math.abs(this.velocity_y)
    if (this.is_in_air) {
    if (vel < 9) {
      this.current_sprite = this.jumpingSprites[3];
    } else if (vel < 16) {
      this.current_sprite = this.jumpingSprites[2];
    } else {
      this.current_sprite = this.jumpingSprites[1];
    }
  } else {
    this.current_sprite = this.jumpingSprites[0];
  }
  }

  process_input() {
    if (this.pressed_jump) {
      if (!this.is_in_air) {
        player.is_in_air = true;
        player.velocity_y += this.jump_height;
      }
    }
  }
}
