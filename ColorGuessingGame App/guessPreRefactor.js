//QUESTION TO ASK AFTER FINISHING
//WHAT IF THE RANDOM COLOR CLOSELY MATCHES THE DEFAULT TEXT COLOR????

//set the number of squares default to be 6
var numSquares = 6;
// var colors = generateRandomColors(numSquares);
var colors = []; // we can do this because it's being handled in the reset function
// var pickedColor = pickColor();
var pickedColor; // we can do this because it's being handled in the reset function
var squares = document.querySelectorAll('.square');
var colorDisplay = document.getElementById('colorDisplay');
var messageDisplay = document.querySelector('#message');
var h1 = document.querySelector('h1');
var resetButton = document.querySelector('#reset');
var modeButtons = document.querySelectorAll('.mode');


//----------------------------------------------------------
//RUNS ON PAGE LOAD
init();

function init() {
    //MODE BUTTON EVENT LISTENERS
    //REFACTORING THE BUTTONS -- ALSO ALLOWS FOR ADDING MORE MODES AND BUTTONS TO THE GAME WITHOUT ADDITIONAL CODE
    // var easyBtn = document.querySelector('#easyBtn');
    // var hardBtn = document.querySelector('#hardBtn');
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener('click', function () {
            modeButtons[0].classList.remove('selected');
            modeButtons[1].classList.remove('selected');
            this.classList.add('selected');
            this.textContent === 'Easy' ? numSquares = 3 : numSquares = 6;
            // REFACTORING IF STATEMENT WITH TERNARY OPERATORS
            // if(this.textContent ==== 'Easy') {
            //     numSquares = 3;
            // } else {
            //     numSquares = 6;
            // }
            reset();

        });
    }
 
    for (var i = 0; i < squares.length; i++) {
        //add click listeners to squares
        squares[i].addEventListener('click', function () {
            //grab color of clicked square
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === pickedColor) {
                resetButton.textContent = 'Play Again?'
                messageDisplay.textContent = 'Correct!!';
                changeColors(clickedColor);
                h1.style.backgroundColor = clickedColor;
            } else {
                this.style.backgroundColor = '#232323'
                messageDisplay.textContent = 'Try Again!';
            }
        });
    }
    reset();
}

function reset() {
    //generate all new colors
    colors = generateRandomColors(numSquares);
    //pick a new random color from arr
    pickedColor = pickColor();
    //change colorDisplay to match pickedColor
    colorDisplay.textContent = pickedColor;
    resetButton.textContent = 'New Colors';
    messageDisplay.textContent = '';
    //change colors of squares
    for(var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = colors[i];
        if(colors[i]) {
            squares[i].style.display = 'block';
            squares[i].style.backgroundColor = colors[i];
        } else {
           squares[i].style.display = 'none'; 
        }
    }
    h1.style.backgroundColor = 'steelblue';
}
//REFACTORING THESE BUTTONS AND LISTENERS INTO THE RESET FUNCTION ABOVE

// easyBtn.addEventListener('click', function() {
//     easyBtn.classList.add('selected');
//     hardBtn.classList.remove('selected');
//     //set squares to be 3
//     numSquares = 3;
//     //generate random colors for the selected number of squares
//     colors = generateRandomColors(numSquares);    
//     //pick the necessary colors
//     pickedColor = pickColor();
//     colorDisplay.textContent = pickedColor;
//     for(var i = 0; i < squares.length; i++) {
//         //if there is a color at that INDEX [i]
//         if(colors[i]) {
//             //for the first 3 - because colors has 3 - we're going to loop and check for a color and if there is one we will change the color
//             squares[i].style.backgroundColor = colors[i];
//         //use the else statement to hide the remaining 3 squares as they did not have a color associated in the above loop
//         } else {
//             squares[i].style.display = 'none';
//         }
//     }
// });

// hardBtn.addEventListener('click', function() {
//     easyBtn.classList.remove('selected');
//     hardBtn.classList.add('selected');  
//     numSquares = 6;
//     colors = generateRandomColors(numSquares);
//     pickedColor = pickColor();
//     colorDisplay.textContent = pickedColor;
//     for(var i = 0; i < squares.length; i++) {
//         squares[i].style.backgroundColor = colors[i];
//         squares[i].style.display = 'block';
//     }
// });

//----------------------------------------------------------

//REFACTORING THE RESET BUTTON CODE!

// resetButton.addEventListener('click', function() {
//     //generate all new colors
//     colors = generateRandomColors(numSquares);
//     //pick a new random color from arr
//     pickedColor = pickColor();
//     //change colorDisplay to match pickedColor
//     colorDisplay.textContent = pickedColor;
//     this.textContent = 'New Colors';
//     messageDisplay.textContent = '';
//     //change colors of squares
//     for(var i = 0; i < squares.length; i++) {
//         squares[i].style.backgroundColor = colors[i];
//     }
//     h1.style.backgroundColor = 'steelblue';
// })

resetButton.addEventListener('click', function() {
    reset();
})

// OLD CODE BEFORE REFACTOR MOVED TO INIT FUNCTION
// for (var i = 0; i < squares.length; i++) {
//     //add initial color to squares
//     squares[i].style.backgroundColor = colors[i];
//     //add click listeners to squares
//     squares[i].addEventListener('click', function () {
//         //grab color of clicked square
//         var clickedColor = this.style.backgroundColor;
//         //compare to pickedColor
//         console.log(clickedColor, pickedColor)
//         if (clickedColor === pickedColor) {
//             resetButton.textContent = 'Play Again?'
//             messageDisplay.textContent = 'Correct!!';
//             changeColors(clickedColor);
//             h1.style.backgroundColor = clickedColor;
//         } else {
//             this.style.backgroundColor = '#232323'
//             messageDisplay.textContent = 'Try Again!';
//         }
//     });
// }

function changeColors(color) {
    //loop through all squares
    for(var i = 0; i < squares.length; i++) {
        //change each color to match given color
        squares[i].style.backgroundColor = color;
    }
}

function pickColor() {
    //get random number
    var random = Math.floor(Math.random() * colors.length);
    //access an element from an array at that index
    return colors[random];
}

function generateRandomColors(num) {
    //make an array
    var arr = []
    //repeat num times
    for(var i = 0; i < num; i++) {
        //get random color and push into arr
        arr.push(randomColor())
    }
    //return array at end
    return arr;
}

function randomColor() {
    //pick a 'red' from 0 to 255
    var r = Math.floor(Math.random() * 256);
    //pick a 'green' from 0 to 255
    var g = Math.floor(Math.random() * 256);
    //pick a 'blue' from 0 to 255
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}
