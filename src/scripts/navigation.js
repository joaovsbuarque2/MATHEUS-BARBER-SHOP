const DESKTOP_QUERY = '(min-width: 1021px)';

export function initNavigation() {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLabel = menuToggle?.querySelector('.menu-toggle__label');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const whatsappFloat = document.querySelector('.whatsapp-float');

  const setScrollState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  setScrollState();
  window.addEventListener('scroll', setScrollState, { passive: true });

  let menuOpen = false;

  const setBackgroundInert = (inert) => {
    [main, footer, whatsappFloat].forEach((element) => {
      if (element) element.inert = inert;
    });
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle || menuOpen) return;

    menuOpen = true;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    header?.classList.add('is-menu-open');
    document.body.classList.add('no-scroll');
    setBackgroundInert(true);

    if (menuLabel) menuLabel.textContent = 'Fechar';

    const firstLink = mobileMenu.querySelector('a[href]');
    window.setTimeout(() => {
      if (menuOpen) firstLink?.focus();
    }, 450);
  };

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!mobileMenu || !menuToggle || !menuOpen) return;

    menuOpen = false;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    header?.classList.remove('is-menu-open');
    document.body.classList.remove('no-scroll');
    setBackgroundInert(false);

    if (menuLabel) menuLabel.textContent = 'Menu';
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle?.addEventListener('click', () => {
    if (menuOpen) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  mobileMenu?.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', (event) => {
    if (menuOpen && event.target.closest('a[href]')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      closeMenu({ restoreFocus: true });
    }
  });

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches && menuOpen) closeMenu();
  });

  const yearElement = document.querySelector('[data-year]');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  const navLinks = Array.from(document.querySelectorAll('.site-nav .nav-link'));
  const sections = Array.from(document.querySelectorAll('main section[id]')).filter((section) =>
    navLinks.some((link) => link.getAttribute('href') === `#${section.id}`),
  );

  if ('IntersectionObserver' in window && sections.length) {
    const activeSection = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.add(entry.target.id);
          } else {
            activeSection.delete(entry.target.id);
          }
        });

        let current = null;
        sections.forEach((section) => {
          if (activeSection.has(section.id)) current = section.id;
        });

        navLinks.forEach((link) => {
          link.classList.toggle('is-active', current === link.getAttribute('href')?.slice(1));
        });
      },
      {
        rootMargin: '-38% 0px -54% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }
}
