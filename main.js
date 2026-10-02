/* ============================================================
   BREW HOUSE COFFEE SHOP - main.js
   ============================================================ */
"use strict";

/* --- 1. NAVBAR --- */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", false);
    });
  });
})();

/* --- 2. HERO PARTICLES --- */
(function initParticles() {
  const container = document.getElementById("heroParticles");
  if (!container) return;
  const count = window.innerWidth < 768 ? 18 : 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (4 + Math.random() * 6).toFixed(1);
    const dly = (Math.random() * 6).toFixed(1);
    const dx  = ((Math.random() - 0.5) * 60).toFixed(0);
    const size = (2 + Math.random() * 4).toFixed(1);
    p.style.cssText = "left:" + x + "%;top:" + y + "%;width:" + size + "px;height:" + size + "px;--dur:" + dur + "s;--dly:-" + dly + "s;--dx:" + dx + "px;";
    container.appendChild(p);
  }
})();

/* --- 3. SCROLL ANIMATIONS --- */
(function initScrollAnimations() {
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  elements.forEach(el => observer.observe(el));

  // Score bars
  const scoreObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        scoreObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".score-fill").forEach(bar => scoreObs.observe(bar));
})();

/* --- 4. LAZY LOAD IMAGES --- */
(function initLazyLoad() {
  const imgs = document.querySelectorAll("img[loading=lazy]");
  if (!("IntersectionObserver" in window)) {
    imgs.forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
    return;
  }
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
      } else if (!img.complete) {
        img.classList.add("lazy");
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        img.addEventListener("error", () => img.classList.add("loaded"), { once: true });
      }
      imgObs.unobserve(img);
    });
  }, { rootMargin: "200px 0px" });
  imgs.forEach(img => { if (!img.complete) imgObs.observe(img); });
})();

/* --- 5. TABS DO CARDAPIO --- */
(function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels  = document.querySelectorAll(".tab-panel");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById("panel-" + target);
      if (panel) {
        panel.classList.add("active");
        panel.querySelectorAll("[data-animate]").forEach(el => {
          el.classList.remove("is-visible");
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-visible")));
        });
      }
    });
  });
  // Ativar cards do painel inicial
  const activePanel = document.querySelector(".tab-panel.active");
  if (activePanel) {
    activePanel.querySelectorAll("[data-animate]").forEach(el => el.classList.add("is-visible"));
  }
})();

/* --- 6. FORMULARIO WHATSAPP COM EMOJIS --- */
(function initContactForm() {
  const form = document.getElementById("contatoForm");
  if (!form) return;

  const nomeInput = document.getElementById("nome");
  const telInput  = document.getElementById("telefone");
  const assInput  = document.getElementById("assunto");
  const msgInput  = document.getElementById("mensagem");
  const erroNome  = document.getElementById("erroNome");
  const erroTel   = document.getElementById("erroTelefone");
  const erroMsg   = document.getElementById("erroMensagem");

  function showError(field, el, txt) { field.classList.add("invalid"); el.textContent = txt; el.classList.add("show"); }
  function clearError(field, el) { field.classList.remove("invalid"); el.classList.remove("show"); el.textContent = ""; }

  nomeInput.addEventListener("input", () => { if (nomeInput.value.trim().length >= 2) clearError(nomeInput, erroNome); });
  telInput.addEventListener("input",  () => { if (telInput.value.trim().length >= 8)  clearError(telInput, erroTel); });
  msgInput.addEventListener("input",  () => { if (msgInput.value.trim().length >= 5)  clearError(msgInput, erroMsg); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const nome = nomeInput.value.trim();
    const tel  = telInput.value.trim();
    const ass  = assInput.value;
    const msg  = msgInput.value.trim();

    if (nome.length < 2)                        { showError(nomeInput, erroNome, "Por favor, insira seu nome completo."); valid = false; } else { clearError(nomeInput, erroNome); }
    if (tel.replace(/\D/g,"").length < 8)       { showError(telInput, erroTel, "Por favor, insira um telefone valido."); valid = false; }  else { clearError(telInput, erroTel); }
    if (msg.length < 5)                          { showError(msgInput, erroMsg, "Por favor, escreva sua mensagem."); valid = false; }       else { clearError(msgInput, erroMsg); }
    if (!valid) return;

    const now     = new Date();
    const dataFmt = now.toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric" });
    const horaFmt = now.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });

    const linhas = [
      "\u2615 *MENSAGEM VIA SITE \u2014 BREW HOUSE COFFEE SHOP* \u2615",
      "",
      "\uD83D\uDC64 *Nome:* " + nome,
      "\uD83D\uDCDE *Telefone/WhatsApp:* " + tel,
      ass ? "\uD83D\uDCCB *Assunto:* " + ass : "",
      "",
      "\uD83D\uDCAC *Mensagem:*",
      msg,
      "",
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
      "\uD83D\uDDD3\uFE0F *Data:* " + dataFmt + " \u00E0s " + horaFmt,
      "\uD83C\uDF10 *Origem:* Site Brew House Coffee Shop"
    ].filter(Boolean).join("\n");

    const waNumber = "551141726558";
    const waURL    = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(linhas);

    const btn = document.getElementById("formSubmit");
    const origHTML = btn.innerHTML;
    btn.innerHTML = "\u23F3 Abrindo WhatsApp...";
    btn.disabled = true;

    setTimeout(() => {
      window.open(waURL, "_blank");
      btn.innerHTML = "\u2705 Mensagem enviada! Obrigado, " + nome.split(" ")[0] + "!";
      btn.style.background = "#1ebe5d";
      form.reset();
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.disabled  = false;
        btn.style.background = "";
      }, 4000);
    }, 600);
  });
})();

/* --- 7. SMOOTH SCROLL --- */
(function initSmoothScroll() {
  document.querySelectorAll("a[href^=\"#\"]").forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
    });
  });
})();

/* --- 8. PARALLAX HERO --- */
(function initParallax() {
  const overlay = document.querySelector(".hero-bg-overlay");
  if (!overlay) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const s = window.scrollY;
        if (s < window.innerHeight) overlay.style.transform = "translateY(" + (s * 0.25) + "px)";
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* --- 9. COUNT-UP NOTA --- */
(function initCountUp() {
  const el = document.querySelector(".rating-score");
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    let c = 0;
    const t = 5.0;
    const timer = setInterval(() => {
      c = Math.min(c + t / 40, t);
      el.textContent = c.toFixed(1);
      if (c >= t) clearInterval(timer);
    }, 30);
    obs.disconnect();
  }, { threshold: 0.5 });
  obs.observe(el);
})();

/* --- 10. ACTIVE NAV SECTION --- */
(function initActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const style = document.createElement("style");
  style.textContent = ".nav-link.active-link { color: var(--caramel) !important; } .nav-link.active-link::after { width: 60% !important; }";
  document.head.appendChild(style);
  const navH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - navH() - 60) current = sec.id; });
    navLinks.forEach(link => link.classList.toggle("active-link", link.getAttribute("href") === "#" + current));
  }, { passive: true });
})();
