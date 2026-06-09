// ============================================
// 2BROTHER'S COFFEE - COFFEE PAGE
// Product listing with filter (Green Beans / Roasted)
// ============================================

let allProducts = [];
let currentTypeFilter = "all"; // all, green-beans, roasted
let currentCategoryFilter = "all"; // all, Arabika, Robusta (hanya untuk green beans)

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    const data = await response.json();
    allProducts = data.products;
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    const grid = document.getElementById("productsGrid");
    if (grid) {
      grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load products. Please refresh the page.</p>
                </div>
            `;
    }
  }
}

// Filter products based on current filters
function getFilteredProducts() {
  let filtered = [...allProducts];

  // Filter by product type (Green Beans / Roasted)
  if (currentTypeFilter === "green-beans") {
    filtered = filtered.filter((p) => p.category !== "Roasted");
  } else if (currentTypeFilter === "roasted") {
    filtered = filtered.filter((p) => p.category === "Roasted");
  }

  // Filter by category (Arabika/Robusta) - hanya untuk green beans
  if (currentCategoryFilter !== "all" && currentTypeFilter !== "roasted") {
    filtered = filtered.filter((p) => p.category === currentCategoryFilter);
  }

  return filtered;
}

// Render products based on current filters
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const filteredProducts = getFilteredProducts();

  // Update results count
  const countSpan = document.getElementById("resultsCount");
  if (countSpan) {
    countSpan.textContent = filteredProducts.length;
  }

  // Show/hide category filter group for roasted products
  const categoryFilterGroup = document.getElementById("categoryFilterGroup");
  if (categoryFilterGroup) {
    if (currentTypeFilter === "roasted") {
      categoryFilterGroup.style.display = "none";
    } else {
      categoryFilterGroup.style.display = "flex";
    }
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-coffee"></i>
                <p>No products found in this category.</p>
            </div>
        `;
    return;
  }

  grid.innerHTML = filteredProducts
    .map((product) => {
      // Tentukan tombol request sample berdasarkan jenis produk
      const sampleText =
        product.category === "Roasted"
          ? "Request Sample (250gr)"
          : "Request Sample";

      return `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${product.image}');"></div>
                <div class="product-content">
                    <div class="product-category">${product.category} ${product.category !== "Roasted" ? "G1" : ""}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toLocaleString()}<small>/${product.category === "Roasted" ? "kg" : "ton FOB"}</small></div>
                    <button class="btn-sample" onclick="openProductModal(${product.id})">View Details</button>
                    <button class="btn-detail" onclick="requestSample(${product.id})">${sampleText}</button>
                </div>
            </div>
        `;
    })
    .join("");
}

// Request sample function (250gr only)
function requestSample(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (product) {
    // Simpan ke localStorage untuk sementara
    const sampleRequest = {
      productId: product.id,
      productName: product.name,
      quantity: "250gr",
      date: new Date().toISOString(),
      status: "pending",
    };

    let requests = JSON.parse(localStorage.getItem("sampleRequests") || "[]");
    requests.push(sampleRequest);
    localStorage.setItem("sampleRequests", JSON.stringify(requests));

    // Redirect ke contact page dengan pesan
    localStorage.setItem("pendingSample", JSON.stringify(sampleRequest));
    window.location.href = "contact.html?sample=" + product.id;
  }
}

// Open modal with product details
function openProductModal(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  modalTitle.textContent = product.name;

  // Tampilkan spesifikasi berdasarkan jenis produk
  let specHtml = "";

  if (product.category === "Roasted") {
    specHtml = `
            <div class="origin-badge">🔥 Roast Level: ${product.roastLevel || "Medium"}</div>
            <table class="spec-table">
                <tr><td style="padding: 8px 0; font-weight: 600;">Category</td><td>${product.category}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Price</td><td>$${product.price.toLocaleString()}/${product.unit}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Flavor Profile</td><td>${product.flavorProfile || product.flavor || "-"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Origin</td><td>${product.origin}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Process</td><td>${product.process}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Packaging</td><td>${product.packaging || "250gr / 500gr / 1kg"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">MOQ</td><td>${product.moq}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Lead Time</td><td>${product.leadTime}</td></tr>
            </table>
        `;
  } else {
    specHtml = `
            <div class="origin-badge">🌍 ${product.origin}</div>
            <table class="spec-table">
                <tr><td style="padding: 8px 0; font-weight: 600;">Category</td><td>${product.category} G1</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Price</td><td>$${product.price.toLocaleString()} ${product.unit}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Moisture</td><td>${product.moisture}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Defects</td><td>${product.defects}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Screen Size</td><td>${product.screen}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Process</td><td>${product.process}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">MOQ</td><td>${product.moq}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Lead Time</td><td>${product.leadTime}</td></tr>
            </table>
        `;
  }

  const sampleText =
    product.category === "Roasted"
      ? "Request Sample (250gr)"
      : "Request Sample (250gr)";

  modalBody.innerHTML = `
        ${specHtml}
        <div class="sample-info" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; margin: 16px 0;">
            <i class="fas fa-info-circle"></i> Sample request: <strong>250gr</strong> per coffee type. Free sample, shipping fee applies.
        </div>
        <div style="display: flex; gap: 16px; margin-top: 16px;">
            <button class="btn-primary" onclick="requestSample(${product.id})" style="flex: 1;">${sampleText} <i class="fas fa-paper-plane"></i></button>
            <button class="btn-outline" onclick="closeModal()" style="flex: 1;">Close</button>
        </div>
    `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Setup filters
function setupFilters() {
  // Product type dropdown filter
  const typeFilter = document.getElementById("productTypeFilter");
  if (typeFilter) {
    typeFilter.addEventListener("change", (e) => {
      currentTypeFilter = e.target.value;
      // Reset category filter ketika ganti jenis
      currentCategoryFilter = "all";
      updateCategoryButtons();
      renderProducts();
    });
  }

  // Category buttons (Arabika/Robusta)
  const categoryBtns = document.querySelectorAll(".filter-btn");
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategoryFilter = btn.getAttribute("data-filter");
      renderProducts();
    });
  });
}

// Update active state category buttons
function updateCategoryButtons() {
  const categoryBtns = document.querySelectorAll(".filter-btn");
  categoryBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-filter") === currentCategoryFilter) {
      btn.classList.add("active");
    }
  });
}

// Sticky filter bar
function initStickyFilter() {
  const filterBar = document.getElementById("filterBar");
  if (filterBar) {
    const stickyTop = 70; // navbar height
    filterBar.style.position = "sticky";
    filterBar.style.top = stickyTop + "px";
    filterBar.style.zIndex = "20";
    filterBar.style.backgroundColor = "var(--bg-primary)";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupFilters();
  initStickyFilter();
});

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Expose functions globally
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.requestSample = requestSample;
