
const supabase = supabase.createClient(
  'https://duyamagiyvrpqkhkvlrx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWFtYWdpeXZycHFraGt2bHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA2NTcsImV4cCI6MjA2NDE3NjY1N30.atmVHRAzE1oKx8Tgby_v-Iota_W7c5KOxDEP10_DVLE'
);

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
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

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) window.location.href = 'index.html';
});
