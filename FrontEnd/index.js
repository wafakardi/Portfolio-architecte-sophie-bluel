function updateUI() {
  const token = localStorage.getItem('authToken');
  const isConnected = !!token;

  const loginLink = document.getElementById('login-link');
  const banner = document.getElementById('edit-banner');
  const filters = document.getElementById('filters');

  if (isConnected) {
    // Afficher le bandeau
    if (banner) banner.classList.remove('hidden');

    // Login → Logout
    if (loginLink) loginLink.textContent = 'logout';

    // Cacher les filtres
    if (filters) filters.style.display = 'none';

    // Ajouter les boutons "modifier" sur chaque projet
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
      const btn = document.createElement('button');
      btn.textContent = 'modifier';
      btn.classList.add('edit-btn');
      project.appendChild(btn);
    });
  }

  // Gestion du clic login/logout
  if (loginLink) {
    loginLink.addEventListener('click', () => {
      if (isConnected) {
        localStorage.removeItem('authToken');
        window.location.reload();
      } else {
        window.location.href = 'login.html';
      }
    });
  }
}

// Lancer la fonction au chargement
updateUI();