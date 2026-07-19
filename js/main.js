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

    /* feltfeil nullstilles når brukeren retter */
    ['navn', 'telefon', 'epost'].forEach(function (n) {
      if (form[n]) {
        form[n].addEventListener('input', function () { this.removeAttribute('aria-invalid'); });
      }
    });

    var feltFeil = function (felt, melding) {
      status.textContent = melding;
      status.classList.add('error');
      felt.setAttribute('aria-invalid', 'true');
      felt.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* honningfelle: et skjult felt som kun bots fyller ut */
      var honey = form.elements['_honey'];
      if (honey && honey.value) { return; }

      var navn = form.navn.value.trim();
      var telefon = form.telefon.value.trim();

      if (!navn) { feltFeil(form.navn, 'Fyll inn navn, så kan vi kontakte deg.'); return; }
      if (!telefon) { feltFeil(form.telefon, 'Fyll inn telefonnummer, så kan vi kontakte deg.'); return; }
      if (form.epost.value.trim() && !form.epost.checkValidity()) {
        feltFeil(form.epost, 'E-postadressen ser ikke riktig ut – sjekk den, eller la feltet stå tomt.');
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

      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var tidsfrist = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;

      fetch(SKJEMA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (r) {
          if (!r.ok) { throw new Error('http ' + r.status); }
          return r.json().catch(function () { return {}; });
        })
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
        .finally(function () {
          if (tidsfrist) { clearTimeout(tidsfrist); }
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
      lysboks.setAttribute('aria-label', 'Bildevisning: ' + kilde.alt);
      lbTeller.textContent = (aktiv + 1) + ' / ' + galleriKnapper.length;
      /* forhåndslast naboene så piltastene føles umiddelbare */
      [aktiv + 1, aktiv - 1].forEach(function (j) {
        var nabo = galleriKnapper[(j + galleriKnapper.length) % galleriKnapper.length].querySelector('img');
        var im = new Image();
        im.src = nabo.src;
      });
    };

    galleriKnapper.forEach(function (knapp, i) {
      var bilde = knapp.querySelector('img');
      if (bilde) { knapp.setAttribute('aria-label', 'Åpne i full størrelse: ' + bilde.alt); }
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
  } else if (galleriKnapper.length) {
    /* fallback uten <dialog>-støtte: åpne bildet i ny fane */
    galleriKnapper.forEach(function (knapp) {
      var bilde = knapp.querySelector('img');
      if (!bilde) { return; }
      knapp.setAttribute('aria-label', 'Åpne i full størrelse: ' + bilde.alt);
      knapp.addEventListener('click', function () { window.open(bilde.src, '_blank', 'noopener'); });
    });
  }

  /* Scrollspy: uthev aktiv seksjon i toppmenyen (kun på forsiden) */
  var navLenker = Array.prototype.slice.call(document.querySelectorAll('.mainnav a[href^="#"]'));

  if (navLenker.length && 'IntersectionObserver' in window) {
    var lenkeForSeksjon = {};
    navLenker.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) { lenkeForSeksjon[sec.id] = a; }
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        navLenker.forEach(function (a) {
          a.classList.remove('is-active');
          a.removeAttribute('aria-current');
        });
        lenkeForSeksjon[e.target.id].classList.add('is-active');
        lenkeForSeksjon[e.target.id].setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    Object.keys(lenkeForSeksjon).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* Footer year */
  var aar = document.getElementById('aar');
  if (aar) { aar.textContent = String(new Date().getFullYear()); }
})();
