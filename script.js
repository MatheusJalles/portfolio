/* Interações do portfólio */
const header = document.getElementById('header');
const nav = document.getElementById('main-nav');
const menuButton = document.getElementById('menu-toggle');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.main-nav a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();

/* Carrossel infinito: avança sozinho, pausa no hover e aceita arraste. */
(() => {
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.getElementById('carousel-track');
  if (!viewport || !track) return;

  const originals = Array.from(track.children);
  const total = originals.length;
  const prev = document.getElementById('project-prev');
  const next = document.getElementById('project-next');
  const current = document.getElementById('carousel-current');
  const progress = document.getElementById('carousel-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  track.insertBefore(originals[total - 1].cloneNode(true), originals[0]);
  track.appendChild(originals[0].cloneNode(true));
  let cards = Array.from(track.children);
  let index = 1;
  let timer = null;
  let pointerStart = null;
  let pointerDelta = 0;
  let isDragging = false;

  const stepSize = () => {
    const first = cards[0];
    const styles = getComputedStyle(track);
    return first.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
  };

  function paint(animate = true) {
    const step = stepSize();
    const offset = viewport.clientWidth / 2 - cards[index].getBoundingClientRect().width / 2 - index * step;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(${offset}px,0,0)`;
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    const realIndex = (index - 1 + total) % total;
    current.textContent = String(realIndex + 1).padStart(2, '0');
    progress.style.width = `${((realIndex + 1) / total) * 100}%`;
  }

  function move(direction) {
    if (isDragging) return;
    index += direction;
    paint(true);
  }
  function resetLoop() {
    if (index === 0) index = total;
    else if (index === total + 1) index = 1;
    paint(false);
    requestAnimationFrame(() => { track.style.transition = ''; });
  }
  track.addEventListener('transitionend', resetLoop);
  prev.addEventListener('click', () => { stop(); move(-1); start(); });
  next.addEventListener('click', () => { stop(); move(1); start(); });

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function start() {
    stop();
    if (!reducedMotion && !document.hidden) timer = window.setInterval(() => move(1), 4800);
  }

  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  viewport.addEventListener('pointerdown', event => {
    if (event.target.closest('a,button')) return;
    pointerStart = event.clientX;
    pointerDelta = 0;
    isDragging = true;
    stop();
    viewport.classList.add('dragging');
    track.style.transition = 'none';
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!isDragging || pointerStart === null) return;
    pointerDelta = event.clientX - pointerStart;
    const step = stepSize();
    const offset = viewport.clientWidth / 2 - cards[index].getBoundingClientRect().width / 2 - index * step;
    track.style.transform = `translate3d(${offset + pointerDelta}px,0,0)`;
  });
  function finishDrag() {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('dragging');
    if (Math.abs(pointerDelta) > 45) index += pointerDelta < 0 ? 1 : -1;
    pointerStart = null;
    pointerDelta = 0;
    paint(true);
    start();
  }
  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  window.addEventListener('resize', () => paint(false));

  paint(false);
  start();
})();
