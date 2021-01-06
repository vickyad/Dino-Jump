/* --> Constants <-- */
// HTML Elements
const restartDialog = document.getElementById('restart-dialog')
const cancelButton = document.getElementById('cancel')
const confirmButton = document.getElementById('confirm')

// Assets
let dinoImg
let platformImg
let backgroundImg

// Board attirbutes
const boardWidth = window.innerWidth > window.innerHeight? window.innerWidth * 0.55 : window.innerWidth
const boardHeight = window.innerHeight

// Dino attributes
let dinoSize = Math.floor(boardHeight / 10)
let dinoX
let dinoY
let dinoVelocity
let dinoXSpeed = 4

// Platform attributes
let platformHeight = Math.floor(boardHeight / 45)
let platformWidth = platformHeight * 3
let numOfPlatforms = Math.floor(boardHeight / 130)
let platformList = []
let platYChange = 0

// General attributes
let gameStarted
let gameOver = false
let score = 0


/* --> Inicialization <-- */
restartDialog.close()


/* --> Functions <-- */
//  Preload the Image Sprites
function preload() {
    dinoImg = loadImage('./assets/dinossauro.svg')
    platformImg = loadImage('./assets/platform.png')
    backgroundImg = loadImage('./assets/background.png')
}

//  Controllers
function setup() {
    createCanvas(boardWidth,boardHeight)
    frameRate(60)
    gameStarted = false
    
  }
  
  function draw() {
    background(backgroundImg)
    if(gameOver){
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
    } else if(gameStarted) {
      //Draw the game
      drawPlatforms()
      drawdino()
      checkCollision()
      movedino()
      moveScreen()
      fill('#121212')
      textSize(60);
      text(score, boardWidth - 80, boardHeight * 0.08)
    } else {
      // Start menu
      textSize(60);
      text("Start", boardWidth/2 - 60, boardHeight/2 - 60)
    }
}

function moveScreen() {
  if(dinoY < 50) {
    platYChange = 3
    dinoVelocity += 0.25
  } else {
    platYChange = 0
  }
}

// Start Game
function mousePressed() {
  if(gameStarted === false) {
    score = 0
    setupPlatforms()
    dinoY = 350
    dinoX = platformList[platformList.length - 1].xPos + 15
    dinoVelocity = 0.1
    gameStarted = true
  }
}

//  dino
function drawdino() {
  fill(204, 200, 52)
  // rect(dinoX, dinoY, dinoSize, dinoSize);
  image(dinoImg, dinoX, dinoY, dinoSize, dinoSize)
}

function movedino() {
  // dino falls with gravity
  dinoVelocity += 0.2
  dinoY += dinoVelocity

  if (keyIsDown(LEFT_ARROW)) {
    dinoX -= dinoXSpeed
  }
  if (keyIsDown(RIGHT_ARROW)) {
    dinoX += dinoXSpeed
  }
}

//  Platforms
function setupPlatforms() {
  for(var i=0; i < numOfPlatforms; i++) {
    var platGap = height / numOfPlatforms
    var newPlatformYPosition = i * platGap
    var plat = new Platform(newPlatformYPosition)
    platformList.push(plat)
  }
}

function drawPlatforms() {
  fill(106, 186, 40)
  platformList.forEach(function(plat) {
    // move all platforms down
    plat.yPos += platYChange
    // rect(plat.xPos, plat.yPos, plat.width, plat.height);
    image(platformImg, plat.xPos, plat.yPos, plat.width, plat.height)

    if(plat.yPos > boardHeight - 50) {
      score++
      platformList.pop()
      var newPlat = new Platform(0)
      platformList.unshift(newPlat) // add to front
    }
  });
}

function Platform(newPlatformYPosition) {
  this.xPos = random(15, boardWidth - 100)
  this.yPos = newPlatformYPosition
  this.width = platformWidth
  this.height = platformHeight
}

//  Collisions
function checkCollision() {
  platformList.forEach(function(plat) {
    if(
      dinoX < plat.xPos + plat.width &&
      dinoX + dinoSize > plat.xPos &&
      dinoY + dinoSize < plat.yPos + plat.height &&
      dinoY + dinoSize > plat.yPos &&
      dinoVelocity > 0
    ) {
      dinoVelocity = -10
    }
  });
  
  if(dinoY > height) {
    gameOver = true
    gameStarted = false
    platformList = []
  }
  
  // screen wraps from left to right
  if(dinoX < -dinoSize) {
    dinoX = width
  } else if(dinoX > width) {
    dinoX = -dinoSize
  }
}