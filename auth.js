// Initialize Supabase (THIS WAS MISSING BEFORE)
const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorBox = document.getElementById("error");

// Toggle UI
function showLogin() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  errorBox.style.display = "none";
}

function showRegister() {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  errorBox.style.display = "none";
}

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorBox.textContent = error.message;
    errorBox.style.display = "block";
    return;
  }

  alert("Login successful");
  // window.location.href = "quiz.html";
});

// REGISTER
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    errorBox.textContent = error.message;
    errorBox.style.display = "block";
    return;
  }

  alert("Registration successful. Please login.");
  showLogin();
});
