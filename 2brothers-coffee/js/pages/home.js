// ============================================
// 2BROTHER'S COFFEE - HOME PAGE
// Load products from JSON
// ============================================

async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    const data = await response.json();
    const products = data.products;
    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    // Tampilkan hanya 3 produk teratas di home
    const featuredProducts = products.slice(0, 3);

    grid.innerHTML = featuredProducts
      .map(
        (product) => `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${product.image || "https://images.unsplash.com/photo-1559056199-5a47f60c5053?w=400&h=300&fit=crop"}');"></div>
                <div class="product-content">
                    <div class="product-category">${product.category} G1</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toLocaleString()}<small>/ton FOB</small></div>
                    <button class="btn-sample" onclick="window.location.href='coffee.html'">Request Sample</button>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading products:", error);
    const grid = document.getElementById("productsGrid");
    if (grid) {
      grid.innerHTML =
        "<p>Unable to load products. Please try again later.</p>";
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
