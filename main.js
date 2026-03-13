/* ═══════════════════════════════════════════════════════════
   MAIN.JS — AkbarStudio Portfolio
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DARK / LIGHT MODE TOGGLE ─────────────────────────── */
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  // Apply saved preference on load
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });


  // ==============================
  // FITUR 2: COUNTER
  // ==============================
  let count = 0;
  const angkaDisplay  = document.querySelector('#angka-counter');
  const pesanDisplay  = document.querySelector('#counter-pesan');
  const btnTambah     = document.querySelector('#btn-tambah');
  const btnKurang     = document.querySelector('#btn-kurang');

  function updatePesan(n) {
    if (n === 0)      pesanDisplay.textContent = 'Yuk mulai minum air!';
    else if (n < 4)   pesanDisplay.textContent = 'Kurang minum nih...';
    else if (n < 8)   pesanDisplay.textContent = 'Lumayan, terus tambah! 💧';
    else              pesanDisplay.textContent = 'Keren! Sudah cukup minum air hari ini! 🎉';
  }

  function updateWarna(n) {
    angkaDisplay.classList.remove('warna-merah', 'warna-kuning', 'warna-biru', 'warna-hijau');
    if (n === 0)      angkaDisplay.classList.add('warna-merah');
    else if (n < 4)   angkaDisplay.classList.add('warna-kuning');
    else if (n < 8)   angkaDisplay.classList.add('warna-biru');
    else              angkaDisplay.classList.add('warna-hijau');
  }

  function bump() {
    angkaDisplay.classList.remove('bump');
    void angkaDisplay.offsetWidth;
    angkaDisplay.classList.add('bump');
    setTimeout(() => angkaDisplay.classList.remove('bump'), 150);
  }

  if (btnTambah) {
    btnTambah.addEventListener('click', function () {
      count++;
      angkaDisplay.textContent = count;
      bump();
      updatePesan(count);
      updateWarna(count);
      btnKurang.disabled = false;
    });
  }

  if (btnKurang) {
    btnKurang.disabled = true;
    updateWarna(0);
    btnKurang.addEventListener('click', function () {
      if (count > 0) {
        count--;
        angkaDisplay.textContent = count;
        bump();
        updatePesan(count);
        updateWarna(count);
        if (count === 0) btnKurang.disabled = true;
      }
    });
  }


  /* ── ACTIVE NAV LINK ON SCROLL ────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top    = section.offsetTop - 90;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll);


  /* ── NAVBAR HIDE / SHOW ON SCROLL ─────────────────────── */
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });


  /* ── SKILL BAR ANIMATION ON SCROLL (IntersectionObserver) */
  const skillSection = document.querySelector('.skills');
  const skillBars    = document.querySelectorAll('.skill-progress');

  if (skillSection) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            bar.style.width = bar.style.width; // trigger reflow
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(skillSection);
  }


  // ==============================
  // FITUR 3: VALIDASI FORM
  // ==============================
  const btnKirim     = document.querySelector('#btn-kirim');
  const inputNama    = document.querySelector('#input-nama');
  const inputEmail   = document.querySelector('#input-email');
  const inputPesan   = document.querySelector('#input-pesan');
  const formFeedback = document.querySelector('#form-feedback');

  function tampilkanPesan(teks, tipe) {
    formFeedback.textContent = teks;
    formFeedback.className = 'feedback ' + tipe;
  }

  function isEmailValid(email) {
    return email.includes('@') && email.includes('.');
  }

  function setInputError(el, isError) {
    el.classList.toggle('input-error', isError);
  }

  if (btnKirim) {
    btnKirim.addEventListener('click', function () {
      const nama  = inputNama.value.trim();
      const email = inputEmail.value.trim();
      const pesan = inputPesan.value.trim();

      // Reset error state
      [inputNama, inputEmail, inputPesan].forEach(el => setInputError(el, false));

      // Validasi: field kosong
      if (nama === '' || email === '' || pesan === '') {
        if (nama === '')  setInputError(inputNama, true);
        if (email === '') setInputError(inputEmail, true);
        if (pesan === '') setInputError(inputPesan, true);
        tampilkanPesan('⚠️ Semua field harus diisi!', 'error');
        return;
      }

      // Validasi: format email
      if (!isEmailValid(email)) {
        setInputError(inputEmail, true);
        tampilkanPesan('⚠️ Format email tidak valid! Contoh: nama@email.com', 'error');
        return;
      }

      // Jika semua valid
      tampilkanPesan('✅ Pesan berhasil dikirim! Terima kasih, ' + nama + '!', 'success');
      inputNama.value  = '';
      inputEmail.value = '';
      inputPesan.value = '';
    });

    // Hapus error saat user mulai mengetik
    [inputNama, inputEmail, inputPesan].forEach(el => {
      el.addEventListener('input', function () {
        setInputError(el, false);
        if (formFeedback.classList.contains('error')) {
          formFeedback.className = 'feedback hidden';
        }
      });
    });
  }


  /* ── SCROLL REVEAL ANIMATION ──────────────────────────── */
  const revealElements = document.querySelectorAll(
    '.skill-card, .service-card, .portfolio-item, .testimonial-card, .stat-item'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('hidden-before-reveal');
    revealObserver.observe(el);
  });


  /* ── CONTACT FORM SUBMIT ──────────────────────────────── */
  const form = document.querySelector('.contact__form form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const original = btn.textContent;

      btn.textContent  = '✅ Pesan Terkirim!';
      btn.disabled     = true;
      btn.style.opacity = '0.8';

      setTimeout(() => {
        btn.textContent  = original;
        btn.disabled     = false;
        btn.style.opacity = '1';
        form.reset();
      }, 3000);
    });
  }


  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
