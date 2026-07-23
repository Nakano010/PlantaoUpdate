// ─── Menu "Mais" (bottom sheet do app) ───
function initAppSheet() {
  const sheet = document.getElementById('appSheet');
  const backdrop = document.getElementById('sheetBackdrop');
  const openBtn = document.getElementById('tabMais');
  const closeBtn = document.getElementById('sheetClose');
  if (!sheet || !backdrop || !openBtn) return;

  function abrirSheet() {
    sheet.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      sheet.classList.add('show');
      backdrop.classList.add('show');
    });
    document.body.classList.add('sheet-open');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function fecharSheet() {
    sheet.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.classList.remove('sheet-open');
    openBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { sheet.hidden = true; backdrop.hidden = true; }, 300);
  }

  openBtn.addEventListener('click', () => {
    const aberto = sheet.classList.contains('show');
    aberto ? fecharSheet() : abrirSheet();
  });
  backdrop.addEventListener('click', fecharSheet);
  if (closeBtn) closeBtn.addEventListener('click', fecharSheet);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('show')) fecharSheet();
  });
  // fecha o sheet ao navegar por um dos links dentro dele
  sheet.querySelectorAll('a.sheet-link').forEach(link => {
    link.addEventListener('click', fecharSheet);
  });
}

// ─── Navbar sombra ao rolar ───
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Revelar elementos ao rolar ───
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal, .step-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('step-item')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
          : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ─── Controle de tamanho de fonte (acessibilidade) ───
  const tamanhos = ['normal', 'grande', 'maior'];
  let atual = localStorage.getItem('plantao-fonte') || 'normal';
  aplicarFonte(atual);

  function aplicarFonte(tamanho) {
    document.documentElement.setAttribute('data-fonte', tamanho);
    localStorage.setItem('plantao-fonte', tamanho);
  }

  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.fontDir, 10) || 0;
      let i = tamanhos.indexOf(document.documentElement.getAttribute('data-fonte') || 'normal');
      i = Math.max(0, Math.min(i + dir, tamanhos.length - 1));
      aplicarFonte(tamanhos[i]);
    });
  });

  // ─── Inicializa o menu "Mais" (bottom sheet do app) ───
  initAppSheet();

  // ─── Contador animado (home) ───
  function animateCounter(el, target) {
    let current = 0;
    const step = target / 60;
    const suffix = el.dataset.suffix || '';
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
    }, 25);
  }
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, num);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  // ─── Formulário de reporte (sem backend — apenas simulação visual) ───
  const reportForm = document.getElementById('reportForm');
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('reportStatus');
      status.textContent = 'Registro recebido nesta demonstração. Ainda não há envio real: a integração com a equipe de suporte será feita em uma próxima etapa.';
      status.classList.add('show');
      reportForm.reset();
    });
  }

  // ─── Login / Cadastro (sem backend — apenas demonstração de layout) ───
  const loginForm = document.getElementById('loginForm');
  const cadastroForm = document.getElementById('cadastroForm');
  [loginForm, cadastroForm].forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.auth-status');
      if (status) {
        status.textContent = 'Esta tela ainda é apenas uma demonstração visual. O acesso real será conectado em uma próxima etapa.';
        status.classList.add('show');
      }
    });
  });

  const tabEntrar = document.getElementById('tabEntrar');
  const tabCriar = document.getElementById('tabCriar');
  const painelEntrar = document.getElementById('painelEntrar');
  const painelCriar = document.getElementById('painelCriar');
  if (tabEntrar && tabCriar) {
    tabEntrar.addEventListener('click', () => {
      tabEntrar.classList.add('active');
      tabCriar.classList.remove('active');
      painelEntrar.classList.add('active');
      painelCriar.classList.remove('active');
    });
    tabCriar.addEventListener('click', () => {
      tabCriar.classList.add('active');
      tabEntrar.classList.remove('active');
      painelCriar.classList.add('active');
      painelEntrar.classList.remove('active');
    });
  }
});
