// ============================================
// 2BROTHER'S COFFEE - LOGIN PAGE
// Authentication with data from users.json
// ============================================

let users = [];

// Get form elements
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// Hide error initially
if (loginError) {
  loginError.classList.remove("show");
}

// ============================================
// LOAD USERS FROM JSON
// ============================================

async function loadUsers() {
  try {
    // Load dari JSON
    const response = await fetch("data/users.json");
    const data = await response.json();
    const jsonUsers = data.users;

    // Load dari localStorage (user baru yang ditambahkan admin)
    const storedUsers = JSON.parse(localStorage.getItem("app_users") || "[]");

    // Gabungkan semua user
    users = [...jsonUsers, ...storedUsers];

    // Hapus duplikat berdasarkan email
    users = users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.email === user.email),
    );

    console.log("✅ Users loaded:", users.length);
  } catch (error) {
    console.error("Error loading users:", error);
    // Fallback ke hardcode
    users = [
      {
        email: "bro@2brothers.coffee",
        password: "founder123",
        role: "super_admin",
        name: "Brother 1",
      },
      {
        email: "co@2brothers.coffee",
        password: "cofounder123",
        role: "super_admin",
        name: "Brother 2",
      },
      {
        email: "admin@2brothers.coffee",
        password: "admin123",
        role: "admin",
        name: "Admin User",
      },
      {
        email: "buyer@example.com",
        password: "buyer123",
        role: "buyer",
        name: "Sample Buyer",
      },
    ];
  }
}

// ============================================
// REDIRECT BASED ON ROLE
// ============================================

function redirectByRole(role) {
  switch (role) {
    case "super_admin":
      window.location.href = "super-admin.html";
      break;
    case "admin":
      window.location.href = "admin.html";
      break;
    case "buyer":
      window.location.href = "dashboard.html";
      break;
    default:
      window.location.href = "index.html";
  }
}

// ============================================
// CHECK EXISTING LOGIN
// ============================================

function checkExistingLogin() {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const rememberMe = localStorage.getItem("rememberMe") === "true";

  if (userRole && userEmail && rememberMe) {
    redirectByRole(userRole);
  }
}

// ============================================
// HANDLE LOGIN SUBMISSION
// ============================================

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rememberMe = document.getElementById("rememberMe")?.checked || false;

  // Tampilkan loading state
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  submitBtn.disabled = true;

  // Pastikan users sudah load
  if (users.length === 0) {
    await loadUsers();
  }

  // Cari user
  const user = users.find((u) => u.email === email && u.password === password);

  // Reset button
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;

  if (user) {
    // Login sukses
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    console.log(`✅ Login sukses sebagai: ${user.role}`);
    redirectByRole(user.role);
  } else {
    // Login gagal
    loginError.classList.add("show");
    document.getElementById("password").value = "";

    setTimeout(() => {
      loginError.classList.remove("show");
    }, 3000);
  }
});

// ============================================
// FORGOT PASSWORD
// ============================================

document.querySelector(".forgot-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert(
    "Please contact our support team at export@2brothers.coffee to reset your password.",
  );
});

// ============================================
// ENTER KEY SUPPORT
// ============================================

document.getElementById("password")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loginForm?.dispatchEvent(new Event("submit"));
  }
});

// ============================================
// INITIALIZE
// ============================================

// Load users saat halaman dimuat
loadUsers();
checkExistingLogin();
