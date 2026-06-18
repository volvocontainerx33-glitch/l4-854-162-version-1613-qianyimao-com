(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    var items = Array.prototype.slice.call(scope.querySelectorAll("[data-search-item]"));
    var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-button]"));
    var activeCategory = "all";

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      items.forEach(function (item) {
        var text = item.getAttribute("data-search") || "";
        var category = item.getAttribute("data-category") || "";
        var matchesText = !query || text.indexOf(query) !== -1;
        var matchesCategory = activeCategory === "all" || category === activeCategory;
        item.classList.toggle("is-hidden", !(matchesText && matchesCategory));
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-filter-button") || "all";
        buttons.forEach(function (current) {
          current.classList.toggle("is-active", current === button);
        });
        apply();
      });
    });
  });
})();

function initMoviePlayer(src, videoId) {
  var video = document.getElementById(videoId);

  if (!video) {
    return;
  }

  var shell = video.closest("[data-player-shell]");
  var overlay = shell ? shell.querySelector(".player-overlay") : null;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src;
  } else if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: false
    });
    hls.loadSource(src);
    hls.attachMedia(video);
  } else {
    video.src = src;
  }

  function startPlayback() {
    if (overlay) {
      overlay.setAttribute("hidden", "hidden");
    }
    if (shell) {
      shell.classList.add("is-playing");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        if (overlay) {
          overlay.removeAttribute("hidden");
        }
        if (shell) {
          shell.classList.remove("is-playing");
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.setAttribute("hidden", "hidden");
    }
    if (shell) {
      shell.classList.add("is-playing");
    }
  });

  video.addEventListener("pause", function () {
    if (shell) {
      shell.classList.remove("is-playing");
    }
  });
}
