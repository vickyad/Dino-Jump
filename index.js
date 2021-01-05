const grid = document.getElementById('grid')
const doodler = document.createElement('div')

let doodlerLeftSpace = 50
let startPoint = 150
let doodlerBottomSpace = startPoint
let isGameOver = false
let plataformCount = 5
let plataforms = []
let upTimerId
let downTimerId
let isJumping = true
let isGoingLeft = false
let isGoingRight = false
let leftTimerId
let rightTimerId
let score = 0

function createDoodler(){
    doodler.classList.add('doodler')

    doodlerLeftSpace = plataforms[0].left
    doodler.style.left = `${doodlerLeftSpace}px`
    doodler.style.bottom = `${doodlerBottomSpace}px`
    grid.appendChild(doodler)
}

class Plataform {
    constructor(newPlataformBottom) {
        this.bottom = newPlataformBottom
        this.left = Math.random() * 315
        this.visual = document.createElement('div')

        this.visual.classList.add('plataform')
        this.visual.style.left = `${this.left}px`
        this.visual.style.bottom = `${this.bottom}px`

        grid.appendChild(this.visual)
    }
}


function createPlataforms() {
    let plataformGap = 600 / plataformCount

    for(let i = 0; i < plataformCount; i++) {
        let newPlataformBottom = 100 + i * plataformGap
        let newPlataform = new Plataform(newPlataformBottom)
        plataforms.push(newPlataform)
    }
}

function movePlataforms() {
    if(doodlerBottomSpace > 200) {
        plataforms.forEach(plataform => {
            plataform.bottom -= 4
            plataform.visual.style.bottom = `${plataform.bottom}px`

            if(plataform.bottom < 10) {
                plataforms[0].visual.classList.remove('plataform')
                plataforms.shift()

                let newPlataform = new Plataform(600)
                plataforms.push(newPlataform)

                score++
            }
        })
    }
}

function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(() => {
        doodlerBottomSpace += 20
        doodler.style.bottom = `${doodlerBottomSpace}px`
        if(doodlerBottomSpace > startPoint + 200) {
            fall()
        }
    }, 30)
}

function fall() {
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(() => {
        doodlerBottomSpace -= 5
        doodler.style.bottom = `${doodlerBottomSpace}px`

        if(doodlerBottomSpace <= 0) {
            gameOver()
        }

        plataforms.forEach(plataform => {
            if((doodlerBottomSpace >= plataform.bottom) && (doodlerBottomSpace <= (plataform.bottom + 15)) && ((doodlerLeftSpace + 60) >= plataform.left) && (doodlerLeftSpace <= (plataform.left + 85)) && !isJumping) {
                console.log('landed')
                startPoint = doodlerBottomSpace
                jump()
            }
        })
    }, 30)
}

function gameOver() {
    console.log('game over')
    isGameOver = true
    while(grid.firstChild){
        grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}

function control(e) {
    switch(e.key){
        case 'ArrowLeft':
            moveLeft()
            break
        case 'ArrowRight':
            moveRight()
            break
        case 'ArrowUp':
            //moveStraight()
            break
    }
}

function moveLeft() {
    clearInterval(rightTimerId)
    isGoingRight = false

    isGoingLeft = true
    leftTimeId = setInterval(() => {
        if(doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 5
            doodler.style.left = `${doodlerLeftSpace}px`
        }
    }, 20)
}

function moveRight() {
    clearInterval(leftTimerId)
    isGoingLeft = false

    isGoingRight = true
    rightTimerId  = setInterval(() => {
        if(doodlerLeftSpace <= (400 - 60)) {
            doodlerLeftSpace += 5
            doodler.style.left = `${doodlerLeftSpace}px`
        }
    }, 20)
}

function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}

function main() {
    if(!isGameOver) {
        createPlataforms()
        createDoodler()
        setInterval(movePlataforms, 30)
        jump()
        document.addEventListener('keydown', control)
    }
}

main() // attach to button