// Récupérer le token dans le localStorage
const token = localStorage.getItem('authToken');

// Vérifier si l'utilisateur est connecté
const isLoggedIn = token ? true : false;

console.log("Utilisateur connecté ?", isLoggedIn);

// Modifier le menu si connecté
if (isLoggedIn) {
  const navItems = document.querySelectorAll('header nav ul li');

  navItems.forEach(item => {
    if (item.textContent.trim().toLowerCase() === 'login') {
      item.textContent = 'logout';
      item.style.cursor = 'pointer';

      item.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        location.reload();
      });
    }
  });
}

// Ajouter le bandeau mode édition
if (isLoggedIn) {
  const banner = document.createElement('div');
  banner.classList.add('edit-banner');
  banner.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Mode édition";
  document.body.prepend(banner);
}

// Cacher les filtres si connecté
if (isLoggedIn) {
  const filters = document.querySelector('.category-filter');
  if (filters) {
    filters.style.display = 'none';
  }
}

// Ajouter un bouton "modifier" dans la section portfolio
if (isLoggedIn) {
  const title = document.querySelector('#portfolio h2');
  const btn = document.createElement('button');
  btn.id = 'openModal';
  btn.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> modifier";
  title.appendChild(btn);
}

// Création de la modale
if (isLoggedIn) {
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.classList.add('hidden');

  modal.innerHTML = `
    <div class="modal-box">
      <button id="closeModal"><i class="fa-solid fa-xmark"></i></button>

      <div id="galleryView">
        <h3>Galerie photo</h3>
        <div id="modalGallery"></div>
        <hr class="modal-line">
        <button id="addPhotoBtn">Ajouter une photo</button>
      </div>

      <div id="formView" class="hidden">
        <button id="returnBtn"><i class="fa-solid fa-arrow-left"></i></button>

        <h3>Ajout photo</h3>

        <form id="photoForm">
          <div class="upload-box">
            <img id="imagePreview" class="hidden" alt="Aperçu de l'image">
          <div id="uploadContent" class="hidden">
            <i class="fa-regular fa-image"></i>
            <label for="imageUpload" class="upload-btn">+ Ajouter photo</label>
            <input type="file" id="imageUpload" hidden>
            <p>jpg, png : 4mo max</p>
            </div>
          </div>

          <label for="title">Titre</label>
          <input type="text" id="title">

          <label for="category">Catégorie</label>
          <select id="category">
            <option value=""></option>
          </select>

          <p id="formErrorMsg" class="hidden"></p>

          <hr class="modal-line">

          <button type="submit" class="validate-btn">Valider</button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Récupération des éléments
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const returnBtn = document.getElementById('returnBtn');
  const galleryView = document.getElementById('galleryView');
  const formView = document.getElementById('formView');
  const modalGallery = document.getElementById('modalGallery');

  // Ouvrir la modale
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    galleryView.classList.remove('hidden');

    displayModalWorks();
  });

  // Fermer la modale avec la croix
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    formView.classList.add('hidden');
  });

  // Fermer la modale en cliquant en dehors
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      formView.classList.add('hidden');
    }
  });

  // Afficher le formulaire
  addPhotoBtn.addEventListener('click', () => {
    galleryView.classList.add('hidden');
    formView.classList.remove('hidden');
  });

  // Retour à la galerie
  returnBtn.addEventListener('click', () => {
    formView.classList.add('hidden');
    galleryView.classList.remove('hidden');
  });


  
   // Afficher les projets dans la modale
  async function displayModalWorks() {
    const works = await getWorks();
    modalGallery.innerHTML = "";

    works.forEach(work => {
      const figure = document.createElement('figure');
      figure.dataset.id = work.id;

      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;

  // Créer le bouton de suppression

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.dataset.id = work.id;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';


  // Supprimer le projet en cliquant sur le bouton de suppression

      deleteBtn.addEventListener('click', async () => {
        const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        console.log(response);

        const deletedWork = document.querySelectorAll(`figure[data-id="${work.id}"]`);
        console.log(deletedWork);
        deletedWork.forEach(work => work.remove());
        
        });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      modalGallery.appendChild(figure);
    });
  }


}

//Selection de photo ajouté dans le formulaire
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const uploadContent = document.getElementById('uploadContent');

imageUpload.addEventListener('change', () => {
  const file = imageUpload.files[0];

  const imageUrl = URL.createObjectURL(file);
  document.getElementById('uploadContent').style.display = 'none';

  imagePreview.src = imageUrl;
  imagePreview.classList.remove('hidden');
  uploadContent.classList.add('hidden');
});


  //recuperer les categories dans le formulaire
  async function displayCategories() {
  const categories = await getCategories();

  const select = document.getElementById('category');

  select.innerHTML = '<option value=""></option>';

  categories.forEach(category => {
    const option = document.createElement('option');

    option.value = category.id;
    option.textContent = category.name;

    select.appendChild(option);
  });
}

  displayCategories();




//message d'erreur si les champs ne sont pas remplis
  const photoForm = document.getElementById('photoForm');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  photoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = imageUpload.files[0];
    const title = titleInput.value;
    const categoryId = categorySelect.value;

    const errorMsg = document.getElementById('formErrorMsg');
    if (!file || !title || !categoryId) {
      
      errorMsg.textContent = "Veuillez remplir tous les champs.";
      errorMsg.classList.remove('hidden');
      return;

     }

  errorMsg.classList.add('hidden');


  //envoie du formulaire a l'API
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    console.log(formData.get('image'), formData.get('title'), formData.get('category'));

    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });
    
   if (response.ok) {
     const newWork = await response.json();

     console.log(newWork);
     addWorkToMainGallery(newWork);
       

        alert("Projet ajouté avec succès !");

   // Réinitialiser le formulaire
        photoForm.reset();
        imagePreview.classList.add('hidden');
        uploadContent.classList.remove('hidden');
        document.getElementById('uploadContent').style.display = 'flex';
        
    }
   else {
alert("Erreur lors de l'ajout du projet.");

  }
  
});



  // l affichage de nouveau projet dans la galerie principale
  function addWorkToMainGallery(work) {
  const gallery = document.querySelector('.gallery');

  const figure = document.createElement('figure');
  figure.dataset.id = work.id;
  figure.dataset.category = work.categoryId;

  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}



  

 
  