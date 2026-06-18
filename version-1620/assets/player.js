(function () {
    window.initMoviePlayer = function (sourceUrl) {
        var video = document.getElementById('moviePlayer');
        var button = document.getElementById('playToggle');

        if (!video || !button || !sourceUrl) {
            return;
        }

        var attached = false;

        function attach() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = sourceUrl;
        }

        function play() {
            attach();
            button.classList.add('is-hidden');
            video.controls = true;
            var started = video.play();

            if (started && typeof started.catch === 'function') {
                started.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }

        button.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    };
})();
