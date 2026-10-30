import gsap from 'gsap';

export function initGallery() {
  const dialog = document.querySelector('#lightbox');
  const items = Array.from(document.querySelectorAll('[data-gallery-item]'));

  if (!dialog || !items.length) return;

  const image = dialog.querySelector('[data-lightbox-image]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const counter = dialog.querySelector('[data-lightbox-count]');
  const figure = dialog.querySelector('.lightbox__figure');
  const closeButton = dialog.querySelector('[data-lightbox-close]');
  const prevButton = dialog.querySelector('[data-lightbox-prev]');
  const nextButton = dialog.querySelector('[data-lightbox-next]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentIndex = 0;
  let closing = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const formatIndex = (index) => String(index + 1).padStart(2, '0');

  const preload = (index) => {
    const item = items[(index + items.length) % items.length];
    if (!item) return;
    const adjacent = new Image();
    adjacent.src = item.dataset.full || item.getAttribute('href');
  };

  const render = (index, animate = true) => {
    const item = items[index];
    const thumbnail = item.querySelector('img');
    const label = item.dataset.caption || thumbnail?.alt || '';
    const fullSource = item.dataset.full || item.getAttribute('href');

    image.src = fullSource;
    image.alt = thumbnail?.alt || label;

    if (thumbnail?.width && thumbnail?.height) {
      image.width = thumbnail.width;
      image.height = thumbnail.height;
    }

    if (caption) caption.textContent = label;
    if (counter) counter.textContent = `${formatIndex(index)} / ${String(items.length).padStart(2, '0')}`;

    if (!reducedMotion && animate) {
      gsap.fromTo(
        image,
        { opacity: 0, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
      );
    }

    preload(index + 1);
    preload(index - 1);
  };

  const cleanupAfterClose = () => {
    document.body.classList.remove('no-scroll');
    dialog.style.opacity = '';
    closing = false;

    window.requestAnimationFrame(() => {
      items[currentIndex]?.focus({ preventScroll: true });
    });
  };

  const close = () => {
    if (!dialog.open || closing) return;

    if (reducedMotion) {
      dialog.close();
      return;
    }

    closing = true;
    gsap.to(dialog, {
      opacity: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: () => dialog.close(),
    });
    gsap.to(figure, {
      opacity: 0,
      scale: 0.985,
      duration: 0.24,
      ease: 'power2.in',
    });
  };

  const open = (index) => {
    currentIndex = index;
    gsap.set(figure, { clearProps: 'opacity,transform' });
    render(currentIndex, false);

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add('no-scroll');
    }

    if (!reducedMotion) {
      gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        figure,
        { opacity: 0, scale: 0.97, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      );
    }

    closeButton?.focus();
  };

  const goTo = (direction) => {
    currentIndex = (currentIndex + direction + items.length) % items.length;
    render(currentIndex);
  };

  items.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      open(index);
    });
  });

  closeButton?.addEventListener('click', close);
  prevButton?.addEventListener('click', () => goTo(-1));
  nextButton?.addEventListener('click', () => goTo(1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(-1);
    }
  });

  dialog.addEventListener('close', cleanupAfterClose);

  dialog.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true },
  );

  dialog.addEventListener(
    'touchend',
    (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(deltaX < 0 ? 1 : -1);
      }
    },
    { passive: true },
  );
}
