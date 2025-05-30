// Initialize Supabase
const supabaseUrl = 'https://duyamagiyvrpqkhkvlrx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWFtYWdpeXZycHFraGt2bHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA2NTcsImV4cCI6MjA2NDE3NjY1N30.atmVHRAzE1oKx8Tgby_v-Iota_W7c5KOxDEP10_DVLE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterRegion = document.getElementById('filter-region');
const resultsTable = document.getElementById('results-table');
const pagination = document.getElementById('pagination');
const logoutBtn = document.getElementById('logout-btn');
const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));

let currentPage = 1;
const itemsPerPage = 10;

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  fetchFarmers();
});

// Search function
searchBtn.addEventListener('click', () => {
  currentPage = 1;
  fetchFarmers();
});

// Filter by region
filterRegion.addEventListener('change', () => {
  currentPage = 1;
  fetchFarmers();
});

// Fetch farmers with pagination
async function fetchFarmers() {
  const searchTerm = searchTerm = searchInput.value.trim();
  const regionFilter = filterRegion.value;
  
  let query = supabase
    .from('farmers_search')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,village.ilike.%${searchTerm}%`);
  }

  if (regionFilter) {
    query = query.eq('region', regionFilter);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
    resultsTable.innerHTML = '<tr><td colspan="7" class="text-center">Error loading data</td></tr>';
  } else {
    displayResults(data);
    setupPagination(count);
  }
}

// Display results in table
function displayResults(farmers) {
  if (farmers.length === 0) {
    resultsTable.innerHTML = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
    return;
  }

  resultsTable.innerHTML = farmers.map(farmer => `
    <tr>
      <td>${farmer.name}</td>
      <td>${farmer.gender || '-'}</td>
      <td>${farmer.region || '-'}</td>
      <td>${farmer.village || '-'}</td>
      <td>${farmer.farm_type || '-'}</td>
      <td>${new Date(farmer.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-info view-btn" data-id="${farmer.id}">View</button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to view buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await showFarmerDetails(id);
    });
  });
}

// Show farmer details in modal
async function showFarmerDetails(id) {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching farmer:', error);
    document.getElementById('modal-body').innerHTML = '<p>Error loading details</p>';
  } else {
    document.getElementById('modal-body').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Gender:</strong> ${data.gender || '-'}</p>
          <p><strong>Age:</strong> ${data.age || '-'}</p>
          <p><strong>Region:</strong> ${data.region || '-'}</p>
          <p><strong>Village:</strong> ${data.village || '-'}</p>
          <p><strong>Group Name:</strong> ${data.group_name || '-'}</p>
        </div>
        <div class="col-md-6">
          <p><strong>Farm Type:</strong> ${data.farm_type || '-'}</p>
          <p><strong>Specific Activity:</strong> ${data.specific_activity || '-'}</p>
          <p><strong>Land Area:</strong> 
            ${data.land_teau || '0'} Teau, 
            ${data.land_eka || '0'} Eka, 
            ${data.land_pole || '0'} Pole
          </p>
          <p><strong>Activities:</strong> ${data.activities ? data.activities.join(', ') : '-'}</p>
          <p><strong>Comments:</strong> ${data.comments || '-'}</p>
          <p><strong>Date Registered:</strong> ${new Date(data.created_at).toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  
  viewModal.show();
}

// Setup pagination
function setupPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchFarmers();
    }
  });
  pagination.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${currentPage === i ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      fetchFarmers();
    });
    pagination.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      fetchFarmers();
    }
  });
  pagination.appendChild(nextLi);
}

// Logout
logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Error logging out: ' + error.message);
  } else {
    window.location.href = 'index.html';
  }
});