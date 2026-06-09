// ============================================
// 2BROTHER'S COFFEE - ADMIN PANEL
// Complete Admin Dashboard
// ============================================

// Data stores
let orders = [];
let users = [];
let products = [];
let messages = [];
let team = [];
let origins = [];

// Current page
let currentPage = "dashboard";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get status badge
function getStatusBadge(status) {
  const colors = {
    processing: "#ff9800",
    shipped: "#2196f3",
    delivered: "#4caf50",
  };
  return `<span style="color: ${colors[status] || "#666"};">${status}</span>`;
}

// Show modal
function showModal(title, body, onSave) {
  const modal = document.createElement("div");
  modal.className = "admin-modal active";
  modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
            </div>
            <div class="admin-modal-body">${body}</div>
            ${onSave ? `<div class="admin-modal-footer"><button class="btn-primary" id="modalSaveBtn">Save</button><button class="btn-outline" onclick="this.closest('.admin-modal').remove()">Cancel</button></div>` : ""}
        </div>
    `;
  document.body.appendChild(modal);

  if (onSave) {
    modal.querySelector("#modalSaveBtn")?.addEventListener("click", onSave);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ============================================
// AUTHENTICATION
// ============================================

function checkAdminAuth() {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (userRole !== "admin") {
    window.location.href = "login.html";
    return false;
  }

  document.getElementById("adminName").textContent =
    localStorage.getItem("userName") || "Admin User";
  document.getElementById("adminEmail").textContent = userEmail;
  return true;
}

// ============================================
// LOAD DATA
// ============================================

async function loadData() {
  try {
    // Load orders
    const ordersRes = await fetch("data/orders.json");
    const ordersData = await ordersRes.json();
    orders = ordersData.orders;

    // Load products
    const productsRes = await fetch("data/products.json");
    const productsData = await productsRes.json();
    products = productsData.products;

    // Load users dari JSON dan localStorage
    const usersRes = await fetch("data/users.json");
    const usersData = await usersRes.json();
    const jsonUsers = usersData.users.filter((u) => u.role === "buyer");

    // Load users dari localStorage
    const storedUsers = JSON.parse(localStorage.getItem("app_users") || "[]");

    // Gabungkan (prioritaskan localStorage)
    const allUsers = [...jsonUsers, ...storedUsers];
    // Hapus duplikat berdasarkan email
    users = allUsers.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.email === user.email),
    );

    // Load messages
    const savedMessages = localStorage.getItem("contactMessages");
    if (savedMessages) {
      messages = JSON.parse(savedMessages);
    } else {
      messages = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          company: "Coffee Shop Inc",
          interest: "green-beans",
          message:
            "Interested in Sumatra Mandheling, please send quote for 5 tons.",
          timestamp: "2026-05-18T10:30:00.000Z",
          status: "unread",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          company: "Roastery Co",
          interest: "sample",
          message: "Requesting sample for Gayo Arabica.",
          timestamp: "2026-05-19T14:20:00.000Z",
          status: "read",
        },
      ];
    }

    // Load team
    const teamRes = await fetch("data/team.json");
    const teamData = await teamRes.json();
    team = teamData.team || [];

    // Load origins
    const originsRes = await fetch("data/origins.json");
    const originsData = await originsRes.json();
    origins = originsData.origins || [];
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// ============================================
// RENDER DASHBOARD
// ============================================

function renderDashboard() {
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "processing").length,
    totalUsers: users.length,
    totalProducts: products.length,
    unreadMessages: messages.filter((m) => m.status === "unread").length,
    lowStock: products.filter(
      (p) => p.stock < 10000 && p.category !== "Roasted",
    ).length,
  };

  // Data untuk chart
  const last6Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueData = [12400, 18200, 15300, 19800, 22400, 45200];

  return `
        <!-- Stats Cards -->
        <div class="admin-stats">
            <div class="admin-stat-card">
                <div class="admin-stat-icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="admin-stat-info">
                    <h3>${stats.totalOrders}</h3>
                    <p>Total Orders</p>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon"><i class="fas fa-spinner"></i></div>
                <div class="admin-stat-info">
                    <h3>${stats.pendingOrders}</h3>
                    <p>Pending Orders</p>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon"><i class="fas fa-users"></i></div>
                <div class="admin-stat-info">
                    <h3>${stats.totalUsers}</h3>
                    <p>Total Buyers</p>
                </div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-icon"><i class="fas fa-envelope"></i></div>
                <div class="admin-stat-info">
                    <h3>${stats.unreadMessages}</h3>
                    <p>Unread Messages</p>
                </div>
            </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="admin-chart-container">
            <div class="chart-header">
                <h3>Revenue Overview (Last 6 Months)</h3>
            </div>
            <canvas id="revenueChart" height="200"></canvas>
        </div>
        
        <!-- Low Stock Alert -->
        ${
          stats.lowStock > 0
            ? `
            <div class="low-stock-alert">
                <i class="fas fa-exclamation-triangle"></i>
                <span>⚠️ ${stats.lowStock} products are running low on stock!</span>
                <a href="#" onclick="navigateToPage('products')">Manage Products →</a>
            </div>
        `
            : ""
        }
        
        <!-- Recent Orders -->
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Recent Orders</strong>
                <a href="#" onclick="navigateToPage('orders')">View All →</a>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Status</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders
                          .slice(0, 5)
                          .map(
                            (order) => `
                            <tr>
                                <td>${order.orderId}</td>
                                <td>${order.customerName || "-"}</td>
                                <td>${order.product}</td>
                                <td>${getStatusBadge(order.status)}</td>
                                <td><button class="action-btn edit" onclick="editOrder('${order.orderId}')"><i class="fas fa-edit"></i></button></td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Recent Messages -->
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Recent Messages</strong>
                <a href="#" onclick="navigateToPage('messages')">View All →</a>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Interest</th><th>Status</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${messages
                          .slice(0, 5)
                          .map(
                            (msg) => `
                            <tr>
                                <td>${msg.name}</td>
                                <td>${msg.email}</td>
                                <td>${msg.interest}</td>
                                <td>${msg.status === "unread" ? '<span style="color: var(--gold);">Unread</span>' : "Read"}</td>
                                <td><button class="action-btn view" onclick="viewMessage(${msg.id})"><i class="fas fa-eye"></i></button></td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Initialize chart after render
function initRevenueChart() {
  const ctx = document.getElementById("revenueChart")?.getContext("2d");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue (USD)",
            data: [12400, 18200, 15300, 19800, 22400, 45200],
            borderColor: "#C6A43F",
            backgroundColor: "rgba(198, 164, 63, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }
}

// ============================================
// MANAGE ORDERS
// ============================================

function renderOrdersPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>All Orders</strong>
                <div class="table-actions">
                    <select id="bulkStatusSelect" class="filter-select-mini">
                        <option value="">Bulk Action</option>
                        <option value="processing">Set Processing</option>
                        <option value="shipped">Set Shipped</option>
                        <option value="delivered">Set Delivered</option>
                    </select>
                    <button class="btn-primary btn-sm" onclick="bulkUpdateOrders()">Apply</button>
                </div>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="selectAllOrders"></th>
                            <th>Order ID</th><th>Date</th><th>Customer</th><th>Product</th><th>Quantity</th><th>Total</th><th>Status</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders
                          .map(
                            (order) => `
                            <tr>
                                <td><input type="checkbox" class="order-checkbox" data-id="${order.orderId}"></td>
                                <td>${order.orderId}</td>
                                <td>${order.date}</td>
                                <td>${order.customerName || "-"}</td>
                                <td>${order.product}</td>
                                <td>${order.quantity}</td>
                                <td>${order.total}</td>
                                <td>${getStatusBadge(order.status)}</td>
                                <td>
                                    <button class="action-btn edit" onclick="editOrder('${order.orderId}')"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn view" onclick="viewOrder('${order.orderId}')"><i class="fas fa-eye"></i></button>
                                 </td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function editOrder(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return;

  const body = `
        <div class="admin-form-group">
            <label>Order ID</label>
            <input type="text" value="${order.orderId}" disabled>
        </div>
        <div class="admin-form-group">
            <label>Status</label>
            <select id="editStatus" class="admin-select">
                <option value="processing" ${order.status === "processing" ? "selected" : ""}>Processing</option>
                <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Shipped (In Transit)</option>
                <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
            </select>
        </div>
        <div class="admin-form-group">
            <label>Tracking Link</label>
            <input type="url" id="editTrackingLink" value="${order.trackingLink || ""}" placeholder="https://www.flightradar24.com/...">
            <small>Example: https://www.flightradar24.com/JAL35/3fcd57f0</small>
        </div>
        <div class="admin-form-group">
            <label>Tracking Provider</label>
            <select id="editTrackingProvider">
                <option value="">None</option>
                <option value="FlightRadar24" ${order.trackingProvider === "FlightRadar24" ? "selected" : ""}>FlightRadar24 (Air)</option>
                <option value="MarineTraffic" ${order.trackingProvider === "MarineTraffic" ? "selected" : ""}>MarineTraffic (Sea)</option>
            </select>
        </div>
        <div class="admin-form-group checkbox-group">
            <input type="checkbox" id="notifyBuyer" checked>
            <label>Send notification to buyer</label>
        </div>
    `;

  showModal("Edit Order", body, () => {
    order.status = document.getElementById("editStatus").value;
    order.trackingLink = document.getElementById("editTrackingLink").value;
    order.trackingProvider = document.getElementById(
      "editTrackingProvider",
    ).value;

    if (document.getElementById("notifyBuyer").checked) {
      addNotification(
        order.customerEmail,
        `Your order #${order.orderId} status has been updated to ${order.status}.`,
        "order",
      );
    }

    alert(`Order ${order.orderId} updated!`);
    document.querySelector(".admin-modal")?.remove();
    navigateToPage(currentPage);
  });
}

function viewOrder(orderId) {
  window.location.href = `tracking.html?id=${orderId}`;
}

function bulkUpdateOrders() {
  const selectedIds = Array.from(
    document.querySelectorAll(".order-checkbox:checked"),
  ).map((cb) => cb.dataset.id);
  const newStatus = document.getElementById("bulkStatusSelect")?.value;

  if (!newStatus || selectedIds.length === 0) {
    alert("Select orders and a status");
    return;
  }

  orders.forEach((order) => {
    if (selectedIds.includes(order.orderId)) {
      order.status = newStatus;
    }
  });

  alert(`${selectedIds.length} orders updated to ${newStatus}`);
  navigateToPage(currentPage);
}

// ============================================
// MANAGE USERS
// ============================================

function renderUsersPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Buyer Users</strong>
                <button class="btn-primary btn-sm" onclick="showAddUserModal()">+ Add User</button>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users
                          .map(
                            (user) => `
                            <tr>
                                <td>${user.name || "-"}</td>
                                <td>${user.email}</td>
                                <td>${user.company || "-"}</td>
                                <td>${user.phone || "-"}</td>
                                <td>${user.joined || "-"}</td>
                                <td>
                                    <button class="action-btn delete" onclick="deleteUser(${user.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddUserModal() {
  const body = `
        <div class="admin-form-group"><label>Name</label><input type="text" id="userName" placeholder="Full name"></div>
        <div class="admin-form-group"><label>Email</label><input type="email" id="userEmail" placeholder="email@example.com"></div>
        <div class="admin-form-group"><label>Company</label><input type="text" id="userCompany" placeholder="Company name"></div>
        <div class="admin-form-group"><label>Phone</label><input type="text" id="userPhone" placeholder="+62 xxx"></div>
        <div class="admin-form-group"><label>Password</label><input type="password" id="userPassword" placeholder="password"></div>
        <div class="admin-form-group"><label>Role</label>
            <select id="userRole">
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
            </select>
        </div>
    `;

  showModal("Add New User", body, () => {
    const newUser = {
      id: Date.now(),
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      password: document.getElementById("userPassword").value || "buyer123",
      role: document.getElementById("userRole").value,
      status: "active",
      joined: new Date().toISOString().split("T")[0],
      company: document.getElementById("userCompany").value || "",
      phone: document.getElementById("userPhone").value || "",
    };

    if (newUser.name && newUser.email) {
      // Simpan ke localStorage
      const savedUsers = JSON.parse(localStorage.getItem("app_users") || "[]");
      savedUsers.push(newUser);
      localStorage.setItem("app_users", JSON.stringify(savedUsers));

      // Tambah ke array users
      users.push(newUser);

      addActivityLog("Added new user", `${newUser.name} (${newUser.email})`);
      alert("User added successfully!");
      document.querySelector(".admin-modal")?.remove();
      navigateToPage(currentPage);
    } else {
      alert("Please fill name and email");
    }
  });
}

function deleteUser(userId) {
  if (confirm("Delete this user?")) {
    // Hapus dari localStorage
    const savedUsers = JSON.parse(localStorage.getItem("app_users") || "[]");
    const updatedSavedUsers = savedUsers.filter((u) => u.id !== userId);
    localStorage.setItem("app_users", JSON.stringify(updatedSavedUsers));

    // Hapus dari array users
    users = users.filter((u) => u.id !== userId);

    addActivityLog("Deleted user", `User ID: ${userId}`);
    navigateToPage(currentPage);
  }
}

// ============================================
// MANAGE PRODUCTS
// ============================================

function renderProductsPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>All Products</strong>
                <button class="btn-primary btn-sm" onclick="showAddProductModal()">+ Add Product</button>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock (kg)</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${products
                          .map(
                            (product) => `
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${product.category}</td>
                                <td>$${product.price.toLocaleString()}</td>
                                <td>${product.stock?.toLocaleString() || "-"}</td>
                                <td>
                                    <button class="action-btn edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                                 </td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddProductModal() {
  const body = `
        <div class="admin-form-group"><label>Product Name</label><input type="text" id="productName"></div>
        <div class="admin-form-group"><label>Category</label><select id="productCategory"><option value="Arabika">Arabika</option><option value="Robusta">Robusta</option><option value="Roasted">Roasted</option></select></div>
        <div class="admin-form-group"><label>Price (USD)</label><input type="number" id="productPrice"></div>
        <div class="admin-form-group"><label>Stock (kg)</label><input type="number" id="productStock" value="0"></div>
        <div class="admin-form-group"><label>Image URL</label><input type="url" id="productImage" placeholder="https://..."></div>
    `;

  showModal("Add New Product", body, () => {
    const newProduct = {
      id: products.length + 1,
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: parseInt(document.getElementById("productPrice").value),
      stock: parseInt(document.getElementById("productStock").value) || 0,
      image:
        document.getElementById("productImage").value ||
        "https://images.unsplash.com/photo-1559056199-5a47f60c5053?w=400&h=300&fit=crop",
      unit:
        document.getElementById("productCategory").value === "Roasted"
          ? "USD/kg"
          : "USD/ton FOB",
    };

    if (newProduct.name && newProduct.price) {
      products.push(newProduct);
      alert("Product added successfully!");
      document.querySelector(".admin-modal")?.remove();
      navigateToPage(currentPage);
    } else {
      alert("Please fill name and price");
    }
  });
}

function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const body = `
        <div class="admin-form-group"><label>Product Name</label><input type="text" id="productName" value="${product.name}"></div>
        <div class="admin-form-group"><label>Category</label><select id="productCategory"><option value="Arabika" ${product.category === "Arabika" ? "selected" : ""}>Arabika</option><option value="Robusta" ${product.category === "Robusta" ? "selected" : ""}>Robusta</option><option value="Roasted" ${product.category === "Roasted" ? "selected" : ""}>Roasted</option></select></div>
        <div class="admin-form-group"><label>Price (USD)</label><input type="number" id="productPrice" value="${product.price}"></div>
        <div class="admin-form-group"><label>Stock (kg)</label><input type="number" id="productStock" value="${product.stock || 0}"></div>
    `;

  showModal("Edit Product", body, () => {
    product.name = document.getElementById("productName").value;
    product.category = document.getElementById("productCategory").value;
    product.price = parseInt(document.getElementById("productPrice").value);
    product.stock = parseInt(document.getElementById("productStock").value);

    alert("Product updated!");
    document.querySelector(".admin-modal")?.remove();
    navigateToPage(currentPage);
  });
}

function deleteProduct(productId) {
  if (confirm("Delete this product?")) {
    products = products.filter((p) => p.id !== productId);
    navigateToPage(currentPage);
  }
}

// ============================================
// MANAGE MESSAGES
// ============================================

function renderMessagesPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Contact Messages</strong>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Company</th><th>Interest</th><th>Date</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${messages
                          .map(
                            (msg) => `
                            <tr>
                                <td>${msg.name}</td>
                                <td>${msg.email}</td>
                                <td>${msg.company || "-"}</td>
                                <td>${msg.interest}</td>
                                <td>${new Date(msg.timestamp).toLocaleDateString()}</td>
                                <td>${msg.status === "unread" ? '<span style="color: var(--gold);">Unread</span>' : "Read"}</td>
                                <td><button class="action-btn view" onclick="viewMessage(${msg.id})"><i class="fas fa-eye"></i></button></td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function viewMessage(messageId) {
  const message = messages.find((m) => m.id === messageId);
  if (message) {
    message.status = "read";
    const body = `
            <div class="message-detail">
                <p><strong>From:</strong> ${message.name} (${message.email})</p>
                <p><strong>Company:</strong> ${message.company || "-"}</p>
                <p><strong>Interest:</strong> ${message.interest}</p>
                <p><strong>Message:</strong></p>
                <p style="background: var(--bg-secondary); padding: 12px; border-radius: 8px;">${message.message}</p>
                <p><strong>Sent:</strong> ${new Date(message.timestamp).toLocaleString()}</p>
            </div>
        `;
    showModal("Message Details", body, null);
    navigateToPage(currentPage);
  }
}

// ============================================
// MANAGE TEAM
// ============================================

function renderTeamPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Team Members</strong>
                <button class="btn-primary btn-sm" onclick="showAddTeamModal()">+ Add Member</button>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Name</th><th>Role</th><th>Bio</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${team
                          .map(
                            (member) => `
                            <tr>
                                <td>${member.name}</td>
                                <td>${member.role}</td>
                                <td>${member.bio.substring(0, 50)}...</td>
                                <td><button class="action-btn delete" onclick="deleteTeamMember(${member.id})"><i class="fas fa-trash"></i></button></td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddTeamModal() {
  const body = `
        <div class="admin-form-group"><label>Name</label><input type="text" id="teamName"></div>
        <div class="admin-form-group"><label>Role</label><input type="text" id="teamRole"></div>
        <div class="admin-form-group"><label>Bio</label><textarea id="teamBio" rows="3"></textarea></div>
        <div class="admin-form-group"><label>Image URL</label><input type="url" id="teamImage" placeholder="https://..."></div>
    `;

  showModal("Add Team Member", body, () => {
    const newMember = {
      id: team.length + 1,
      name: document.getElementById("teamName").value,
      role: document.getElementById("teamRole").value,
      bio: document.getElementById("teamBio").value,
      image:
        document.getElementById("teamImage").value ||
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      social: { linkedin: "#", instagram: "#" },
    };

    if (newMember.name && newMember.role) {
      team.push(newMember);
      alert("Team member added!");
      document.querySelector(".admin-modal")?.remove();
      navigateToPage(currentPage);
    } else {
      alert("Please fill name and role");
    }
  });
}

function deleteTeamMember(memberId) {
  if (confirm("Delete this team member?")) {
    team = team.filter((m) => m.id !== memberId);
    navigateToPage(currentPage);
  }
}

// ============================================
// MANAGE ORIGIN CATALOG
// ============================================

function renderOriginPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Origin Catalog</strong>
                <button class="btn-primary btn-sm" onclick="showAddOriginModal()">+ Add Origin</button>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Region</th><th>Altitude</th><th>Flavor</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${origins
                          .map(
                            (origin) => `
                            <tr>
                                <td>${origin.region}</td>
                                <td>${origin.altitude}</td>
                                <td>${origin.flavor}</td>
                                <td><button class="action-btn delete" onclick="deleteOrigin(${origin.id})"><i class="fas fa-trash"></i></button></td>
                            `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddOriginModal() {
  const body = `
        <div class="admin-form-group"><label>Region</label><input type="text" id="originRegion"></div>
        <div class="admin-form-group"><label>Description</label><textarea id="originDesc" rows="2"></textarea></div>
        <div class="admin-form-group"><label>Altitude</label><input type="text" id="originAltitude"></div>
        <div class="admin-form-group"><label>Flavor Profile</label><input type="text" id="originFlavor"></div>
    `;

  showModal("Add Origin Region", body, () => {
    const newOrigin = {
      id: origins.length + 1,
      region: document.getElementById("originRegion").value,
      description: document.getElementById("originDesc").value,
      altitude: document.getElementById("originAltitude").value,
      flavor: document.getElementById("originFlavor").value,
    };

    if (newOrigin.region) {
      origins.push(newOrigin);
      alert("Origin added!");
      document.querySelector(".admin-modal")?.remove();
      navigateToPage(currentPage);
    }
  });
}

function deleteOrigin(originId) {
  if (confirm("Delete this origin?")) {
    origins = origins.filter((o) => o.id !== originId);
    navigateToPage(currentPage);
  }
}

// ============================================
// EXPORT DATA
// ============================================

function renderExportPage() {
  return `
        <div class="admin-export-container">
            <div class="export-card">
                <i class="fas fa-file-csv"></i>
                <h3>Export Orders</h3>
                <p>Download all orders as CSV file</p>
                <button class="btn-primary" onclick="exportToCSV('orders')">Export Orders</button>
            </div>
            <div class="export-card">
                <i class="fas fa-users"></i>
                <h3>Export Users</h3>
                <p>Download all buyer users as CSV file</p>
                <button class="btn-primary" onclick="exportToCSV('users')">Export Users</button>
            </div>
            <div class="export-card">
                <i class="fas fa-coffee"></i>
                <h3>Export Products</h3>
                <p>Download all products as CSV file</p>
                <button class="btn-primary" onclick="exportToCSV('products')">Export Products</button>
            </div>
            <div class="export-card">
                <i class="fas fa-envelope"></i>
                <h3>Export Messages</h3>
                <p>Download all messages as CSV file</p>
                <button class="btn-primary" onclick="exportToCSV('messages')">Export Messages</button>
            </div>
        </div>
    `;
}

function exportToCSV(type) {
  let data = [];
  let filename = "";

  switch (type) {
    case "orders":
      data = orders.map((o) => ({
        "Order ID": o.orderId,
        Date: o.date,
        Customer: o.customerName,
        Product: o.product,
        Quantity: o.quantity,
        Total: o.total,
        Status: o.status,
      }));
      filename = "orders_export.csv";
      break;
    case "users":
      data = users.map((u) => ({
        Name: u.name,
        Email: u.email,
        Company: u.company,
        Phone: u.phone,
        Joined: u.joined,
      }));
      filename = "users_export.csv";
      break;
    case "products":
      data = products.map((p) => ({
        ID: p.id,
        Name: p.name,
        Category: p.category,
        Price: p.price,
        Stock: p.stock,
      }));
      filename = "products_export.csv";
      break;
    case "messages":
      data = messages.map((m) => ({
        Name: m.name,
        Email: m.email,
        Company: m.company,
        Message: m.message,
        Date: new Date(m.timestamp).toLocaleDateString(),
      }));
      filename = "messages_export.csv";
      break;
  }

  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header] || "";
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  alert(`Exported ${data.length} records to ${filename}`);
}

// ============================================
// NOTIFICATION HELPER
// ============================================

function addNotification(userEmail, message, type = "general") {
  const allNotifications = JSON.parse(
    localStorage.getItem("buyer_notifications") || "[]",
  );
  allNotifications.unshift({
    id: Date.now(),
    message: message,
    type: type,
    date: new Date().toISOString(),
    read: false,
  });
  localStorage.setItem("buyer_notifications", JSON.stringify(allNotifications));
}

// ============================================
// PAGE NAVIGATION
// ============================================

function navigateToPage(page) {
  currentPage = page;

  const titles = {
    dashboard: "Admin Dashboard",
    orders: "Manage Orders",
    users: "Manage Users",
    products: "Manage Products",
    messages: "Contact Messages",
    team: "Manage Team",
    origin: "Origin Catalog",
    export: "Export Data",
  };
  document.getElementById("pageTitle").textContent =
    titles[page] || "Admin Dashboard";

  document.querySelectorAll(".admin-nav-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-page") === page) item.classList.add("active");
  });

  const contentDiv = document.getElementById("adminContent");
  switch (page) {
    case "dashboard":
      contentDiv.innerHTML = renderDashboard();
      setTimeout(() => initRevenueChart(), 100);
      break;
    case "orders":
      contentDiv.innerHTML = renderOrdersPage();
      setTimeout(() => {
        const selectAll = document.getElementById("selectAllOrders");
        if (selectAll) {
          selectAll.onclick = () => {
            document
              .querySelectorAll(".order-checkbox")
              .forEach((cb) => (cb.checked = selectAll.checked));
          };
        }
      }, 100);
      break;
    case "users":
      contentDiv.innerHTML = renderUsersPage();
      break;
    case "products":
      contentDiv.innerHTML = renderProductsPage();
      break;
    case "messages":
      contentDiv.innerHTML = renderMessagesPage();
      break;
    case "team":
      contentDiv.innerHTML = renderTeamPage();
      break;
    case "origin":
      contentDiv.innerHTML = renderOriginPage();
      break;
    case "export":
      contentDiv.innerHTML = renderExportPage();
      break;
    default:
      contentDiv.innerHTML = renderDashboard();
  }
}

function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

function initMobileToggle() {
  const toggle = document.getElementById("mobileAdminToggle");
  const sidebar = document.getElementById("adminSidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.querySelectorAll(".admin-nav-item").forEach((link) => {
      link.addEventListener("click", () => sidebar.classList.remove("open"));
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  if (!checkAdminAuth()) return;
  await loadData();
  initMobileToggle();
  navigateToPage("dashboard");

  document.querySelectorAll(".admin-nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToPage(link.getAttribute("data-page"));
    });
  });

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

init();

// Expose functions globally
window.navigateToPage = navigateToPage;
window.editOrder = editOrder;
window.viewOrder = viewOrder;
window.bulkUpdateOrders = bulkUpdateOrders;
window.deleteUser = deleteUser;
window.showAddUserModal = showAddUserModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showAddProductModal = showAddProductModal;
window.viewMessage = viewMessage;
window.deleteTeamMember = deleteTeamMember;
window.showAddTeamModal = showAddTeamModal;
window.deleteOrigin = deleteOrigin;
window.showAddOriginModal = showAddOriginModal;
window.exportToCSV = exportToCSV;
