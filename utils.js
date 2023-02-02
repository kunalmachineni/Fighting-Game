function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health && timer === 0) {
        document.querySelector('#displayText').innerHTML = '<h1>Tie</h1>'
    } else if (player.health <= enemy.health && timer === 0) {
        document.querySelector('#displayText').innerHTML = '<h1>Kenji did more damage</h1>'
    } else if (player.health >= enemy.health && timer === 0) {
        document.querySelector('#displayText').innerHTML = '<h1>Samurai Mack did more damage</h1>'
    } else if (player.health > enemy.health && timer !== 0) {
        document.querySelector('#displayText').innerHTML = '<h1>Samurai Mack Wins</h1>'
    } else if (player.health < enemy.health && timer !== 0) {
        document.querySelector('#displayText').innerHTML  = '<h1>Kenji Wins</h1>'
    }
}
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}