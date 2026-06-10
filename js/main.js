(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* Scroll reveal (respects reduced motion) */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealed = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealed.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealed.forEach(function (el) { io.observe(el); });
  }

  /* Quote form -> opens a pre-filled e-mail draft (no backend needed).
     Swap this for a Formspree/Netlify endpoint when one is set up. */
  var form = document.getElementById('tilbudsskjema');

  if (form) {
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var navn = form.navn.value.trim();
      var telefon = form.telefon.value.trim();

      if (!navn || !telefon) {
        status.textContent = 'Fyll inn navn og telefonnummer, så kan vi kontakte deg.';
        status.classList.add('error');
        (!navn ? form.navn : form.telefon).focus();
        return;
      }

      status.classList.remove('error');

      var emne = 'Forespørsel fra nettsiden: ' + form.type.value;
      var linjer = [
        'Navn: ' + navn,
        'Telefon: ' + telefon,
        'E-post: ' + (form.epost.value.trim() || '-'),
        'Gjelder: ' + form.type.value,
        '',
        form.melding.value.trim()
      ];

      window.location.href = 'mailto:tobiastalberg030505@gmail.com' +
        '?subject=' + encodeURIComponent(emne) +
        '&body=' + encodeURIComponent(linjer.join('\n'));

      status.textContent = 'E-postutkast åpnet – send det fra e-postprogrammet ditt. Du kan også ringe 93 80 47 00.';
    });
  }

  /* Bildegalleri-lysboks */
  var lysboks = document.getElementById('lysboks');
  var galleriKnapper = Array.prototype.slice.call(document.querySelectorAll('.galleri-item'));

  if (lysboks && galleriKnapper.length && typeof lysboks.showModal === 'function') {
    var lbBilde = lysboks.querySelector('img');
    var lbTeller = lysboks.querySelector('.lysboks-teller');
    var aktiv = 0;

    var vis = function (i) {
      aktiv = (i + galleriKnapper.length) % galleriKnapper.length;
      var kilde = galleriKnapper[aktiv].querySelector('img');
      lbBilde.src = kilde.src;
      lbBilde.alt = kilde.alt;
      lbTeller.textContent = (aktiv + 1) + ' / ' + galleriKnapper.length;
    };

    galleriKnapper.forEach(function (knapp, i) {
      knapp.addEventListener('click', function () {
        vis(i);
        lysboks.showModal();
      });
    });

    lysboks.querySelector('.lysboks-lukk').addEventListener('click', function () { lysboks.close(); });
    lysboks.querySelector('.lysboks-forrige').addEventListener('click', function () { vis(aktiv - 1); });
    lysboks.querySelector('.lysboks-neste').addEventListener('click', function () { vis(aktiv + 1); });

    lysboks.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { vis(aktiv - 1); }
      if (e.key === 'ArrowRight') { vis(aktiv + 1); }
    });

    /* klikk utenfor bildet lukker */
    lysboks.addEventListener('click', function (e) {
      if (e.target === lysboks) { lysboks.close(); }
    });
  }

  /* Footer year */
  var aar = document.getElementById('aar');
  if (aar) { aar.textContent = String(new Date().getFullYear()); }
})();
