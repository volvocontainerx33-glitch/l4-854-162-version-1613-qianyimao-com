(function () {
  function setStatus(box, message) {
    var status = box.querySelector('[data-player-status]');
    if (status) {
      status.textContent = message;
    }
  }

  function playVideo(box) {
    var video = box.querySelector('video');
    var source = box.getAttribute('data-m3u8');

    if (!video || !source) {
      setStatus(box, '未找到播放源。');
      return;
    }

    setStatus(box, '正在初始化播放源...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().then(function () {
        box.classList.add('is-playing');
      }).catch(function () {
        setStatus(box, '浏览器阻止了自动播放，请再次点击播放按钮。');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(function () {
          box.classList.add('is-playing');
        }).catch(function () {
          setStatus(box, '播放源已就绪，请再次点击播放按钮。');
        });
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus(box, '播放初始化失败，请检查网络或稍后重试。');
        }
      });
      return;
    }

    video.src = source;
    video.play().then(function () {
      box.classList.add('is-playing');
    }).catch(function () {
      setStatus(box, '当前浏览器不支持 HLS 播放，请使用 Chrome、Safari 或 Edge 最新版本。');
    });
  }

  var boxes = document.querySelectorAll('.video-player-box');
  boxes.forEach(function (box) {
    var button = box.querySelector('[data-play-button]');
    if (button) {
      button.addEventListener('click', function () {
        playVideo(box);
      });
    }
  });
})();
