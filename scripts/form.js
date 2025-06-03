
const supabaseUrl = 'https://duyamagiyvrpqkhkvlrx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWFtYWdpeXZycHFraGt2bHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA2NTcsImV4cCI6MjA2NDE3NjY1N30.atmVHRAzE1oKx8Tgby_v-Iota_W7c5KOxDEP10_DVLE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    age: document.getElementById('age').value,
    region: document.getElementById('region').value,
    village: document.getElementById('village').value,
    group_name: document.getElementById('groupName').value,
    farm_type: document.getElementById('farmType').value,
    specific_activity: document.getElementById('specificActivity').value,
    land_teau: document.getElementById('landTeau').value,
    land_eka: document.getElementById('landEka').value,
    land_pole: document.getElementById('landPole').value,
    activities: Array.from(document.getElementById('activities').selectedOptions).map(opt => opt.value),
    comments: document.getElementById('comments').value
  };

  const { error } = await supabase.from('farmers').insert([data]);
  if (error) {
    alert('Error saving data: ' + error.message);
  } else {
    alert('Farmer registered successfully!');
    document.getElementById('registration-form').reset();
  }
});

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('registration-form').reset();
});
