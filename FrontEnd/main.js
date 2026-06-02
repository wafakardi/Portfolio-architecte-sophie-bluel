// Récupérer le token dans le localStorage
const token = localStorage.getItem('authToken');
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

  // Ajouter le bandeau mode édition
  const banner = document.createElement('div');
  banner.classList.add('edit-banner');
  banner.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Mode édition";
  document.body.prepend(banner);

  // Cacher les filtres
  const filters = document.querySelector('.category-filter');
  if (filters) {
    filters.style.display = 'none';
  }

  // Ajouter bouton modifier
  const title = document.querySelector('#portfolio h2');
  const btn = document.createElement('button');
  btn.id = 'openModal';
  btn.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> modifier";

  if (title) {
    title.appendChild(btn);
  }

  // Création de la modale
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

            <div id="uploadContent">
              <i class="fa-regular fa-image"></i>
              <label for="imageUpload" class="upload-btn">+ Ajouter photo</label>
              <input type="file" id="imageUpload" accept="image/png, image/jpeg" hidden>
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

  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const uploadContent = document.getElementById('uploadContent');

  const photoForm = document.getElementById('photoForm');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const errorMsg = document.getElementById('formErrorMsg');

  // Ouvrir la modale
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    galleryView.classList.remove('hidden');
    formView.classList.add('hidden');
    displayModalWorks();
  });

  // Fermer la modale
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    formView.classList.add('hidden');
    galleryView.classList.remove('hidden');
  });

  // Fermer en cliquant dehors
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      formView.classList.add('hidden');
      galleryView.classList.remove('hidden');
    }
  });

  // Afficher formulaire
  addPhotoBtn.addEventListener('click', () => {
    galleryView.classList.add('hidden');
    formView.classList.remove('hidden');
  });

  // Retour galerie
  returnBtn.addEventListener('click', () => {
    formView.classList.add('hidden');
    galleryView.classList.remove('hidden');
  });

  // Sélection photo
  imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    imagePreview.src = imageUrl;
    imagePreview.classList.remove('hidden');
    uploadContent.classList.add('hidden');
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

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.dataset.id = work.id;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      deleteBtn.addEventListener('click', async () => {
        const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const deletedWork = document.querySelectorAll(`figure[data-id="${work.id}"]`);
          deletedWork.forEach(workElement => workElement.remove());
        }
      });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      modalGallery.appendChild(figure);
    });
  }

  // Récupérer les catégories
  async function displayCategories() {
    const categories = await getCategories();

    categorySelect.innerHTML = '<option value=""></option>';

    categories.forEach(category => {
      const option = document.createElement('option');

      option.value = category.id;
      option.textContent = category.name;

      categorySelect.appendChild(option);
    });
  }

  displayCategories();

  // Envoi formulaire
  photoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = imageUpload.files[0];
    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;

    if (!file || !title || !categoryId) {
      errorMsg.textContent = "Veuillez remplir tous les champs.";
      errorMsg.classList.remove('hidden');
      return;
    }

    errorMsg.classList.add('hidden');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });

    if (response.ok) {
      const newWork = await response.json();

      addWorkToMainGallery(newWork);

      alert("Projet ajouté avec succès !");

      photoForm.reset();
      imagePreview.classList.add('hidden');
      imagePreview.src = "";
      uploadContent.classList.remove('hidden');

      formView.classList.add('hidden');
      galleryView.classList.remove('hidden');

      displayModalWorks();
    } else {
      alert("Erreur lors de l'ajout du projet.");
    }
  });
}

// Affichage nouveau projet dans la galerie principale
function addWorkToMainGallery(work) {
  const gallery = document.querySelector('.gallery');

  if (!gallery) return;

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