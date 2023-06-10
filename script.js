// Récupérer le canevas du HTML
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Variables pour le chronomètre
var startTime = Date.now(); // Temps de départ du chronomètre
var elapsedTime = 0; // Temps écoulé depuis le départ du chronomètre



// Variables pour la position du joueur
var playerX = 50;
var playerY = 50;

// Variable pour la vitesse verticale du joueur
var playerDY = 0;


// Gestion des événements clavier
var keys = [];

var isDoor1Open = false; 
var isDoor2Open = false; 
 // État de la porte (ouverte ou fermée)

var doorX = 200; // Position horizontale de la porte
var doorY = 300; // Position verticale de la porte
var doorWidth = 50; // Largeur de la porte
var doorHeight = 100; // Hauteur de la porte

var door2X = 500; // Position horizontale de la deuxième porte
var door2Y = 300; // Position verticale de la deuxième porte
var door2Width = 50; // Largeur de la deuxième porte
var door2Height = 100; // Hauteur de la deuxième porte

var downloadButton = document.createElement("button");
downloadButton.innerText = "Download Screenshot";
document.body.appendChild(downloadButton);


downloadButton.addEventListener("click", function() {
    if(isDoor2Open) { // Vérifiez si la deuxième porte est ouverte
        // Prenez une capture d'écran
        var screenshot = canvas.toDataURL("image/png");

        // Créer un nouveau canevas temporaire
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        var tempContext = tempCanvas.getContext('2d');

        // Créer une nouvelle image à partir de la capture d'écran
        var img = new Image();
        img.onload = function() {
            // Dessinez un cadre sur le canevas temporaire
            tempContext.fillStyle = 'green'; // Choisissez la couleur du cadre
            tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height); // Dessinez le cadre
            tempContext.fillStyle = 'white'; // Choisissez la couleur de l'intérieur du cadre
            tempContext.fillRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20); // Dessinez l'intérieur du cadre

            // Dessinez l'image de la capture d'écran sur le canevas temporaire, à l'intérieur du cadre
            tempContext.drawImage(img, 10, 10, tempCanvas.width - 20, tempCanvas.height - 20);

            // Téléchargez la capture d'écran encadrée
            var framedScreenshot = tempCanvas.toDataURL("image/png");
            downloadURI(framedScreenshot, 'framed_screenshot.png');
        }
        img.src = screenshot;
    }
});





// Attribuez une fonction à l'événement 'click' du bouton
downloadButton.addEventListener("click", function() {
    if(isDoor2Open) { // Vérifiez si la deuxième porte est ouverte
        // Prenez une capture d'écran
        var screenshot = canvas.toDataURL("image/png");
  
        // Téléchargez la capture d'écran
       
    }
});

window.addEventListener("keydown", function(event) {
  keys[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  keys[event.keyCode] = false;
});

// Variables pour les plateformes
var platforms = [
    { x: 1, y: 400, width: canvas.width, height: 20 },

  // Ajoutez d'autres plateformes ici...
];


function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fonction pour dessiner les plateformes
function drawPlatforms() {
    context.fillStyle = "#00FF00"; // Couleur des plateformes
  
    for (var i = 0; i < platforms.length; i++) {
      var platform = platforms[i];
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  
    // Dessiner la première porte
    context.fillStyle = isDoor1Open ? "#00FF00" : "#0000FF"; // La première porte est verte si ouverte, bleue si fermée
    context.fillRect(doorX, doorY, doorWidth, doorHeight);
  
    // Dessiner la deuxième porte
    context.fillStyle = isDoor2Open ? "#00FF00" : "#FF0000"; // La deuxième porte est verte si ouverte, rouge si fermée
    context.fillRect(door2X, door2Y, door2Width, door2Height);
  }

// Fonction pour détecter les collisions entre le joueur et les plateformes
function checkCollision() {
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
  
      // Vérifier la collision avec les plateformes
      if (
        playerY + 50 >= platform.y &&
        playerY <= platform.y + platform.height &&
        playerX + 50 >= platform.x &&
        playerX <= platform.x + platform.width
      ) {
        // Collision détectée, réajuster la position du joueur
  
        // Détection de collision par le bas
        if (playerY + 50 > platform.y && playerDY >= 0) {
          playerY = platform.y - 50;
          playerDY = 0;
        }
  
        // Détection de collision par le haut
        else if (playerY < platform.y + platform.height && playerDY < 0) {
          playerY = platform.y + platform.height;
          playerDY = 0;
        }
  
        // Détection de collision par la droite
        else if (playerX + 50 > platform.x && playerX < platform.x && playerDY >= 0) {
          playerX = platform.x - 50;
        }
  
        // Détection de collision par la gauche
        else if (playerX < platform.x + platform.width && playerX + 50 > platform.x + platform.width && playerDY >= 0) {
          playerX = platform.x + platform.width;
        }
      }
    
      // Vérifier la collision avec la première porte
      if (
        playerX + 50 >= doorX &&
        playerX <= doorX + doorWidth &&
        playerY + 50 >= doorY &&
        playerY <= doorY + doorHeight &&
        !isDoor1Open // Ajouter cette condition
      ) {
        isDoor1Open = true; // La première porte est ouverte
        startTime = Date.now(); // Démarrer le chronomètre
      }
  
      // Vérifier la collision avec la deuxième porte (porte bleue)
      if (
        playerX + 50 >= door2X &&
        playerX <= door2X + door2Width &&
        playerY + 50 >= door2Y &&
        playerY <= door2Y + door2Height &&
        isDoor1Open && // Ajouter cette condition
        !isDoor2Open // Ajouter cette condition
      ) {
        isDoor2Open = true; // La deuxième porte est ouverte
        elapsedTime = Date.now() - startTime; // Arrêter le chronomètre
      
        // Prendre une capture d'écran
        var screenshot = canvas.toDataURL("image/png");
      
        // Créer une nouvelle image et définir sa source sur la capture d'écran
        var img = new Image();
        img.src = screenshot;
      
        
      
        // Ajouter l'image à la page
        document.body.appendChild(img);
       
      }
    }
  }
  
  function drawTimer() {
    context.fillStyle = "#000000"; // Couleur du texte du chronomètre
    context.font = "24px Arial"; // Police et taille du texte
    context.fillText("Temps écoulé: " + (elapsedTime / 1000).toFixed(3) + " secondes", 10, 30); // Dessine le texte du chronomètre
}
// Fonction de mise à jour du jeu
// Fonction de mise à jour du jeu
// Fonction de mise à jour du jeu
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

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

  checkCollision();
  
  if (isDoor1Open && !isDoor2Open) {
    elapsedTime = Date.now() - startTime;
  } else if (isDoor2Open) {
    // Arrêter le chronomètre, ne mettez pas à jour elapsedTime ici
  }

  drawPlatforms();

  context.fillStyle = "#FF0000";
  context.fillRect(playerX, playerY, 50, 50);

  drawTimer();

  // Mettre à jour la logique du jeu

  // Demander une nouvelle frame d'animation
  requestAnimationFrame(update);
}

// Lancer le jeu
update();

