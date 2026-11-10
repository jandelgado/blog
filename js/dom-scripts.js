/* Expandable sections */
(function () {
  function toggle (button, target) {
    var expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    target.hidden = !target.hidden;
  }

  var expanders = document.querySelectorAll('[data-expands]');

  Array.prototype.forEach.call(expanders, function (expander) {
    var target = document.getElementById(expander.getAttribute('data-expands'));

    expander.addEventListener('click', function () {
      toggle(expander, target);
    })
  })
}());


  /* Add "link here" links to <h2> headings */
  (function () {
    var headings = document.querySelectorAll('main > h2');

    Array.prototype.forEach.call(headings, function (heading) {
      var id = heading.getAttribute('id');

      if (id) {
        var newHeading = heading.cloneNode(true);
        newHeading.setAttribute('tabindex', '-1');

        var container = document.createElement('div');
        container.setAttribute('class', 'h2-container');
        container.appendChild(newHeading);

        heading.parentNode.insertBefore(container, heading);

        var link = document.createElement('a');
        link.setAttribute('href', '#' + id);
        link.innerHTML = '<svg aria-hidden="true" class="link-icon" viewBox="0 0 50 50" focusable="false"> <use xlink:href="#link"></use> </svg>';

        container.appendChild(link);

        heading.parentNode.removeChild(heading);
      }
    })
  }());


/* Copy-to-clipboard buttons for code blocks */
(function () {
  function makeCopyButton(codeEl) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', function () {
      var text = codeEl.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.classList.add('copied');
          setTimeout(function () { btn.classList.remove('copied'); }, 2000);
        }).catch(function () { fallbackCopy(text, btn); });
      } else {
        fallbackCopy(text, btn);
      }
    });

    return btn;
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    btn.classList.add('copied');
    setTimeout(function () { btn.classList.remove('copied'); }, 2000);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.highlight'), function (highlight) {
    var code = highlight.querySelector('code');
    if (code) {
      highlight.appendChild(makeCopyButton(code));
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('pre'), function (pre) {
    if (pre.closest('.highlight')) return;
    var code = pre.querySelector('code');
    if (!code) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'pre-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(makeCopyButton(code));
  });
}());

/* Enable scrolling by keyboard of code samples */
(function () {
  var codeBlocks = document.querySelectorAll('pre, .code-annotated');

  Array.prototype.forEach.call(codeBlocks, function (block) {
    if (block.querySelector('code')) {
      block.setAttribute('role', 'region');
      block.setAttribute('aria-label', 'code sample');
      if (block.scrollWidth > block.clientWidth) {
        block.setAttribute('tabindex', '0');
      }
    }
  });
}());

/* Theme toggle: Switch between amber and green phosphor themes */
(function () {
  var toggleLink = document.getElementById('theme-toggle');
  var THEME_KEY = 'vcr-blog-theme';
  var THEME_GREEN = 'vt100';
  var THEME_AMBER = 'vt220';

  /**
   * Get the current theme from localStorage, defaulting to amber
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || THEME_AMBER;
    } catch (e) {
      // localStorage might be disabled (private browsing, etc.)
      return THEME_AMBER;
    }
  }

  /**
   * Save the theme preference to localStorage
   */
  function persistTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Update the link text to show the opposite theme name
   */
  function updateLinkText(currentTheme) {
    if (toggleLink) {
      // Show the name of the theme we'll switch TO
      toggleLink.textContent = currentTheme === THEME_AMBER ? THEME_GREEN : THEME_AMBER;
    }
  }

  /**
   * Apply the green theme by adding the theme-green class to body
   */
  function applyGreenTheme() {
    document.body.classList.add('theme-green');
    updateLinkText(THEME_GREEN);
  }

  /**
   * Apply the amber theme by removing the theme-green class from body
   */
  function applyAmberTheme() {
    document.body.classList.remove('theme-green');
    updateLinkText(THEME_AMBER);
  }

  /**
   * Toggle between themes
   */
  function toggleTheme(e) {
    if (e) {
      e.preventDefault();
    }

    var currentTheme = getStoredTheme();
    var newTheme = currentTheme === THEME_AMBER ? THEME_GREEN : THEME_AMBER;

    if (newTheme === THEME_GREEN) {
      applyGreenTheme();
    } else {
      applyAmberTheme();
    }

    persistTheme(newTheme);
  }

  /**
   * Initialize theme on page load
   */
  function initializeTheme() {
    var storedTheme = getStoredTheme();

    if (storedTheme === THEME_GREEN) {
      applyGreenTheme();
    } else {
      applyAmberTheme();
    }
  }

  // Set up toggle link click handler
  if (toggleLink) {
    toggleLink.addEventListener('click', toggleTheme);
  }

  /**
   * Show content after theme is applied to prevent FOUC
   */
  function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
  }

  // Initialize theme when DOM is ready
  window.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    showContent();
  });

}());

/* CRT Effect toggle: Switch between CRT and TFT display modes */
(function () {
  var toggleLink = document.getElementById('crt-toggle');
  var CRT_KEY = 'vcr-blog-crt';
  var MODE_CRT = 'crt';
  var MODE_TFT = 'tft';

  /**
   * Get the current CRT mode from localStorage, defaulting to TFT (disabled)
   */
  function getStoredMode() {
    try {
      return localStorage.getItem(CRT_KEY) || MODE_TFT;
    } catch (e) {
      return MODE_TFT;
    }
  }

  /**
   * Save the CRT mode preference to localStorage
   */
  function persistMode(mode) {
    try {
      localStorage.setItem(CRT_KEY, mode);
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Update the link text to show the opposite mode name
   */
  function updateLinkText(currentMode) {
    if (toggleLink) {
      // Show the name of the mode we'll switch TO
      toggleLink.textContent = currentMode === MODE_CRT ? MODE_TFT : MODE_CRT;
    }
  }

  /**
   * Enable CRT effects by removing the crt-off class from body
   */
  function enableCRT() {
    document.body.classList.remove('crt-off');
    updateLinkText(MODE_CRT);
  }

  /**
   * Disable CRT effects by adding the crt-off class to body
   */
  function disableCRT() {
    document.body.classList.add('crt-off');
    updateLinkText(MODE_TFT);
  }

  /**
   * Toggle between CRT and TFT modes
   */
  function toggleCRT(e) {
    if (e) {
      e.preventDefault();
    }

    var currentMode = getStoredMode();
    var newMode = currentMode === MODE_CRT ? MODE_TFT : MODE_CRT;

    if (newMode === MODE_CRT) {
      enableCRT();
    } else {
      disableCRT();
    }

    persistMode(newMode);
  }

  /**
   * Initialize CRT mode on page load
   */
  function initializeCRT() {
    var storedMode = getStoredMode();

    if (storedMode === MODE_TFT) {
      disableCRT();
    } else {
      enableCRT();
    }
  }

  // Set up toggle link click handler
  if (toggleLink) {
    toggleLink.addEventListener('click', toggleCRT);
  }

  // Initialize CRT mode when DOM is ready
  window.addEventListener('DOMContentLoaded', function () {
    initializeCRT();
  });

}());

