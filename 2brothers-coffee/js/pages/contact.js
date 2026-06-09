// ============================================
// 2BROTHER'S COFFEE - CONTACT PAGE
// Form validation and submission
// ============================================

const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccess");

// Hide success message initially
if (successMessage) {
  successMessage.classList.remove("show");
}

// Form validation
function validateForm() {
  let isValid = true;

  // Get values
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const message = document.getElementById("message")?.value.trim();
  const interest = document.getElementById("interest")?.value;

  // Name validation
  const nameError = document.getElementById("nameError");
  if (!name) {
    if (nameError) nameError.classList.add("show");
    isValid = false;
  } else {
    if (nameError) nameError.classList.remove("show");
  }

  // Email validation
  const emailError = document.getElementById("emailError");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (emailError) emailError.classList.add("show");
    isValid = false;
  } else {
    if (emailError) emailError.classList.remove("show");
  }

  // Message validation
  const messageError = document.getElementById("messageError");
  if (!message || message.length < 10) {
    if (messageError) messageError.classList.add("show");
    isValid = false;
  } else {
    if (messageError) messageError.classList.remove("show");
  }

  // Interest validation
  if (!interest || interest === "") {
    isValid = false;
  }

  return isValid;
}

// Submit form
async function submitForm(formData) {
  // Simulate API call (will be replaced with actual backend)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const messages = JSON.parse(
        localStorage.getItem("contactMessages") || "[]",
      );
      messages.push({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("contactMessages", JSON.stringify(messages));
      resolve({ success: true });
    }, 1000);
  });
}

// Handle form submission
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Get form data
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    company: document.getElementById("company")?.value.trim() || "",
    interest: document.getElementById("interest").value,
    message: document.getElementById("message").value.trim(),
    newsletter: document.getElementById("newsletter")?.checked || false,
  };

  // Change button state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Submit form
  const result = await submitForm(formData);

  if (result.success) {
    // Show success message
    successMessage.classList.add("show");

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.remove("show");
    }, 5000);

    // Optional: Send to WhatsApp
    const whatsappNumber = "6281234567890";
    const whatsappMessage = `Halo 2Brother's Coffee,%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Company:* ${formData.company}%0A*Interest:* ${formData.interest}%0A*Message:* ${formData.message}`;

    // Uncomment below to enable WhatsApp redirect
    // window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  }

  // Reset button state
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
});

// Real-time validation
document.getElementById("name")?.addEventListener("input", () => {
  const name = document.getElementById("name").value.trim();
  const nameError = document.getElementById("nameError");
  if (name) {
    nameError?.classList.remove("show");
  }
});

document.getElementById("email")?.addEventListener("input", () => {
  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailError = document.getElementById("emailError");
  if (email && emailRegex.test(email)) {
    emailError?.classList.remove("show");
  }
});

document.getElementById("message")?.addEventListener("input", () => {
  const message = document.getElementById("message").value.trim();
  const messageError = document.getElementById("messageError");
  if (message && message.length >= 10) {
    messageError?.classList.remove("show");
  }
});
