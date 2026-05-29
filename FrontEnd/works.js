// URL de l'API 
const apiUrlworks = "http://localhost:5678/api/works";

// Fonction pour récupérer les projets
async function getWorks() {
    const response = await fetch(apiUrlworks);
    const works = await response.json();
    return works;
}

// Fonction pour afficher les projets
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");

  // Vider la galerie avant d'ajouter les nouveaux éléments
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const figure = document.createElement("figure");
    figure.dataset.category = work.categoryId; // Ajouter l'attribut data-category pour le filtrage 
    

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// Fonction principale
async function init() {
  const works = await getWorks();
  displayWorks(works);
}

// Lancer le script
init();

//rendre getWorks accessible depuis d'autres modules
window.getWorks = getWorks;
