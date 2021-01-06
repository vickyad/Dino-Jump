/*Downloaded from https://www.codeseek.co/ainc/doodle-jump-complete-ZxGXwd */
const restartDialog = document.getElementById('restart-dialog')
const cancelButton = document.getElementById('cancel')
const confirmButton = document.getElementById('confirm')

const boardWidth = window.innerWidth > window.innerHeight? window.innerWidth * 0.55 : window.innerWidth
const boardHeight = window.innerHeight

let doodlerSize = Math.floor(boardHeight / 10)
let doodlerX;
let doodlerY;
let doodlerVelocity;
let doodlerXSpeed = 4;
let platformHeight = Math.floor(boardHeight / 58)
let platformWidth = platformHeight * 5
let numOfPlatforms = Math.floor(boardHeight / 130);
let platformList = [];
let platYChange = 0;
let gameStarted;
let score = 0;
let doodlerImg;
let platformImg;
let gameOver = false


restartDialog.close()

// ===========================
//  Preload the Image Sprites
// ===========================
function preload() {
    doodlerImg = loadImage('https://www.flaticon.com/svg/static/icons/svg/145/145321.svg')
    platformImg = loadImage("https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-platform.png")
}

// ===========================
//  Controllers
// ===========================
function setup() {
    createCanvas(boardWidth,boardHeight);
    frameRate(60);
    gameStarted = false;
}

function draw() {
    background(247, 239, 231);
    
    if(gameStarted) {
        //Draw the game
        drawPlatforms();
        drawDoodler();
        checkCollision();
        moveDoodler();
        moveScreen();
        textSize(60);
        text(score, boardWidth - 80, boardHeight * 0.08)
    } else if (gameOver){
        gameOver = false

        // Check if the user would like to restart the game
        restartDialog.showModal()
        confirmButton.addEventListener('click', () => {
            restartDialog.close()
        })
        cancelButton.addEventListener('click', () => {
            restartDialog.close()
            remove()
        })
    } else {
        // Start menu
        textSize(60);
        text("Start", boardWidth/2 - 60, boardHeight/2 - 60);
    }
}

function moveScreen() {
  if(doodlerY < 50) {
    platYChange = 3;
    doodlerVelocity += 0.25;
  } else {
    platYChange = 0;
  }
}

// Start Game
function mousePressed() {
  if(gameStarted === false) {
    score = 0;
    setupPlatforms();
    doodlerY = 350;
    doodlerX = platformList[platformList.length - 1].xPos + 15;
    doodlerVelocity = 0.1;
    gameStarted = true;
  }
}

// ===========================
//  Doodler
// ===========================
function drawDoodler() {
  fill(204, 200, 52);
  // rect(doodlerX, doodlerY, doodlerSize, doodlerSize);
  image(doodlerImg, doodlerX, doodlerY, doodlerSize, doodlerSize);
}

function moveDoodler() {
  // doodler falls with gravity
  doodlerVelocity += 0.2;
  doodlerY += doodlerVelocity;

  if (keyIsDown(LEFT_ARROW)) {
    doodlerX -= doodlerXSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    doodlerX += doodlerXSpeed;
  }
}

// ===========================
//  Platforms
// ===========================
function setupPlatforms() {
  for(var i=0; i < numOfPlatforms; i++) {
    var platGap = height / numOfPlatforms;
    var newPlatformYPosition = i * platGap;
    var plat = new Platform(newPlatformYPosition);
    platformList.push(plat);
  }
}

function drawPlatforms() {
  fill(106, 186, 40);
  platformList.forEach(function(plat) {
    // move all platforms down
    plat.yPos += platYChange;
    // rect(plat.xPos, plat.yPos, plat.width, plat.height);
    image(platformImg, plat.xPos, plat.yPos, plat.width, plat.height);

    if(plat.yPos > boardHeight - 50) {
      score++;
      platformList.pop();
      var newPlat = new Platform(0);
      platformList.unshift(newPlat); // add to front
    }
  });
}

function Platform(newPlatformYPosition) {
  this.xPos = random(15, boardWidth - 100);
  this.yPos = newPlatformYPosition;
  this.width = platformWidth;
  this.height = platformHeight;
}

// ===========================
//  Collisions
// ===========================
function checkCollision() {
  platformList.forEach(function(plat) {
    if(
      doodlerX < plat.xPos + plat.width &&
      doodlerX + doodlerSize > plat.xPos &&
      doodlerY + doodlerSize < plat.yPos + plat.height &&
      doodlerY + doodlerSize > plat.yPos &&
      doodlerVelocity > 0
    ) {
      doodlerVelocity = -10;
    }
  });
  
  if(doodlerY > height) {
    gameOver = true
    gameStarted = false;
    platformList = [];
  }
  
  // screen wraps from left to right
  if(doodlerX < -doodlerSize) {
    doodlerX = width;
  } else if(doodlerX > width) {
    doodlerX = -doodlerSize;
  }
}