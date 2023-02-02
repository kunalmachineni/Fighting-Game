const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const button = document.getElementById('button')
canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 20,
            y: 37
        },
        width: 235,
        height: 50
    }
})
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/Kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/Kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Kenji/attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/Kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -171,
            y: 50
        },
        width: 210,
        height: 50
    }
})
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    A: {
        pressed: false
    },
    D: {
        pressed: false
    },
    W: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}
decreaseTimer()
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(225, 225, 225, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    // player movement
    if (keys.a.pressed && lastKey === 'a' || keys.A.pressed && lastKey === 'A') {
        player.switchSprite('run')
        if (player.position.x !== 0) {
            player.velocity.x = -5
        }
    } else if (keys.d.pressed && lastKey === 'd' || keys.D.pressed && lastKey === 'D') {
        player.switchSprite('run')
        if (player.position.x !== 950) {
            player.velocity.x = 5
        }
    } else {
        player.switchSprite('idle')
    }
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run')
        if (enemy.position.x !== 0) {
            enemy.velocity.x = -5
        }
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run')
        if (enemy.position.x !== 950) {
            enemy.velocity.x = 5
        }
    } else {
        enemy.switchSprite('idle')
    }
    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    // detect the collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }
    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    // this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }
    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }
    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}
animate()
let jumped1 = false
let jumped2 = false
window.addEventListener('keydown', (event) => {
    if (!player.dead && timer !== 0) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                lastKey = 'a'
                break
            case 'w':
                if (!jumped1) {
                    player.velocity.y = -20
                    jumped1 = true
                    setTimeout(() => {
                        jumped1 = false
                    }, 950)
                }
                break
            case 'D':
                keys.D.pressed = true
                lastKey = 'D'
                break
            case 'A':
                keys.A.pressed = true
                lastKey = 'A'
                break
            case 'W':
                if (!jumped1) {
                    player.velocity.y = -20
                    jumped1 = true
                    setTimeout(() => {
                        jumped1 = false
                    }, 950)
                }
                break
            case ' ':
                player.attack()
                break
        }
    }
    if (!enemy.dead && timer !== 0) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if (!jumped2) {
                    enemy.velocity.y = -20
                    jumped2 = true
                    setTimeout(() => {
                        jumped2 = false
                    }, 950)
                }
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'D':
            keys.D.pressed = false
            break
        case 'A':
            keys.A.pressed = false
            break
    }
    switch (event.key) {
        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})