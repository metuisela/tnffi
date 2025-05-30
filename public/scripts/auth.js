// Initialize Supabase
const supabaseUrl = 'https://duyamagiyvrpqkhkvlrx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWFtYWdpeXZycHFraGt2bHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA2NTcsImV4cCI6MjA2NDE3NjY1N30.atmVHRAzE1oKx8Tgby_v-Iota_W7c5KOxDEP10_DVLE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// DOM elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

// Toggle between login and signup
signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
});

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// Login function
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  console.log('Attempting login with:', email); // Add this line
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  console.log('Login response:', { data, error }); // Add this line

  if (error) {
    console.error('Login error:', error); // Add this line
    alert(error.message);
  } else {
    console.log('Login successful, redirecting...'); // Add this line
    window.location.href = 'form.html';
  }
});

// Signup function
signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    alert('Signup successful! Please check your email for confirmation.');
    signupSection.style.display = 'none';
    loginSection.style.display = 'block';
  }
});

// Check if user is already logged in
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    window.location.href = 'form.html';
  }
}

checkAuth();
