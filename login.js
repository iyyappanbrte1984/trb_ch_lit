// login.js – FINAL FIXED VERSION

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // Supabase Configuration
  // ===============================
  const SUPABASE_URL = "https://qqmbquelvcupzngbowvs.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbWJxdWVsdmN1cHpuZ2Jvd3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODM3NzgsImV4cCI6MjA4MTM1OTc3OH0.SumVL_hNoXsxGaz711E2G6hq6vlxGXOLA2AhUqBdiTE";

  window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  // ===============================
  // Element References
  // ===============================
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const authMessage = document.getElementById("auth-message");

  const authCard = document.getElementById("auth-card");
  const quizCard = document.getElementById("quiz-card");
  const scoreCard = document.getElementById("score-card");

  // ===============================
  // Tab Switching
  // ===============================
  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    authMessage.textContent = "";
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    authMessage.textContent = "";
  });

  // ===============================
  // Login Handler
  // ===============================
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // IMPORTANT

    authMessage.textContent = "";

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      authMessage.textContent = "Email மற்றும் Password அவசியம்.";
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      authMessage.textContent = error.message;
      return;
    }

    afterLogin();
  });

  // ===============================
  // Register Handler
  // ===============================
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // IMPORTANT

    authMessage.textContent = "";

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    if (!name || !email || !password) {
      authMessage.textContent = "அனைத்து புலங்களும் நிரப்பவும்.";
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      authMessage.textContent = error.message;
      return;
    }

    authMessage.textContent =
      "Account உருவாக்கப்பட்டது. Email confirmation தேவைப்பட்டால் inbox பார்க்கவும்.";
  });

  // ===============================
  // After Login UI Setup
  // ===============================
  async function afterLogin() {
    authCard.style.display = "none";
    quizCard.style.display = "block";
    scoreCard.style.display = "block";
    logoutBtn.style.display = "inline-block";

    if (window.setupQuiz) window.setupQuiz();
    if (window.loadScores) window.loadScores();
  }

  // ===============================
  // Logout
  // ===============================
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  });

  // ===============================
  // Auto Login Check
  // ===============================
  supabaseClient.auth.getUser().then(({ data }) => {
    if (data.user) {
      afterLogin();
    }
  });

});
