// Safety check
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  alert("Supabase config missing");
  throw new Error("Supabase config missing");
}

// Create Supabase client ONCE
const sb = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// Elements
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorBox = document.getElementById("errorBox");

// Tabs
loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  hideError();
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.style.display = "block";
  loginForm.style.display = "none";
  hideError();
};

// Login
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  hideError();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return showError(error.message);

  alert("Login successful");
};

// Register
registerForm.onsubmit = async (e) => {
  e.preventDefault();
  hideError();

  const email = regEmail.value;
  const password = regPassword.value;

  const { error } = await sb.auth.signUp({ email, password });
  if (error) return showError(error.message);

  alert("Registration successful. Please login.");
  loginTab.click();
};

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

function hideError() {
  errorBox.style.display = "none";
}
