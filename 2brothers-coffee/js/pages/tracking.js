// ============================================
// 2BROTHER'S COFFEE - TRACKING PAGE
// Order tracking with live tracking link
// ============================================

// Hardcoded orders data (sementara, nanti dari JSON)
const ordersData = [
  {
    orderId: "2BC-001",
    date: "2026-05-15",
    product: "Sumatra Mandheling G1",
    quantity: "2 tons",
    total: "$16,200",
    status: "shipped",
    trackingLink: "https://www.flightradar24.com/JAL35/3fcd57f0",
    trackingProvider: "FlightRadar24",
    customerName: "PT Kopi Nusantara",
    shippingAddress: "Jakarta, Indonesia",
    estimatedDelivery: "2026-06-05",
    history: [
      { date: "2026-05-15", status: "Order Confirmed", location: "Medan" },
      { date: "2026-05-17", status: "Quality Check", location: "Medan" },
      { date: "2026-05-20", status: "Shipping", location: "Belawan Port" },
    ],
  },
  {
    orderId: "2BC-002",
    date: "2026-05-10",
    product: "Gayo Arabica G1",
    quantity: "1 ton",
    total: "$8,200",
    status: "processing",
    trackingLink: "",
    trackingProvider: "",
    customerName: "Roastery Indonesia",
    shippingAddress: "Bandung, Indonesia",
    estimatedDelivery: "2026-05-30",
    history: [
      { date: "2026-05-10", status: "Order Confirmed", location: "Medan" },
      { date: "2026-05-12", status: "Quality Check", location: "Medan" },
    ],
  },
  {
    orderId: "2BC-003",
    date: "2026-05-01",
    product: "Sumatra Robusta G1",
    quantity: "5 tons",
    total: "$19,000",
    status: "delivered",
    trackingLink: "https://www.marinetraffic.com/en/ais/home/shipid:123456",
    trackingProvider: "MarineTraffic",
    customerName: "Coffee Export Co",
    shippingAddress: "Singapore",
    estimatedDelivery: "2026-05-22",
    history: [
      { date: "2026-05-01", status: "Order Confirmed", location: "Medan" },
      { date: "2026-05-03", status: "Quality Check", location: "Medan" },
      { date: "2026-05-06", status: "Shipping", location: "Belawan Port" },
      {
        date: "2026-05-20",
        status: "Arrived at Destination Port",
        location: "Singapore Port",
      },
      { date: "2026-05-22", status: "Delivered", location: "Buyer Warehouse" },
    ],
  },
];

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

// Get current step index
function getCurrentStep(status) {
  const steps = ["processing", "shipped", "delivered"];
  return steps.indexOf(status);
}

// Render progress steps
function renderProgressSteps(status) {
  const steps = [
    {
      key: "processing",
      icon: "fas fa-clipboard-list",
      label: "Order Confirmed",
    },
    { key: "shipped", icon: "fas fa-ship", label: "In Transit" },
    { key: "delivered", icon: "fas fa-check-circle", label: "Delivered" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return steps
    .map((step, index) => {
      let stepClass = "";
      if (index < currentIndex) {
        stepClass = "completed";
      } else if (index === currentIndex) {
        stepClass = "active";
      }

      return `
            <div class="progress-step ${stepClass}">
                <div class="step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <div class="step-label">${step.label}</div>
            </div>
        `;
    })
    .join("");
}

// Render live tracking button
function renderLiveTracking(trackingLink, provider) {
  if (!trackingLink || trackingLink === "") {
    return "";
  }

  const providerIcon = provider === "FlightRadar24" ? "fa-plane" : "fa-ship";
  const providerName = provider || "Live Tracking";

  return `
        <div class="live-tracking-card">
            <i class="fas ${providerIcon}"></i>
            <div class="live-tracking-info">
                <h4>Live Shipment Tracking</h4>
                <p>Track your cargo in real-time via ${providerName}</p>
            </div>
            <a href="${trackingLink}" target="_blank" class="btn-live-track" rel="noopener noreferrer">
                Track Live <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
}

// Render tracking result
function renderTracking(order) {
  const history = order.history;
  const status = order.status;

  return `
        <!-- Order Info Card -->
        <div class="order-info">
            <div class="order-header">
                <h2>Order #${order.orderId}</h2>
                <p>Last updated: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Product</span>
                    <span class="detail-value">${order.product}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Quantity</span>
                    <span class="detail-value">${order.quantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value">${order.total}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date</span>
                    <span class="detail-value">${order.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estimated Delivery</span>
                    <span class="detail-value">${order.estimatedDelivery || "-"}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Shipping Address</span>
                    <span class="detail-value">${order.shippingAddress || "-"}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Current Status</span>
                    <span class="detail-value">${getStatusBadge(order.status)}</span>
                </div>
            </div>
        </div>
        
        <!-- Live Tracking Card (only if tracking link exists) -->
        ${renderLiveTracking(order.trackingLink, order.trackingProvider)}
        
        <!-- Progress Section -->
        <div class="progress-section">
            <div class="progress-title">Shipment Progress</div>
            <div class="progress-steps">
                ${renderProgressSteps(order.status)}
            </div>
        </div>
        
        <!-- Timeline Section -->
        <div class="timeline-section">
            <div class="timeline-title">Tracking History</div>
            <div class="timeline-list">
                ${history
                  .map(
                    (item) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${item.date}</div>
                        <div class="timeline-status">${item.status}</div>
                        <div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${item.location}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        
        <!-- Need Help Section -->
        <div class="help-section">
            <i class="fas fa-headset"></i>
            <div>
                <h4>Need help with your shipment?</h4>
                <p>Contact our support team for assistance</p>
            </div>
            <a href="contact.html" class="btn-outline btn-sm">Contact Support</a>
        </div>
    `;
}

// Show error message
function showError(message) {
  const resultDiv = document.getElementById("trackingResult");
  resultDiv.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <p style="margin-top: 16px; font-size: 14px;">Available Order IDs: 2BC-001, 2BC-002, 2BC-003</p>
            <p style="font-size: 14px;">Example: <code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px;">2BC-001</code></p>
        </div>
    `;
}

// Show loading state
function showLoading() {
  const resultDiv = document.getElementById("trackingResult");
  resultDiv.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading order details...</p>
        </div>
    `;
}

// Track order by ID
function trackOrder(orderId) {
  if (!orderId || orderId.trim() === "") {
    showError("Please enter an Order ID");
    return;
  }

  showLoading();

  // Simulasi delay (bisa dihapus nanti)
  setTimeout(() => {
    const order = ordersData.find((o) => o.orderId === orderId);

    if (order) {
      const resultDiv = document.getElementById("trackingResult");
      resultDiv.innerHTML = renderTracking(order);

      // Save to URL param for sharing
      const url = new URL(window.location);
      url.searchParams.set("id", orderId);
      window.history.pushState({}, "", url);
    } else {
      showError(`Order #${orderId} not found`);
    }
  }, 500);
}

// Check URL parameter on load
function checkUrlParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");

  if (orderId) {
    const orderInput = document.getElementById("orderId");
    if (orderInput) {
      orderInput.value = orderId;
    }
    trackOrder(orderId);
  }
}

// Initialize
function init() {
  checkUrlParam();

  const trackBtn = document.getElementById("trackBtn");
  const orderInput = document.getElementById("orderId");

  if (trackBtn) {
    trackBtn.addEventListener("click", () => {
      trackOrder(orderInput.value);
    });
  }

  if (orderInput) {
    orderInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        trackOrder(orderInput.value);
      }
    });
  }
}

// Start
document.addEventListener("DOMContentLoaded", init);
