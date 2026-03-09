// DOM Elements - Login
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const userHint = document.getElementById('userHint');
const passHint = document.getElementById('passHint');
const loginBtn = document.getElementById('loginBtn');

// Simple login validation with demo credentials
loginBtn.addEventListener('click', () => {

  userHint.textContent = '';
  passHint.textContent = '';

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;

  // Username check
  if (!username) {
    userHint.innerHTML =
      '<i class="fa-regular fa-circle-xmark text-red-500"></i> Username is required';
    isValid = false;
  } else if (username !== 'admin') {
    userHint.innerHTML =
      '<i class="fa-regular fa-circle-xmark text-red-500"></i> Invalid username (use: admin)';
    isValid = false;
  } else {
    userHint.innerHTML =
      '<i class="fa-regular fa-circle-check text-green-500"></i> Correct username';
  }

  // Password check
  if (!password) {
    passHint.innerHTML =
      '<i class="fa-regular fa-circle-xmark text-red-500"></i> Password is required';
    isValid = false;
  } else if (password !== 'admin123') {
    passHint.innerHTML =
      '<i class="fa-regular fa-circle-xmark text-red-500"></i> Invalid password (use: admin123)';
    isValid = false;
  } else {
    passHint.innerHTML =
      '<i class="fa-regular fa-circle-check text-green-500"></i> Correct password';
  }

  // If login successful → go to dashboard
  if (isValid) {
    
    localStorage.setItem('isLoggedIn', 'true');

    
    window.location.href = 'dashboard.html';
  }
});
