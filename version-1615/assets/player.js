
(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function bindPlayer(player) {
        var video = player.querySelector("video");
        var overlay = player.querySelector(".player-overlay");
        var source = player.getAttribute("data-hls");
        var loaded = false;
        var hls = null;

        function load() {
            if (loaded || !video || !source) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            load();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {});
            }
        }

        if (!video || !source) {
            return;
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                start();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    ready(function () {
        document.querySelectorAll(".movie-player").forEach(bindPlayer);
    });
})();
