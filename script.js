const dino = document.getElementById('dino');
const barriers = document.querySelector('.barriers');
const scoreSpan = document.getElementById('scoreSpan');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const retryBtn = document.getElementById('retry');
const jumpSound = document.getElementById('jumpSound');

let score = 0;
let isJumping = false;
let gameIsOver = false;
let barrierInterval;

function jump() {
    if (isJumping || gameIsOver) return;

    isJumping = true;
    dino.classList.add("jump");
    jumpSound.play();

    setTimeout(() => {
        dino.classList.remove("jump");
        isJumping = false;
    }, 500);
}

function createBarrier() {
    if (gameIsOver) return;

    const barrier = document.createElement('div');
    barrier.classList.add('barrier');
    barriers.appendChild(barrier);

    let position = window.innerWidth;
    let speed = 5 + Math.floor(score / 10);

    function moveBarrier() {
        if (position <= -50) {
            barrier.remove();
            score++;
            scoreSpan.textContent = score;
        } else {
            position -= speed;
            barrier.style.left = position + 'px';

            let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
            let barrierLeft = position;
            let dinoLeft = 50;

            if (barrierLeft < dinoLeft + 50 && barrierLeft > dinoLeft - 40 && dinoBottom < 60) {
                gameOver();
            }
        }
    }

    let barrierMovement = setInterval(moveBarrier, 20);
    barrier.dataset.interval = barrierMovement;
}

function startBarrierGeneration() {
    barrierInterval = setInterval(() => {
        if (!gameIsOver) {
            setTimeout(createBarrier, Math.random() * 1500 + 1000);
        }
    }, 2000);
}

function gameOver() {
    gameIsOver = true;
    clearInterval(barrierInterval);

    document.querySelectorAll('.barrier').forEach(barrier => {
        clearInterval(parseInt(barrier.dataset.interval));
        barrier.remove();
    });

    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameIsOver = false;
    score = 0;
    scoreSpan.textContent = '0';
    gameOverScreen.classList.add('hidden');
    startBarrierGeneration();
}

document.addEventListener('keydown', (event) => {
    if ((event.code === 'Space' || event.key === 'ArrowUp') && !gameIsOver) {
        jump();
    }
});

retryBtn.addEventListener('click', resetGame);

startBarrierGeneration();
