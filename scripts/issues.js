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

// Label UI Config

function getLabelConfig(label) {
  const lower = label.toLowerCase();

  if (lower === 'bug') {
    return {
      wrapper: 'bg-red-50 border border-red-200',
      text: 'text-red-500',
      icon: `<i class="fa-solid fa-bug text-red-500 w-4 h-4"></i>`,
    };
  }

  if (lower === 'help wanted') {
    return {
      wrapper: 'bg-orange-50 border border-orange-200',
      text: 'text-orange-400',
      icon: `<i class="fa-solid fa-life-ring text-orange-400 w-4 h-4"></i>`,
    };
  }

  if (lower === 'enhancement') {
    return {
      wrapper: 'bg-green-50 border border-green-200',
      text: 'text-green-500',
      icon: `<i class="fa-solid fa-bahai text-green-500 w-4 h-4"></i>`,
    };
  }

  if (lower === 'good first issue') {
    return {
      wrapper: 'bg-blue-50 border border-blue-200',
      text: 'text-blue-500',
      icon: `<i class="fa-regular fa-star text-blue-500 w-4 h-4"></i>`,
    };
  }

  return {
    wrapper: 'bg-gray-50 border border-gray-200',
    text: 'text-gray-500',
    icon: `<i class="fa-solid fa-bars-staggered text-gray-500 w-4 h-4"></i>`,
  };
}

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

// Card Creator (Updated UI)

function createIssueCard(issue) {
  const card = document.createElement('div');

  const priorityColor =
    issue.priority?.toLowerCase() === 'high'
      ? '#EF4444'
      : issue.priority?.toLowerCase() === 'medium'
        ? '#F59E0B'
        : '#9CA3AF';

  const priorityBg =
    issue.priority?.toLowerCase() === 'high'
      ? '#EF444410'
      : issue.priority?.toLowerCase() === 'medium'
        ? '#F59E0B10'
        : '#9CA3AF10';

  const statusColor = issue.status === 'open' ? '#00A96E' : '#A855F7';

  const statusIcon =
    issue.status === 'open'
      ? `<div class="w-7 h-7 flex items-center justify-center text-green-500 bg-green-100 rounded-full">
          <i class="fa-regular fa-circle-dot"></i>
        </div>`
      : `<div class="w-7 h-7 flex items-center justify-center text-purple-500 bg-purple-100 rounded-full">
          <i class="fa-regular fa-circle-check"></i>
        </div>`;

  const labelsHTML =
    issue.labels
      ?.map((label) => {
        const { wrapper, text, icon } = getLabelConfig(label);

        return `
          <div class="flex items-center gap-1 ${wrapper} px-2 py-1 rounded-full">
            ${icon}
            <span class="${text} text-[10px] uppercase">${label}</span>
          </div>
        `;
      })
      .join('') || '';

  card.innerHTML = `
    <div class="cursor-pointer bg-white rounded-xl h-full shadow-sm border border-gray-100 overflow-hidden">

      <div style="background-color:${statusColor}" class="h-1.5 w-full"></div>

      <div class="p-6">

        <div class="flex justify-between items-center mb-4">

          ${statusIcon}

          <span style="color:${priorityColor}; background:${priorityBg}"
            class="px-6 py-1.5 rounded-full text-sm font-bold tracking-wider">
            ${issue.priority}
          </span>

        </div>

        <h2 class="text-[#2c3e50] text-xl font-bold leading-tight mb-3">
          ${issue.title}
        </h2>

        <p class="text-slate-400 text-base mb-6">
          ${issue.description || 'No description provided.'}
        </p>

        <div class="flex gap-3 flex-wrap">
          ${labelsHTML}
        </div>

      </div>

      <div class="border-t border-gray-100"></div>

      <div class="p-6 flex justify-between text-slate-500 text-sm">
        <span>#${issue.id} by ${issue.author}</span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
      </div>

      <div class="px-6 pb-6 flex justify-between text-slate-500 text-sm">
        <span>Assignee: ${issue.assignee || 'N/A'}</span>
        <span>Updated: ${new Date(issue.updatedAt).toLocaleDateString()}</span>
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

// Modal (Updated UI)

function showIssueModal(issue) {
  if (!modalContent) return;

  const statusColor = issue.status === 'open' ? '#00A96E' : '#A855F7';

  const priorityColor =
    issue.priority?.toLowerCase() === 'high'
      ? '#EF4444'
      : issue.priority?.toLowerCase() === 'medium'
        ? '#F59E0B'
        : '#9CA3AF';

  const priorityBg =
    issue.priority?.toLowerCase() === 'high'
      ? '#EF444410'
      : issue.priority?.toLowerCase() === 'medium'
        ? '#F59E0B10'
        : '#9CA3AF10';

  const labelsHTML =
    issue.labels
      ?.map((label) => {
        const { wrapper, text, icon } = getLabelConfig(label);

        return `
          <div class="flex items-center gap-1 ${wrapper} px-2 py-1 rounded-full">
            ${icon}
            <span class="${text} text-[10px] uppercase">${label}</span>
          </div>
        `;
      })
      .join('') || '';

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold text-[#1a1f36] mb-2">${issue.title}</h2>

    <div class="flex items-center gap-2 mb-4 text-xs text-slate-500">

      <span style="background:${statusColor}"
      class="text-white px-2.5 py-0.5 rounded-full uppercase">
      ${issue.status}
      </span>

      <span>•</span>
      <span>By ${issue.author}</span>

      <span>•</span>
      <span>${new Date(issue.createdAt).toLocaleDateString()}</span>

    </div>

    <div class="flex gap-3 flex-wrap mb-4">
      ${labelsHTML}
    </div>

    <p class="text-slate-500 text-sm leading-snug mb-6">
      ${issue.description || 'No description available.'}
    </p>

    <div class="bg-[#f8faff] rounded-xl p-4 flex justify-between items-center mb-6 border border-slate-50">

      <div>
        <p class="text-slate-400 text-xs font-medium">Assignee</p>
        <p class="text-[#1a1f36] text-sm font-bold">
          ${issue.assignee || 'Unassigned'}
        </p>
      </div>

      <div class="text-right">
        <p class="text-slate-400 text-xs font-medium mb-1">Priority</p>

        <span style="color:${priorityColor}; background:${priorityBg}"
        class="px-4 py-0.5 rounded-full text-sm font-semibold">
        ${issue.priority}
        </span>
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

// Event Listeners

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

// Initial Load

fetchAllIssues();
