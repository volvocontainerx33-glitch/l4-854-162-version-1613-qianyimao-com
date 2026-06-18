(function () {
  var movies = window.MOVIE_CATALOG || [];
  var keywordInput = document.getElementById('search-keyword');
  var categorySelect = document.getElementById('search-category');
  var yearSelect = document.getElementById('search-year');
  var sortSelect = document.getElementById('search-sort');
  var results = document.getElementById('search-results');
  var count = document.getElementById('search-count');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQueryValue(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card">' +
      '  <a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '    <span class="badge type-badge">' + escapeHtml(movie.type) + '</span>' +
      '    <span class="badge year-badge">' + escapeHtml(movie.year) + '</span>' +
      '    <span class="play-mask">▶</span>' +
      '  </a>' +
      '  <div class="card-body">' +
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '    <p>' + escapeHtml(movie.oneLine) + '</p>' +
      '    <div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>' +
      '    <div class="tag-row">' + tags + '</div>' +
      '  </div>' +
      '</article>';
  }

  function render() {
    var keyword = (keywordInput.value || '').trim().toLowerCase();
    var category = categorySelect.value;
    var year = yearSelect.value;
    var sort = sortSelect.value;

    var filtered = movies.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        movie.oneLine,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase();

      if (keyword && haystack.indexOf(keyword) === -1) {
        return false;
      }
      if (category && movie.category !== category) {
        return false;
      }
      if (year && String(movie.year) !== year) {
        return false;
      }
      return true;
    });

    filtered.sort(function (a, b) {
      if (sort === 'oldest') {
        return a.year - b.year || a.id.localeCompare(b.id);
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title, 'zh-Hans-CN') || a.id.localeCompare(b.id);
      }
      return b.year - a.year || a.id.localeCompare(b.id);
    });

    count.textContent = '找到 ' + filtered.length + ' 部影片';
    results.innerHTML = filtered.map(movieCard).join('');
  }

  keywordInput.value = getQueryValue('q');
  [keywordInput, categorySelect, yearSelect, sortSelect].forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
})();
