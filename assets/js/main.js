// ============================================================
// Tom De Lille — small UI behaviours
// ============================================================

// Header shadow on scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile nav toggle (legacy, in case .nav-toggle still exists)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// Holistic mobile menu — 2-line toggle + fullpage overlay
const mToggle = document.querySelector('.m-toggle');
const mMenu   = document.querySelector('.m-menu');
if (mToggle && mMenu) {
  const setOpen = (open) => {
    mToggle.classList.toggle('open', open);
    mMenu.classList.toggle('open', open);
    mToggle.setAttribute('aria-expanded', String(open));
    mMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };
  mToggle.addEventListener('click', () => setOpen(!mToggle.classList.contains('open')));
  // Close when a menu link is clicked
  mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mToggle.classList.contains('open')) setOpen(false);
  });
}

// Mobile dropdown
document.querySelectorAll('.nav-dropdown-toggle').forEach(t => {
  t.addEventListener('click', e => {
    if (window.innerWidth > 980) return;
    e.preventDefault();
    t.parentElement.classList.toggle('open');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  });
});

// Reveal on scroll — also lifts ".section-head" inside the same parent
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll('.section-head').forEach(s => s.classList.add('in'));
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Section-head reveal independently
const ioHead = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      ioHead.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-head').forEach(el => ioHead.observe(el));

// Magnetic CTA — subtle pull toward cursor on dark buttons
const magnets = document.querySelectorAll('.btn-primary, .btn-block, .btn-accent');
const lerp = (a, b, t) => a + (b - a) * t;
magnets.forEach(el => {
  let raf = null;
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  const animate = () => {
    current.x = lerp(current.x, target.x, 0.18);
    current.y = lerp(current.y, target.y, 0.18);
    el.style.transform = `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px)`;
    if (Math.abs(current.x - target.x) > 0.05 || Math.abs(current.y - target.y) > 0.05) {
      raf = requestAnimationFrame(animate);
    } else {
      raf = null;
    }
  };
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    target.x = mx * 0.22;
    target.y = my * 0.32;
    if (!raf) raf = requestAnimationFrame(animate);
  });
  el.addEventListener('mouseleave', () => {
    target.x = 0;
    target.y = 0;
    if (!raf) raf = requestAnimationFrame(animate);
  });
});

// Contact form — submit via fetch to /api/contact, show inline success/error
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.contact-submit');
  const errorEl   = contactForm.querySelector('.contact-error');
  const successEl = document.querySelector('.contact-success');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Versturen…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(contactForm),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        contactForm.hidden = true;
        if (successEl) {
          successEl.hidden = false;
          successEl.classList.add('in');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error(result.error || 'Verzending mislukt.');
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message + ' Bel direct op 050 62 15 67.';
        errorEl.hidden = false;
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

// Slow image-shift on hero photo when no native scroll-timeline
if (!CSS.supports('animation-timeline: scroll()')) {
  const photo = document.querySelector('.hero-photo .frame-image-wide img');
  if (photo) {
    photo.style.transform = 'scale(1.04)';
    document.addEventListener('scroll', () => {
      const y = window.scrollY;
      const offset = Math.max(-30, Math.min(30, y * 0.05));
      photo.style.transform = `translateY(${offset}px) scale(1.04)`;
    }, { passive: true });
  }
}
