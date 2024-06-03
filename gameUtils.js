export function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    return { canvas, context };
}

export function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

export function drawPlatforms(context, platforms, doorX, doorY, doorWidth, doorHeight, isDoor1Open, door2X, door2Y, door2Width, door2Height, isDoor2Open) {
    context.fillStyle = "#00FF00"; // Couleur des plateformes
    platforms.forEach(platform => context.fillRect(platform.x, platform.y, platform.width, platform.height));

    context.fillStyle = isDoor1Open ? "#00FF00" : "#0000FF";
    context.fillRect(doorX, doorY, doorWidth, doorHeight);

    context.fillStyle = isDoor2Open ? "#00FF00" : "#FF0000";
    context.fillRect(door2X, door2Y, door2Width, door2Height);
}

export function checkCollision(playerX, playerY, playerDY, platforms, doorX, doorY, doorWidth, doorHeight, door2X, door2Y, door2Width, door2Height, isDoor1Open, isDoor2Open, startTime, timerRunning, elapsedTime) {
    let collisionData = { playerX, playerY, playerDY, isDoor1Open, isDoor2Open, startTime, timerRunning, elapsedTime };
    platforms.forEach(platform => {
        if (playerY + 50 >= platform.y && playerY <= platform.y + platform.height && playerX + 50 >= platform.x && playerX <= platform.x + platform.width) {
            if (playerY + 50 > platform.y && playerDY >= 0) {
                collisionData.playerY = platform.y - 50;
                collisionData.playerDY = 0;
            } else if (playerY < platform.y + platform.height && playerDY < 0) {
                collisionData.playerY = platform.y + platform.height;
                collisionData.playerDY = 0;
            } else if (playerX + 50 > platform.x && playerX < platform.x && playerDY >= 0) {
                collisionData.playerX = platform.x - 50;
            } else if (playerX < platform.x + platform.width && playerX + 50 > platform.x + platform.width && playerDY >= 0) {
                collisionData.playerX = platform.x + platform.width;
            }
        }
    });

    if (playerX + 50 >= doorX && playerX <= doorX + doorWidth && playerY + 50 >= doorY && playerY <= doorY + doorHeight && !isDoor1Open) {
        collisionData.isDoor1Open = true;
        collisionData.startTime = Date.now();
        collisionData.timerRunning = true;
    }

    if (playerX + 50 >= door2X && playerX <= door2X + door2Width && playerY + 50 >= door2Y && playerY <= door2Y + door2Height && isDoor1Open && !isDoor2Open) {
        collisionData.isDoor2Open = true;
        collisionData.elapsedTime = Date.now() - startTime;
        collisionData.timerRunning = false;
    } else if (isDoor1Open && !isDoor2Open && timerRunning) {
        collisionData.elapsedTime = Date.now() - startTime;
    } else if (isDoor2Open) {
        // Le timer est déjà arrêté, on ne change pas elapsedTime
    } else {
        collisionData.elapsedTime = 0;
    }

    return collisionData;
}

export function drawTimer(context, elapsedTime) {
    context.fillStyle = "#000000";
    context.font = "24px Arial";
    context.fillText("Temps écoulé: " + (elapsedTime / 1000).toFixed(3) + " secondes", 10, 30);
}

export function downloadURI(uri, name) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
