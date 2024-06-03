export function handleKeyboardInput(event, keys) {
    keys[event.keyCode] = event.type === 'keydown';
}

export function updatePlayerPosition(playerX, playerY, playerDY, keys) {
    if (keys[37]) {
        playerX -= 5;
    }
    if (keys[39]) {
        playerX += 5;
    }
    if (keys[38] && playerDY === 0) {
        playerDY = -10;
    }
    if (keys[40]) {
        playerY += 5;
    }
    playerDY += 0.5;
    playerY += playerDY;
    return { newPlayerX: playerX, newPlayerY: playerY, newPlayerDY: playerDY };
}
