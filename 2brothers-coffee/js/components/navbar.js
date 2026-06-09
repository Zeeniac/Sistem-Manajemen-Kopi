// ============================================
// 2BROTHER'S COFFEE - NAVBAR COMPONENT
// Dynamic navbar with dark mode & language switcher
// ============================================

class NavbarComponent {
  constructor() {
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.handleScroll();
  }

  render() {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    // Get current user role from localStorage (default: guest)
    const userRole = localStorage.getItem("userRole") || "guest";

    navbarContainer.innerHTML = `
            <nav class="navbar" id="mainNavbar">
                <div class="nav-container">
                    <!-- Logo -->
                    <a href="index.html" class="logo">
                        2Brother's<span>Coffee</span>
                    </a>
                    
                    <!-- Desktop Navigation Links -->
                    <div class="nav-links" id="navLinks">
                        <a href="index.html" data-i18n="navHome">Home</a>
                        <a href="coffee.html" data-i18n="navCoffee">Coffee</a>
                        <a href="export-process.html" data-i18n="navExport">Export</a>
                        <a href="about.html" data-i18n="navAbout">About</a>
                        <a href="contact.html" data-i18n="navContact">Contact</a>
                        ${this.renderNavLinksByRole(userRole)}
                    </div>
                    
                    <!-- Right Controls -->
                    <div class="nav-controls">
                        <!-- Language Switcher -->
                        <div class="lang-switcher">
                            <button class="lang-btn" id="langID">ID</button>
                            <button class="lang-btn" id="langEN">EN</button>
                        </div>
                        
                        <!-- Dark Mode Toggle -->
                        <button class="toggle-btn" id="darkModeToggle">
                            <i class="fas fa-moon"></i>
                        </button>
                        
                        <!-- Mobile Menu Button -->
                        <button class="mobile-menu-btn" id="mobileMenuBtn">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </nav>
        `;
  }

  renderNavLinksByRole(role) {
    switch (role) {
      case "buyer":
        return `
                    <a href="dashboard.html" data-i18n="dashboardTitle">Dashboard</a>
                    <button class="btn-login" id="logoutBtn" data-i18n="dashboardLogout">Logout</button>
                `;
      case "admin":
        return `
                    <a href="admin.html">Admin Panel</a>
                    <a href="dashboard.html">Dashboard</a>
                    <button class="btn-login" id="logoutBtn">Logout</button>
                `;
      default:
        return `<button class="btn-login" id="loginBtn" data-i18n="navLogin">Login</button>`;
    }
  }

  attachEventListeners() {
    // Mobile menu toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener("click", () => {
        this.isMenuOpen = !this.isMenuOpen;
        navLinks.classList.toggle("active", this.isMenuOpen);
        const icon = mobileBtn.querySelector("i");
        if (icon) {
          icon.className = this.isMenuOpen ? "fas fa-times" : "fas fa-bars";
        }
      });
    }

    // Close mobile menu when clicking a link
    if (navLinks) {
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (this.isMenuOpen) {
            this.isMenuOpen = false;
            navLinks.classList.remove("active");
            const mobileBtn = document.getElementById("mobileMenuBtn");
            const icon = mobileBtn?.querySelector("i");
            if (icon) icon.className = "fas fa-bars";
          }
        });
      });
    }

    // Login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        window.location.href = "index.html";
      });
    }

    // Dark Mode Toggle
    const darkModeBtn = document.getElementById("darkModeToggle");
    if (darkModeBtn && window.darkModeManager) {
      darkModeBtn.addEventListener("click", () => {
        window.darkModeManager.toggle();
        window.darkModeManager.updateToggleButton();
      });
      window.darkModeManager.updateToggleButton();
    }

    // Language Switcher
    const langID = document.getElementById("langID");
    const langEN = document.getElementById("langEN");

    if (langID && window.languageManager) {
      langID.addEventListener("click", () => {
        window.languageManager.setLanguage("id");
      });
    }

    if (langEN && window.languageManager) {
      langEN.addEventListener("click", () => {
        window.languageManager.setLanguage("en");
      });
    }

    // Re-apply translations when language changes
    if (window.languageManager) {
      window.addEventListener("languageChanged", () => {
        this.updateNavbarTexts();
        window.darkModeManager?.updateToggleButton();
      });
    }
  }

  updateNavbarTexts() {
    if (!window.languageManager) return;

    const t = window.languageManager.translate.bind(window.languageManager);

    // Update nav links
    document.querySelectorAll(".nav-links a[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    // Update login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn && loginBtn.hasAttribute("data-i18n")) {
      const key = loginBtn.getAttribute("data-i18n");
      loginBtn.textContent = t(key);
    }

    // Update logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && logoutBtn.hasAttribute("data-i18n")) {
      const key = logoutBtn.getAttribute("data-i18n");
      logoutBtn.textContent = t(key);
    }
  }

  handleScroll() {
    window.addEventListener("scroll", () => {
      const navbar = document.getElementById("mainNavbar");
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
      }
    });
  }
}

// ============================================
// FOOTER COMPONENT
// ============================================

class FooterComponent {
  constructor() {
    this.render();
  }

  render() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-col">
                            <h4>2Brother's Coffee</h4>
                            <p>Premium green beans & roasted coffee export from Indonesia. Direct trade, premium quality.</p>
                        </div>
                        <div class="footer-col">
                            <h4 data-i18n="footerQuickLinks">Quick Links</h4>
                            <p><a href="index.html" data-i18n="navHome">Home</a></p>
                            <p><a href="coffee.html" data-i18n="navCoffee">Coffee</a></p>
                            <p><a href="export-process.html" data-i18n="navExport">Export</a></p>
                            <p><a href="about.html" data-i18n="navAbout">About</a></p>
                            <p><a href="contact.html" data-i18n="navContact">Contact</a></p>
                        </div>
                        <div class="footer-col">
                            <h4 data-i18n="footerContact">Contact</h4>
                            <p>Email: export@2brothers.coffee</p>
                            <p>WhatsApp: +62 812 3456 7890</p>
                            <p>Medan, North Sumatra</p>
                        </div>
                        <div class="footer-col">
                            <h4 data-i18n="footerFollow">Follow Us</h4>
                            <div class="social-links">
                                <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
                                <a href="https://linkedin.com" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2026 2Brother's Coffee. <span data-i18n="footerRights">All rights reserved.</span></p>
                    </div>
                </div>
            </footer>
        `;
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  new NavbarComponent();
  new FooterComponent();
});
