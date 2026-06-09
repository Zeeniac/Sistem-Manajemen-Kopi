// ============================================
// 2BROTHER'S COFFEE - SUPER ADMIN DASHBOARD
// Complete super admin with full control
// ============================================

// Data stores
let orders = [];
let users = [];
let products = [];
let adminUsers = [];
let activityLog = [];

// Current page
let currentPage = "dashboard";

// Revenue chart instance
let revenueChart = null;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Load activity log from localStorage
function loadActivityLog() {
  const saved = localStorage.getItem("super_activity_log");
  if (saved) {
    activityLog = JSON.parse(saved);
  } else {
    activityLog = [];
  }
}

// Save activity log
function saveActivityLog() {
  localStorage.setItem("super_activity_log", JSON.stringify(activityLog));
}

// Add activity log entry
function addActivityLog(action, details) {
  activityLog.unshift({
    id: Date.now(),
    action: action,
    details: details,
    user: localStorage.getItem("userEmail") || "super_admin",
    timestamp: new Date().toISOString(),
  });
  // Keep only last 500 entries
  if (activityLog.length > 500) activityLog = activityLog.slice(0, 500);
  saveActivityLog();
}

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

function checkSuperAdminAuth() {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");

  if (userRole !== "super_admin") {
    window.location.href = "login.html";
    return false;
  }

  document.getElementById("superAdminName").textContent =
    localStorage.getItem("userName") || "Super Admin";
  document.getElementById("superAdminEmail").textContent = userEmail;
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

    // Load all users (including admins)
    const usersRes = await fetch("data/users.json");
    const usersData = await usersRes.json();
    users = usersData.users;

    // Filter admin users (admin and super_admin)
    adminUsers = usersData.users.filter(
      (u) => u.role === "admin" || u.role === "super_admin",
    );

    loadActivityLog();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// ============================================
// CALCULATE STATS
// ============================================

function getStats() {
  const totalRevenue = orders.reduce((sum, o) => {
    const revenue = parseFloat(o.total.replace(/[^0-9]/g, "")) || 0;
    return sum + revenue;
  }, 0);

  const processingOrders = orders.filter(
    (o) => o.status === "processing",
  ).length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  // Calculate growth (mock data for demo)
  const lastMonthRevenue = 45200;
  const revenueGrowth = (
    ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) *
    100
  ).toFixed(1);

  return {
    totalOrders: orders.length,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue,
    revenueGrowth,
    totalUsers: users.length,
    totalProducts: products.length,
    completionRate:
      orders.length > 0
        ? Math.round((deliveredOrders / orders.length) * 100)
        : 0,
  };
}

// ============================================
// RENDER DASHBOARD
// ============================================

function renderDashboard() {
  const stats = getStats();

  // Data untuk chart (last 6 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueData = [12400, 18200, 15300, 19800, 22400, stats.totalRevenue];

  setTimeout(() => {
    const ctx = document.getElementById("revenueChartCanvas")?.getContext("2d");
    if (ctx) {
      if (revenueChart) revenueChart.destroy();
      revenueChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: monthNames,
          datasets: [
            {
              label: "Revenue (USD)",
              data: revenueData,
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
          plugins: { legend: { position: "bottom" } },
        },
      });
    }
  }, 100);

  return `
        <!-- Stats Cards -->
        <div class="super-admin-stats">
            <div class="super-admin-stat-card">
                <div class="super-admin-stat-icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="super-admin-stat-info">
                    <h3>${stats.totalOrders}</h3>
                    <p>Total Orders</p>
                </div>
            </div>
            <div class="super-admin-stat-card">
                <div class="super-admin-stat-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="super-admin-stat-info">
                    <h3>$${(stats.totalRevenue / 1000).toFixed(1)}K</h3>
                    <p>Total Revenue</p>
                </div>
            </div>
            <div class="super-admin-stat-card">
                <div class="super-admin-stat-icon"><i class="fas fa-users"></i></div>
                <div class="super-admin-stat-info">
                    <h3>${stats.totalUsers}</h3>
                    <p>Total Users</p>
                </div>
            </div>
            <div class="super-admin-stat-card">
                <div class="super-admin-stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="super-admin-stat-info">
                    <h3>${stats.completionRate}%</h3>
                    <p>Completion Rate</p>
                </div>
            </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="chart-card">
            <h3>Revenue Overview (Last 6 Months)</h3>
            <canvas id="revenueChartCanvas" height="200"></canvas>
        </div>
        
        <!-- Order Status Distribution -->
        <div class="two-columns">
            <div class="chart-card">
                <h3>Order Status</h3>
                <div style="text-align: center; padding: var(--space-4);">
                    <div style="margin-bottom: var(--space-4);">
                        <span style="display: inline-block; width: 12px; height: 12px; background: #ff9800; border-radius: 50%;"></span> Processing: ${stats.processingOrders}
                    </div>
                    <div style="margin-bottom: var(--space-4);">
                        <span style="display: inline-block; width: 12px; height: 12px; background: #2196f3; border-radius: 50%;"></span> In Transit: ${stats.shippedOrders}
                    </div>
                    <div>
                        <span style="display: inline-block; width: 12px; height: 12px; background: #4caf50; border-radius: 50%;"></span> Delivered: ${stats.deliveredOrders}
                    </div>
                </div>
            </div>
            
            <div class="chart-card">
                <h3>Quick Actions</h3>
                <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                    <button class="btn-primary" onclick="navigateToPage('revenue')">View Revenue Details</button>
                    <button class="btn-outline" onclick="navigateToPage('admins')">Manage Admin Users</button>
                    <button class="btn-outline" onclick="navigateToPage('backup')">Backup Database</button>
                </div>
            </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="chart-card">
            <h3>Recent Activity</h3>
            <div class="activity-log">
                ${activityLog
                  .slice(0, 5)
                  .map(
                    (log) => `
                    <div class="activity-item">
                        <div class="activity-icon"><i class="fas fa-user-circle"></i></div>
                        <div class="activity-content">
                            <p><strong>${log.user}</strong> ${log.action}</p>
                            <p class="activity-time">${new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                ${activityLog.length === 0 ? '<div class="activity-item"><p>No activity yet</p></div>' : ""}
            </div>
        </div>
    `;
}

// ============================================
// RENDER REVENUE & ANALYTICS
// ============================================

function renderRevenuePage() {
  const stats = getStats();

  // Calculate profit margin (mock)
  const cogs = stats.totalRevenue * 0.63;
  const operational = stats.totalRevenue * 0.1;
  const shipping = stats.totalRevenue * 0.07;
  const marketing = stats.totalRevenue * 0.04;
  const netProfit =
    stats.totalRevenue - cogs - operational - shipping - marketing;
  const profitMargin = ((netProfit / stats.totalRevenue) * 100).toFixed(1);

  // Growth metrics
  const customerGrowth = 15;
  const orderGrowth = 22;
  const revenueGrowth = 18;

  return `
        <div class="chart-card">
            <h3>Profit & Loss Statement</h3>
            <div style="padding: var(--space-4);">
                <div style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color);">
                    <span>Total Revenue</span>
                    <strong>$${stats.totalRevenue.toLocaleString()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color);">
                    <span>Cost of Goods Sold (COGS)</span>
                    <span>- $${cogs.toLocaleString()} (63%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color);">
                    <span>Operational Cost</span>
                    <span>- $${operational.toLocaleString()} (10%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color);">
                    <span>Shipping Cost</span>
                    <span>- $${shipping.toLocaleString()} (7%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 2px solid var(--border-color);">
                    <span>Marketing Cost</span>
                    <span>- $${marketing.toLocaleString()} (4%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: var(--space-3) 0;">
                    <span><strong>Net Profit</strong></span>
                    <span style="color: var(--gold);"><strong>$${netProfit.toLocaleString()} (${profitMargin}%)</strong></span>
                </div>
            </div>
        </div>
        
        <div class="two-columns">
            <div class="chart-card">
                <h3>Growth Metrics</h3>
                <div style="padding: var(--space-4);">
                    <div style="margin-bottom: var(--space-4);">
                        <div>Customer Growth</div>
                        <div style="font-size: var(--text-2xl); color: var(--gold);">+${customerGrowth}%</div>
                        <small>Month over Month</small>
                    </div>
                    <div style="margin-bottom: var(--space-4);">
                        <div>Order Growth</div>
                        <div style="font-size: var(--text-2xl); color: var(--gold);">+${orderGrowth}%</div>
                        <small>Month over Month</small>
                    </div>
                    <div>
                        <div>Revenue Growth</div>
                        <div style="font-size: var(--text-2xl); color: var(--gold);">+${revenueGrowth}%</div>
                        <small>Month over Month</small>
                    </div>
                </div>
            </div>
            
            <div class="chart-card">
                <h3>Best Selling Products</h3>
                <div class="top-products-list">
                    ${products
                      .slice(0, 5)
                      .map(
                        (p, idx) => `
                        <div class="top-product-item">
                            <div class="top-product-name">
                                <span class="top-product-rank">${idx + 1}</span>
                                <span>${p.name}</span>
                            </div>
                            <div class="top-product-percent">${Math.round(100 - idx * 15)}%</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// RENDER PRODUCT ANALYSIS
// ============================================

function renderProductAnalysisPage() {
  // Calculate product stats
  const productStats = products
    .map((p) => ({
      ...p,
      salesCount: Math.floor(Math.random() * 50) + 10,
      revenue: p.price * (Math.floor(Math.random() * 20) + 5),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Product Performance Analysis</strong>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Rank</th><th>Product Name</th><th>Category</th><th>Price</th><th>Units Sold</th><th>Revenue</th><th>Margin</th></tr>
                    </thead>
                    <tbody>
                        ${productStats
                          .map(
                            (p, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${p.name}</td>
                                <td>${p.category}</td>
                                <td>$${p.price.toLocaleString()}</td>
                                <td>${p.salesCount} tons</td>
                                <td>$${p.revenue.toLocaleString()}</td>
                                <td><span style="color: var(--gold);">${Math.round(15 + Math.random() * 15)}%</span></td>
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

// ============================================
// RENDER CUSTOMER INSIGHTS
// ============================================

function renderCustomerInsightsPage() {
  // Mock customer data
  const topCustomers = [
    { name: "PT Kopi Nusantara", orders: 6, value: 45200 },
    { name: "Roastery Indonesia", orders: 4, value: 28200 },
    { name: "Coffee Export Co", orders: 3, value: 19000 },
    { name: "Java Coffee Importers", orders: 2, value: 12400 },
    { name: "Bali Roastery", orders: 2, value: 9800 },
  ];

  return `
        <div class="two-columns">
            <div class="chart-card">
                <h3>Top Customers by Order Value</h3>
                <div class="customer-list">
                    ${topCustomers
                      .map(
                        (c) => `
                        <div class="customer-item">
                            <div>
                                <div class="customer-name">${c.name}</div>
                                <small>${c.orders} orders</small>
                            </div>
                            <div class="customer-value">$${c.value.toLocaleString()}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="chart-card">
                <h3>Customer Insights</h3>
                <div style="padding: var(--space-4);">
                    <div style="margin-bottom: var(--space-4);">
                        <div>Total Customers</div>
                        <div style="font-size: var(--text-2xl);">${users.length}</div>
                    </div>
                    <div style="margin-bottom: var(--space-4);">
                        <div>Active Buyers (Last 30d)</div>
                        <div style="font-size: var(--text-2xl);">${Math.floor(users.length * 0.7)}</div>
                    </div>
                    <div>
                        <div>Repeat Customer Rate</div>
                        <div style="font-size: var(--text-2xl);">34%</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-card">
            <h3>Orders by Country</h3>
            <div style="padding: var(--space-4);">
                <div style="margin-bottom: var(--space-3);">
                    <span>Singapore</span>
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-full); height: 20px; margin-top: 4px;">
                        <div style="width: 30%; background: var(--gold); border-radius: var(--radius-full); height: 20px; text-align: center; font-size: var(--text-xs); color: var(--black);">30%</div>
                    </div>
                </div>
                <div style="margin-bottom: var(--space-3);">
                    <span>Malaysia</span>
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-full); height: 20px; margin-top: 4px;">
                        <div style="width: 25%; background: var(--royal-green); border-radius: var(--radius-full); height: 20px; text-align: center; font-size: var(--text-xs); color: white;">25%</div>
                    </div>
                </div>
                <div style="margin-bottom: var(--space-3);">
                    <span>USA</span>
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-full); height: 20px; margin-top: 4px;">
                        <div style="width: 20%; background: var(--royal-green-light); border-radius: var(--radius-full); height: 20px; text-align: center; font-size: var(--text-xs); color: white;">20%</div>
                    </div>
                </div>
                <div>
                    <span>Others</span>
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-full); height: 20px; margin-top: 4px;">
                        <div style="width: 25%; background: var(--gray-500); border-radius: var(--radius-full); height: 20px; text-align: center; font-size: var(--text-xs); color: white;">25%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// MANAGE ADMINS
// ============================================

function renderManageAdminsPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Admin & Super Admin Users</strong>
                <button class="btn-primary btn-sm" onclick="showAddAdminModal()">+ Add Admin</button>
            </div>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${adminUsers
                          .map(
                            (user) => `
                            <tr>
                                <td>${user.name || "-"}</td>
                                <td>${user.email}</td>
                                <td><span style="color: var(--gold);">${user.role}</span></td>
                                <td><span style="color: #4caf50;">${user.status || "active"}</span></td>
                                <td>${user.joined}</td>
                                <td>
                                    <button class="action-btn edit" onclick="editAdmin(${user.id})"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn delete" onclick="deleteAdmin(${user.id})"><i class="fas fa-trash"></i></button>
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

function showAddAdminModal() {
  const body = `
        <div class="admin-form-group"><label>Name</label><input type="text" id="adminName" placeholder="Full name"></div>
        <div class="admin-form-group"><label>Email</label><input type="email" id="adminEmail" placeholder="email@example.com"></div>
        <div class="admin-form-group"><label>Role</label><select id="adminRole"><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select></div>
        <div class="admin-form-group"><label>Password</label><input type="password" id="adminPassword" placeholder="password"></div>
    `;

  showModal("Add Admin User", body, () => {
    const newAdmin = {
      id: adminUsers.length + 100,
      name: document.getElementById("adminName").value,
      email: document.getElementById("adminEmail").value,
      password: document.getElementById("adminPassword").value || "admin123",
      role: document.getElementById("adminRole").value,
      status: "active",
      joined: new Date().toISOString().split("T")[0],
    };

    if (newAdmin.name && newAdmin.email) {
      adminUsers.push(newAdmin);
      addActivityLog("Added new admin", `${newAdmin.name} (${newAdmin.email})`);
      alert("Admin added successfully!");
      document.querySelector(".admin-modal")?.remove();
      navigateToPage(currentPage);
    } else {
      alert("Please fill name and email");
    }
  });
}

function editAdmin(adminId) {
  const admin = adminUsers.find((u) => u.id === adminId);
  if (!admin) return;

  const body = `
        <div class="admin-form-group"><label>Name</label><input type="text" id="adminName" value="${admin.name}"></div>
        <div class="admin-form-group"><label>Email</label><input type="email" id="adminEmail" value="${admin.email}"></div>
        <div class="admin-form-group"><label>Role</label><select id="adminRole"><option value="admin" ${admin.role === "admin" ? "selected" : ""}>Admin</option><option value="super_admin" ${admin.role === "super_admin" ? "selected" : ""}>Super Admin</option></select></div>
        <div class="admin-form-group"><label>New Password (leave empty to keep)</label><input type="password" id="adminPassword" placeholder="Enter new password"></div>
    `;

  showModal("Edit Admin", body, () => {
    admin.name = document.getElementById("adminName").value;
    admin.email = document.getElementById("adminEmail").value;
    admin.role = document.getElementById("adminRole").value;
    const newPassword = document.getElementById("adminPassword").value;
    if (newPassword) admin.password = newPassword;

    addActivityLog("Updated admin", `${admin.name} (${admin.email})`);
    alert("Admin updated!");
    document.querySelector(".admin-modal")?.remove();
    navigateToPage(currentPage);
  });
}

function deleteAdmin(adminId) {
  if (confirm("Delete this admin user?")) {
    const admin = adminUsers.find((u) => u.id === adminId);
    adminUsers = adminUsers.filter((u) => u.id !== adminId);
    addActivityLog("Deleted admin", `${admin?.name} (${admin?.email})`);
    navigateToPage(currentPage);
  }
}

// ============================================
// ACTIVITY LOG
// ============================================

function renderActivityLogPage() {
  return `
        <div class="admin-table-container">
            <div class="table-header">
                <strong>Activity Log</strong>
                <button class="btn-outline btn-sm" onclick="clearActivityLog()">Clear All</button>
            </div>
            <div class="activity-log">
                ${activityLog
                  .map(
                    (log) => `
                    <div class="activity-item">
                        <div class="activity-icon"><i class="fas fa-user-circle"></i></div>
                        <div class="activity-content">
                            <p><strong>${log.user}</strong> ${log.action}</p>
                            <p class="activity-time">${new Date(log.timestamp).toLocaleString()}</p>
                            ${log.details ? `<small style="color: var(--text-muted);">${log.details}</small>` : ""}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                ${activityLog.length === 0 ? '<div class="activity-item"><p>No activity records</p></div>' : ""}
            </div>
        </div>
    `;
}

function clearActivityLog() {
  if (confirm("Clear all activity logs? This cannot be undone.")) {
    activityLog = [];
    saveActivityLog();
    navigateToPage(currentPage);
  }
}

// ============================================
// BACKUP & RESTORE
// ============================================

function renderBackupPage() {
  const lastBackup = localStorage.getItem("last_backup") || "Never";

  return `
        <div class="backup-cards">
            <div class="backup-card">
                <i class="fas fa-download"></i>
                <h3>Download Backup</h3>
                <p>Backup all data including orders, users, products, and settings</p>
                <button class="btn-primary" onclick="createBackup()">Create Backup</button>
                <div class="backup-info">Last backup: ${lastBackup}</div>
            </div>
            <div class="backup-card">
                <i class="fas fa-upload"></i>
                <h3>Restore Backup</h3>
                <p>Restore data from a previously saved backup file</p>
                <input type="file" id="restoreFile" accept=".json" style="display: none;">
                <button class="btn-outline" onclick="document.getElementById('restoreFile').click()">Choose File</button>
                <div class="backup-info">⚠️ Restore will overwrite current data</div>
            </div>
        </div>
    `;
}

function createBackup() {
  const backupData = {
    orders: orders,
    users: users,
    products: products,
    activityLog: activityLog,
    backupDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `2brothers_backup_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  localStorage.setItem("last_backup", new Date().toLocaleString());
  addActivityLog("Created backup", `Backup file downloaded`);
  alert("Backup created successfully!");
  navigateToPage(currentPage);
}

// ============================================
// SYSTEM SETTINGS
// ============================================

function renderSettingsPage() {
  const config = JSON.parse(localStorage.getItem("site_config") || "{}");

  return `
        <div class="settings-form">
            <h3 style="margin-bottom: var(--space-5);">General Settings</h3>
            
            <div class="setting-group">
                <label>Site Name</label>
                <input type="text" id="siteName" value="${config.siteName || "2Brother's Coffee"}">
            </div>
            
            <div class="setting-group">
                <label>Company Email</label>
                <input type="email" id="siteEmail" value="${config.siteEmail || "export@2brothers.coffee"}">
            </div>
            
            <div class="setting-group">
                <label>WhatsApp Number</label>
                <input type="text" id="siteWhatsapp" value="${config.siteWhatsapp || "+6281234567890"}">
            </div>
            
            <div class="setting-group">
                <label>Address</label>
                <textarea id="siteAddress" rows="2">${config.siteAddress || "Medan, North Sumatra, Indonesia"}</textarea>
            </div>
            
            <div class="setting-group">
                <label>Sample Policy</label>
                <select id="samplePolicy">
                    <option value="250gr" ${config.samplePolicy === "250gr" ? "selected" : ""}>250gr per sample</option>
                    <option value="500gr" ${config.samplePolicy === "500gr" ? "selected" : ""}>500gr per sample</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label>Default Theme</label>
                <select id="defaultTheme">
                    <option value="light" ${config.defaultTheme === "light" ? "selected" : ""}>Light Mode</option>
                    <option value="dark" ${config.defaultTheme === "dark" ? "selected" : ""}>Dark Mode</option>
                    <option value="system" ${config.defaultTheme === "system" || !config.defaultTheme ? "selected" : ""}>System Preference</option>
                </select>
            </div>
            
            <button class="btn-primary" onclick="saveSettings()">Save Settings</button>
        </div>
    `;
}

function saveSettings() {
  const settings = {
    siteName: document.getElementById("siteName")?.value,
    siteEmail: document.getElementById("siteEmail")?.value,
    siteWhatsapp: document.getElementById("siteWhatsapp")?.value,
    siteAddress: document.getElementById("siteAddress")?.value,
    samplePolicy: document.getElementById("samplePolicy")?.value,
    defaultTheme: document.getElementById("defaultTheme")?.value,
  };

  localStorage.setItem("site_config", JSON.stringify(settings));
  addActivityLog("Updated system settings", "Site configuration changed");
  alert("Settings saved successfully!");
  navigateToPage(currentPage);
}

// ============================================
// PAGE NAVIGATION
// ============================================

function navigateToPage(page) {
  currentPage = page;

  const titles = {
    dashboard: "Super Admin Dashboard",
    revenue: "Revenue & Analytics",
    products: "Product Analysis",
    customers: "Customer Insights",
    admins: "Manage Admin Users",
    activity: "Activity Log",
    backup: "Backup & Restore",
    settings: "System Settings",
  };
  document.getElementById("pageTitle").textContent =
    titles[page] || "Super Admin Dashboard";

  document.querySelectorAll(".super-admin-nav-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-page") === page) item.classList.add("active");
  });

  const contentDiv = document.getElementById("superAdminContent");
  switch (page) {
    case "dashboard":
      contentDiv.innerHTML = renderDashboard();
      break;
    case "revenue":
      contentDiv.innerHTML = renderRevenuePage();
      break;
    case "products":
      contentDiv.innerHTML = renderProductAnalysisPage();
      break;
    case "customers":
      contentDiv.innerHTML = renderCustomerInsightsPage();
      break;
    case "admins":
      contentDiv.innerHTML = renderManageAdminsPage();
      break;
    case "activity":
      contentDiv.innerHTML = renderActivityLogPage();
      break;
    case "backup":
      contentDiv.innerHTML = renderBackupPage();
      break;
    case "settings":
      contentDiv.innerHTML = renderSettingsPage();
      break;
    default:
      contentDiv.innerHTML = renderDashboard();
  }
}

function logout() {
  addActivityLog("Logged out", "User logged out from Super Admin panel");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

function initMobileToggle() {
  const toggle = document.getElementById("mobileSuperAdminToggle");
  const sidebar = document.getElementById("superAdminSidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.querySelectorAll(".super-admin-nav-item").forEach((link) => {
      link.addEventListener("click", () => sidebar.classList.remove("open"));
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  if (!checkSuperAdminAuth()) return;
  await loadData();
  initMobileToggle();
  navigateToPage("dashboard");

  document.querySelectorAll(".super-admin-nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToPage(link.getAttribute("data-page"));
    });
  });

  document.getElementById("logoutBtn")?.addEventListener("click", logout);

  // Restore file handler
  document.getElementById("restoreFile")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const restored = JSON.parse(event.target.result);
          alert("Restore feature: Data can be restored from backup file");
          addActivityLog("Attempted restore", "Backup file uploaded");
        } catch (err) {
          alert("Invalid backup file");
        }
      };
      reader.readAsText(file);
    }
  });
}

init();

// Expose functions globally
window.navigateToPage = navigateToPage;
window.editAdmin = editAdmin;
window.deleteAdmin = deleteAdmin;
window.showAddAdminModal = showAddAdminModal;
window.clearActivityLog = clearActivityLog;
window.createBackup = createBackup;
window.saveSettings = saveSettings;
