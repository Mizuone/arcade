function start() {
    var canvas = document.getElementById("myCanvas"), ctx = canvas.getContext("2d"),// stores id mycanvas into var named canvas
        firstBall = {x: 200, y: 200, radius: 10, speedx: 2, speedy: -2}, //firstball variables
        secondBall = {x: 250, y: 250, radius: 10, speedx: 2, speedy: -2}, //second ball variables
        paddle = {x: canvas.width - paddleWidth / 2, y: canvas.height, width: 75, height: 20},
        audiobackground = new Audio('sound/Stellardrone - Billions And Billions.mp3'), bounceSound = new Audio('sound/bounce-effect.wav'),
        score = 0, lives = 10, delayDouble = 2000, delay = 4000, upPressed = false, downPressed = false, rightPressed = false, leftPressed = false, 
        spacePressed = false, cancelAnimation; 

    var paddleHeight = 20; /* Paddle Object Height */
    var paddleWidth = 75;  /* Paddle Object Width */
    var paddleX = (canvas.width - paddleWidth) / 2; /* Starting point on the X-Axis */
    var paddleY = (canvas.height); //Starting point on the Y-Axis
    
	//brick variable objects
	var brickRowCount = 5, brickColumnCount = 7, brickWidth = 75, brickHeight = 20, brickPadding = 5, brickOffsetTop = 30, brickOffsetLeft = 20; //number of rows

	//Each bricks is storted into bricks array, this creates a two-dimensional array one for rows, the other for columns
		var bricks = [];
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                var brickArray = bricks[c][r] = { x: 0, y: 0, status: 1, lives: 3}; //creates brick to have a status 1 for visable 0 for invisable
            }
        }
        //document.addEventListener("mousemove", mouseMoveHandler, false); //EventListener for Mousemovement
    
        document.addEventListener("keydown", keyDownHandler, false); //EventListener for key down commands
    
        document.addEventListener("keyup", keyUpHandler, false); //EventListener for key up commands
    
        function keyDownHandler(e) { // if key down then KeyDownHandler is true
                if (e.keyCode == 68) { // 68 = A Fire when user presses A on keyboard
                    rightPressed = true;
                } //if it equals a variable then it will be true else it will fire next variable
                else if (e.keyCode == 65) { //65 = D Fire when user presses D on keyboard
                    leftPressed = true;
                }
                if (e.keyCode == 87) {
                    upPressed = true;
                }
                else if (e.keyCode == 83) {
                    downPressed = true;
                }
				if (e.keyCode ==	32)  {
					spacePressed = true;
					pauseGame();
				}
            }
        function keyUpHandler(e) { //if key up then KeyupHandler is true, and movement variables stop firing
                if (e.keyCode == 68) {
                    rightPressed = false;
                }
                else if (e.keyCode == 65) {
                    leftPressed = false;
                }
                if (e.keyCode == 87) {
                    upPressed = false;
                }
                else if (e.keyCode == 83) {
                    downPressed = false;
                }
				if (e.keyCode ==	32) {
					spacePressed = false;
					draw();
				}
            }
        function drawBall() {
            ctx.beginPath();
            //x and y variables gets updated on everyframe, ballradius is size of object
            ctx.arc(firstBall.x, firstBall.y, firstBall.radius, 0, Math.PI*2);
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fill();
            ctx.closePath();
        }
        function drawSecondball() {
            ctx.beginPath();
            ctx.arc(secondBall.x, secondBall.y, secondBall.radius, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fill();
            ctx.closePath();
        }
        <!--Draws Paddle Object onto canvas object-->
        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, paddleY - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
         }
				
        function drawBricks() {
            //loops through each brick in the array and draws them onto the canvas
            for(c = 0; c < brickColumnCount; c++) {
                for(r = 0; r < brickRowCount; r++) {
                    if(bricks[c][r].status == 1) {//if brick status = 1 draw this set of instructions
                        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft; //adds correct padding/offset to brick x axis
                        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop; //adds correct padding/offset to brick y axis
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "rgba(0, 161, 3, 0.5)";
                        ctx.fill();
                        ctx.closePath();
                    }
                    if(bricks[c][r].status == 2) {
                        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft; //adds correct padding/offset to brick x axis
                        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop; //adds correct padding/offset to brick y axis
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                         ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
				}
			}
		}
    //collision dectection for brick objects
        function collisionDetection() {
            
            for(c = 0; c < brickColumnCount; c++) {
                for(r = 0; r < brickRowCount; r++) {
                    var b = bricks[c][r];
                    if (b.status == 1) {
                        if (firstBall.x > b.x && firstBall.x < b.x + brickWidth &&
                           firstBall.y > b.y && firstBall.y < b.y + brickHeight + 10) { //all four conditions have to be met before ball moves reverse
                            
                            firstBall.speedy = -(firstBall.speedy);
                            firstBall.speedx = -Math.abs(firstBall.speedx);
                            b.lives--;
                            b.status++;
                           bounceSound.play();
                           bounceSound.volume = 0.8;
                            //sets status of that brick hit to 0, making it disappear
                            score++;
                        }
                        if (secondBall.x > b.x && secondBall.x < b.x + brickWidth &&
                           secondBall.y > b.y && secondBall.y < b.y + brickHeight + 10 ||
                           secondBall.x > b.x && secondBall.x < b.x + brickWidth &&
                           secondBall.y > b.y && secondBall.y < b.y + brickHeight - 30) { //all four conditions have to be met before ball moves reverse
                            b.lives--;
                            b.status++;
                            secondBall.speedy = -(secondBall.speedy);
                            secondBall.speedx = -Math.abs(secondBall.speedx);
                            bounceSound.play();
                            bounceSound.volume = 0.8;
                            //sets status of that brick hit to 0, making it disappear
                            score++;
                        }
                    }
                    if (b.status == 2) {
                        if (firstBall.x > b.x && firstBall.x < b.x + brickWidth &&
                           firstBall.y > b.y && firstBall.y < b.y + brickHeight + 5 ||
                           firstBall.x > b.x && firstBall.x < b.x + brickWidth &&
                           firstBall.y > b.y && firstBall.y < b.y + brickHeight - 30) {
                            b.status++;
                            firstBall.speedy = -(firstBall.speedy);
                            firstBall.speedx = -Math.abs(firstBall.speedx);
                            score++;
                        }
                        if (secondBall.x > b.x && secondBall.x < b.x + brickWidth &&
                           secondBall.y > b.y && secondBall.y < b.y + brickHeight + 5 ||
                           secondBall.x > b.x && secondBall.x < b.x + brickWidth &&
                           secondBall.y > b.y && secondBall.y < b.y + brickHeight - 30) { //all four conditions have to be met before ball moves reverse
                            b.status++;
                            secondBall.speedy = -(secondBall.speedy);
                            secondBall.speedx = -Math.abs(secondBall.speedx);
                            bounceSound.play();
                            bounceSound.volume = 0.8;
                            //sets status of that brick hit to 0, making it disappear
                            score++;
                        }
                    }
                }
            }
        }
        //Draws score message when ball collides with brick
        function drawScore() {
            ctx.font = "16px Arial"; //score font and size
            ctx.fillStyle = "#0095DD"; //score color
            ctx.fillText("Score: " + score, 8, 20); //score will start at 0, at x 8 and y 20
        }
        //Draws victory message when user scores 30
        function drawVictory() {
            ctx.font = "2em Arial"; //score font and size
            ctx.fillStyle = "#0095DD"; //score color
            ctx.fillText("You Passed Level 1", 200, 250); //score will start at 0, at x 8 and y 20
        }
        function drawLives() {
            ctx.font = "16px Arial"; //score font and size
            ctx.fillStyle = "#0095DD"; //score color
            ctx.fillText("Lives: " + lives, canvas.width - 65, 20); //score will start at 0, at x 8 and y 20
        }
		function drawGameOver() {
			ctx.font = "2em Arial"; //score font and size
            ctx.fillStyle = "rgba(255,0,0,0.6)"; //score color
            ctx.fillText("GAME OVER!", 200, 250);
		}
        /*function mouseMoveHandler(e) { //Adds mouse movement to move paddle on x axis
            var relativeX = e.clientX - canvas.offsetLeft;
            if(relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth/2;
            }
        } */
		function pauseGame() {
			if(spacePressed = true) {
				window.cancelAnimationFrame(cancelAnimation);
			}
			else if(spacePressed = false){
				window.requestAnimationFrame(cancelAnimation);
			}
		}
    
        //handles all movement and collision with objects
        function triggerBranches() {
            if(score == 70) {  
				drawVictory();
                lives = 10;
                setTimeout(function(){
                    location.reload();
				}, delay); 
            }
        }
        function movementMechanics() {
            if (firstBall.x + firstBall.speedx > canvas.width - firstBall.radius ||
               firstBall.x + firstBall.speedx < firstBall.radius) {
                
                firstBall.speedx = -(firstBall.speedx); //Pushes object in reverse momentum
            }
            /* Used for collision on up and down edges */
            if (firstBall.y + firstBall.speedy < firstBall.radius ) {
                
               firstBall.speedy = -(firstBall.speedy);
            }
            
            if(firstBall.y + firstBall.speedy > canvas.height - firstBall.radius) {
				if(firstBall.x > paddleX &&
                   firstBall.x < paddleX + paddleWidth &&
                   firstBall.y > paddleY &&
                   firstBall.y < paddleY + paddleHeight) { //checks if ball is in between paddle when ball hits bottom
                    
                    firstBall.speedy = 0;
                    firstBall.speedy = -Math.abs(firstBall.speedy - 2); //pushes object in reverse direction + -0.1 will increase slightly per hit
				}
				else {
					if(lives < 1) {
						drawGameOver();
						setTimeout(function() {
							document.location.reload();
						}, delayDouble);
                }
                    else {
                    firstBall.x = canvas.width / 2;
                    firstBall.x = canvas.height - 30;
                    firstBall.speedx = 2;
                    firstBall.speedy = -2;
                    lives--;
                    }
				}
			}
            //Second ball Collision
            if (secondBall.x + secondBall.speedx > canvas.width - secondBall.radius ||
               secondBall.x + secondBall.speedx < secondBall.radius) {
                
                secondBall.speedx = -(secondBall.speedx); //Pushes object in reverse momentum
            }
            /* Used for collision on up and down edges */
            if (secondBall.y + secondBall.speedy < secondBall.radius) {
                
				secondBall.speedy = -(secondBall.speedy);
			}
			if(secondBall.y + secondBall.speedy > canvas.height - secondBall.radius) {
				if(secondBall.x > paddleX &&
                   secondBall.x < paddleX + paddleWidth &&
                   secondBall.y > paddleY &&
                   secondBall.y < paddleY + paddleHeight) { //checks if ball is in between paddle when ball hits bottom
                    secondBall.speedx = -(secondBall.speedx);
                    //pushes object in reverse direction + -0.1 will increase slightly per hit
				}
				else {
					if(lives < 1) {
						drawGameOver();
						setTimeout(function() {
							document.location.reload();
						}, delayDouble);
                }
                    else { //not this
                    secondBall.x = canvas.width / 2;
                    secondBall.y = canvas.height - 30;
                    secondBall.speedx = 2;
                    secondBall.speedy = -2;
                    lives--;
                    }
				}
			}
            //Ball collision with other ball
            var distance = /*c = */Math.sqrt(
            /*a = */((firstBall.x - secondBall.x) * (firstBall.x - secondBall.x))
          + /*b = */((firstBall.y - secondBall.y) * (firstBall.y - secondBall.y))
           );
            if (distance < firstBall.radius + secondBall.radius)//value is checked against the sum of the radii of the two cricles  
            {
                secondBall.speedx = 0;
                secondBall.speedx = -(secondBall.speedx - 3);
                secondBall.speedy = 0;
                secondBall.speedy = -(secondBall.speedy - 3);     
            }
            if(firstBall.x > paddleX + 5 && firstBall.x < paddleX + paddleWidth + 5 && firstBall.y > paddleY - 30 && firstBall.y < paddleY + paddleHeight - 25) {
				
                var deltaY = firstBall.y
                        -(paddleY + paddleWidth / 2);
                    firstBall.speedy = deltaY * 0.06;
			}
            if(secondBall.x > paddleX + 5 && secondBall.x < paddleX + paddleWidth + 5 && secondBall.y > paddleY - 30 && secondBall.y < paddleY + paddleHeight - 25) {
				var bravoY = secondBall.y
                        -(paddleY + paddleWidth / 2);
                    secondBall.speedy = bravoY * 0.06;
			}
            if(firstBall.x > paddleX + 25 &&
               firstBall.x < paddleX + paddleWidth + 25 &&
               firstBall.y > paddleY + 10 &&
               firstBall.y < paddleY + paddleHeight - 10) { //checks if ball is in between paddle when ball hits bottom
                    
                    
                firstBall.speedy = 0;
                firstBall.speedy = firstBall.speedy + 4; //pushes object in reverse direction + -0.1 will increase slightly per hit
            }
            if(rightPressed && paddleX < canvas.width - paddleWidth) { //Acts as colloison if paddle x-axis < canvas width minus itself then stop
                paddleX += 10; // Moves positive 7 pixels to the right on the x-axis
            }
            else if(leftPressed && paddleX > - 2) { //Acts as collision if paddle x-axis < canvas width minus itself then stop
                paddleX -= 10; // Moves negative 7 pixels to the left on the x-axis
            }
            if(upPressed && paddleY > 0 + paddleHeight + 250) { // Y collision
                paddleY -= 4; // Y-axis Upwards movement speed
            }
            else if(downPressed && paddleY < canvas.height) {
                paddleY += 4; // Y-axis downward movement speed
            }
            //Moves ball on x and y axis
            firstBall.x += firstBall.speedx; //paints ball on every frame
            firstBall.y += firstBall.speedy;
            secondBall.x += secondBall.speedx;
            secondBall.y += secondBall.speedy;
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); //Refreshs Canvas ctx frame
			drawBricks();
            drawBall(); //Calls drawball function
            drawSecondball();
            drawPaddle(); //Calls drawPaddle
            movementMechanics();
            collisionDetection();
            triggerBranches();
            drawScore();
            drawLives();
            
            
        cancelAnimation = window.requestAnimationFrame(draw);
            
        }
    audiobackground.play();
    audiobackground.volume = 0.6;
    draw();
}

start();