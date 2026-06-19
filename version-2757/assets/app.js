(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var header = qs("[data-header]");
        var toggle = qs("[data-menu-toggle]");
        if (!header || !toggle) {
            return;
        }
        toggle.addEventListener("click", function () {
            header.classList.toggle("is-open");
        });
    }

    function initSiteSearch() {
        qsa("[data-site-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = qs("input[name='q']", form);
                var query = input ? input.value.trim() : "";
                var target = "./search.html";
                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });
    }

    function initBackTop() {
        var button = qs("[data-back-top]");
        if (!button) {
            return;
        }
        function sync() {
            button.classList.toggle("is-visible", window.scrollY > 500);
        }
        window.addEventListener("scroll", sync, { passive: true });
        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        sync();
    }

    function initHeroSlider() {
        var slider = qs("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var panels = qsa("[data-hero-panel]", slider);
        var cards = qsa("[data-hero-card]", slider);
        var images = qsa("[data-hero-bg]", slider);
        var dots = qsa("[data-hero-dot]", slider);
        if (!panels.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + panels.length) % panels.length;
            panels.forEach(function (item, i) {
                item.classList.toggle("is-active", i === index);
            });
            cards.forEach(function (item, i) {
                item.classList.toggle("is-active", i === index);
            });
            images.forEach(function (item, i) {
                item.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (item, i) {
                item.classList.toggle("is-active", i === index);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(i);
                play();
            });
        });

        show(0);
        play();
    }

    function getQueryValue(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function initFiltering() {
        var input = qs("[data-filter-input]");
        var cards = qsa("[data-search-item]");
        if (!input || !cards.length) {
            return;
        }
        var empty = qs("[data-empty-state]");
        var queryFromUrl = getQueryValue("q");
        if (queryFromUrl) {
            input.value = queryFromUrl;
        }

        function filter() {
            var query = input.value.trim().toLowerCase();
            var tokens = query ? query.split(/\s+/) : [];
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search-text") || "").toLowerCase();
                var matched = tokens.every(function (token) {
                    return text.indexOf(token) !== -1;
                });
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        input.addEventListener("input", filter);
        filter();
    }

    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        var existing = qs("script[data-hls-library]");
        if (existing) {
            existing.addEventListener("load", callback, { once: true });
            return;
        }
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
        script.setAttribute("data-hls-library", "true");
        script.onload = callback;
        document.head.appendChild(script);
    }

    window.initializeMoviePlayer = function (source) {
        var video = qs("#movieVideo");
        var overlay = qs("#playOverlay");
        if (!video || !source) {
            return;
        }

        var attached = false;
        var hlsInstance = null;

        function attachSource(done) {
            if (attached) {
                done();
                return;
            }
            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                done();
                return;
            }

            loadHls(function () {
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, done);
                } else {
                    video.src = source;
                    done();
                }
            });
        }

        function startPlayback() {
            attachSource(function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                video.controls = true;
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            });
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initSiteSearch();
        initBackTop();
        initHeroSlider();
        initFiltering();
    });
})();
