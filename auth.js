if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  throw new Error("Supabase config missing");
}
// Use ONLY the values from index.html
const supabaseClient = window.supabase.createClient(
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
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showError(error.message);
    return;
  }

  alert("Login successful");
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    showError(error.message);
    return;
  }

  alert("Registration successful. Please login.");
  loginTab.click();
});

// Helpers
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

function hideError() {
  errorBox.style.display = "none";
}
