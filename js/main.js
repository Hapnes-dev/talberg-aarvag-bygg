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

  /* Tilbudsskjema -> sendes til e-post via Formsubmit (ingen egen server).
     Mottakeren styres av SKJEMA_EPOST. Bytt denne til kundens e-post når
     testen er bekreftet. Formsubmit sender en engangs aktiverings-e-post til
     en ny mottakeradresse første gang den brukes. */
  var SKJEMA_EPOST = 'thomaskvalvaag@hotmail.com';
  var SKJEMA_ENDPOINT = 'https://formsubmit.co/ajax/' + SKJEMA_EPOST;

  var form = document.getElementById('tilbudsskjema');

  if (form) {
    var status = form.querySelector('.form-status');
    var sendKnapp = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* honningfelle: et skjult felt som kun bots fyller ut */
      var honey = form.elements['_honey'];
      if (honey && honey.value) { return; }

      var navn = form.navn.value.trim();
      var telefon = form.telefon.value.trim();

      if (!navn || !telefon) {
        status.textContent = 'Fyll inn navn og telefonnummer, så kan vi kontakte deg.';
        status.classList.add('error');
        (!navn ? form.navn : form.telefon).focus();
        return;
      }

      status.classList.remove('error');
      status.textContent = 'Sender …';
      var opprinneligTekst = sendKnapp.textContent;
      sendKnapp.disabled = true;
      sendKnapp.textContent = 'Sender …';

      var data = {
        Navn: navn,
        Telefon: telefon,
        'E-post': form.epost.value.trim() || '(ikke oppgitt)',
        Gjelder: form.type.value,
        Beskrivelse: form.melding.value.trim() || '(ingen beskrivelse)',
        _subject: 'Ny forespørsel fra nettsiden – ' + form.type.value,
        _template: 'table',
        _captcha: 'false'
      };

      fetch(SKJEMA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          if (j && (j.success === 'true' || j.success === true)) {
            form.reset();
            status.classList.remove('error');
            status.textContent = 'Takk! Forespørselen er sendt – vi tar kontakt så snart vi kan.';
          } else {
            throw new Error('ikke levert');
          }
        })
        .catch(function () {
          status.classList.add('error');
          status.textContent = 'Beklager, noe gikk galt. Prøv igjen, eller ring oss på 93 80 47 00.';
        })
        .then(function () {
          sendKnapp.disabled = false;
          sendKnapp.textContent = opprinneligTekst;
        });
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
