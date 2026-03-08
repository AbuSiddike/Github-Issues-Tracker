const allIssuesBtn = document.getElementById("allIssuesBtn");
const openIssuesBtn = document.getElementById("openIssuesBtn");
const closedIssuesBtn = document.getElementById("closedIssuesBtn");

const issuesContainer = document.getElementById("issuesContainer");
const openIssuesSection = document.getElementById("openIssuesSection");
const closedIssuesSection = document.getElementById("closedIssuesSection");

const issueCount = document.getElementById("issueCount");
const issueModal = document.getElementById("issueModal");
const loadingSpinner = document.getElementById("loadingSpinner");

let allIssues = [];
let openIssues = [];
let closedIssues = [];


/* ------------------ Spinner ------------------ */

function toggleSpinner(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden");
    issuesContainer.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
    issuesContainer.classList.remove("hidden");
  }
}


/* ------------------ Issue Counter ------------------ */

function updateIssueCounter(type) {
  if (type === "all") {
    issueCount.innerText = allIssues.length;
  } else if (type === "open") {
    issueCount.innerText = openIssues.length;
  } else if (type === "closed") {
    issueCount.innerText = closedIssues.length;
  }
}


/* ------------------ Filter Buttons ------------------ */

document
  .getElementById("filterButtons")
  .addEventListener("click", (event) => {

    const clicked = event.target;
    const buttons = document.querySelectorAll("#filterButtons .btn");

    buttons.forEach(btn => btn.classList.remove("btn-primary"));
    clicked.classList.add("btn-primary");

    if (!clicked.classList.contains("btn")) return;

    if (clicked.id === "allIssuesBtn") {
      issuesContainer.classList.remove("hidden");
      openIssuesSection.classList.add("hidden");
      closedIssuesSection.classList.add("hidden");
      updateIssueCounter("all");
    }

    if (clicked.id === "openIssuesBtn") {
      issuesContainer.classList.add("hidden");
      openIssuesSection.classList.remove("hidden");
      closedIssuesSection.classList.add("hidden");
      updateIssueCounter("open");
    }

    if (clicked.id === "closedIssuesBtn") {
      issuesContainer.classList.add("hidden");
      openIssuesSection.classList.add("hidden");
      closedIssuesSection.classList.remove("hidden");
      updateIssueCounter("closed");
    }
  });


/* ------------------ Load All Issues ------------------ */

async function fetchAllIssues() {

  toggleSpinner(true);

  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues"
  );

  const result = await response.json();

  renderIssues(result.data);

  toggleSpinner(false);
}


/* ------------------ Load Single Issue ------------------ */

async function fetchSingleIssue(id) {

  toggleSpinner(true);

  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
  );

  const result = await response.json();

  showIssueModal(result.data);

  toggleSpinner(false);
}


/* ------------------ Modal ------------------ */

function showIssueModal(issue) {

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = "";

  const modalCard = document.createElement("div");

  modalCard.innerHTML = `
  <div class="modal-box">

  <h3 class="text-xl font-bold">${issue.title}</h3>

  <div class="flex items-center gap-3 mb-3">

  <p class="text-white uppercase rounded-full px-3 py-1 ${
    issue.status === "open" ? "bg-green-500" : "bg-purple-500"
  }">
  ${issue.status}
  </p>

  <p>Opened by <span>${issue.author}</span></p>
  <p>${new Date(issue.createdAt).toLocaleDateString("en-GB")}</p>

  </div>

  <div class="flex gap-2 my-3">

  <p class="bg-red-100 border border-red-500 text-red-500 rounded-full px-2 font-bold">
  <i class="fa-solid fa-bug"></i> ${issue.labels[0]}
  </p>

  <p class="bg-yellow-100 border border-yellow-500 text-yellow-500 rounded-full px-2 font-bold">
  <i class="fa-regular fa-life-ring"></i> ${issue.labels[1]}
  </p>

  </div>

  <p>${issue.description}</p>

  <div class="flex justify-between my-3">

  <div>
  <p>assignee:</p>
  <p class="text-xl font-bold">${issue.assignee}</p>
  </div>

  <div class="text-center">
  <p>priority</p>
  <p class="bg-red-500 text-white px-3 rounded-full uppercase">
  ${issue.priority}
  </p>
  </div>

  </div>

  <div class="modal-action">
  <form method="dialog">
  <button class="btn">Close</button>
  </form>
  </div>

  </div>
  `;

  modalContent.append(modalCard);
  issueModal.showModal();
}


/* ------------------ Search ------------------ */

async function searchIssues() {

  const searchField = document.getElementById("searchInput");
  const query = searchField.value;

  if (query.trim() === "") {
    fetchAllIssues();
    return;
  }

  toggleSpinner(true);

  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`
  );

  const result = await response.json();

  renderIssues(result.data);

  toggleSpinner(false);
}

document
  .getElementById("searchInput")
  .addEventListener("input", searchIssues);


/* ------------------ Render Cards ------------------ */

function renderIssues(issues) {

  issuesContainer.innerHTML = "";
  openIssuesSection.innerHTML = "";
  closedIssuesSection.innerHTML = "";

  allIssues = [];
  openIssues = [];
  closedIssues = [];

  issues.forEach(issue => {

    allIssues.push(issue);

    const card = document.createElement("div");

    card.innerHTML = `
    <div onclick="fetchSingleIssue(${issue.id})"
    class="card card-body shadow space-y-4 h-full border-t-4 ${
      issue.status === "open" ? "border-green-500" : "border-purple-500"
    }">

    <div class="flex justify-between">
    <img class="w-10 h-10" src="./assets/Open-Status.png">
    <p class="bg-red-100 text-red-500 font-bold px-6 py-2 rounded-full">
    ${issue.priority}
    </p>
    </div>

    <div>
    <h2 class="text-2xl font-bold">${issue.title}</h2>
    <p class="text-gray-400 line-clamp-2">${issue.description}</p>
    </div>

    <div class="flex gap-2">

    <p class="bg-red-100 border border-red-500 text-red-500 px-2 rounded-full font-bold">
    <i class="fa-solid fa-bug"></i> ${issue.labels[0]}
    </p>

    <p class="bg-yellow-100 border border-yellow-500 text-yellow-500 px-2 rounded-full font-bold">
    <i class="fa-regular fa-life-ring"></i> ${issue.labels[1]}
    </p>

    </div>

    <div class="divider"></div>

    <div>
    <p>#1 by ${issue.author}</p>
    <p>${new Date(issue.updatedAt).toLocaleDateString("en-GB")}</p>
    </div>

    </div>
    `;

    if (issue.status === "open") {
      openIssues.push(issue);
      openIssuesSection.append(card.cloneNode(true));
    }

    if (issue.status === "closed") {
      closedIssues.push(issue);
      closedIssuesSection.append(card.cloneNode(true));
    }

    issuesContainer.append(card);
  });

  updateIssueCounter("all");
}


/* ------------------ Initial Load ------------------ */

fetchAllIssues();