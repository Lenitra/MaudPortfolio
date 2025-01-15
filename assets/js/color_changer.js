// Sélectionner l'élément du color-picker
const colorPicker = document.getElementById('color-picker');

// Charger la couleur sauvegardée depuis le localStorage
const savedColor = localStorage.getItem('main-bg-color');
if (savedColor) {
    // Appliquer la couleur sauvegardée à la variable CSS et au color-picker
    document.documentElement.style.setProperty('--main-bg-color', savedColor);
    colorPicker.value = savedColor;
}

// Ajouter un écouteur d'événements pour détecter les changements de valeur
// type = change
colorPicker.addEventListener('input', (event) => {
    // Récupérer la valeur sélectionnée dans le color-picker
    const selectedColor = event.target.value;

    // Mettre à jour la variable CSS "--main-bg-color" dans le style racine
    document.documentElement.style.setProperty('--main-bg-color', selectedColor);

    // Sauvegarder la couleur sélectionnée dans le localStorage
    localStorage.setItem('main-bg-color', selectedColor);
});