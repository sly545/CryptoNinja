import { initCanvas, loadImage, drawPlatforms, checkCollision, drawTimer, downloadURI } from './gameUtils.js';
import { handleKeyboardInput, updatePlayerPosition } from './playerControls.js';

// Initialiser le canevas et charger l'image du ninja
const { canvas, context } = initCanvas('gameCanvas');
const ninjaImage = loadImage('asset/ninjaCrypto.webp'); // Remplace par le bon chemin

// Variables pour le chronomètre
let startTime = null; // Temps de départ du chronomètre
let elapsedTime = 0; // Temps écoulé depuis le départ du chronomètre
let timerRunning = false; // Indicateur du chronomètre en cours

// Variables pour la position du joueur
let playerX = 50;
let playerY = 50;

// Variable pour la vitesse verticale du joueur
let playerDY = 0;

// Variables pour les portes
let isDoor1Open = false;
let isDoor2Open = false;
const doorX = 200;
const doorY = 300;
const doorWidth = 50;
const doorHeight = 100;
const door2X = 500;
const door2Y = 300;
const door2Width = 50;
const door2Height = 100;

// Variables pour les plateformes
const platforms = [
    { x: 1, y: 400, width: canvas.width, height: 20 },
    // Ajoutez d'autres plateformes ici...
];

// Gestion des événements clavier
const keys = [];
window.addEventListener("keydown", event => handleKeyboardInput(event, keys));
window.addEventListener("keyup", event => handleKeyboardInput(event, keys));

// Fonction pour mettre à jour le jeu
function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Mettre à jour la position du joueur en fonction des entrées clavier
    const { newPlayerX, newPlayerY, newPlayerDY } = updatePlayerPosition(playerX, playerY, playerDY, keys);
    playerX = newPlayerX;
    playerY = newPlayerY;
    playerDY = newPlayerDY;

    // Vérifier les collisions
    const collisionResults = checkCollision(playerX, playerY, playerDY, platforms, doorX, doorY, doorWidth, doorHeight, door2X, door2Y, door2Width, door2Height, isDoor1Open, isDoor2Open, startTime, timerRunning, elapsedTime);
    playerX = collisionResults.playerX;
    playerY = collisionResults.playerY;
    playerDY = collisionResults.playerDY;
    isDoor1Open = collisionResults.isDoor1Open;
    isDoor2Open = collisionResults.isDoor2Open;
    if (collisionResults.startTime !== null) {
        startTime = collisionResults.startTime;
    }
    timerRunning = collisionResults.timerRunning;
    elapsedTime = collisionResults.elapsedTime;

    // Dessiner les plateformes et les portes
    drawPlatforms(context, platforms, doorX, doorY, doorWidth, doorHeight, isDoor1Open, door2X, door2Y, door2Width, door2Height, isDoor2Open);

    // Dessiner l'image du ninja
    context.drawImage(ninjaImage, playerX, playerY, 50, 50);

    // Dessiner le chronomètre
    drawTimer(context, elapsedTime);

    // Demander une nouvelle frame d'animation
    requestAnimationFrame(update);
}

// Lancer le jeu une fois l'image chargée
ninjaImage.onload = function() {
    update();
};

// Gérer la capture d'écran
document.getElementById("downloadButton").addEventListener("click", () => {
    if (isDoor2Open) {
        // Prendre une capture d'écran
        const screenshot = canvas.toDataURL("image/png");
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempContext = tempCanvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            tempContext.fillStyle = 'green';
            tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempContext.fillStyle = 'white';
            tempContext.fillRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20);
            tempContext.drawImage(img, 10, 10, tempCanvas.width - 20, tempCanvas.height - 20);
            const framedScreenshot = tempCanvas.toDataURL("image/png");
            downloadURI(framedScreenshot, 'framed_screenshot.png');
        }
        img.src = screenshot;
    }
});
