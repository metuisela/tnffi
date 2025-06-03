// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Check if Supabase is available
  if (window.supabase) {
    // Initialize Supabase
    const supabase = window.supabase.createClient(
      'https://duyamagiyvrpqkhkvlrx.supabase.co',
      'YOUR_PUBLIC_SUPABASE_KEY'
    );

    // Login handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          alert('Login failed: ' + error.message);
        } else {
          window.location.href = 'form.html';
        }
      });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) window.location.href = 'index.html';
      });
    }
  } else {
    console.error('Supabase library not loaded.');
  }
});
