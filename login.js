// ======= Supabase config =======
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_PUBLIC_ANON_KEY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======= Tabs: Login / Register =======
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
  authMessage.textContent = '';
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  authMessage.textContent = '';
});

// ======= Login / Register handlers =======
document.getElementById('login-btn').addEventListener('click', async () => {
  authMessage.textContent = '';
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage.textContent = error.message;
  } else {
    authMessage.textContent = '';
    await afterLogin();
  }
});

document.getElementById('register-btn').addEventListener('click', async () => {
  authMessage.textContent = '';
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });

  if (error) {
    authMessage.textContent = error.message;
  } else {
    authMessage.textContent = 'கணக்கு உருவாக்கப்பட்டது. Email confirmation தேவைப்பட்டால் உங்கள் inbox-ஐ பார்க்கவும்.';
  }
});

// ======= Check current session & setup UI =======
const authCard = document.getElementById('auth-card');
const quizCard = document.getElementById('quiz-card');
const scoreCard = document.getElementById('score-card');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');

async function afterLogin() {
  const { data } = await supabaseClient.auth.getUser();
  if (data.user) {
    userInfo.textContent = `வணக்கம், ${data.user.user_metadata?.full_name || data.user.email}`;
    authCard.style.display = 'none';
    quizCard.style.display = 'block';
    scoreCard.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    if (window.setupQuiz) {
      window.setupQuiz(); // from score.js
    }
    if (window.loadScores) {
      window.loadScores(); // from score.js
    }
  }
}

logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  location.reload();
});

// initial check
supabaseClient.auth.getUser().then(({ data }) => {
  if (data.user) {
    afterLogin();
  }
});
