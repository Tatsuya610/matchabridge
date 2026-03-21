/* =============================================================
   Matcha Bridge — shared header / footer injection
   Usage: add <div id="site-header"></div> and
              <div id="site-footer"></div> to each inner page,
          then load this script before </body>.
   ============================================================= */

(function () {

  var isLegacyScriptsPage = window.location.pathname.indexOf('/scripts/') !== -1;
  var prefix = isLegacyScriptsPage ? '../' : '';

  var HEADER = `
  <header>
    <div class="header-container">
      <a href="${prefix}index.html" class="logo" aria-label="Matcha Bridge home">
        <img src="${prefix}assets/logo.png" alt="Matcha Bridge" loading="eager" decoding="async">
      </a>
      <div class="header-right">
        <nav>
          <a href="${prefix}index.html#story">Stories</a>
          <a href="${prefix}index.html#why">Why Us</a>
          <a href="${prefix}index.html#process">The Craft</a>
        </nav>
        <div class="social-links">
          <a href="https://instagram.com/matcha_bridge" target="_blank" rel="noopener noreferrer" title="Follow on Instagram" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  </header>`;

  var FOOTER = `
  <footer>
    <div class="footer-container">
      <div class="footer-section">
        <h4>Matcha Bridge</h4>
        <a href="${prefix}index.html#founder-message">About Us</a>
        <a href="${prefix}contact.html">Contact</a>
      </div>
      <div class="footer-section">
        <h4>For Cafes</h4>
        <a href="${prefix}signin.html">Sign in</a>
        <a href="${prefix}contact.html#wholesale-inquiry">Wholesale Inquiry</a>
      </div>
      <div class="footer-section">
        <h4>Company</h4>
        <a href="${prefix}privacy.html">Privacy Policy</a>
        <a href="${prefix}terms.html">Terms of Service</a>
        <a href="${prefix}shipping.html">Shipping Info</a>
      </div>
    </div>
    <div class="footer-bottom" id="footer-bottom-text">
      &copy; 2026 Matcha Bridge Inc. All rights reserved.<br>
      <span class="footer-tagline">Connecting cafes directly with Japanese tea farms.</span>
    </div>
  </footer>`;

  function injectHeader() {
    var el = document.getElementById('site-header');
    if (el) el.outerHTML = HEADER;
  }

  function injectFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var extra = el.getAttribute('data-note') || '';
    el.outerHTML = FOOTER;
    if (extra) {
      var bottom = document.getElementById('footer-bottom-text');
      if (bottom) {
        bottom.appendChild(document.createElement('br'));
        var note = document.createElement('span');
        note.textContent = extra;
        bottom.appendChild(note);
      }
    }
  }

  injectHeader();
  injectFooter();

})();
