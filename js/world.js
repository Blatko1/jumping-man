class Tile {
  constructor(x1, x2) {
    this.x1 = x1;
    this.x2 = x2;
  }
}

class World {
  constructor(groundTexture, backgrounds, groundScrollSpeed) {
    this.tiles = [];
    this.minWidthFactor = 0.2;
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    this.minHoleWidth = 60;
    this.maxHoleWidth = 150;

    this.groundOffset = 30;
    this.groundScrollSpeed = groundScrollSpeed;
    this.groundTex = groundTexture;

    this.currentBgIndex = 0
    this.lastBgIndex = null
    this.bgAlpha = 1.0
    this.transitionSpeed = 0.3
    this.backgrounds = backgrounds;
  }

  update() {
    // Generate or delete ground tiles
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    if (this.tiles.length != 0) {
      this.generateTiles(this.tiles[this.tiles.length - 1].x2)
      if (this.tiles[0].x2 < 0) this.tiles.shift();
    } else {
      this.generateTiles(-this.maxHoleWidth)
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

  generateTiles(last_x) {
    let lastX = last_x
    while (this.tiles.length < 7) {
      let new_tile_x1 = lastX + Math.min(this.maxHoleWidth, Math.random() * (this.maxHoleWidth - this.minHoleWidth) + this.minHoleWidth);
      let new_tile_x2 =
        new_tile_x1 +
          this.minWidthFactor * this.groundTex.width +
            Math.random() * this.groundTex.width * this.randWidthFactor;
      let new_tile = new Tile(new_tile_x1, new_tile_x2);
      this.tiles.push(new_tile);
      lastX = new_tile_x2
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
