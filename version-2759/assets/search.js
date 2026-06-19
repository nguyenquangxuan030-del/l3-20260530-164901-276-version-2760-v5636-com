(function () {
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var count = document.getElementById('searchCount');
  if (!input || !results || !window.MOVIE_INDEX) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function createCard(movie) {
    var article = document.createElement('article');
    article.className = 'movie-card';
    article.innerHTML = [
      '<a class="poster-frame" href="' + movie.url + '">',
      '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy" onerror="handlePosterError(this)">',
      '<span class="poster-glow"></span>',
      '</a>',
      '<div class="movie-card-body">',
      '<div class="movie-meta-line"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>' + movie.type + '</span></div>',
      '<h3><a href="' + movie.url + '">' + movie.title + '</a></h3>',
      '<p>' + movie.oneLine + '</p>',
      '<div class="tag-row"><span>' + movie.genre + '</span></div>',
      '</div>'
    ].join('');
    return article;
  }

  function render() {
    var keyword = input.value.trim().toLowerCase();
    var source = window.MOVIE_INDEX;
    var list = keyword
      ? source.filter(function (movie) {
          return [movie.title, movie.region, movie.type, movie.genre, movie.tags].join(' ').toLowerCase().indexOf(keyword) >= 0;
        })
      : source.slice(0, 80);
    results.innerHTML = '';
    list.slice(0, 160).forEach(function (movie) {
      results.appendChild(createCard(movie));
    });
    if (count) {
      count.textContent = keyword ? '找到 ' + list.length + ' 条相关内容' : '显示热门内容';
    }
  }

  input.addEventListener('input', render);
  render();
})();
