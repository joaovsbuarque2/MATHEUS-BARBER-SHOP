import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SCHEDULE = {
  0: { open: 9 * 60, close: 12 * 60 },
  1: { open: 13 * 60 + 30, close: 20 * 60 },
  2: { open: 9 * 60, close: 20 * 60 },
  3: { open: 9 * 60, close: 20 * 60 },
  4: { open: 9 * 60, close: 20 * 60 },
  5: { open: 9 * 60, close: 20 * 60 },
  6: { open: 8 * 60, close: 20 * 60 },
};

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h${String(minutes).padStart(2, '0')}`;
}

function getSaoPauloTime() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const weekday = parts.find((part) => part.type === 'weekday')?.value;
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);
    const day = DAY_KEYS.indexOf(weekday);

    if (day >= 0 && Number.isFinite(hour) && Number.isFinite(minute)) {
      return { day, minutes: hour * 60 + minute };
    }
  } catch {
    // Timezone data may be unavailable in very old browsers.
  }

  const now = new Date();
  return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
}

function updateScheduleUI() {
  const { day, minutes } = getSaoPauloTime();
  const today = SCHEDULE[day] || SCHEDULE[1];
  const isOpen = minutes >= today.open && minutes < today.close;
  const range = `${formatTime(today.open)} — ${formatTime(today.close)}`;
  const status = isOpen ? `Aberto agora · até ${formatTime(today.close)}` : 'Fechado agora';

  document.querySelectorAll('[data-open-status]').forEach((element) => {
    element.textContent = status;
  });

  document.querySelectorAll('.status-pill').forEach((pill) => {
    pill.classList.toggle('is-open', isOpen);
  });

  document.querySelectorAll('[data-day]').forEach((row) => {
    const isToday = Number(row.dataset.day) === day;
    row.classList.toggle('is-today', isToday);

    if (isToday) {
      row.setAttribute('aria-current', 'date');
    } else {
      row.removeAttribute('aria-current');
    }
  });

  document.querySelectorAll('[data-hero-hours]').forEach((element) => {
    element.textContent = isOpen
      ? `Aberto agora · até ${formatTime(today.close)}`
      : `Hoje · ${range}`;
  });

  document.querySelectorAll('[data-location-today]').forEach((element) => {
    element.textContent = `Hoje · ${range}`;
  });

  document.querySelectorAll('[data-contact-hours]').forEach((element) => {
    element.textContent = isOpen ? status : `Hoje · ${range}`;
  });
}

function initReducedMotionProgress() {
  const progress = document.querySelector('[data-progress]');
  if (!progress) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
  });

  timeline
    .from('.hero__media', { opacity: 0, xPercent: 3, duration: 1.3, ease: 'power2.out' }, 0)
    .from('.hero__media img', { scale: 1.14, duration: 1.8, ease: 'power2.out' }, 0)
    .from('[data-hero="eyebrow"]', { y: 16, autoAlpha: 0, duration: 0.8 }, 0.35)
    .from(
      '[data-hero-line]',
      { yPercent: 115, duration: 1.15, stagger: 0.11, ease: 'expo.out' },
      0.45,
    )
    .from('[data-hero="lead"]', { y: 22, autoAlpha: 0, duration: 0.9 }, 0.82)
    .from(
      '[data-hero="actions"] .btn',
      { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
      0.98,
    )
    .from('[data-hero="meta"]', { y: 16, autoAlpha: 0, duration: 0.8 }, 1.12)
    .from('[data-hero="scroll"]', { autoAlpha: 0, duration: 0.8 }, 1.25)
    .from('.hero__rail', { autoAlpha: 0, duration: 0.9 }, 1.2);
}

function initScrollAnimations() {
  const progress = document.querySelector('[data-progress]');

  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25,
      },
    });
  }

  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 34,
      autoAlpha: 0,
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 89%',
        once: true,
      },
    });
  });

  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    if (!items.length) return;

    gsap.from(items, {
      y: 42,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.085,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 86%',
        once: true,
      },
    });
  });

  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero__media img');

  if (hero && heroImage) {
    const media = gsap.matchMedia();

    media.add('(min-width: 901px)', () => {
      gsap.to(heroImage, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  const contactImage = document.querySelector('.contact__bg img');

  if (contactImage) {
    gsap.fromTo(
      contactImage,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.section--contact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export function initInteractions() {
  updateScheduleUI();
  window.setInterval(updateScheduleUI, 60_000);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    initReducedMotionProgress();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  initHeroAnimation();
  initScrollAnimations();
}
