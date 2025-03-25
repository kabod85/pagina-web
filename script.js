/* script.js */

/* -------------------------------------
   Funciones para manejo de LocalStorage
-------------------------------------- */
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getReviews() {
  return JSON.parse(localStorage.getItem('reviews')) || [];
}

function saveReviews(reviews) {
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

/* -------------------------------------
   Manejo del formulario de Registro
-------------------------------------- */
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    let users = getUsers();

    // Verifica si el nombre de usuario ya existe (ignora mayúsculas/minúsculas)
    if (users.find(user => user.username.toLowerCase() === username.toLowerCase())) {
      alert('El nombre de usuario ya está registrado.');
      return;
    }

    // Guarda el nuevo usuario
    users.push({ username, email, password });
    saveUsers(users);

    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = "login.html";
  });
}

/* -------------------------------------
   Manejo del formulario de Inicio de Sesión
-------------------------------------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const users = getUsers();
    // Busca un usuario que coincida con el username y password
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      alert('Inicio de sesión exitoso.');
      // Redireccionamos al inicio
      window.location.href = "index.html";
    } else {
      alert('Credenciales incorrectas.');
    }
  });
}

/* -------------------------------------
   Manejo del formulario de Reseñas
-------------------------------------- */
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Verifica que el usuario haya iniciado sesión
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      alert('Debes iniciar sesión para dejar una reseña.');
      return;
    }

    const reviewerName = document.getElementById('reviewer-name').value.trim() || loggedInUser.username;
    const reviewText = document.getElementById('review-text').value.trim();

    let reviews = getReviews();
    reviews.push({
      name: reviewerName,
      text: reviewText,
      date: new Date().toLocaleString()
    });

    saveReviews(reviews);
    alert('Reseña enviada.');
    reviewForm.reset();
    loadReviews();
  });
}

/* -------------------------------------
   Cargar reseñas en reviews.html
-------------------------------------- */
function loadReviews() {
  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList) {
    const reviews = getReviews();
    reviewsList.innerHTML = '';
    reviews.forEach(review => {
      const reviewDiv = document.createElement('div');
      reviewDiv.className = 'review-item';
      reviewDiv.innerHTML = `
        <strong>${review.name}</strong>
        <em>${review.date}</em>
        <p>${review.text}</p>
      `;
      reviewsList.appendChild(reviewDiv);
    });
  }
}

/* -------------------------------------
   Mostrar nombre de usuario y Logout
-------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userInfo = document.getElementById('user-info');
  const logoutLink = document.getElementById('logout-link');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');

  if (loggedInUser && userInfo && logoutLink && loginLink && registerLink) {
    // Muestra el nombre de usuario
    userInfo.textContent = `Hola, ${loggedInUser.username}`;
    userInfo.style.display = 'block';

    // Muestra el enlace de cerrar sesión
    logoutLink.style.display = 'block';

    // Oculta "Iniciar Sesión" y "Registrarse"
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';

    // Maneja el cierre de sesión
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      // Regresamos al inicio (o donde prefieras)
      window.location.href = "index.html";
    });
  } else {
    // Si no hay usuario logueado
    if (userInfo) userInfo.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
  }

  // Cargamos reseñas si estamos en reviews.html
  loadReviews();
});
