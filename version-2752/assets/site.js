document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === heroIndex);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === heroIndex);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showHero(i);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var searchInput = document.getElementById('siteSearch');
  var yearFilter = document.getElementById('yearFilter');
  var categoryFilter = document.getElementById('categoryFilter');
  var grid = document.getElementById('movieGrid') || document.body;
  var count = document.getElementById('resultCount');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.movie-card, .rank-row'));

  function applyFilter() {
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var category = categoryFilter ? categoryFilter.value : '';
    var visible = 0;

    items.forEach(function (item) {
      var hay = [
        item.getAttribute('data-title') || '',
        item.getAttribute('data-region') || '',
        item.getAttribute('data-genre') || '',
        item.getAttribute('data-category') || '',
        item.getAttribute('data-year') || ''
      ].join(' ').toLowerCase();
      var ok = true;

      if (q && hay.indexOf(q) === -1) {
        ok = false;
      }

      if (year && item.getAttribute('data-year') !== year) {
        ok = false;
      }

      if (category && item.getAttribute('data-category') !== category) {
        ok = false;
      }

      item.classList.toggle('is-hidden-by-filter', !ok);

      if (ok) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = '共 ' + visible + ' 部';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilter);
  }
});
