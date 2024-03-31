/* global deltaTime:readonly, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_HEIGHT,
  highScore, lastScore */
class Tile {
  constructor(x1, x2) {
    this.x1 = x1;
    this.x2 = x2;
  }
}

// eslint-disable-next-line no-unused-vars
class World {
  constructor(groundTexture, backgrounds, groundScrollSpeed) {
    this.score = 0;

    this.tiles = [];
    this.defaultMinWidthFactor = 0.9;
    this.minWidthFactor = this.defaultMinWidthFactor;
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    this.defaultMinHoleWidth = 60;
    this.defaultMaxHoleWidth = 160;
    this.minHoleWidth = this.defaultMinHoleWidth;
    this.maxHoleWidth = this.defaultMaxHoleWidth;

    this.groundOffset = 30;
    this.defaultGroundScrollSpeed = groundScrollSpeed;
    this.groundScrollSpeed = groundScrollSpeed;
    this.groundTex = groundTexture;

    this.currentBgIndex = 0;
    this.lastBgIndex = null;
    this.bgAlpha = 1.0;
    this.transitionSpeed = 0.3;
    this.backgrounds = backgrounds;
  }

  update() {
    // Generate or delete ground tiles
    this.minWidthFactor = Math.min(
      1.0,
      (this.defaultMinWidthFactor + 5) / this.score,
    );
    this.minHoleWidth = this.defaultMinHoleWidth + this.score * 1.5;
    this.maxHoleWidth = this.defaultMaxHoleWidth + this.score * 1.5;
    this.randWidthFactor = 1.0 - this.minWidthFactor;
    if (this.tiles.length !== 0) {
      this.generateTiles(this.tiles[this.tiles.length - 1].x2);
      if (this.tiles[0].x2 < 0) {
        this.tiles.shift();
        this.score += 1;
      }
    } else {
      this.generateTiles(0);
    }

    // Move the ground tiles
    this.groundScrollSpeed = this.defaultGroundScrollSpeed + this.score * 15;
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i].x1 -= deltaTime * this.groundScrollSpeed;
      this.tiles[i].x2 -= deltaTime * this.groundScrollSpeed;
    }

    if (this.lastBgIndex != null) {
      this.bgAlpha = Math.min(
        1.0,
        this.bgAlpha + deltaTime * this.transitionSpeed,
      );
      if (this.bgAlpha === 1.0) {
        this.lastBgIndex = null;
      }
    }
  }

  generateTiles(lastXArg) {
    let lastX = lastXArg;
    while (this.tiles.length < 7) {
      const newTileX1 = lastX
        + Math.min(
          this.maxHoleWidth,
          Math.random() * (this.maxHoleWidth - this.minHoleWidth)
            + this.minHoleWidth,
        );
      const newTileX2 = newTileX1
        + this.minWidthFactor * this.groundTex.width
        + Math.random() * this.groundTex.width * this.randWidthFactor;
      const newTile = new Tile(newTileX1, newTileX2);
      this.tiles.push(newTile);
      lastX = newTileX2;
    }
  }

  draw() {
    if (this.lastBgIndex != null) {
      const currentBg = this.backgrounds[this.currentBgIndex];
      const lastBg = this.backgrounds[this.lastBgIndex];
      ctx.globalAlpha = 1.0 - this.bgAlpha;
      ctx.drawImage(lastBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = this.bgAlpha;
      ctx.drawImage(currentBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.globalAlpha = 1.0;
    } else {
      const bg = this.backgrounds[this.currentBgIndex];
      ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    for (let i = 0; i < this.tiles.length; i += 1) {
      const tile = this.tiles[i];
      const texWidth = tile.x2 - tile.x1;
      const texHeight = this.groundTex.height;
      ctx.drawImage(
        this.groundTex,
        0,
        0,
        texWidth,
        texHeight,
        tile.x1,
        GROUND_HEIGHT - this.groundOffset,
        texWidth,
        texHeight,
      );
    }
    ctx.save();
    ctx.font = '30px serif';
    ctx.fillText(`Score: ${this.score}`, CANVAS_WIDTH - 200, 40);
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 240, 80);
    ctx.fillText(`Last Score: ${lastScore}`, CANVAS_WIDTH - 235, 120);
    ctx.restore();
  }

  alternateBackground() {
    if (this.lastBgIndex == null) {
      this.bgAlpha = 0.0;
      this.lastBgIndex = this.currentBgIndex;
      this.currentBgIndex = Math.floor(Math.random() * this.backgrounds.length);
    }
  }
}
