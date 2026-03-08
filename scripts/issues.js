// DOM Elements - Issues Dashboard

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const issuesContainer = document.getElementById('issuesContainer');
const issueCount = document.getElementById('issueCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const issueModal = document.getElementById('issueModal');
const modalContent = document.getElementById('modalContent');

const allBtn = document.getElementById('allIssuesBtn');
const openBtn = document.getElementById('openIssuesBtn');
const closedBtn = document.getElementById('closedIssuesBtn');

// State

let allIssues = [];
let currentFilter = 'all';

// Helper Functions

function toggleLoading(show) {
  loadingSpinner.classList.toggle('hidden', !show);
  issuesContainer.classList.toggle('hidden', show);
  errorMessage?.classList.add('hidden');
}

function showError(msg) {
  if (errorMessage) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
  }
  toggleLoading(false);
}

function updateIssueCount(count) {
  if (issueCount) issueCount.textContent = count;
}

function getFilteredIssues() {
  if (currentFilter === 'all') return allIssues;
  return allIssues.filter((issue) => issue.status === currentFilter);
}

function setActiveTab(btn) {
  [allBtn, openBtn, closedBtn].forEach((b) =>
    b?.classList.remove('btn-primary')
  );
  btn?.classList.add('btn-primary');
}

function showNoSearchResults() {
  issuesContainer.innerHTML = `
    <div class="text-center py-16 text-gray-500">
      <h3 class="text-xl font-semibold mb-2">No issues found</h3>
      <p>Try searching with a different keyword.</p>
    </div>
  `;
  updateIssueCount(0);
}

// Card Creator

function createIssueCard(issue) {
  const card = document.createElement('div');
  card.className = `card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${
    issue.status === 'open' ? 'border-green-500' : 'border-purple-500'
  }`;

  card.innerHTML = `
    <div class="card-body space-y-3">
      <div class="flex justify-between items-start gap-2">
        <h3 class="text-xl font-bold flex-1 line-clamp-2">${issue.title}</h3>
        <span class="badge badge-neutral uppercase">${issue.priority}</span>
      </div>

      <p class="text-gray-600 line-clamp-3">${issue.description || 'No description provided.'}</p>

      <div class="flex flex-wrap gap-2">
        ${issue.labels?.map((label) => `<div class="badge badge-outline">${label}</div>`).join('') || ''}
      </div>

      <div class="divider my-1"></div>

      <div class="text-sm text-gray-500 flex flex-col gap-1">
        <div>#${issue.id} opened by <strong>${issue.author}</strong></div>
        <div>${new Date(issue.createdAt).toLocaleDateString('en-GB')}</div>
      </div>
    </div>
  `;

  card.addEventListener('click', () => showIssueModal(issue));
  return card;
}

// Render Issues

function renderIssues(issuesList) {
  issuesContainer.innerHTML = '';

  if (!issuesList || issuesList.length === 0) {
    issuesContainer.innerHTML =
      '<p class="text-center py-10 text-gray-500">No issues to display.</p>';
  } else {
    issuesList.forEach((issue) => {
      issuesContainer.appendChild(createIssueCard(issue));
    });
  }

  updateIssueCount(issuesList?.length || 0);
}

// Modal

function showIssueModal(issue) {
  if (!modalContent) return;

  modalContent.innerHTML = `
    <h3 class="text-2xl font-bold mb-4">${issue.title}</h3>

    <div class="flex flex-wrap gap-3 mb-4">
      <div class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'} uppercase">
        ${issue.status}
      </div>
      <div class="text-sm">
        Opened by <strong>${issue.author}</strong> • ${new Date(issue.createdAt).toLocaleDateString('en-GB')}
      </div>
    </div>

    <p class="mb-6 whitespace-pre-wrap">${issue.description || 'No description available.'}</p>

    <div class="flex flex-wrap gap-2 mb-6">
      ${issue.labels?.map((l) => `<div class="badge badge-outline">${l}</div>`).join('') || '<span class="text-gray-500">No labels</span>'}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div>
        <p class="font-medium">Assignee</p>
        <p class="mt-1">${issue.assignee || 'Unassigned'}</p>
      </div>
      <div>
        <p class="font-medium">Priority</p>
        <p class="mt-1 uppercase font-medium">${issue.priority}</p>
      </div>
    </div>
  `;

  issueModal?.showModal();
}

// Fetch Functions

async function fetchAllIssues() {
  toggleLoading(true);

  try {
    const response = await fetch(
      'https://phi-lab-server.vercel.app/api/v1/lab/issues'
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message || 'API error');

    allIssues = data.data || [];
    renderIssues(getFilteredIssues());
  } catch (err) {
    console.error(err);
    showError(`Failed to load issues: ${err.message}`);
  } finally {
    toggleLoading(false);
  }
}

async function searchIssues(query) {
  if (!query.trim()) {
    showNoSearchResults();
    return;
  }

  toggleLoading(true);

  try {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.status !== 'success')
      throw new Error(data.message || 'Search error');

    const results = data.data || [];
    allIssues = results; 
    currentFilter = 'all'; 
    setActiveTab(allBtn);
    renderIssues(results);
  } catch (err) {
    console.error(err);
    showError(`Search failed: ${err.message}`);
  } finally {
    toggleLoading(false);
  }
}

// Event Listeners (dashboard only)

// Tabs
document.getElementById('filterButtons')?.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn')) return;

  if (e.target.id === 'allIssuesBtn') currentFilter = 'all';
  if (e.target.id === 'openIssuesBtn') currentFilter = 'open';
  if (e.target.id === 'closedIssuesBtn') currentFilter = 'closed';

  setActiveTab(e.target);
  renderIssues(getFilteredIssues());
});

searchBtn?.addEventListener('click', () => {
  const query = searchInput?.value.trim() || '';
  searchIssues(query);
});

searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn?.click();
  }
});
