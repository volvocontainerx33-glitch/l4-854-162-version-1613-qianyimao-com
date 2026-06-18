(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function filterCards(root) {
        var input = root.querySelector('[data-filter-input]');
        var year = root.querySelector('[data-year-filter]');
        var sort = root.querySelector('[data-sort-filter]');
        var grid = root.querySelector('[data-card-grid]');
        var empty = root.querySelector('[data-no-results]');

        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));

        function apply() {
            var keyword = input ? normalize(input.value) : '';
            var selectedYear = year ? year.value : '';
            var visible = [];

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardYear = card.getAttribute('data-year') || '';
                var matched = (!keyword || text.indexOf(keyword) !== -1) && (!selectedYear || cardYear === selectedYear);
                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible.push(card);
                }
            });

            if (sort && sort.value) {
                visible.sort(function (a, b) {
                    var ay = Number(a.getAttribute('data-year')) || 0;
                    var by = Number(b.getAttribute('data-year')) || 0;
                    var at = a.getAttribute('data-title') || '';
                    var bt = b.getAttribute('data-title') || '';

                    if (sort.value === 'oldest') {
                        return ay === by ? at.localeCompare(bt, 'zh-CN') : ay - by;
                    }

                    if (sort.value === 'title') {
                        return at.localeCompare(bt, 'zh-CN');
                    }

                    return ay === by ? at.localeCompare(bt, 'zh-CN') : by - ay;
                });

                visible.forEach(function (card) {
                    grid.appendChild(card);
                });
            }

            if (empty) {
                empty.classList.toggle('is-visible', visible.length === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }

        if (year) {
            year.addEventListener('change', apply);
        }

        if (sort) {
            sort.addEventListener('change', apply);
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q && input) {
            input.value = q;
        }

        apply();
    }

    document.querySelectorAll('[data-filter-root]').forEach(filterCards);
})();
