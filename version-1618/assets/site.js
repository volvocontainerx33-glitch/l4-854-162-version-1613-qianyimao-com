(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
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
          dot.setAttribute('aria-pressed', dotIndex === current ? 'true' : 'false');
        });
      }

      function play() {
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
          play();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          play();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          play();
        });
      });

      show(0);
      play();
    });

    document.querySelectorAll('[data-catalog]').forEach(function (catalog) {
      var input = catalog.querySelector('[data-search-input]');
      var category = catalog.querySelector('[data-category-filter]');
      var year = catalog.querySelector('[data-year-filter]');
      var cards = Array.prototype.slice.call(catalog.querySelectorAll('[data-movie-card]'));
      var empty = catalog.querySelector('[data-empty-state]');

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var categoryValue = category ? category.value : '';
        var yearValue = year ? year.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var cardCategory = card.getAttribute('data-category') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var matchQuery = !query || haystack.indexOf(query) !== -1;
          var matchCategory = !categoryValue || cardCategory === categoryValue;
          var matchYear = !yearValue || cardYear === yearValue;
          var showCard = matchQuery && matchCategory && matchYear;

          card.classList.toggle('hidden-by-filter', !showCard);

          if (showCard) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      if (category) {
        category.addEventListener('change', apply);
      }

      if (year) {
        year.addEventListener('change', apply);
      }
    });
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById('moviePlayer');
  var mask = document.querySelector('[data-player-mask]');
  var attached = false;
  var hls = null;

  if (!video || !source) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    attached = true;
  }

  function start() {
    attach();

    if (mask) {
      mask.classList.add('is-hidden');
    }

    video.controls = true;

    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (mask) {
          mask.classList.remove('is-hidden');
        }
      });
    }
  }

  if (mask) {
    mask.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (mask) {
      mask.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
