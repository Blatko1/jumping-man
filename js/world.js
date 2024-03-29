class Tile {
  constructor(x1, x2) {
    this.x1 = x1;
    this.x2 = x2;
  }
}

class World {
  constructor(groundTexture, backgrounds, groundScrollSpeed) {
    this.tiles = [];
    this.minWidthFactor = 0.7;
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    this.holeWidth = 100;
    this.groundOffset = 30;
    this.groundScrollSpeed = groundScrollSpeed;
    this.groundTex = groundTexture;
    this.currentBgIndex = 0
    this.lastBgIndex = null
    this.bgAlpha = 1.0
    this.transitionSpeed = 0.3
    this.backgrounds = backgrounds;
    //this.groundTex.onload = function () {
    //  th
    //}
  }

  update() {
    // Generate or delete ground tiles
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    if (this.tiles.length != 0) {
      if (this.tiles[0].x2 < 0) this.tiles.shift();
    }
    while (this.tiles.length < 7) {
      let last_tile_x = null;
      if (this.tiles.length == 0) {
        last_tile_x = -this.holeWidth;
      } else {
        last_tile_x = this.tiles[this.tiles.length - 1].x2;
      }
      let new_tile_x1 = last_tile_x + this.holeWidth;
      let new_tile_x2 =
        new_tile_x1 +
        Math.min(
          this.minWidthFactor * this.groundTex.width +
            Math.random() * this.groundTex.width * this.randWidthFactor,
          this.groundTex.width
        );
      let new_tile = new Tile(new_tile_x1, new_tile_x2);
      this.tiles.push(new_tile);
    }

    // Move the ground tiles
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].x1 -= deltaTime * this.groundScrollSpeed;
      this.tiles[i].x2 -= deltaTime * this.groundScrollSpeed;
    }

    if (this.lastBgIndex != null) {
        this.bgAlpha = Math.min(1.0, this.bgAlpha + deltaTime * this.transitionSpeed)
        if (this.bgAlpha == 1.0) {
            this.lastBgIndex = null
        }
    }
  }

  draw() {
    if (this.lastBgIndex != null) {
        let currentBg = this.backgrounds[this.currentBgIndex];
        let lastBg = this.backgrounds[this.lastBgIndex];
        ctx.globalAlpha = 1.0 - this.bgAlpha
        ctx.drawImage(lastBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.globalAlpha = this.bgAlpha
        ctx.drawImage(currentBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.globalAlpha = 1.0
    } else {
        let bg = this.backgrounds[this.currentBgIndex];
        ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    for (let i = 0; i < this.tiles.length; i++) {
      let tile = this.tiles[i];
      let texWidth = tile.x2 - tile.x1;
      let texHeight = this.groundTex.height;
      ctx.drawImage(
        this.groundTex,
        0,
        0,
        texWidth,
        texHeight,
        tile.x1,
        GROUND_HEIGHT - this.groundOffset,
        texWidth,
        texHeight
      );
    }
  }

  alternateBackground() {
    if (this.lastBgIndex == null) {
      this.bgAlpha = 0.0
      this.lastBgIndex = this.currentBgIndex
      this.currentBgIndex = Math.floor(Math.random() * this.backgrounds.length)
    }
  }
}
