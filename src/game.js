import Paddle from "../src/paddle";
import InputHandler from "../src/input";
import Ball from "../src/ball";
import { buildLevel, level1, level2 } from "../src/levels";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4
};

export default class Game {
  constructor(GAME_WIDTH, GAME_HEIGHT) {
    this.gameWidth = GAME_WIDTH;
    this.gameHeight = GAME_HEIGHT;

    this.gamestate = GAMESTATE.MENU;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;

    this.levels = [level1, level2];

    this.currentLevel = 0;

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL
    )
      return;

    let bricks = buildLevel(this, this.levels[this.currentLevel]);

    this.ball.reset();
    this.bricks = bricks;

    this.gameObjects = [this.ball, this.paddle];

    this.gamestate = GAMESTATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER
    )
      return;

    [...this.gameObjects, ...this.bricks].forEach((object) =>
      object.update(deltaTime)
    );

    this.bricks = this.bricks.filter((object) => !object.markedForDeletion);

    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.gamestate = GAMESTATE.NEWLEVEL;
      this.start();
    }
  }

  draw(context) {
    [...this.gameObjects, ...this.bricks].forEach((object) =>
      object.draw(context)
    );

    switch (this.gamestate) {
      case GAMESTATE.MENU:
        context.rect(0, 0, this.gameWidth, this.gameHeight);
        context.fillStyle = "rgba(0,0,0,1)";
        context.fill();

        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(
          "Space to begin",
          this.gameWidth / 2,
          this.gameHeight / 2
        );
        break;
      case GAMESTATE.PAUSED:
        context.rect(0, 0, this.gameWidth, this.gameHeight);
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fill();

        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
        break;
      case GAMESTATE.GAMEOVER:
        context.rect(0, 0, this.gameWidth, this.gameHeight);
        context.fillStyle = "rgba(0,0,0,1)";
        context.fill();

        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(
          "YOU FAILED!",
          this.gameWidth / 2,
          this.gameHeight / 2
        );
        break;
      default:
        break;
    }
  }

  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
