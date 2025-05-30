// Initialize Supabase
const supabaseUrl = 'https://duyamagiyvrpqkhkvlrx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWFtYWdpeXZycHFraGt2bHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA2NTcsImV4cCI6MjA2NDE3NjY1N30.atmVHRAzE1oKx8Tgby_v-Iota_W7c5KOxDEP10_DVLE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const form = document.getElementById('registration-form');
const clearBtn = document.getElementById('clear-btn');
const logoutBtn = document.getElementById('logout-btn');

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert('You must be logged in to submit a form');
    window.location.href = 'index.html';
    return;
  }

  // Get selected activities
  const activitiesSelect = document.getElementById('activities');
  const selectedActivities = Array.from(activitiesSelect.selectedOptions)
    .map(option => option.value);

  const formData = {
    user_id: user.id,
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    age: document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null,
    region: document.getElementById('region').value,
    village: document.getElementById('village').value,
    group_name: document.getElementById('groupName').value,
    farm_type: document.getElementById('farmType').value,
    specific_activity: document.getElementById('specificActivity').value,
    land_teau: document.getElementById('landTeau').value ? parseFloat(document.getElementById('landTeau').value) : null,
    land_eka: document.getElementById('landEka').value ? parseFloat(document.getElementById('landEka').value) : null,
    land_pole: document.getElementById('landPole').value ? parseFloat(document.getElementById('landPole').value) : null,
    comments: document.getElementById('comments').value,
    activities: selectedActivities
  };

  const { data, error } = await supabase
    .from('farmers')
    .insert([formData])
    .select();

  if (error) {
    console.error('Error inserting data:', error);
    alert('Error submitting form: ' + error.message);
  } else {
    alert('Farmer registration submitted successfully!');
    form.reset();
  }
});

// Clear form
clearBtn.addEventListener('click', () => {
  form.reset();
});

// Logout
logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Error logging out: ' + error.message);
  } else {
    window.location.href = 'index.html';
  }
});