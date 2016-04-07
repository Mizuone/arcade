function start() {
    "use strict";
    var canvas = document.getElementById("myCanvas"), ctx = canvas.getContext("2d"), 
rectangleOne = {x: 0, y: 250, width: 15, height: 100, speedx: 1, speedy: -1}, 
rectangleTwo = {x: 785, y: 250, width: 15, height: 100, speedx: 2, speedy: -1}, 
ballObject = {x: 200, y: 250, radius: 10, speedx: 4, speedy: -2}, playerScore = 0, computerScore = 0,
        theWinner = " ", delay = 2000, optionScreen = false;
    
    function handleMouseClick(evt) {
        if(optionScreen) {
            playerScore = 0;
            computerScore = 0;
            theWinner = "";
            optionScreen = false;
            window.requestAnimationFrame(drawAll);
        }
    };
    
    
    //adds input from mouse onto player paddle
    canvas.addEventListener("mousedown", handleMouseClick);
    
    canvas.addEventListener("mousemove", function(evt) {
            var mousePos = calculateMousePos(evt);
            rectangleOne.y = mousePos.y - rectangleOne.height / 2;
    });
    //mouse function for canvas coordinates from mouse
    function calculateMousePos(evt) {
        
        var rect = canvas.getBoundingClientRect(), 
            root = document.documentElement,
            mouseX = evt.clientX - rect.left - root.scrollLeft,
            mouseY = evt.clientY - rect.top - root.scrollTop;
        
        return {
                x:mouseX,
                y:mouseY
            
        };
    };
    function Winner() { 
        if (playerScore == 10) {
            theWinner = "Player Wins!";
            setTimeout(function() {
                    optionScreen = true;
                }, delay);
        } 
        if (computerScore == 10) {
            theWinner = "Computer Wins!";
            setTimeout(function() {
                    optionScreen = true;
                }, delay);
        }
    };
    function clickOption() {
        ctx.font = "3.5em Arial";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillText("Click to Continue", 200, 300);
        ctx.closePath();
        ctx.fill();
    };
    function computerMovement() {
        if(rectangleTwo.y < ballObject.y - rectangleTwo.height / 2) {
            rectangleTwo.y += 2;
        } else {
            rectangleTwo.y -= 2;
        }
    };
    //resets ball position when called
    function drawNet() {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.setLineDash([14]);
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, 650);
            ctx.closePath();
            ctx.stroke();
    };
    function ballReset() {
        ballObject.speedx = 4;
        ballObject.speedy = -2;
        ballObject.speedx = -(ballObject.speedx)
        ballObject.x = canvas.width / 2;
        ballObject.y = canvas.height / 2;
        
    };
    function drawWinner() {
        ctx.font = "3.5em Arial";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillText("" + theWinner, 225, 80);
        ctx.closePath();
        ctx.fill();
    };
    //this is the left paddle
    function drawRectangle1() {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(rectangleOne.x, rectangleOne.y, rectangleOne.width, rectangleOne.height);
        ctx.closePath();
        ctx.fill();
        
    };
    //draws player score
    function drawScorePlayer() {
        ctx.font = "4em Arial";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillText(" " + playerScore, 100, 80);
        ctx.closePath();
        ctx.fill();
        
    };
    //draws computer score
    function drawScoreComputer() {
        ctx.font = "4em Arial";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillText(" " + computerScore, 650, 80);
        ctx.closePath();
        ctx.fill();
    };
    //this is the right paddle
    function drawRectangle2() {
        ctx.beginPath();
        ctx.fillRect(rectangleTwo.x, rectangleTwo.y, rectangleTwo.width, rectangleTwo.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    };
    //draws ball onto canvas
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballObject.x, ballObject.y, ballObject.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath;
    };
    //gives objects collision mechanics, and conditions
    function moveObjects() {
        //collision between objects
        if (optionScreen) {
            clickOption();
            return;
        }
        //x-axis collision for ball against canvas
        /*if (ballObject.x > canvas.width - ballObject.radius) {
           
            ballObject.speedx = -(ballObject.speedx);
        }*/ 
                //ball collision against left paddle    
                if(ballObject.y > rectangleOne.y - 2 &&
                   ballObject.y < rectangleOne.y + rectangleOne.height - 5 &&
                   ballObject.x > rectangleOne.x &&
                   ballObject.x < rectangleOne.x + rectangleOne.width + 7){
                    
                        ballObject.speedx = -(ballObject.speedx);
                        
                        var deltaY = ballObject.y
                        -(rectangleOne.y + rectangleOne.height / 2);
                    ballObject.speedy = deltaY * 0.35;
                }
                //ball collision against right paddle
                if(ballObject.y > rectangleTwo.y - 2 &&
                   ballObject.y < rectangleTwo.y + rectangleTwo.height - 5 &&
                   ballObject.x > rectangleTwo.x - 2 &&
                   ballObject.x < rectangleTwo.x + rectangleTwo.width){

                    ballObject.speedx = -(ballObject.speedx);
                        
                        var bravoY = ballObject.y
                        -(rectangleTwo.y + rectangleTwo.height / 2);
                    ballObject.speedy = bravoY * 0.35;
                }
                    
                //if ball x-axis goes beyond these conditions ball position resets
                if(ballObject.x < 0) {
                    computerScore++; //must be before reset
                    ballReset();
                    Winner();
                }
                if(ballObject.x > canvas.width) {
                    playerScore++;
                    ballReset();
                    Winner();
                }
            
        //x-axis collision for paddles against canvas
        if (rectangleOne.x > canvas.width - rectangleOne.width ||
           rectangleOne.x < 0) {
           
            rectangleOne.speedx = -(rectangleOne.speedx);
        }
        //y-axis collision for paddle against canvas
         if (ballObject.y > canvas.height - ballObject.radius ||
           ballObject.y < 0 + ballObject.radius) {
           
            ballObject.speedy = -(ballObject.speedy);
        }
        if (rectangleOne.y > canvas.height - rectangleOne.height ||
           rectangleOne.y < 0) {
            
            rectangleOne.speedy = -(rectangleOne.speedy);
        }
        
        //moves objects
        ballObject.x += ballObject.speedx;
        ballObject.y += ballObject.speedy;
    };
    //draws all objects that are called on canvas
    function drawAll() {
        //refreshes canvas everyone to give the animation effect
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (optionScreen) {
            clickOption();
            return;
        }
        
        //calling functions to draw objects
        drawNet();
        drawRectangle1();
        drawRectangle2();
        drawBall();
        drawScorePlayer();
        drawScoreComputer();
        computerMovement();
        drawWinner();
        moveObjects();
        
        
        //requests an animation from the browser API onto canvas = to user refresh rate
        window.requestAnimationFrame(drawAll);
    };
    //draw all calls all mechanics and conditions and relys it to start function
    drawAll();
};
//starts the program when called
start();