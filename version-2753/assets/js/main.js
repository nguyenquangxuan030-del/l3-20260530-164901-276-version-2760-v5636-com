(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = qs(".menu-toggle");
    var mobile = qs(".mobile-nav");

    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var isOpen = mobile.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    qsa("[data-hero]").forEach(function (hero) {
      var slides = qsa("[data-hero-slide]", hero);
      var dots = qsa("[data-hero-dot]", hero);
      var prev = qs("[data-hero-prev]", hero);
      var next = qs("[data-hero-next]", hero);
      var index = 0;
      var timer = null;

      function activate(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function play() {
        stop();
        timer = window.setInterval(function () {
          activate(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          activate(i);
          play();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          activate(index - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          activate(index + 1);
          play();
        });
      }

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", play);
      activate(0);
      play();
    });

    qsa("[data-search-panel]").forEach(function (panel) {
      var input = qs(".site-search-input", panel);
      var empty = qs("[data-empty-state]", panel);
      var section = panel.parentElement || document;
      var cards = qsa("[data-card]", section);
      var buttons = qsa("[data-filter-value]", panel);
      var activeFilter = "all";

      function apply() {
        var query = text(input ? input.value : "");
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = text([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" "));
          var matchesText = !query || haystack.indexOf(query) !== -1;
          var matchesFilter = activeFilter === "all" || haystack.indexOf(text(activeFilter)) !== -1;
          var show = matchesText && matchesFilter;
          card.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var queryParam = params.get("q");
        if (queryParam) {
          input.value = queryParam;
        }
        input.addEventListener("input", apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter-value") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          apply();
        });
      });

      apply();
    });
  });
})();
