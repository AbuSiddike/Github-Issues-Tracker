const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');

const userHint = document.getElementById('userHint');
const passHint = document.getElementById('passHint');

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', function () {
  userHint.innerText = '';
  passHint.innerText = '';

  const usernameValue = usernameInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // username validation
  if (usernameValue === '') {
    userHint.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Please enter <span class="text-green-500">'admin'</span> your user name`;
    userHint.classList.add('text-red-500', 'animate-bounce');
    return;
  } else if (usernameValue !== 'admin') {
    userHint.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Wrong user name. Please enter 'admin'`;
    userHint.classList.add('text-red-500', 'animate-bounce');
    return;
  } else {
    userHint.classList.remove(
      'text-red-500',
      'animate-bounce',
      'text-purple-500'
    );
    userHint.classList.add('text-green-500');
    userHint.innerHTML = `<i class="fa-regular fa-circle-check"></i> Correct Your user name`;
  }

  // password validation
  if (passwordValue === '') {
    passHint.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Please enter <span class="text-green-500">'admin123'</span> your password`;
    passHint.classList.add('text-red-500', 'animate-bounce');
    return;
  } else if (passwordValue !== 'admin123') {
    passHint.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Wrong password. Please enter 'admin123'`;
    passHint.classList.add('text-red-500', 'animate-bounce');
    return;
  } else {
    passHint.classList.remove(
      'text-red-500',
      'animate-bounce',
      'text-purple-500'
    );
    passHint.classList.add('text-green-500');
    passHint.innerHTML = `<i class="fa-regular fa-circle-check"></i> Correct Your Password`;

    // redirect after successful login
    // window.location.href = "./home.html";
    document.getElementById('loginPage').classList.add('hidden');
    // document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('dashboard').classList.remove('hidden')
  }

  console.log(usernameValue, passwordValue);
});
