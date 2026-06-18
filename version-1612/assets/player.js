function initMoviePlayer(stream) {
  var video = document.getElementById("moviePlayer");
  var cover = document.getElementById("playCover");
  var loaded = false;

  function load() {
    if (!video || !stream || loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (window.Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }
  }

  function play() {
    load();

    if (cover) {
      cover.classList.add("is-hidden");
    }

    if (video) {
      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () {});
      }
    }
  }

  if (cover) {
    cover.addEventListener("click", play);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
  }

  load();
}
