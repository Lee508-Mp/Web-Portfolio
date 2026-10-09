/* ==========================================================
   ICT251 Activity 3 | js/script.js
   Four features:
     1. Contact form validation and preview (compulsory)
     2. Mobile navigation button
     3. Light / dark theme switch
     4. Photo gallery viewer (Previous / Next)
   The file is loaded with "defer", so the HTML is already parsed
   by the time this code runs and every element can be found.
   ========================================================== */

'use strict';

// Tells the CSS that JavaScript is running, so the gallery can show one photo at a time.
document.documentElement.classList.add('js');

/** Short helper: find the first element that matches a CSS selector. */
function $(selector, scope = document) {
  return scope.querySelector(selector);
}


/* ----------------------------------------------------------
   FEATURE 1: Contact form validation and preview
   ---------------------------------------------------------- */

// Letters/numbers, one @, then a domain with at least one dot and a 2+ letter ending.
const EMAIL_PATTERN = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;

/** Each checker returns an error message, or '' when the value is fine. */
function checkName(value) {
  // trim() removes spaces at both ends, so "   " becomes "" and is rejected.
  return value.trim() === '' ? 'Enter your name.' : '';
}

function checkEmail(value) {
  const email = value.trim();
  if (email === '') return 'Enter your email address.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter an email in the form name@example.com.';
  return '';
}

function checkMessage(value) {
  return value.trim() === '' ? 'Write a message.' : '';
}

/** Shows (or clears) the error under one field and marks the field for screen readers. */
function showFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  input.classList.toggle('is-invalid', message !== '');
}

/** Builds the validated-data summary. Uses textContent so typed text can never run as HTML. */
function renderPreview(container, entries) {
  container.textContent = '';                       // clear any earlier preview

  const heading = document.createElement('h3');
  heading.textContent = 'Validation passed';

  const note = document.createElement('p');
  note.textContent = 'Your entries passed the checks. This is a local preview only; no message was sent or delivered.';

  const list = document.createElement('dl');
  entries.forEach(function (entry) {
    const term = document.createElement('dt');
    term.textContent = entry.label;
    const detail = document.createElement('dd');
    detail.textContent = entry.value;
    list.append(term, detail);
  });

  container.append(heading, note, list);
  container.hidden = false;
  container.focus();                                // moves screen-reader users to the result
}

/** Connects the form's events: submit, typing, and reset. */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  // An array of field descriptions lets one loop handle all three fields.
  const fields = [
    { label: 'Name',    input: $('#contact-name'),    error: $('#name-error'),    check: checkName },
    { label: 'Email',   input: $('#contact-email'),   error: $('#email-error'),   check: checkEmail },
    { label: 'Message', input: $('#contact-message'), error: $('#message-error'), check: checkMessage }
  ];
  const status = $('#form-status');
  const preview = $('#form-preview');

  form.addEventListener('submit', function (event) {
    event.preventDefault();                         // keep everything local: no page reload, nothing sent

    let firstInvalid = null;
    fields.forEach(function (field) {
      const message = field.check(field.input.value);
      showFieldError(field.input, field.error, message);
      if (message !== '' && firstInvalid === null) firstInvalid = field.input;
    });

    if (firstInvalid !== null) {
      status.textContent = 'Some fields need fixing. Check the messages below each field.';
      preview.hidden = true;
      firstInvalid.focus();
      return;
    }

    status.textContent = '';
    renderPreview(preview, fields.map(function (field) {
      return { label: field.label, value: field.input.value.trim() };
    }));
  });

  // Once a field has been flagged, re-check it as the visitor types so the message disappears when fixed.
  fields.forEach(function (field) {
    field.input.addEventListener('input', function () {
      if (field.input.classList.contains('is-invalid')) {
        showFieldError(field.input, field.error, field.check(field.input.value));
      }
    });
  });

  form.addEventListener('reset', function () {
    fields.forEach(function (field) { showFieldError(field.input, field.error, ''); });
    status.textContent = '';
    preview.hidden = true;
    preview.textContent = '';
  });
}


/* ----------------------------------------------------------
   FEATURE 2: Mobile navigation button
   ---------------------------------------------------------- */
function initMobileNav() {
  const toggle = $('#nav-toggle');
  const nav = $('#site-nav');
  if (!toggle || !nav) return;
  const label = $('.nav-toggle__label', toggle);

  /** Opens or closes the menu and keeps the button's state in sync (class, aria-expanded, label). */
  function setOpen(isOpen) {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    label.textContent = isOpen ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Choosing a link closes the menu so the section is not hidden behind it.
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  // Escape closes the menu and returns focus to the button.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // If the window becomes wide (the icon rail takes over), reset the menu state.
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (event) {
    if (event.matches) setOpen(false);
  });
}


/* ----------------------------------------------------------
   FEATURE 3: Light / dark theme switch
   ---------------------------------------------------------- */
function initThemeSwitch() {
  const button = $('#theme-toggle');
  if (!button) return;
  const label = $('#theme-label');
  const iconUse = $('use', button);
  const STORAGE_KEY = 'portfolio-theme';

  /** Reads the saved choice. Storage can be blocked, so failure is handled quietly. */
  function loadSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (error) {
      return null;
    }
  }

  /** Sets data-theme on <html>; the CSS variables do the rest. Also updates the button. */
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    label.textContent = isDark ? 'Light mode' : 'Dark mode';
    iconUse.setAttribute('href', isDark ? '#i-sun' : '#i-moon');
  }

  // Start with the saved choice, or the visitor's system preference.
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(loadSavedTheme() || (systemPrefersDark ? 'dark' : 'light'));

  button.addEventListener('click', function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Saving is optional, so ignore the error.
    }
  });
}


/* ----------------------------------------------------------
   FEATURE 4: Photo gallery viewer
   ---------------------------------------------------------- */
function initGallery() {
  const photos = Array.from(document.querySelectorAll('.gallery__item'));   // array of <figure> elements
  const prevButton = $('#gallery-prev');
  const nextButton = $('#gallery-next');
  const status = $('#gallery-status');
  if (photos.length === 0 || !prevButton || !nextButton || !status) return;

  let current = 0;

  /** Shows one photo (with its caption) and updates the counter and button states. */
  function showPhoto(index) {
    // Clamp the index so it can never go before the first or after the last photo.
    current = Math.max(0, Math.min(photos.length - 1, index));

    photos.forEach(function (photo, position) {
      photo.classList.toggle('is-active', position === current);
    });
    status.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;

    // Boundary cases: nothing before the first photo or after the last.
    prevButton.disabled = current === 0;
    nextButton.disabled = current === photos.length - 1;

    // A disabled button cannot keep keyboard focus, so hand it to the other button.
    if (prevButton.disabled && document.activeElement === prevButton) nextButton.focus();
    if (nextButton.disabled && document.activeElement === nextButton) prevButton.focus();
  }

  prevButton.addEventListener('click', function () { showPhoto(current - 1); });
  nextButton.addEventListener('click', function () { showPhoto(current + 1); });

  showPhoto(0);
}


/* ----------------------------------------------------------
   Start everything
   ---------------------------------------------------------- */
initContactForm();
initMobileNav();
initThemeSwitch();
initGallery();
