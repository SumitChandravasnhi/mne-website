document.addEventListener("DOMContentLoaded", () => {

  /* ── Active nav link ──────────────────────────────────────── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ── Scroll reveal ───────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sr').forEach(el => io.observe(el));

  /* ── Contact form ────────────────────────────────────────── */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = {
        name:    form.name.value,
        email:   form.email.value,
        subject: form.subject ? form.subject.value : '',
        message: form.message.value
      };

      try {
        const res = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          showToast("✓  Message sent — we'll be in touch shortly.");
          form.reset();
        } else {
          showToast("Something went wrong. Please try again.");
        }
      } catch {
        showToast("Network error. Please try again.");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  /* ── Toast helper ────────────────────────────────────────── */
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
});
