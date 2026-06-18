(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initCatalogFilters();
    initPlayer();
  });

  function initMobileMenu() {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var opened = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      toggle.textContent = opened ? '×' : '☰';
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        restart();
      });
    });
    restart();
  }

  function initCatalogFilters() {
    var search = document.querySelector('.catalog-search');
    var select = document.querySelector('.catalog-category');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var pills = Array.prototype.slice.call(document.querySelectorAll('.filter-pill'));
    var empty = document.querySelector('.empty-state');
    if (!cards.length || (!search && !select && !pills.length)) {
      return;
    }
    var activeFilter = 'all';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var query = normalize(search ? search.value : '');
      var category = select ? select.value : activeFilter;
      if (activeFilter !== 'all') {
        category = activeFilter;
      }
      var visible = 0;
      cards.forEach(function (card) {
        var data = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-meta'),
          card.textContent
        ].join(' '));
        var cardCategory = card.getAttribute('data-category') || '';
        var okQuery = !query || data.indexOf(query) !== -1;
        var okCategory = category === 'all' || cardCategory === category;
        var show = okQuery && okCategory;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (search) {
      search.addEventListener('input', apply);
    }
    if (select) {
      select.addEventListener('change', function () {
        activeFilter = select.value;
        pills.forEach(function (pill) {
          pill.classList.toggle('active', pill.getAttribute('data-filter') === activeFilter);
        });
        apply();
      });
    }
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        activeFilter = pill.getAttribute('data-filter') || 'all';
        pills.forEach(function (item) {
          item.classList.toggle('active', item === pill);
        });
        if (select) {
          select.value = activeFilter;
        }
        apply();
      });
    });
  }

  function initPlayer() {
    var video = document.querySelector('.movie-player');
    if (!video) {
      return;
    }
    var shell = document.querySelector('.video-shell');
    var overlay = document.querySelector('.player-overlay');
    var stream = video.getAttribute('data-stream');
    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (prepared || !stream) {
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return;
      }
      video.src = stream;
    }

    function play() {
      prepare();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    prepare();
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    if (shell) {
      shell.addEventListener('click', function (event) {
        if (event.target === overlay || overlay && overlay.contains(event.target)) {
          return;
        }
        if (video.paused) {
          play();
        }
      });
    }
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
