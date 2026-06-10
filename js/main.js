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

  /* Footer year */
  var aar = document.getElementById('aar');
  if (aar) { aar.textContent = String(new Date().getFullYear()); }
})();
