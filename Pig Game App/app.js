/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

BONUS RULES:

1. A player loses their ENTIRE score when they roll two 6's in a row. After that, it's the next player's turn.
2. Players can choose their own score to play to
3. Add a second die to the game, so that there are two dice now. The player loses his current score when one of them is a 1.

*/


//Defining our variables in the global scope for access
//gamePlaying boolean is declared
var scores, roundScore, activePlayer, gamePlaying, gameLimit;
//initialize the game
init();
var lastRoll;
// ===============================================================
// DOM manipulation
// ===============================================================
//setting up event handler for the Roll Dice button
document.querySelector('.btn-roll').addEventListener('click', () => {
    if(gamePlaying && gameLimit !== '') {
        //calculate random number for the dice between 1-6
        var dice1 = Math.floor(Math.random() * 6 + 1);
        var dice2 = Math.floor(Math.random() * 6 + 1);
        //set the die to be displayed
        //display the result
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        //set the image die to show based on the random number generated and saved to the dice variable
        document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';
        // if (dice === 6 && lastRoll === 6) {
        //     //player loses score if double 6 rolls
        //     scores[activePlayer];
        //     document.querySelector('#score-' + activePlayer).textContent = 0;
        //     nextPlayer();
        //     //update the round score IF roll != 1
        //     //avoid type coercion using !== 
        // } else 
        if (dice1 !== 1 && dice2 !== 1) {
            // alert('user rolled a 1 or two 6\'s');
            //add and update roundScore
            roundScore += dice1 + dice2;
            //display the roundScore value for the active player
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            //refactored to move to nextPlayer function
            nextPlayer();
        }
        // lastRoll = dice;
    }
});

// ===============================================================
// IMPLEMENT HOLD FEATURE WITH CALLBACK AND LISTENER
// ===============================================================
document.querySelector('.btn-hold').addEventListener('click', () => {
    //if gamePlaying used to make sure the game is active, otherwise we don't want anything to work other than NEW GAME
    if (gamePlaying && gameLimit !== '') {
        //add current score to players score
        //we have the active player variable and the scores array
        //we can use player variable to read/write the scores into the array
        scores[activePlayer] += roundScore;
        //update the UI to show the players score
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        //check if player won the game
        if(scores[activePlayer] >= gameLimit) {
            //declare the winner
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            //remove the dice image
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            //toggle winner css class
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            //toggle active class
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            //set gamePlaying to false to lock out the roll button when the game is over
            gamePlaying = false;
        } else {
            //switch activePlayer
            nextPlayer(); 
        }
    }
});

//doesnt receive any parameters or use any arguments. its for simplifying code
function nextPlayer() {
    //switch player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    //reset roundScore to 0 if the player makes a mistake
    roundScore = 0;
    //change the current score for either player back to 0
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    //switch active class to current player using toggle
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    //hide the dice image
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
};
// ===============================================================
// CONFIGURE NEW GAME BUTTON
// ===============================================================
//call init function when button is pressed. no () because we don't want to immediately invoke the function
document.querySelector('.btn-new').addEventListener('click', init);

//initialize the game
function init() {
    scores = [0, 0];
    roundScore = 0;
    gamePlaying = true;
    gameLimit = document.getElementById('gameLimit').value;
    //0 is player 1 and 1 is player 2
    //we will use 0 and 1 to write the player score to the array
    activePlayer = 0; 
    //hiding the dice image
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    //setting/resetting initial scores
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    //setting/resetting player names
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    //remove winner css class from either/both
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    //remove active class from player 1
    document.querySelector('.player-0-panel').classList.remove('active');
    //remove active class from player 2
    document.querySelector('.player-1-panel').classList.remove('active');
    //reset player 1 to have active class
    document.querySelector('.player-0-panel').classList.add('active');
}



































