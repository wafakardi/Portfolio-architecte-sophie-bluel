// URL de l'API 
const apiUrlcategories = "http://localhost:5678/api/categories";


// Fonction pour récupérer les catégories
async function getCategories() {
    const response = await fetch(apiUrlcategories);
    const categories = await response.json();
    return categories;
}


// Fonction pour afficher les catégories
function displayFilterCategories(categories) {
  const categoryFilter = document.querySelector(".category-filter");
  
  
  // Vider le filtre avant d'ajouter les nouvelles catégories
  categoryFilter.innerHTML = "";
  
  // Ajouter un bouton "Tous" pour afficher tous les travaux
    const allbutton = document.createElement("button");
    allbutton.innerText = "Tous";
    allbutton.setAttribute("data-category", "all");
    allbutton.addEventListener("click", () => {
      const works = document.querySelectorAll(".gallery figure");
      works.forEach(work => {
        work.style.display = "block";
      });
    });
    categoryFilter.appendChild(allbutton);
    
    // Ajouter les boutons pour chaque catégorie

  for (let i = 0; i < categories.length; i++) {
    console.log(categories[i]);
    const category = categories[i];
    const button = document.createElement("button");
    button.innerText = category.name;
    button.addEventListener("click", () => { 
      const works = document.querySelectorAll(".gallery figure");
      works.forEach(work => {
        if ( work.dataset.category == category.id) {
          work.style.display = "block";
        } else {
          work.style.display = "none";
        }
    
     } )
  })
  categoryFilter.appendChild(button);
  

  // Ajouter la classe active au bouton cliqué
  
  // faut - t il creer une fonction pour ça ?

    const buttons = document.querySelectorAll('.category-filter button');

    buttons.forEach(btn => {
    btn.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');

  });
});
  }
  }
// Fonction principale
async function initcategories() {
  const categories = await getCategories();
  displayFilterCategories(categories);
}

// Lancer le script
initcategories();

window.getCategories = getCategories;
