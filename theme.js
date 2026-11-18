/* Temporary GTA VI theme for the starting and ending scenes.
   Active on calendar days up to and including 23 Nov 2026 in Europe/Berlin.
   From 24 Nov 2026 00:00 Berlin time the scene stays on the default theme.
   Override in the browser-source URL with ?theme=gta6 or ?theme=default. */
(function (root) {
  var LAST_DAY = '2026-11-23';

  function berlinDay(date) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  function resolveTheme(date, queryTheme) {
    var q = String(queryTheme || '').toLowerCase();
    if (q === 'gta6' || q === 'default') return q;
    return berlinDay(date) <= LAST_DAY ? 'gta6' : 'default';
  }

  root.kipTheme = { LAST_DAY: LAST_DAY, berlinDay: berlinDay, resolveTheme: resolveTheme };

  if (typeof document === 'undefined') return;

  var query = '';
  try { query = new URLSearchParams(location.search).get('theme') || ''; }
  catch (err) { query = ''; }

  var theme = resolveTheme(new Date(), query);
  root.__KIP_THEME = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'gta6') document.documentElement.classList.add('gta6');

  function playVideo(video) {
    video.muted = true;
    var pending = video.play();
    if (pending && typeof pending.catch === 'function') pending.catch(function () {});
  }

  root.kipMountGtaBackdrop = function (scene) {
    if (theme !== 'gta6' || !scene || scene.querySelector('.gta-bg')) return;

    var video = document.createElement('video');
    video.className = 'gta-bg';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.poster = 'assets/gta6-poster.jpg';
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.src = 'assets/gta6-bg.mp4';

    var scrim = document.createElement('div');
    scrim.className = 'gta-scrim';
    scrim.setAttribute('aria-hidden', 'true');

    scene.insertBefore(scrim, scene.firstChild);
    scene.insertBefore(video, scene.firstChild);
    video.addEventListener('loadeddata', function () { playVideo(video); });
    playVideo(video);
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
