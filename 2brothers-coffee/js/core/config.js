// ============================================
// 2BROTHER'S COFFEE - CONFIGURATION
// Dark Mode & Language Settings
// ============================================

// Site Configuration
const siteConfig = {
  name: "2Brother's Coffee",
  tagline: "Premium Green Beans & Roasted Coffee from Indonesia",
  email: "export@2brothers.coffee",
  whatsapp: "+6281234567890",
  phone: "+62 21 1234 5678",
  address: "Medan, North Sumatra, Indonesia",
  socialMedia: {
    instagram: "https://instagram.com/2brothers.coffee",
    linkedin: "https://linkedin.com/company/2brothers-coffee",
    facebook: "https://facebook.com/2brothers.coffee",
  },
};

// ============================================
// DARK MODE MANAGEMENT
// ============================================

class DarkModeManager {
  constructor() {
    this.isDark = localStorage.getItem("theme") === "dark";
    this.init();
  }

  init() {
    // Apply saved theme or system preference
    if (this.isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      !localStorage.getItem("theme")
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
      this.isDark = true;
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.toggle(e.matches);
        }
      });
  }

  toggle() {
    this.isDark = !this.isDark;
    const theme = this.isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateToggleButton();
  }

  updateToggleButton() {
    const toggleBtn = document.getElementById("darkModeToggle");
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = this.isDark ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }

  getCurrentTheme() {
    return this.isDark ? "dark" : "light";
  }
}

// ============================================
// LANGUAGE MANAGEMENT (ID/EN)
// ============================================

// Translations
const translations = {
  id: {
    // Navbar
    navHome: "Beranda",
    navCoffee: "Kopi",
    navExport: "Ekspor",
    navAbout: "Tentang",
    navContact: "Kontak",
    navLogin: "Masuk",

    // Hero
    heroBadge: "Eksportir Kopi Premium Indonesia",
    heroTitle: "Direct Trade.<br>Kualitas Premium.",
    heroDesc:
      "Green beans dan kopi sangrai dari kebun terbaik di Sumatra, Aceh, dan Jawa. Kualitas ekspor dengan traceability penuh.",
    heroBtnSample: "Request Sample",
    heroBtnProducts: "Lihat Produk",

    // Stats
    statsTons: "Ton Diekspor",
    statsCountries: "Negara",
    statsBuyers: "Buyer Puas",
    statsQuality: "Garansi Kualitas",

    // Why Us
    whyTitle: "Kenapa Memilih Kami",
    whyDesc:
      "Kami memberikan keunggulan dari kebun hingga pelabuhan, memastikan standar kualitas tertinggi untuk bisnis Anda.",
    whyFarmTitle: "Langsung dari Kebun",
    whyFarmDesc:
      "Tanpa perantara. Kami bekerja langsung dengan petani untuk harga yang adil dan kualitas konsisten.",
    whyQualityTitle: "Kontrol Kualitas",
    whyQualityDesc:
      "Diuji di laboratorium untuk kadar air, cacat, dan ukuran. Setiap batch memenuhi standar ekspor.",
    whyShippingTitle: "Pengiriman Global",
    whyShippingDesc:
      "FOB dari Belawan & Tanjung Priok. Dokumentasi cepat dan mitra logistik terpercaya.",

    // Products
    productsTitle: "Pilihan Premium Kami",
    productsDesc: "Bersumber langsung dari wilayah kopi terbaik Indonesia",
    btnRequestSample: "Request Sample",

    // CTA
    ctaTitle: "Siap Mendapatkan Kopi Premium?",
    ctaDesc:
      "Request sample atau dapatkan penawaran untuk pesanan besar. Tim kami siap membantu Anda.",
    ctaBtn: "Hubungi Kami",

    // Footer
    footerQuickLinks: "Tautan Cepat",
    footerContact: "Kontak",
    footerFollow: "Ikuti Kami",
    footerRights: "Hak Cipta Dilindungi.",

    // Contact Page
    contactName: "Nama",
    contactEmail: "Email",
    contactMessage: "Pesan",
    contactSend: "Kirim Pesan",

    // Login
    loginTitle: "Selamat Datang Kembali",
    loginEmail: "Alamat Email",
    loginPassword: "Kata Sandi",
    loginBtn: "Masuk",
    loginForgot: "Lupa kata sandi?",
    loginNoAccount: "Tidak punya akun?",
    loginRegister: "Daftar",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardWelcome: "Selamat datang",
    dashboardOrders: "Pesanan Saya",
    dashboardTracking: "Lacak Pesanan",
    dashboardProfile: "Profil Saya",
    dashboardLogout: "Keluar",
  },
  en: {
    // Navbar
    navHome: "Home",
    navCoffee: "Coffee",
    navExport: "Export",
    navAbout: "About",
    navContact: "Contact",
    navLogin: "Login",

    // Hero
    heroBadge: "Premium Indonesian Coffee Exporter",
    heroTitle: "Direct Trade.<br>Premium Quality.",
    heroDesc:
      "Green beans and roasted coffee from the finest farms in Sumatra, Aceh, and Java. Export-grade quality with full traceability.",
    heroBtnSample: "Request Sample",
    heroBtnProducts: "View Products",

    // Stats
    statsTons: "Tons Exported",
    statsCountries: "Countries",
    statsBuyers: "Happy Buyers",
    statsQuality: "Quality Guarantee",

    // Why Us
    whyTitle: "Why Choose Us",
    whyDesc:
      "We deliver excellence from farm to port, ensuring the highest quality standards for your business.",
    whyFarmTitle: "Direct from Farm",
    whyFarmDesc:
      "No middlemen. We work directly with farmers to ensure fair prices and consistent quality.",
    whyQualityTitle: "Quality Control",
    whyQualityDesc:
      "Lab-tested for moisture, defects, and screen size. Every batch meets export standards.",
    whyShippingTitle: "Global Shipping",
    whyShippingDesc:
      "FOB from Belawan & Tanjung Priok. Fast documentation and reliable logistics partners.",

    // Products
    productsTitle: "Our Premium Selection",
    productsDesc: "Directly sourced from Indonesia's best coffee regions",
    btnRequestSample: "Request Sample",

    // CTA
    ctaTitle: "Ready to Source Premium Coffee?",
    ctaDesc:
      "Request a sample or get a quote for bulk orders. Our team is ready to assist you.",
    ctaBtn: "Contact Us Today",

    // Footer
    footerQuickLinks: "Quick Links",
    footerContact: "Contact",
    footerFollow: "Follow Us",
    footerRights: "All rights reserved.",

    // Contact Page
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send Message",

    // Login
    loginTitle: "Welcome Back",
    loginEmail: "Email Address",
    loginPassword: "Password",
    loginBtn: "Login",
    loginForgot: "Forgot password?",
    loginNoAccount: "Don't have an account?",
    loginRegister: "Sign up",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardWelcome: "Welcome",
    dashboardOrders: "My Orders",
    dashboardTracking: "Track Order",
    dashboardProfile: "My Profile",
    dashboardLogout: "Logout",
  },
};

// Language Manager Class
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("language") || "en";
    this.init();
  }

  init() {
    this.applyTranslations();
    this.updateLanguageButtons();
  }

  setLanguage(lang) {
    if (lang !== "id" && lang !== "en") return;
    this.currentLang = lang;
    localStorage.setItem("language", lang);
    this.applyTranslations();
    this.updateLanguageButtons();
  }

  applyTranslations() {
    const t = translations[this.currentLang];
    if (!t) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (t[key]) {
        // Handle HTML content
        if (t[key].includes("<br>")) {
          element.innerHTML = t[key];
        } else {
          element.textContent = t[key];
        }
      }
    });

    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", this.currentLang);

    // Dispatch custom event for other components to react
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { lang: this.currentLang },
      }),
    );
  }

  updateLanguageButtons() {
    const idBtn = document.getElementById("langID");
    const enBtn = document.getElementById("langEN");

    if (idBtn && enBtn) {
      if (this.currentLang === "id") {
        idBtn.classList.add("active");
        enBtn.classList.remove("active");
      } else {
        enBtn.classList.add("active");
        idBtn.classList.remove("active");
      }
    }
  }

  translate(key) {
    return translations[this.currentLang]?.[key] || key;
  }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize managers when DOM is ready
let darkModeManager;
let languageManager;

document.addEventListener("DOMContentLoaded", () => {
  darkModeManager = new DarkModeManager();
  languageManager = new LanguageManager();

  // Expose for global use
  window.darkModeManager = darkModeManager;
  window.languageManager = languageManager;
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    siteConfig,
    DarkModeManager,
    LanguageManager,
    translations,
  };
}
