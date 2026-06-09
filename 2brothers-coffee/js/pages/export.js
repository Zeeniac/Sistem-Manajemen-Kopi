// ============================================
// 2BROTHER'S COFFEE - EXPORT PROCESS PAGE
// Load export steps from JSON
// ============================================

// Export steps data (bisa dipindah ke JSON nanti)
const exportSteps = [
  {
    step: 1,
    title: "Inquiry & Contract",
    description:
      "Buyer submits inquiry. We discuss MOQ, pricing, shipping terms (FOB/CIF), and payment method (LC/TT).",
    icon: "fas fa-envelope",
  },
  {
    step: 2,
    title: "Sampling & Lab Test",
    description:
      "Green bean sample sent to buyer for cupping and lab analysis. Quality report provided.",
    icon: "fas fa-flask",
  },
  {
    step: 3,
    title: "Payment Arrangement",
    description:
      "Payment via LC (Letter of Credit) or TT. Proforma invoice issued.",
    icon: "fas fa-credit-card",
  },
  {
    step: 4,
    title: "Loading & Export Docs",
    description:
      "Container loading at warehouse. Export documents prepared: Bill of Lading, COO, Packing List.",
    icon: "fas fa-boxes",
  },
  {
    step: 5,
    title: "Shipping",
    description:
      "FOB from Belawan Port (Medan) or Tanjung Priok (Jakarta). Shipping timeline: 14-21 days.",
    icon: "fas fa-ship",
  },
  {
    step: 6,
    title: "Delivery & Customs",
    description:
      "Arrival at destination port. Customs clearance coordinated with buyer.",
    icon: "fas fa-truck",
  },
];

// Load FAQ data
async function loadFAQ() {
  try {
    const response = await fetch("data/exportFAQ.json");
    const data = await response.json();
    renderFAQ(data.faq);
  } catch (error) {
    console.error("Error loading FAQ:", error);
    const container = document.getElementById("faqContainer");
    if (container) {
      container.innerHTML =
        '<p class="empty-state">Unable to load FAQ. Please refresh the page.</p>';
    }
  }
}

// Render FAQ
function renderFAQ(faqList) {
  const container = document.getElementById("faqContainer");
  if (!container) return;

  container.innerHTML = faqList
    .map(
      (faq, index) => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(this)">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `,
    )
    .join("");
}

// Toggle FAQ answer
function toggleFAQ(element) {
  element.classList.toggle("active");
  const answer = element.nextElementSibling;
  answer.classList.toggle("show");
}

// Panggil loadFAQ() di dalam fungsi init()
// Tambahkan baris ini di dalam document.addEventListener('DOMContentLoaded', ...)
// loadFAQ();

// Render timeline
function renderTimeline() {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  container.innerHTML = exportSteps
    .map(
      (step) => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <i class="${step.icon}"></i>
            </div>
            <div class="timeline-content">
                <span class="timeline-step">STEP ${step.step}</span>
                <h3>${step.title}</h3>
                <p>${step.description}</p>
            </div>
        </div>
    `,
    )
    .join("");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderTimeline();
});
