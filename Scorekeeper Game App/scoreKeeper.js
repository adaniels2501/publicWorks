var p1Button = document.querySelector('#p1'); //uses the hash symbol
var p2Button = document.getElementById('p2');
var p1Display = document.getElementById('p1Display');
var p2Display = document.getElementById('p2Display');
var resetButton = document.getElementById('reset');
var numInput = document.querySelector("input[name='maxScore']");
var winningScoreDisplay = document.querySelector('p span');
var p1Score = 0;
var p2Score = 0;

var gameOver = false;
var winningScore = numInput.value;

p1Button.addEventListener('click', function() {
    if(!gameOver) {
        p1Score++;
        if(p1Score === winningScore) {
            p1Display.classList.add('winner');
            gameOver = true;
        }
        p1Display.textContent = p1Score;
    } 
});

p2Button.addEventListener('click', function() {
    if(!gameOver) {
        p2Score++;
        if(p2Score === winningScore) {
            p2Display.classList.add('winner');
            gameOver = true;
        }
        p2Display.textContent = p2Score;
    }
});

resetButton.addEventListener('click', function() {
    reset();
});

numInput.addEventListener('change', function() {
    winningScoreDisplay.textContent = Number(this.value)
    winningScore = Number(this.value);
    reset();
})

function reset() {
    gameOver = false;
    p1Score = 0;
    p2Score = 0;
    p1Display.textContent = 0;
    p2Display.textContent = 0;
    p1Display.classList.remove('winner');
    p2Display.classList.remove('winner');
}