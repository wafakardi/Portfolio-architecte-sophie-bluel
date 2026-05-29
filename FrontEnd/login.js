
// Sélection du formulaire et du div pour les messages d'erreur

  const form = document.getElementById("loginForm");
const errorDiv = document.getElementById("errorMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  const result = await response.json();

  if (response.ok) {

    localStorage.setItem("authToken", result.token);

    window.location.href = "index.html";

  } else {

    errorDiv.textContent = "Email ou mot de passe incorrect";

  }
});