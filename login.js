document.addEventListener("DOMContentLoaded", () => {

  const SUPABASE_URL = "https://qqmbquelvcupzngbowvs.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbWJxdWVsdmN1cHpuZ2Jvd3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODM3NzgsImV4cCI6MjA4MTM1OTc3OH0.SumVL_hNoXsxGaz711E2G6hq6vlxGXOLA2AhUqBdiTE";

  window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authMessage = document.getElementById("auth-message");
  const logoutBtn = document.getElementById("logout-btn");

  tabLogin.onclick = () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    authMessage.textContent = "";
  };

  tabRegister.onclick = () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    authMessage.textContent = "";
  };

  document.getElementById("login-btn").onclick = async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email, password
    });

    if (error) authMessage.textContent = error.message;
    else afterLogin();
  };

  document.getElementById("register-btn").onclick = async () => {
    const { error } = await supabaseClient.auth.signUp({
      email: regEmail.value.trim(),
      password: regPassword.value,
      options: { data: { full_name: regName.value.trim() } }
    });

    authMessage.textContent = error
      ? error.message
      : "Account created. Check email if confirmation is enabled.";
  };

  async function afterLogin() {
    document.getElementById("auth-card").style.display = "none";
    document.getElementById("quiz-card").style.display = "block";
    document.getElementById("score-card").style.display = "block";
    logoutBtn.style.display = "inline-block";

    if (window.setupQuiz) setupQuiz();
    if (window.loadScores) loadScores();
  }

  logoutBtn.onclick = async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  };

});
