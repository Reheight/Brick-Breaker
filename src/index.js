import Game from "../src/game";

let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.update(deltaTime);
  game.draw(context);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
