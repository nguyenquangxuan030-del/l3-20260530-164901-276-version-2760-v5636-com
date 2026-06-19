document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("siteHeader");
    var menuButton = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("mobileMenu");
    var backTop = document.querySelector(".back-top");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
        if (backTop) {
            backTop.classList.toggle("show", window.scrollY > 320);
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader);

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            var opened = mobileMenu.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
            menuButton.textContent = opened ? "×" : "☰";
        });
    }

    if (backTop) {
        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    setupHero();
    setupFiltering();
    setupPlayer();
});

function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    if (!slides.length) {
        return;
    }
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            showSlide(index + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
        }
    }

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(index - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(index + 1);
            start();
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
            start();
        });
    });

    start();
}

function setupFiltering() {
    var filterInput = document.querySelector(".local-filter");
    var sortSelect = document.querySelector(".sort-select");
    var grid = document.querySelector(".sortable-grid");
    if (!grid) {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    if (filterInput && initialQuery) {
        filterInput.value = initialQuery;
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function filterCards() {
        var q = normalize(filterInput ? filterInput.value : "");
        Array.prototype.forEach.call(grid.children, function (card) {
            var text = normalize([
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.genre,
                card.dataset.category,
                card.textContent
            ].join(" "));
            card.classList.toggle("hidden-card", q && text.indexOf(q) === -1);
        });
    }

    function sortCards() {
        if (!sortSelect) {
            return;
        }
        var value = sortSelect.value;
        var cards = Array.prototype.slice.call(grid.children);
        cards.sort(function (a, b) {
            if (value === "year-asc") {
                return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
            }
            if (value === "title-asc") {
                return (a.dataset.title || "").localeCompare(b.dataset.title || "", "zh-Hans-CN");
            }
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        });
        cards.forEach(function (card) {
            grid.appendChild(card);
        });
    }

    if (filterInput) {
        filterInput.addEventListener("input", filterCards);
    }
    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            sortCards();
            filterCards();
        });
    }
    sortCards();
    filterCards();
}

function setupPlayer() {
    var video = document.getElementById("movieVideo");
    var overlay = document.getElementById("playOverlay");
    var message = document.getElementById("playerMessage");
    if (!video || !overlay || typeof moviePlayerUrl === "undefined") {
        return;
    }

    var hlsReady = false;

    function showMessage(text) {
        if (message) {
            message.textContent = text || "";
        }
    }

    function attachVideo() {
        if (hlsReady) {
            return Promise.resolve();
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = moviePlayerUrl;
            hlsReady = true;
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(moviePlayerUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                hlsReady = true;
            });
            hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                if (data && data.fatal) {
                    showMessage("加载遇到问题，请稍后重试");
                }
            });
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
                window.setTimeout(resolve, 1500);
            });
        }
        video.src = moviePlayerUrl;
        hlsReady = true;
        return Promise.resolve();
    }

    function playVideo() {
        showMessage("");
        attachVideo().then(function () {
            overlay.classList.add("hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    overlay.classList.remove("hidden");
                    showMessage("点击播放器继续播放");
                });
            }
        });
    }

    overlay.addEventListener("click", playVideo);
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener("play", function () {
        overlay.classList.add("hidden");
    });
    video.addEventListener("pause", function () {
        if (!video.ended) {
            overlay.classList.remove("hidden");
        }
    });
}
