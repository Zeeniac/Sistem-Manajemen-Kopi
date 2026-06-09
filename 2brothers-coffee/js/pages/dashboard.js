// ============================================
// 2BROTHER'S COFFEE - DASHBOARD PAGE
// Complete Buyer Dashboard with all features
// ============================================

// Data stores
let orders = [];
let wishlist = [];
let notifications = [];
let sampleRequests = [];

// Current user
let currentUser = { name: "", email: "" };

// Current page
let currentPage = "overview";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Load data from localStorage
function loadLocalData() {
  // Load wishlist
  const savedWishlist = localStorage.getItem("buyer_wishlist");
  if (savedWishlist) wishlist = JSON.parse(savedWishlist);

  // Load notifications
  const savedNotifications = localStorage.getItem("buyer_notifications");
  if (savedNotifications) notifications = JSON.parse(savedNotifications);

  // Load sample requests
  const savedSamples = localStorage.getItem("sampleRequests");
  if (savedSamples) sampleRequests = JSON.parse(savedSamples);

  // Update notification badge
  updateNotificationBadge();
}

// Save wishlist to localStorage
function saveWishlist() {
  localStorage.setItem("buyer_wishlist", JSON.stringify(wishlist));
}

// Save notifications to localStorage
function saveNotifications() {
  localStorage.setItem("buyer_notifications", JSON.stringify(notifications));
}

// Update notification badge
function updateNotificationBadge() {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badge = document.getElementById("notificationBadge");
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? "inline-block" : "none";
  }
}

// Get status badge HTML
function getStatusBadge(status) {
  switch (status) {
    case "processing":
      return '<span class="status-badge status-processing">📝 Processing</span>';
    case "shipped":
      return '<span class="status-badge status-shipped">🚢 In Transit</span>';
    case "delivered":
      return '<span class="status-badge status-delivered">✅ Delivered</span>';
    default:
      return '<span class="status-badge">' + status + "</span>";
  }
}

// Download invoice (simulasi)
function downloadInvoice(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    const invoiceContent = `
            INVOICE
            ========================================
            Order ID: ${order.orderId}
            Date: ${order.date}
            Customer: ${currentUser.name}
            Product: ${order.product}
            Quantity: ${order.quantity}
            Total: ${order.total}
            Status: ${order.status}
            ========================================
            2Brother's Coffee - Premium Indonesian Coffee
        `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    alert("Invoice downloaded!");
  }
}

// Reorder product
function reorderProduct(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    alert(
      `Reorder for ${order.product} initiated. Our team will contact you shortly.`,
    );
    window.location.href = "contact.html";
  }
}

// Add to wishlist
function addToWishlist(productId, productName, productPrice) {
  if (!wishlist.find((p) => p.id === productId)) {
    wishlist.push({
      id: productId,
      name: productName,
      price: productPrice,
      added: new Date().toISOString(),
    });
    saveWishlist();
    alert(`Added ${productName} to wishlist!`);
  } else {
    alert("Product already in wishlist");
  }
}

// Remove from wishlist
function removeFromWishlist(productId) {
  wishlist = wishlist.filter((p) => p.id !== productId);
  saveWishlist();
  renderWishlistPage();
}

// Mark notification as read
function markNotificationRead(notificationId) {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveNotifications();
    updateNotificationBadge();
    renderNotificationsPage();
  }
}

// Mark all as read
function markAllNotificationsRead() {
  notifications.forEach((n) => (n.read = true));
  saveNotifications();
  updateNotificationBadge();
  renderNotificationsPage();
}

// ============================================
// AUTHENTICATION
// ============================================

function checkAuth() {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (!userRole || userRole !== "buyer") {
    window.location.href = "login.html";
    return false;
  }

  currentUser.name = localStorage.getItem("userName") || "Buyer";
  currentUser.email = userEmail;

  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userEmail").textContent = currentUser.email;
  document.getElementById("welcomeBadge").innerHTML =
    `Welcome back, ${currentUser.name}!`;

  return true;
}

// ============================================
// LOAD ORDERS
// ============================================

async function loadOrders() {
  try {
    const response = await fetch("data/orders.json");
    const data = await response.json();
    orders = data.orders.filter(
      (order) => order.customerEmail === currentUser.email,
    );
  } catch (error) {
    console.error("Error loading orders:", error);
    orders = [];
  }
}

// ============================================
// RENDER OVERVIEW PAGE
// ============================================

function renderOverview() {
  const stats = {
    totalOrders: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  // Sample products for recommendations
  const recommendedProducts = [
    {
      id: 1,
      name: "Sumatra Mandheling G1",
      price: 8100,
      image:
        "https://images.unsplash.com/photo-1559056199-5a47f60c5053?w=200&h=150&fit=crop",
    },
    {
      id: 2,
      name: "Gayo Arabica G1",
      price: 8200,
      image:
        "https://images.unsplash.com/photo-1564186763535-9bff1e6c8b16?w=200&h=150&fit=crop",
    },
  ];

  return `
        <!-- Stats Cards -->
        <div class="stats-dashboard">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="stat-value">${stats.totalOrders}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-spinner"></i></div>
                <div class="stat-value">${stats.processing}</div>
                <div class="stat-label">Processing</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-ship"></i></div>
                <div class="stat-value">${stats.shipped}</div>
                <div class="stat-label">In Transit</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-value">${stats.delivered}</div>
                <div class="stat-label">Delivered</div>
            </div>
        </div>
        
        <!-- Recent Orders -->
        <div class="orders-section">
            <div class="section-title">Recent Orders</div>
            ${renderOrdersTable(orders.slice(0, 3))}
        </div>
        
        <!-- Recommended Products -->
        <div class="orders-section">
            <div class="section-title">Recommended for You</div>
            <div class="recommended-grid">
                ${recommendedProducts
                  .map(
                    (product) => `
                    <div class="recommended-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toLocaleString()}/ton FOB</p>
                        <button class="btn-primary btn-sm" onclick="window.location.href='coffee.html'">View Product</button>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="orders-section">
            <div class="section-title">Quick Actions</div>
            <div class="quick-actions">
                <button class="btn-primary" onclick="navigateToPage('orders')">View All Orders</button>
                <button class="btn-outline" onclick="window.location.href='coffee.html'">Order New Sample</button>
                <button class="btn-outline" onclick="navigateToPage('tracking')">Track Order</button>
                <button class="btn-outline" onclick="navigateToPage('sample')">Request Sample</button>
            </div>
        </div>
    `;
}

// ============================================
// RENDER ORDERS TABLE
// ============================================

function renderOrdersTable(orderList) {
  if (!orderList || orderList.length === 0) {
    return `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>No orders found</p>
                <a href="coffee.html" class="btn-primary" style="margin-top: 16px;">Start Shopping</a>
            </div>
        `;
  }

  return `
        <div class="orders-table">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderList
                      .map(
                        (order) => `
                        <tr>
                            <td>${order.orderId}</td>
                            <td>${order.date}</td>
                            <td>${order.product}</td>
                            <td>${order.quantity}</td>
                            <td>${order.total}</td>
                            <td>${getStatusBadge(order.status)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn" onclick="trackOrder('${order.orderId}')" title="Track">
                                        <i class="fas fa-truck"></i>
                                    </button>
                                    <button class="action-btn" onclick="reorderProduct('${order.orderId}')" title="Reorder">
                                        <i class="fas fa-redo"></i>
                                    </button>
                                    <button class="action-btn" onclick="downloadInvoice('${order.orderId}')" title="Invoice">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;
}

// ============================================
// RENDER ORDERS PAGE (Full)
// ============================================

function renderOrdersPage() {
  return `
        <div class="orders-section">
            <div class="section-title">All Orders</div>
            <div class="order-controls">
                <div class="search-box-mini">
                    <i class="fas fa-search"></i>
                    <input type="text" id="orderSearch" placeholder="Search by Order ID..." onkeyup="filterOrders()">
                </div>
                <select id="orderStatusFilter" onchange="filterOrders()" class="filter-select-mini">
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">In Transit</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>
            <div id="ordersList">
                ${renderOrdersTable(orders)}
            </div>
        </div>
    `;
}

function filterOrders() {
  const searchTerm =
    document.getElementById("orderSearch")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("orderStatusFilter")?.value || "all";

  let filtered = [...orders];

  if (searchTerm) {
    filtered = filtered.filter((o) =>
      o.orderId.toLowerCase().includes(searchTerm),
    );
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((o) => o.status === statusFilter);
  }

  const ordersList = document.getElementById("ordersList");
  if (ordersList) {
    ordersList.innerHTML = renderOrdersTable(filtered);
  }
}

// ============================================
// RENDER TRACKING PAGE
// ============================================

function renderTrackingPage() {
  return `
        <div class="orders-section">
            <div class="section-title">Track Your Order</div>
            <div class="tracking-search">
                <div class="form-group">
                    <label for="trackingId">Enter Order ID</label>
                    <div class="search-input-wrapper">
                        <input type="text" id="trackingId" placeholder="e.g., 2BC-001">
                        <button class="btn-primary" onclick="trackOrderById()">Track</button>
                    </div>
                </div>
                <div id="trackingResult"></div>
            </div>
        </div>
    `;
}

function trackOrderById() {
  const trackingId = document.getElementById("trackingId")?.value.trim();
  const resultDiv = document.getElementById("trackingResult");

  if (!trackingId) {
    resultDiv.innerHTML =
      '<p class="error-message">Please enter an Order ID</p>';
    return;
  }

  const order = orders.find((o) => o.orderId === trackingId);
  if (order) {
    const trackingLink = order.trackingLink
      ? `
            <div class="live-tracking-mini">
                <i class="fas fa-${order.trackingProvider === "FlightRadar24" ? "plane" : "ship"}"></i>
                <span>Live tracking:</span>
                <a href="${order.trackingLink}" target="_blank" class="tracking-link">Track Live <i class="fas fa-external-link-alt"></i></a>
            </div>
        `
      : "";

    resultDiv.innerHTML = `
            <div class="tracking-result-card">
                <h3>Order ${order.orderId}</h3>
                <p><strong>Product:</strong> ${order.product}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Status:</strong> ${getStatusBadge(order.status)}</p>
                <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery || "-"}</p>
                ${trackingLink}
                <button class="btn-outline btn-sm" style="margin-top: 16px;" onclick="window.location.href='tracking.html?id=${order.orderId}'">Full Details →</button>
            </div>
        `;
  } else {
    resultDiv.innerHTML =
      '<p class="error-message">Order not found. Please check your Order ID.</p>';
  }
}

function trackOrder(orderId) {
  window.location.href = `tracking.html?id=${orderId}`;
}

// ============================================
// RENDER SAMPLE PAGE
// ============================================

function renderSamplePage() {
  return `
        <div class="orders-section">
            <div class="section-title">Request Sample (250gr)</div>
            <div class="sample-info-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Sample Policy</strong>
                    <p>Free sample of 250gr per coffee type. Shipping fee applies. Maximum 3 samples per request.</p>
                </div>
            </div>
            <div class="sample-form">
                <div class="form-group">
                    <label for="sampleProduct">Select Coffee</label>
                    <select id="sampleProduct" class="sample-select">
                        <option value="">-- Select Coffee --</option>
                        <option value="Sumatra Mandheling G1">Sumatra Mandheling G1 (Arabika)</option>
                        <option value="Lintong G1">Lintong G1 (Arabika)</option>
                        <option value="Gayo Arabica G1">Gayo Arabica G1 (Arabika)</option>
                        <option value="Sumatra Robusta G1">Sumatra Robusta G1 (Robusta)</option>
                        <option value="Java Robusta G1">Java Robusta G1 (Robusta)</option>
                        <option value="Sumatra Mandheling Roasted">Sumatra Mandheling Roasted</option>
                        <option value="Gayo Arabica Roasted">Gayo Arabica Roasted</option>
                        <option value="Java Robusta Roasted">Java Robusta Roasted</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sampleNotes">Additional Notes (Optional)</label>
                    <textarea id="sampleNotes" rows="3" placeholder="Any specific requirements..."></textarea>
                </div>
                <button class="btn-primary" onclick="submitSampleRequest()">Submit Sample Request</button>
            </div>
            
            <div class="section-title" style="margin-top: 32px;">My Sample Requests</div>
            <div id="sampleRequestsList">
                ${renderSampleRequestsList()}
            </div>
        </div>
    `;
}

function renderSampleRequestsList() {
  if (sampleRequests.length === 0) {
    return '<div class="empty-state"><p>No sample requests yet</p></div>';
  }

  return `
        <div class="sample-requests-list">
            ${sampleRequests
              .map(
                (req) => `
                <div class="sample-request-item">
                    <div><strong>${req.productName}</strong> - 250gr</div>
                    <div>Requested: ${new Date(req.date).toLocaleDateString()}</div>
                    <div class="sample-status ${req.status}">${req.status === "pending" ? "⏳ Pending" : "✅ Processed"}</div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function submitSampleRequest() {
  const productSelect = document.getElementById("sampleProduct");
  const productName = productSelect?.value;
  const notes = document.getElementById("sampleNotes")?.value || "";

  if (!productName) {
    alert("Please select a coffee");
    return;
  }

  sampleRequests.push({
    id: Date.now(),
    productName: productName,
    quantity: "250gr",
    notes: notes,
    date: new Date().toISOString(),
    status: "pending",
  });

  localStorage.setItem("sampleRequests", JSON.stringify(sampleRequests));

  alert(
    `Sample request for ${productName} (250gr) submitted! Our team will contact you soon.`,
  );
  productSelect.value = "";
  document.getElementById("sampleNotes").value = "";
  renderSamplePage();
}

// ============================================
// RENDER WISHLIST PAGE
// ============================================

function renderWishlistPage() {
  if (wishlist.length === 0) {
    return `
            <div class="orders-section">
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>Your wishlist is empty</p>
                    <a href="coffee.html" class="btn-primary" style="margin-top: 16px;">Browse Products</a>
                </div>
            </div>
        `;
  }

  return `
        <div class="orders-section">
            <div class="section-title">My Wishlist</div>
            <div class="wishlist-grid">
                ${wishlist
                  .map(
                    (item) => `
                    <div class="wishlist-item">
                        <div class="wishlist-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toLocaleString()}/ton FOB</p>
                            <small>Added: ${new Date(item.added).toLocaleDateString()}</small>
                        </div>
                        <div class="wishlist-actions">
                            <button class="btn-primary btn-sm" onclick="window.location.href='coffee.html'">Order Now</button>
                            <button class="btn-outline btn-sm" onclick="removeFromWishlist(${item.id})">Remove</button>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;
}

// ============================================
// RENDER NOTIFICATIONS PAGE
// ============================================

function renderNotificationsPage() {
  if (notifications.length === 0) {
    return `
            <div class="orders-section">
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            </div>
        `;
  }

  return `
        <div class="orders-section">
            <div class="section-title">
                Notifications
                <button class="btn-outline btn-sm" onclick="markAllNotificationsRead()">Mark all as read</button>
            </div>
            <div class="notifications-list">
                ${notifications
                  .map(
                    (notif) => `
                    <div class="notification-item ${notif.read ? "read" : "unread"}" onclick="markNotificationRead(${notif.id})">
                        <div class="notification-icon">
                            <i class="fas ${notif.type === "order" ? "fa-box" : notif.type === "sample" ? "fa-flask" : "fa-info-circle"}"></i>
                        </div>
                        <div class="notification-content">
                            <p>${notif.message}</p>
                            <small>${new Date(notif.date).toLocaleString()}</small>
                        </div>
                        ${!notif.read ? '<span class="unread-dot"></span>' : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;
}

// ============================================
// RENDER PROFILE PAGE
// ============================================

function renderProfilePage() {
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  return `
        <div class="orders-section">
            <div class="section-title">My Profile</div>
            <div class="profile-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="profileName" value="${currentUser.name}" class="profile-input">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="profileEmail" value="${currentUser.email}" class="profile-input" disabled>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="profilePhone" value="${userProfile.phone || ""}" class="profile-input" placeholder="+62 xxx">
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" id="profileCompany" value="${userProfile.company || ""}" class="profile-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tax ID / NPWP</label>
                    <input type="text" id="profileTaxId" value="${userProfile.taxId || ""}" class="profile-input" placeholder="xx.xxx.xxx.x-xxx.xxx">
                </div>
                <div class="form-group">
                    <label>Shipping Address</label>
                    <textarea id="profileAddress" rows="3" class="profile-input" placeholder="Full address for shipping">${userProfile.address || ""}</textarea>
                </div>
                <button class="btn-primary" onclick="saveProfile()">Save Changes</button>
            </div>
        </div>
    `;
}

function saveProfile() {
  const profile = {
    name: document.getElementById("profileName")?.value,
    phone: document.getElementById("profilePhone")?.value,
    company: document.getElementById("profileCompany")?.value,
    taxId: document.getElementById("profileTaxId")?.value,
    address: document.getElementById("profileAddress")?.value,
  };

  localStorage.setItem("userProfile", JSON.stringify(profile));
  localStorage.setItem("userName", profile.name);
  currentUser.name = profile.name;
  document.getElementById("userName").textContent = currentUser.name;

  alert("Profile saved successfully!");
}

// ============================================
// RENDER SUPPORT PAGE
// ============================================

function renderSupportPage() {
  const tickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");

  return `
        <div class="orders-section">
            <div class="section-title">Support Tickets</div>
            <div class="support-form">
                <div class="form-group">
                    <label for="ticketSubject">Subject</label>
                    <input type="text" id="ticketSubject" class="profile-input" placeholder="What is your issue about?">
                </div>
                <div class="form-group">
                    <label for="ticketMessage">Message</label>
                    <textarea id="ticketMessage" rows="4" class="profile-input" placeholder="Describe your issue in detail..."></textarea>
                </div>
                <button class="btn-primary" onclick="submitTicket()">Submit Ticket</button>
            </div>
            
            ${
              tickets.length > 0
                ? `
                <div class="section-title" style="margin-top: 32px;">My Tickets</div>
                <div class="tickets-list">
                    ${tickets
                      .map(
                        (ticket) => `
                        <div class="ticket-item">
                            <div><strong>#${ticket.id}</strong> - ${ticket.subject}</div>
                            <div>Status: <span class="ticket-status ${ticket.status}">${ticket.status}</span></div>
                            <div>Submitted: ${new Date(ticket.date).toLocaleDateString()}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
                : ""
            }
        </div>
    `;
}

function submitTicket() {
  const subject = document.getElementById("ticketSubject")?.value;
  const message = document.getElementById("ticketMessage")?.value;

  if (!subject || !message) {
    alert("Please fill in all fields");
    return;
  }

  const tickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
  tickets.unshift({
    id: Date.now(),
    subject: subject,
    message: message,
    date: new Date().toISOString(),
    status: "open",
  });

  localStorage.setItem("supportTickets", JSON.stringify(tickets));

  alert("Ticket submitted! Our support team will respond within 24 hours.");
  document.getElementById("ticketSubject").value = "";
  document.getElementById("ticketMessage").value = "";
  renderSupportPage();
}

// ============================================
// PAGE NAVIGATION
// ============================================

function navigateToPage(page) {
  currentPage = page;

  document.querySelectorAll(".sidebar-nav-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-page") === page) {
      item.classList.add("active");
    }
  });

  const titles = {
    overview: "Dashboard Overview",
    orders: "My Orders",
    tracking: "Track Order",
    sample: "Request Sample (250gr)",
    wishlist: "My Wishlist",
    notifications: "Notifications",
    profile: "My Profile",
    support: "Support Ticket",
  };
  document.getElementById("pageTitle").textContent =
    titles[page] || "Dashboard";

  const contentDiv = document.getElementById("pageContent");
  switch (page) {
    case "overview":
      contentDiv.innerHTML = renderOverview();
      break;
    case "orders":
      contentDiv.innerHTML = renderOrdersPage();
      break;
    case "tracking":
      contentDiv.innerHTML = renderTrackingPage();
      break;
    case "sample":
      contentDiv.innerHTML = renderSamplePage();
      break;
    case "wishlist":
      contentDiv.innerHTML = renderWishlistPage();
      break;
    case "notifications":
      contentDiv.innerHTML = renderNotificationsPage();
      break;
    case "profile":
      contentDiv.innerHTML = renderProfilePage();
      break;
    case "support":
      contentDiv.innerHTML = renderSupportPage();
      break;
    default:
      contentDiv.innerHTML = renderOverview();
  }
}

function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

function initMobileSidebar() {
  const toggleBtn = document.getElementById("mobileSidebarToggle");
  const sidebar = document.getElementById("dashboardSidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.querySelectorAll(".sidebar-nav-item").forEach((link) => {
      link.addEventListener("click", () => sidebar.classList.remove("open"));
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  if (!checkAuth()) return;

  loadLocalData();
  await loadOrders();
  initMobileSidebar();
  navigateToPage("overview");

  document.querySelectorAll(".sidebar-nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToPage(link.getAttribute("data-page"));
    });
  });

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

// Start
init();

// Expose functions to global
window.navigateToPage = navigateToPage;
window.trackOrder = trackOrder;
window.trackOrderById = trackOrderById;
window.reorderProduct = reorderProduct;
window.downloadInvoice = downloadInvoice;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.submitSampleRequest = submitSampleRequest;
window.saveProfile = saveProfile;
window.submitTicket = submitTicket;
window.filterOrders = filterOrders;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
