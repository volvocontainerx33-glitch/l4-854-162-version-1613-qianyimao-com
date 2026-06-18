
(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-menu-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
        panel.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                panel.classList.remove("is-open");
            });
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function (event) {
                event.preventDefault();
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                play();
            });
        });
        if (prev) {
            prev.addEventListener("click", function (event) {
                event.preventDefault();
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener("click", function (event) {
                event.preventDefault();
                show(index + 1);
                play();
            });
        }
        play();
    }

    function initFilters() {
        document.querySelectorAll("[data-card-scope]").forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var year = scope.querySelector("[data-year-filter]");
            var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-chip-filter]"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
            var chipValue = "";
            if (!cards.length) {
                var siblingList = scope.parentElement ? scope.parentElement.querySelectorAll("[data-movie-card]") : [];
                cards = Array.prototype.slice.call(siblingList);
            }
            if (!cards.length) {
                cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
            }

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilter() {
                var query = normalize(input ? input.value : "");
                var selectedYear = year ? year.value : "";
                cards.forEach(function (card) {
                    var title = normalize(card.getAttribute("data-title"));
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardCategory = card.getAttribute("data-category") || "";
                    var matchedText = !query || title.indexOf(query) !== -1;
                    var matchedYear = !selectedYear || cardYear === selectedYear;
                    var matchedChip = !chipValue || cardCategory === chipValue;
                    card.hidden = !(matchedText && matchedYear && matchedChip);
                });
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }
            if (year) {
                year.addEventListener("change", applyFilter);
            }
            chips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    chipValue = chip.getAttribute("data-chip-filter") || "";
                    chips.forEach(function (item) {
                        item.classList.toggle("is-active", item === chip);
                    });
                    applyFilter();
                });
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
