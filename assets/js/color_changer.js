// Sélectionner l'élément du color-picker
const colorPicker = document.getElementById('color-picker');

// Charger la couleur sauvegardée depuis le localStorage
try {
    const savedColor = localStorage.getItem('main-bg-color');
    if (savedColor) {
        // Appliquer la couleur sauvegardée à la variable CSS et au color-picker
        document.documentElement.style.setProperty('--main-bg-color', savedColor);
        colorPicker.value = savedColor;
    }
} catch (error) {
    console.error('Erreur lors du chargement de la couleur :', error);
}

// Ajouter un écouteur d'événements pour détecter les changements de valeur
colorPicker.addEventListener('input', (event) => {
    // Récupérer la valeur sélectionnée dans le color-picker
    const selectedColor = event.target.value;

    // Mettre à jour la variable CSS "--main-bg-color" dans le style racine
    document.documentElement.style.setProperty('--main-bg-color', selectedColor);

    // Sauvegarder la couleur sélectionnée dans le localStorage
    localStorage.setItem('main-bg-color', selectedColor);
});



// Partie RGB
let rgbActive = false;
const rgbBtn = document.querySelector('.rgb-toggle');
let rgbInterval;


// Fonction pour générer une couleur aléatoire
function generateRandomColor() {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    return randomColor;
}


// Fonction pour activer le mode RGB
function startRGBMode() {
    rgbInterval = setInterval(() => {
        const randomColor = generateRandomColor();
        document.documentElement.style.setProperty('--main-bg-color', randomColor);
    }, 500); // Changer la couleur toutes les 500ms
}

// Fonction pour désactiver le mode RGB
function stopRGBMode() {
    clearInterval(rgbInterval);
}


// Ajouter un écouteur au bouton de basculement
rgbBtn.addEventListener('click', () => {
    rgbActive = !rgbActive;
    if (rgbActive) {
        startRGBMode();
        rgbBtn.textContent = 'Désactiver RGB';
    } else {
        stopRGBMode();
        rgbBtn.textContent = 'Activer RGB';

        // Réinitialiser à la couleur sauvegardée ou par défaut
        const savedColor = localStorage.getItem('main-bg-color') || '#ffffff';
        document.documentElement.style.setProperty('--main-bg-color', savedColor);
    }
});