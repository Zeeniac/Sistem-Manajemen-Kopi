// ============================================
// 2BROTHER'S COFFEE - ABOUT PAGE
// Load team data from JSON
// ============================================

let teamMembers = [];

// Load team from JSON
async function loadTeam() {
  try {
    const response = await fetch("data/team.json");
    const data = await response.json();
    teamMembers = data.team;
    renderTeam();
  } catch (error) {
    console.error("Error loading team:", error);
    const grid = document.getElementById("teamGrid");
    if (grid) {
      grid.innerHTML =
        "<p>Unable to load team information. Please refresh the page.</p>";
    }
  }
}

// Load farmers and communities from team.json
async function loadFarmersAndCommunities() {
  try {
    const response = await fetch("data/team.json");
    const data = await response.json();
    renderFarmers(data.farmers);
    renderCommunities(data.communities);
  } catch (error) {
    console.error("Error loading farmers/communities:", error);
  }
}

// Render farmers
function renderFarmers(farmers) {
  const grid = document.getElementById("farmersGrid");
  if (!grid) return;

  if (!farmers || farmers.length === 0) {
    grid.innerHTML =
      '<p class="empty-state">No farmer partners data available.</p>';
    return;
  }

  grid.innerHTML = farmers
    .map(
      (farmer) => `
        <div class="farmer-card">
            <div class="farmer-icon">
                <i class="fas fa-handshake"></i>
            </div>
            <h3>${farmer.name}</h3>
            <p class="farmer-region"><i class="fas fa-map-marker-alt"></i> ${farmer.region}</p>
            <p class="farmer-description">${farmer.description}</p>
        </div>
    `,
    )
    .join("");
}

// Render communities
function renderCommunities(communities) {
  const grid = document.getElementById("communitiesGrid");
  if (!grid) return;

  if (!communities || communities.length === 0) {
    grid.innerHTML = '<p class="empty-state">No community data available.</p>';
    return;
  }

  grid.innerHTML = communities
    .map(
      (community) => `
        <div class="community-card">
            <div class="community-icon">
                <i class="fas fa-users"></i>
            </div>
            <h3>${community.name}</h3>
            <p>${community.description}</p>
        </div>
    `,
    )
    .join("");
}

// Render team grid
function renderTeam() {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;

  if (teamMembers.length === 0) {
    grid.innerHTML = "<p>No team members found.</p>";
    return;
  }

  grid.innerHTML = teamMembers
    .map(
      (member) => `
        <div class="team-card">
            <div class="team-image" style="background-image: url('${member.image}');"></div>
            <div class="team-content">
                <h3>${member.name}</h3>
                <div class="team-role">${member.role}</div>
                <p class="team-bio">${member.bio}</p>
                <div class="team-social">
                    <a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                    <a href="${member.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadTeam();
  loadFarmersAndCommunities(); // ← PENTING: ini harus dipanggil
});
