export class Brick extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, alpha, isBallCreator = false, isBombCreator = false) {
    super(scene, x, y, width, height, color, alpha);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.immovable = true;
    this.body.setCollideWorldBounds(true);

    this.toches = 0;
    this.maxToches = Phaser.Math.Between(1, 4);
    this.isBallCreator = isBallCreator;
    this.isBombCreator = isBombCreator;
  }

  hit() {
    this.toches++;
    if (this.toches === 1) {
      this.setFillStyle(0xff0000);
    }
    if (this.toches === 2) {
      this.setFillStyle(0x00ff00);
    }
    if (this.toches === 3) {
      this.setFillStyle(0x0000ff);
    }

    if (this.toches === this.maxToches) {
      if (this.isBallCreator) {
        this.scene.addNewBall(this.x, this.y);
      }
      if (this.isBombCreator) {
        this.scene.addNewBomb(this.x, this.y);
      }
      this.destroy();
    }
  }
}
