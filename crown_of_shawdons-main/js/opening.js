/* ============================================
   CROWN OF SHADOWS — opening.js
   ============================================ */

const Opening = {

  _config: {
    afterCinematic: 'login',
    cinematicDuration: 97000, // 1:37 min
  },

  _cinematicTimer: null,

  init() {
    // Esconde o fundo global enquanto a abertura estiver visível
    const gb = document.getElementById('global-bg');
    const go = document.getElementById('global-overlay');
    if (gb) gb.style.display = 'none';
    if (go) go.style.display = 'none';
    this._spawnParticles();
    this._bindEvents();
  },

  _spawnParticles() {
    const container = document.getElementById('opening-particles');
    if (!container) return;
    const colors = ['rgba(176,106,255,0.6)','rgba(201,168,76,0.4)','rgba(255,255,255,0.3)','rgba(139,63,200,0.5)'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'op-particle';
      const size = 1 + Math.random() * 3;
      p.style.cssText = [
        'left:'    + Math.random() * 100 + '%',
        'top:'     + (20 + Math.random() * 80) + '%',
        'width:'   + size + 'px',
        'height:'  + size + 'px',
        'background:' + colors[Math.floor(Math.random() * colors.length)],
        'animation-duration:' + (8 + Math.random() * 14) + 's',
        'animation-delay:'    + (Math.random() * 10) + 's',
      ].join(';');
      container.appendChild(p);
    }
  },

  _bindEvents() {
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => this.startCinematic());
      btnPlay.addEventListener('touchend', (e) => { e.preventDefault(); this.startCinematic(); }, { passive: false });
    }

    const btnSkip = document.getElementById('btn-skip-cinematic');
    if (btnSkip) btnSkip.addEventListener('click', () => this.skipCinematic());

    const btnClose = document.getElementById('btn-close-cinematic');
    if (btnClose) btnClose.addEventListener('click', () => this.skipCinematic());

    const video = document.getElementById('cinematic-video');
    if (video && video.tagName === 'VIDEO') {
      video.addEventListener('ended', () => this._onCinematicEnd());
      video.addEventListener('timeupdate', () => this._updateProgress(video));
      video.addEventListener('error', () => this._startFallbackTimer());
    }
  },

  startCinematic() {
    const overlay = document.getElementById('cinematic-overlay');
    if (!overlay) return;

    overlay.classList.add('cin-visible');

    const video = document.getElementById('cinematic-video');
    if (video && video.tagName === 'VIDEO') {
      video.play().catch(() => this._startFallbackTimer());
    } else {
      this._startFallbackTimer();
    }
  },

  _startFallbackTimer() {
    clearTimeout(this._cinematicTimer);
    this._cinematicTimer = setTimeout(() => this._onCinematicEnd(), this._config.cinematicDuration);
    const fill = document.getElementById('cinematic-progress-fill');
    if (fill) {
      fill.style.transition = 'width ' + this._config.cinematicDuration + 'ms linear';
      requestAnimationFrame(() => { fill.style.width = '100%'; });
    }
  },

  _updateProgress(video) {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    const fill = document.getElementById('cinematic-progress-fill');
    if (fill) {
      fill.style.transition = 'width 0.5s linear';
      fill.style.width = pct + '%';
    }
  },

  skipCinematic() {
    clearTimeout(this._cinematicTimer);
    const video = document.getElementById('cinematic-video');
    if (video && video.tagName === 'VIDEO') { video.pause(); video.currentTime = 0; }
    this._onCinematicEnd();
  },

  _onCinematicEnd() {
    clearTimeout(this._cinematicTimer);
    const overlay = document.getElementById('cinematic-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.classList.remove('cin-visible');
        overlay.style.opacity = '';
        overlay.style.transition = '';
      }, 600);
    }
    this._closeOpening();
  },

  _closeOpening() {
    const opening = document.getElementById('page-opening');
    if (!opening) { this._goToNextPage(); return; }
    opening.classList.add('op-exit');
    setTimeout(() => {
      opening.style.display = 'none';
      opening.classList.remove('op-exit');
      this._goToNextPage();
    }, 800);
  },

  _goToNextPage() {
    // Restaura o fundo global
    const gb = document.getElementById('global-bg');
    const go = document.getElementById('global-overlay');
    if (gb) gb.style.display = '';
    if (go) go.style.display = '';

    // Se ja tem sessao ativa (vindo do cadastro), vai direto pro board
    const hasSession = !!sessionStorage.getItem('cos_user');
    const dest = hasSession ? 'board' : this._config.afterCinematic;
    if (typeof App !== 'undefined' && App.show) {
      App.show(dest);
    } else {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const page = document.getElementById('page-' + dest);
      if (page) page.classList.add('active');
    }
  },
};

document.addEventListener('DOMContentLoaded', () => { Opening.init(); });
