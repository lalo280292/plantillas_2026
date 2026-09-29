(() => {
  const audio = document.getElementById('audioPlayer');
  const button = document.getElementById('musicButton');
  audio.src = window.INVITATION_CONFIG.audio.src;
  audio.loop = true;

  function sync() {
    const paused = audio.paused;
    button.classList.toggle('is-muted', paused);
    button.setAttribute('aria-pressed', String(!paused));
    button.setAttribute('aria-label', paused ? 'Reproducir música' : 'Pausar música');
    button.textContent = paused ? '♪' : '♫';
  }

  async function play() {
    try { await audio.play(); } catch (_) { /* El navegador puede bloquear autoplay. */ }
    sync();
  }

  window.addEventListener('invitation:open', play);
  button.addEventListener('click', async () => {
    if (audio.paused) await play(); else audio.pause();
    sync();
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  sync();
})();
