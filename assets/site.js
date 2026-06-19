(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll("[data-global-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = "./search.html";

        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }

        window.location.href = target;
      });
    });

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var index = 0;
      var timer = null;

      function show(next) {
        if (!slides.length) {
          return;
        }

        index = (next + slides.length) % slides.length;
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
        }, 5600);
      }

      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          play();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          play();
        });
      });

      show(0);
      play();
    }

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    document.querySelectorAll("[data-filter-toolbar]").forEach(function (toolbar) {
      var grid = toolbar.parentElement ? toolbar.parentElement.querySelector("[data-filterable]") : null;
      var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]")) : [];
      var search = toolbar.querySelector("[data-card-search]");
      var selects = Array.prototype.slice.call(toolbar.querySelectorAll("[data-card-select]"));
      var empty = toolbar.parentElement ? toolbar.parentElement.querySelector("[data-empty-state]") : null;
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";

      if (search && initialQuery) {
        search.value = initialQuery;
      }

      function run() {
        var query = normalize(search ? search.value : "");
        var shown = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-filter"));
          var ok = !query || text.indexOf(query) !== -1;

          selects.forEach(function (select) {
            var key = select.getAttribute("data-card-select");
            var value = normalize(select.value);
            var cardValue = normalize(card.getAttribute("data-" + key));

            if (value && cardValue.indexOf(value) === -1) {
              ok = false;
            }
          });

          card.hidden = !ok;

          if (ok) {
            shown += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", shown === 0);
        }
      }

      if (search) {
        search.addEventListener("input", run);
      }

      selects.forEach(function (select) {
        select.addEventListener("change", run);
      });

      run();
    });

    var topButton = document.querySelector(".back-top");

    if (topButton) {
      window.addEventListener("scroll", function () {
        topButton.classList.toggle("is-visible", window.scrollY > 420);
      });

      topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });
})();
