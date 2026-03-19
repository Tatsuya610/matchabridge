/* =============================================================
   Matcha Bridge — shared header / footer injection
   Usage: add <div id="site-header"></div> and
              <div id="site-footer"></div> to each inner page,
          then load this script before </body>.
   ============================================================= */

(function () {

  var HEADER = `
  <header>
    <div class="header-container">
      <a href="index.html" class="logo" aria-label="Matcha Bridge home">
        <img src="assets/logo.png" alt="Matcha Bridge" loading="eager" decoding="async">
      </a>
      <div style="display:flex; align-items:center; gap:24px;">
        <div class="social-links">
          <a href="https://instagram.com/matcha_bridge" target="_blank" rel="noopener noreferrer" title="Follow on Instagram" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" title="Follow on TikTok" aria-label="TikTok">
            <i class="fab fa-tiktok"></i>
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
        <a href="index.html#founder-message">About Us</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-section">
        <h4>For Cafes</h4>
        <a href="signin.html">Sign in</a>
        <a href="contact.html#wholesale-inquiry">Wholesale Inquiry</a>
        <a href="cafes.html">Barista Training</a>
      </div>
      <div class="footer-section">
        <h4>Company</h4>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Shipping Info</a>
      </div>
    </div>
    <div class="footer-bottom" id="footer-bottom-text">
      &copy; 2026 Matcha Bridge Inc. All rights reserved.<br>
      <span style="color: #666;">Connecting cafes directly with Japanese tea farms.</span>
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
      if (bottom) bottom.innerHTML += '<br><span style="color:#666;font-size:10px;">' + extra + '</span>';
    }
  }

  injectHeader();
  injectFooter();

})();
