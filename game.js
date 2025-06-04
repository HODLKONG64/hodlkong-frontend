let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

let player = { x: 50, y: 550, w: 32, h: 32, vy: 0, jumping: false };
let keys = {};
let gravity = 1;
let score = 0;

let platforms = [{ x: 0, y: 580, w: 800, h: 20 }];
let coins = [];

function spawnCoin() {
  let x = Math.random() * 750 + 25;
  let y = Math.random() * 500 + 50;
  coins.push({ x, y, r: 10 });
}
setInterval(spawnCoin, 2000);

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;
  if (keys[" "] && !player.jumping) {
    player.vy = -15;
    player.jumping = true;
  }

  player.vy += gravity;
  player.y += player.vy;

  platforms.forEach(p => {
    if (player.y + player.h >= p.y && player.y + player.h <= p.y + p.h &&
        player.x + player.w >= p.x && player.x <= p.x + p.w) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.jumping = false;
    }
  });

  coins.forEach((coin, i) => {
    let dx = player.x + player.w/2 - coin.x;
    let dy = player.y + player.h/2 - coin.y;
    if (Math.sqrt(dx*dx + dy*dy) < 20) {
      score += 100;
      coins.splice(i, 1);
    }
  });
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "white";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.fillStyle = "gold";
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "cyan";
  ctx.font = "20px monospace";
  ctx.fillText("Score: " + score, 20, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();