export class Ball extends Phaser.GameObjects.Arc {
  constructor(scene, x, y, radius, color, alpha) {
    super(scene, x, y, radius, 0, 360, false, color, alpha);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(1, 1);
    this.body.setVelocity(200, 200);

    this.body.onWorldBounds = true;
  }

  increaseSpeed() {
    this.body.velocity.x *= 1.1;
    this.body.velocity.y *= 1.1;
  }

  resetPosition() {
    this.setPosition(400, 300);
    this.body.setVelocity(200, 200);
  }

  // Método para agregar una nueva pelota
  addNewBall(x, y) {
    let newBall = new Ball(this, x, y, 10, 0xffffff, 1);
    this.ballGroup.add(newBall);
  }

  // Método para manejar cuando una pelota sale de la pantalla
  handleBallOut(ball) {
    ball.destroy();
    if (this.ballGroup.countActive() === 0) {
      this.scene.start("GameOver"); // El jugador pierde si no hay más pelotas
    }
  }
}
