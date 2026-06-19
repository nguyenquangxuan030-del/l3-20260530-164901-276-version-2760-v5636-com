import { H as Hls } from './hls-bbsaiqh1.js';

document.querySelectorAll('[data-player]').forEach(function (player) {
  var video = player.querySelector('video');
  var overlay = player.querySelector('.player-overlay');
  var source = player.getAttribute('data-source');
  var hlsInstance = null;

  function attach() {
    if (!video || !source || video.dataset.ready === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.dataset.ready = '1';
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({ enableWorker: true });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      video.dataset.ready = '1';
      return;
    }

    video.src = source;
    video.dataset.ready = '1';
  }

  function start() {
    attach();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!video.dataset.ready) {
        start();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
});
