(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var cover = box.querySelector(".player-cover");
      var streamUrl = video ? video.getAttribute("data-stream") : "";
      var attached = false;
      var hlsInstance = null;

      function attach() {
        if (!video || !streamUrl || attached) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }

        attached = true;
      }

      function start(event) {
        if (event) {
          event.preventDefault();
        }

        attach();

        if (cover) {
          cover.classList.add("is-hidden");
        }

        video.setAttribute("controls", "controls");
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            video.setAttribute("controls", "controls");
          });
        }
      }

      if (cover) {
        cover.addEventListener("click", start);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });

        video.addEventListener("play", function () {
          if (cover) {
            cover.classList.add("is-hidden");
          }
        });

        video.addEventListener("ended", function () {
          if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
            hlsInstance.stopLoad();
          }
        });
      }
    });
  });
})();
