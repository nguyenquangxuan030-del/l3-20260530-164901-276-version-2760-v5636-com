import { H as Hls } from './video-dru42stk.js';

function startPlayer(shell) {
  if (!shell || shell.dataset.ready === '1') {
    var readyVideo = shell ? shell.querySelector('video') : null;
    if (readyVideo) {
      readyVideo.play().catch(function () {});
    }
    return;
  }

  var video = shell.querySelector('video');
  var source = shell.dataset.src;
  if (!video || !source) {
    return;
  }

  shell.dataset.ready = '1';
  shell.classList.add('playing');

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.addEventListener('loadedmetadata', function () {
      video.play().catch(function () {});
    }, { once: true });
    video.load();
    return;
  }

  if (Hls && Hls.isSupported && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(function () {});
    });
    return;
  }

  video.src = source;
  video.play().catch(function () {});
}

Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
  var startButton = shell.querySelector('.player-start');
  shell.addEventListener('click', function () {
    startPlayer(shell);
  });
  if (startButton) {
    startButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      startPlayer(shell);
    });
  }
});
