function start() {
    
    var canvas = document.getElementById("canvas_Level2");
    var ctx = canvas.getContext("2d");
    
    var ballRadius = 10;
    
    var x = canvas.width / 5; //600
    var y = canvas.height - 200; //400
    var dx = 2;
    var dy = Math.floor((Math.random() * 2) + 1);//randomizes a number from 1 - 3 as the y axis movement of the ball
    var paddleWidth = 20;
    var paddleHeight = 75;
    var paddleX = canvas.width - paddleWidth - 45;
    var paddleY = (canvas.height - 220);
    var upPressed = false;
    var downPressed = false;
    var leftPressed = false;
    var rightPressed = false;
    
    //brick variables
    var brickRowCount = 4; //number of rows
	var brickColumnCount = 6;  //number of columns of brick object
	var brickWidth = 20;
	var brickHeight = 75;
	var brickPadding = 10; // padding between other brick objects
	var brickOffsetTop = 30; //Not drawn directly from the edge of the canvas
	var brickOffsetLeft = 50;
    //Each bricks is storted into bricks array, this creates a two-dimensional array one for rows, the other for columns
		var bricks = [];
        for(c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 }; //creates brick to have a status 1 for visable 0 for invisable
            }
        }
    document.addEventListener("keydown", keyDownHandler, false);
    
    document.addEventListener("keyup", keyUpHandler, false);
    
    function keyDownHandler(e) { // if key down then KeyDownHandler is true
                if(e.keyCode == 68) { // 68 = A Fire when user presses A on keyboard
                    leftPressed = true;
                } //if it equals a variable then it will be true else it will fire next variable
                else if(e.keyCode == 65) { //65 = D Fire when user presses D on keyboard
                    rightPressed = true;
                }
                if(e.keyCode == 87) { // W key
                    upPressed = true;
                }
                else if(e.keyCode == 83) { // S key
                    downPressed = true;
                }
				if(e.keyCode ==	32)  { // space key
					spacePressed = true;
					pauseGame();
                    spaceCounter += 1;
				}
            }
        function keyUpHandler(e) { //if key up then KeyupHandler is true, and movement variables stop firing
                if(e.keyCode == 68) {
                    rightPressed = false;
                }
                else if(e.keyCode == 65) {
                    leftPressed = false;
                }
                if(e.keyCode == 87) {
                    upPressed = false;
                }
                else if(e.keyCode == 83) {
                    downPressed = false;
                }
				if(e.keyCode ==	32) {
					spacePressed = false;
					draw();
				}
            }
    
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, paddleY - paddleWidth, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath;
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
				}
			}
		}
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        if( x + dx < ballRadius) {
                dx = -dx; //Pushes object in reverse momentum
            }
        if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;//Pushes object in reverse momentum //bottom collision
        }
            /* Used for collision on up and down edges */
        if(x > paddleX && x < paddleX + paddleWidth + 10 && y > paddleY - 30 && y < paddleY + paddleHeight - 25) {
            dx = 0;
            dx = -dx - 3;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        if(leftPressed  && paddleX < canvas.width - paddleWidth) { //Acts as colloison if paddle x-axis < canvas width minus itself then stop
            paddleX += 3; // Moves positive 7 pixels to the right on the x-axis
        }
        else if(rightPressed && paddleX > 0) { //Acts as collision if paddle x-axis < canvas width minus itself then stop
            paddleX -= 3; // Moves negative 7 pixels to the left on the x-axis
        }
        if(upPressed && paddleY > 0 + 20) { // Y collision
            paddleY -= 3; // Y-axis Upwards movement speed
        }
        else if(downPressed && paddleY < canvas.height - 50) {
            paddleY += 3; // Y-axis downward movement speed
        }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }    
    draw();
}

start();