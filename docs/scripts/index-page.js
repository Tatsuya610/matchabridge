// Index page interactions: hero video playlist and in-page smooth scrolling.
(function () {
  var heroLayers = Array.from(document.querySelectorAll('.hero-bg'));
  var heroPlaylist = [
    { src: 'assets/matcha-hero-new.mp4', duration: 4000 },
    { src: 'assets/shading.mp4', duration: 4000 },
    { src: 'assets/hand-picking.mp4', duration: 3000 },
    { src: 'assets/stone-grinding.mp4', duration: 4000 },
    { src: 'assets/match-late.mp4', duration: 3000 }
  ];

  var fadeMs = 1000;
  var activeLayer = 0;
  var activeIndex = 0;
  var heroTimer = null;

  function setVideoSource(video, src) {
    if (video.dataset.currentSrc === src) return;
    video.src = src;
    video.dataset.currentSrc = src;
    video.load();
  }

  function playVideo(video) {
    video.currentTime = 0;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function scheduleNextHeroSwap() {
    clearTimeout(heroTimer);
    var now = heroPlaylist[activeIndex];
    heroTimer = setTimeout(swapHeroVideo, now.duration);
  }

  function swapHeroVideo() {
    if (heroLayers.length < 2 || heroPlaylist.length === 0) return;

    var nextIndex = (activeIndex + 1) % heroPlaylist.length;
    var currentVideo = heroLayers[activeLayer];
    var nextLayer = activeLayer === 0 ? 1 : 0;
    var nextVideo = heroLayers[nextLayer];

    setVideoSource(nextVideo, heroPlaylist[nextIndex].src);
    playVideo(nextVideo);

    nextVideo.classList.add('is-visible');
    currentVideo.classList.remove('is-visible');

    setTimeout(function () {
      currentVideo.pause();
    }, fadeMs + 120);

    activeLayer = nextLayer;
    activeIndex = nextIndex;
    scheduleNextHeroSwap();
  }

  if (heroLayers.length >= 2 && heroPlaylist.length > 0) {
    setVideoSource(heroLayers[0], heroPlaylist[0].src);
    playVideo(heroLayers[0]);
    heroLayers[0].classList.add('is-visible');

    var preloadIndex = heroPlaylist.length > 1 ? 1 : 0;
    setVideoSource(heroLayers[1], heroPlaylist[preloadIndex].src);
    scheduleNextHeroSwap();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!/^#[a-zA-Z0-9_-]+$/.test(href)) return;
      e.preventDefault();
      var target = document.getElementById(href.substring(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
