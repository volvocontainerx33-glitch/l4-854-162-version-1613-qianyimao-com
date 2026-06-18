(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".mobile-toggle");
    var menu = document.querySelector(".mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function startHero() {
      if (slides.length < 2) {
        return;
      }

      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function resetHero() {
      if (timer) {
        window.clearInterval(timer);
      }
      startHero();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        resetHero();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        resetHero();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
        resetHero();
      });
    });

    showSlide(0);
    startHero();

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));

    filterPanels.forEach(function (panel) {
      var gridId = panel.getAttribute("data-grid") || "movieGrid";
      var grid = document.getElementById(gridId);
      var wrapper = panel.closest(".filter-wrap") || document.body;
      var search = panel.querySelector(".js-search");
      var year = panel.querySelector(".js-year");
      var region = panel.querySelector(".js-region");
      var type = panel.querySelector(".js-type");

      function valueOf(node) {
        return node ? node.value.trim().toLowerCase() : "";
      }

      function applyFilter() {
        if (!grid) {
          return;
        }

        var q = valueOf(search);
        var y = valueOf(year);
        var r = valueOf(region);
        var t = valueOf(type);
        var visible = 0;
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".js-card"));

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-tags") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-year") || ""
          ].join(" ").toLowerCase();

          var ok = true;
          ok = ok && (!q || haystack.indexOf(q) !== -1);
          ok = ok && (!y || (card.getAttribute("data-year") || "").toLowerCase() === y);
          ok = ok && (!r || (card.getAttribute("data-region") || "").toLowerCase().indexOf(r) !== -1);
          ok = ok && (!t || (card.getAttribute("data-type") || "").toLowerCase().indexOf(t) !== -1);

          card.style.display = ok ? "" : "none";

          if (ok) {
            visible += 1;
          }
        });

        wrapper.classList.toggle("no-results", visible === 0);
      }

      [search, year, region, type].forEach(function (node) {
        if (node) {
          node.addEventListener("input", applyFilter);
          node.addEventListener("change", applyFilter);
        }
      });
    });
  });
})();
