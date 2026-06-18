(function () {
  var header = document.querySelector('[data-header]');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var input = document.querySelector('[data-filter-input]');
      var region = document.querySelector('[data-filter-region]');
      var year = document.querySelector('[data-filter-year]');
      var type = document.querySelector('[data-filter-type]');
      var count = document.querySelector('[data-filter-count]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

      function normalized(value) {
        return String(value || '').trim().toLowerCase();
      }

      function applyFilters() {
        var query = normalized(input && input.value);
        var selectedRegion = normalized(region && region.value);
        var selectedYear = normalized(year && year.value);
        var selectedType = normalized(type && type.value);
        var visible = 0;

        cards.forEach(function (card) {
          var searchText = normalized(card.getAttribute('data-search'));
          var cardRegion = normalized(card.getAttribute('data-region'));
          var cardYear = normalized(card.getAttribute('data-year'));
          var cardType = normalized(card.getAttribute('data-type'));
          var matchesQuery = !query || searchText.indexOf(query) !== -1;
          var matchesRegion = !selectedRegion || cardRegion === selectedRegion;
          var matchesYear = !selectedYear || cardYear === selectedYear;
          var matchesType = !selectedType || cardType === selectedType;
          var matches = matchesQuery && matchesRegion && matchesYear && matchesType;

          card.hidden = !matches;
          if (matches) {
            visible += 1;
          }
        });

        scope.classList.toggle('is-empty', visible === 0);
        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部影片';
        }
      }

      [input, region, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });

      applyFilters();
    });
  }

  function initializeHlsVideo(video) {
    var src = video.getAttribute('data-hls-src');
    if (!src || video.getAttribute('data-hls-ready') === 'true') {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      video._hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      video.src = src;
    }

    video.setAttribute('data-hls-ready', 'true');
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-hls-src]'));
    players.forEach(function (video) {
      var frame = video.closest('.player-frame');
      var overlay = frame ? frame.querySelector('[data-player-overlay]') : null;

      function playVideo() {
        initializeHlsVideo(video);
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            video.controls = true;
          });
        }
      }

      if (overlay) {
        overlay.addEventListener('click', playVideo);
      }

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });

      video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove('is-hidden');
        }
      });
    });
  }

  function setupImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img'));
    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.style.opacity = '0';
      }, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (header) {
      document.body.classList.add('has-header');
    }

    setupHeroCarousel();
    setupFilters();
    setupPlayers();
    setupImageFallbacks();
  });
})();
