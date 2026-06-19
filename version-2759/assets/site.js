function handlePosterError(image) {
  var parent = image.parentElement;
  if (parent) {
    parent.classList.add('cover-fallback');
  }
}

(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.hero-tab'));
  if (slides.length > 0) {
    var index = 0;
    var showSlide = function (nextIndex) {
      index = nextIndex % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle('active', tabIndex === index);
      });
    };
    tabs.forEach(function (tab, tabIndex) {
      tab.addEventListener('click', function () {
        showSlide(tabIndex);
      });
    });
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }
})();
