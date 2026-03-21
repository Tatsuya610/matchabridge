// Contact page interactions: Formspree endpoint binding and hash scrolling offset.
(function () {
  var formspreeEndpoint = document.body.getAttribute('data-formspree-endpoint');
  document.querySelectorAll('.formspree-form').forEach(function (form) {
    form.action = formspreeEndpoint;
  });

  function getHeaderOffset() {
    var header = document.querySelector('header');
    return (header ? header.offsetHeight : 0) + 16;
  }

  function scrollToHash(hash, smooth) {
    var target = document.querySelector(hash);
    if (!target) return;
    var y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', hash);
      scrollToHash(hash, true);
    });
  });

  if (window.location.hash) {
    window.requestAnimationFrame(function () {
      scrollToHash(window.location.hash, false);
    });
  }
})();
