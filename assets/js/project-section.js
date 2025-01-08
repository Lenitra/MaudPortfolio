// Système de navigation entre les différentes catégories des projets
document.addEventListener("DOMContentLoaded", () => {

    // Sélectionner tous les boutons
    const navButtons = document.querySelectorAll(".projets-nav-btn");

    // Sélectionner toutes les sections flex de projets
    const allProjectsContainers = document.querySelectorAll(".projects-container");

    // Parcourir chaque bouton et attacher un événement 'click'
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {

            // Récupérer l'ID cible depuis l'attribut data-target
            const targetId = button.getAttribute("data-target");

            // Retirer la classe "active" de toutes les sections et boutons
            allProjectsContainers.forEach((container) => {
                container.classList.remove("active");
            });
            navButtons.forEach((button) => {
                button.classList.remove("active");
            })

            // Ajouter la classe "active" à la section qui correspond à l'ID cible et au bouton cliqué
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
                button.classList.add("active");
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    // Sélectionner tous les éléments avec la classe "project_visual" ayant au moins 2 enfants
    const allVisualContainers = Array.from(document.querySelectorAll(".project_visual"));

    allVisualContainers.forEach((container) => {
        const images = Array.from(container.querySelectorAll("img")); // Récupérer toutes les images du conteneur
        if (images.length <= 1) return; // Si une seule image, ne rien faire


        let currentIndex = 0; // Index de l'image actuellement visible
        // Configurer l'opacité initiale pour chaque image et les déplacer vers le haut pour les aligner
        images.forEach((img, index) => {
            img.style.opacity = index === 0 ? '1' : '0'; // Montrer uniquement la première image
            img.style.transition = 'opacity 1s ease-in-out'; // Transition fluide pour le changement
            img.style.position = 'absolute'; // Position relative pour permettre le décalage

            // recupréer la largeur de l'élément parent pour définir avec le format 16/9 la hauteur a soustraire
            let parentWidth = img.parentNode.offsetWidth;
            console.log(parentWidth);
            let topMinus = parentWidth / (16 / 9) + 4 ;
            if (index % 3 === 0){
                topMinus--;
            }

            console.log(topMinus);
            // img.style.transform = `translateY(-${topMinus * index}px)`; // Utiliser transform pour le décalage
        });

        // Fonction pour passer à l'image suivante
        const changeImage = () => {
            // Masquer l'image actuelle
            images[currentIndex].style.opacity = '0';

            // Passer à l'image suivante
            currentIndex = (currentIndex + 1) % images.length;

            // Afficher la nouvelle image
            images[currentIndex].style.opacity = '1';
        };

        // Démarrer le slider
        setInterval(changeImage, 3000); // Change d'image toutes les 3 secondes
    });
});




