# Portfolio — Maud Mellinger, artiste 3D

Site statique, responsive, sans dépendance ni étape de build : trois fichiers et un dossier
d'images.

**En ligne : <https://lenitra.github.io/MaudPortfolio/>**

Le déploiement se fait par GitHub Pages depuis la branche `main`. Pousser sur `main` suffit
à mettre le site à jour — aucune étape de build, aucun workflow.

## Aperçu local

```bash
python -m http.server 5173
```

Puis ouvrir <http://localhost:5173>. (Ouvrir `index.html` en double-cliquant fonctionne
aussi, mais un serveur reproduit mieux les conditions réelles.)

## Structure

```
portfolio/
├── index.html                  Contenu et structure — les 12 projets sont dans le HTML
├── README.md
├── assets/
│   ├── css/styles.css          Styles, thème sombre, points de rupture
│   ├── js/data.js              Données des projets (titres, textes, listes d'images)
│   ├── js/main.js              Filtres, maçonnerie, galerie, navigation
│   └── img/                    37 visuels optimisés en WebP (1,2 Mo au total)
└── assets_visuels/             Sources — PDF, démo reel web, rendus d'origine
```

Les images du dossier `assets/img/` ont été extraites du PDF et des rendus fournis, puis
converties en WebP (1600 px pour la galerie, 800 px pour les vignettes). Les originaux
restent dans `assets_visuels/`.

## La démo reel

Le master fait 230 Mo, au-dessus de la limite de 100 Mo par fichier de GitHub : il n'est
donc **pas** versionné (voir `.gitignore`) et reste sur le poste de Maud. Le site sert
`assets_visuels/demoreel-web.mp4`, une version 1080p de 15 Mo produite ainsi :

```bash
ffmpeg -i Demoreel_MaudMELLINGER.mp4 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart demoreel-web.mp4
```

`-movflags +faststart` place l'index en tête du fichier : la lecture démarre sans attendre
le téléchargement complet. Et comme la balise `<video>` porte `preload="none"`, rien n'est
téléchargé tant que personne ne clique sur Lire.

Pour remplacer la démo reel plus tard, rejouer cette commande sur le nouveau master et
écraser `demoreel-web.mp4` — le HTML n'a pas besoin de changer.

## Ajouter ou modifier un projet

Chaque projet vit à deux endroits :

1. **`index.html`** — un bloc `<article class="card" data-slug="…" data-tags="…">`.
   `data-slug` fait le lien avec les données, `data-tags` détermine les filtres où le
   projet apparaît (`personnages`, `environnements`, `props`, `texturing`, `2d`).
2. **`assets/js/data.js`** — l'entrée du même `slug` : titre, sur-titre, description,
   logiciels et la liste des images ouvertes dans la galerie.

Les vignettes portent le suffixe `-t` (`flasgar-1-t.webp`), les grandes images non
(`flasgar-1.webp`). Pensez à renseigner `width` et `height` sur les `<img>` du HTML :
c'est ce qui évite les sauts de mise en page pendant le chargement.

## Choix techniques

- **Couleurs** — trois variables en haut de `styles.css` pilotent tout le jaune :
  `--accent` (#ffd400) pour le texte, les traits et les aplats, `--accent-hi` pour le
  survol des aplats, `--accent-ink` pour l'encre foncée posée **sur** un aplat jaune.
  Changer `--accent` suffit à changer la couleur d'accent du site entier.
- **Maçonnerie sans bibliothèque** — la grille utilise des lignes de 4 px et un
  `grid-row-end` calculé par carte. Les proportions d'origine des images sont conservées,
  aucun recadrage, et l'ordre de lecture reste de gauche à droite.
- **Accessibilité** — navigation complète au clavier (galerie comprise : `←` `→` `Échap`),
  piège de focus dans la galerie, focus restauré à la fermeture, textes alternatifs sur
  toutes les images, contrastes conformes AA, respect de `prefers-reduced-motion`.
- **Sans JavaScript** — le site reste consultable : les 12 projets sont écrits en dur dans
  le HTML. Seuls les filtres et la galerie plein écran nécessitent JS.
- **Polices** — Playfair Display et Inter chargées depuis Google Fonts, avec repli sur
  Georgia et les polices système si le réseau est indisponible.

## Crédits

Dragon modélisé par Clément Mona, texturé par Maud Mellinger. Tous les autres visuels sont
de Maud Mellinger.
