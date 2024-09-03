import { Scene } from "phaser";

// import class entitities
import { Paddle } from "../entities/Paddle";
import { Ball } from "../entities/Ball";
import { Brick } from "../entities/Brick";
import { WallBrick } from "../entities/WallBrick";

export class Game extends Scene {
  constructor() {
    super("Game");
    this.ballOnPaddle = true; // Nuevo estado para la pelota
  }

  create() {
    this.ballGroup = this.physics.add.group();
    this.bombGroup = this.physics.add.group();

    // Crear una pelota inicial
    this.ball = new Ball(this, 400, 300, 10, 0xffffff, 1);
    this.ballGroup.add(this.ball);

    // Habilitar colisiones con los límites del mundo para el grupo de pelotas
    this.ballGroup.children.iterate((ball) => {
      ball.body.setCollideWorldBounds(true);
      ball.body.setBounce(1);
    });

    // Crear la paleta y los ladrillos
    this.paddle = new Paddle(this, 400, 550, 300, 20, 0xffffff, 1);
    this.wall = new WallBrick(this);

    // Colisiones entre la paleta y las pelotas
    this.physics.add.collider(this.paddle, this.ballGroup);

    // Colisiones entre las pelotas y los ladrillos
    this.physics.add.collider(
      this.ballGroup,
      this.wall,
      this.hitBrick,
      null,
      this
    );

    // Colisiones entre la paleta y las bombas
    this.physics.add.collider(
      this.paddle,
      this.bombGroup,
      this.hitBomb,
      null,
      this
    );

    // Colisión de la pelota con el límite inferior
    this.physics.world.on("worldbounds", (body, up, down) => {
      if (down) {
        this.handleBallOut(body.gameObject);
      }
    });

    // Ajustar la pelota en la posición inicial, sobre la paleta
    this.resetBall();
  }

  resetBall() {
    // Colocar la pelota encima de la paleta
    this.ball.setPosition(
      this.paddle.x,
      this.paddle.y - this.paddle.height / 2 - this.ball.radius
    );
    this.ball.body.setVelocity(0, 0); // Asegurarse de que la pelota no se mueva
    this.ballOnPaddle = true; // Indicar que la pelota está en la paleta
  }

  update() {
    this.paddle.update();

    if (this.ballOnPaddle) {
      // Hacer que la pelota siga la posición de la paleta
      this.ball.x = this.paddle.x;

      // Detectar si el jugador intenta mover la paleta para liberar la pelota
      if (this.paddle.body.velocity.x !== 0) {
        this.releaseBall(); // Liberar la pelota cuando la paleta se mueva
      }
    }
  }

  releaseBall() {
    if (this.ballOnPaddle) {
      this.ball.body.setVelocity(200, -200); // Establecer la velocidad inicial de la pelota
      this.ballOnPaddle = false; // Cambiar el estado de la pelota
    }
  }

  handleBallOut(ball) {
    ball.destroy();
    if (this.ballGroup.countActive() === 0) {
      this.scene.start("GameOver"); // El jugador pierde si no hay más pelotas
    }
  }

  hitBrick(ball, brick) {
    console.log("Colisión detectada entre ball y brick:", brick);

    if (brick instanceof Brick) {
      console.log("Llamando al método hit() en:", brick);
      brick.hit();
    } else {
      console.error("Objeto brick no es una instancia de Brick:", brick);
    }
    ball.destroy()
  }

  addNewBall(x, y) {
    let newBall = new Ball(this, x, y, 10, 0xffffff, 1);
    this.ballGroup.add(newBall);
  }

  addNewBomb(x, y) {
    let bomb = this.physics.add.image(x, y, "bomb");
    bomb.setVelocity(0, 200); // Velocidad hacia abajo
    this.bombGroup.add(bomb);
  }

  hitBomb(paddle, bomb) {
    this.scene.start("GameOver"); // El jugador pierde si una bomba toca la paleta
  }
}
