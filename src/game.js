import { GAME_DATA, characters, imageVersion } from './data.js';

// Web Audio API Synthesizer (created/resumed on user gesture)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  flip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  match() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [1046.5, 1567.98].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.32);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      });
    } catch {}
  }

  mismatch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch {}
  }

  stageWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const start = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = start + i * 0.11;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.3);
      });
    } catch {}
  }

  fanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
      const start = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = start + i * 0.12;
        const dur = i === notes.length - 1 ? 0.65 : 0.25;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.13, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + dur);
      });
    } catch {}
  }
}

const sfx = new SoundFX();
const LANG_KEY = 'bm_lang';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {}
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('ar') ? 'ar' : 'en';
}

// Game State
let currentLang = getInitialLang();
let currentStageIndex = 0;
let stagesWon = 0;
let selectedHero = null;
let currentDeck = [];
let flippedCards = [];
let matchedCount = 0;
let isBoardLocked = false;
let isPickingHero = false;
let activeTimeouts = [];

// Localization & BDI helpers
function t(key) {
  const entry = GAME_DATA.ui[key];
  if (!entry) return '';
  return entry[currentLang] || entry.en || '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatBdi(str) {
  return escapeHtml(str).replace(
    /(\$\d+(?:\.\d+)?|\d+(?:\.\d+)?\$|\d+(?:\.\d+)?%|\d+)/g,
    '<bdi class="bdi-num">$1</bdi>'
  );
}

function getHeroImgUrl(heroId) {
  const entry = characters[heroId];
  return entry ? `${entry.src}?v=${imageVersion}` : '';
}

// Timeout manager
function registerTimeout(fn, delay) {
  const id = setTimeout(() => {
    activeTimeouts = activeTimeouts.filter(item => item !== id);
    fn();
  }, delay);
  activeTimeouts.push(id);
  return id;
}

function clearAllTimeouts() {
  activeTimeouts.forEach(id => clearTimeout(id));
  activeTimeouts = [];
}

function cleanupTemporaryElements() {
  document.querySelectorAll('.confetti-container, .sparkle-layer').forEach(el => el.remove());
}

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const stageBanner = document.getElementById('stage-banner');
const stageCompleteModal = document.getElementById('stage-complete-modal');
const victoryScreen = document.getElementById('victory-screen');

const startTitleText = document.getElementById('start-title-text');
const startSubtitle = document.getElementById('start-subtitle');
const startLangBtn = document.getElementById('start-lang-btn');
const topbarLangBtn = document.getElementById('topbar-lang-btn');

const stageBannerTitle = document.getElementById('stage-banner-title');
const stageBannerEmoji = document.getElementById('stage-banner-emoji');
const stageBannerHint = document.getElementById('stage-banner-hint');

const stageCompleteTitle = document.getElementById('stage-complete-title');
const stageRecapText = document.getElementById('stage-recap-text');
const nextStageBtn = document.getElementById('next-stage-btn');

const victoryTitle = document.getElementById('victory-title');
const victorySub = document.getElementById('victory-sub');
const playAgainBtn = document.getElementById('play-again-btn');
const muteBtn = document.getElementById('mute-btn');

const rotateTitle = document.getElementById('rotate-title');
const rotateSub = document.getElementById('rotate-sub');

const boardContainer = document.getElementById('board-container');
const stageDotsContainer = document.getElementById('stage-dots');
const pairPipsContainer = document.getElementById('pair-pips');
const heroBox = document.getElementById('hero-box');
const victoryHeroBox = document.getElementById('victory-hero-box');

function getHeroScale() {
  return Math.min(1.0, 0.5 + 0.125 * stagesWon);
}

function renderHeroIn(container, hero, isVictory = false) {
  if (!container || !hero) return;
  const scale = isVictory ? 1.0 : getHeroScale();
  const extraClass = isVictory ? 'hero-wiggle' : 'hero-bob-loop';
  const imgUrl = getHeroImgUrl(hero.id);
  const altText = t(hero.nameKey);

  container.innerHTML = `
    <div class="hero-avatar-scaler ${extraClass}" style="--hero-scale: ${scale};">
      <img src="${imgUrl}" alt="${escapeHtml(altText)}" decoding="async" />
      <span class="hero-avatar-fallback">${hero.emoji}</span>
    </div>
  `;
  const img = container.querySelector('img');
  const fallback = container.querySelector('.hero-avatar-fallback');
  if (img && fallback) {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    }, { once: true });
  }
}

function updateHeroScale() {
  const scaler = heroBox.querySelector('.hero-avatar-scaler');
  if (scaler) {
    scaler.style.setProperty('--hero-scale', String(getHeroScale()));
  }
}

function triggerHeroAnimation(animationClass, duration = 350) {
  if (prefersReducedMotion()) return;
  const scaler = heroBox.querySelector('.hero-avatar-scaler');
  if (!scaler) return;
  scaler.classList.add(animationClass);
  registerTimeout(() => {
    scaler.classList.remove(animationClass);
  }, duration);
}

function getSparkleLayer() {
  let layer = document.querySelector('.sparkle-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    document.body.appendChild(layer);
  }
  return layer;
}

function spawnCardSparkles(cardElement) {
  if (prefersReducedMotion()) return;
  const rect = cardElement.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const emojis = ['✨', '⭐', '✨', '💛', '✨', '⭐'];
  const layer = getSparkleLayer();

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 + Math.random() * 20) * (Math.PI / 180);
    const dist = 32 + Math.random() * 18;
    const sp = document.createElement('div');
    sp.className = 'sparkle-particle';
    sp.textContent = emojis[i % emojis.length];
    sp.style.insetInlineStart = `${cx}px`;
    sp.style.insetBlockStart = `${cy}px`;
    sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    sp.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    layer.appendChild(sp);
    setTimeout(() => sp.remove(), 550);
  }
}

function spawnHeroSparkles() {
  if (prefersReducedMotion()) return;
  const rect = heroBox.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const layer = getSparkleLayer();

  for (let i = 0; i < 8; i++) {
    const angle = i * 45 * (Math.PI / 180);
    const dist = 44 + Math.random() * 14;
    const sp = document.createElement('div');
    sp.className = 'sparkle-particle';
    sp.textContent = '✨';
    sp.style.insetInlineStart = `${cx}px`;
    sp.style.insetBlockStart = `${cy}px`;
    sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    sp.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    layer.appendChild(sp);
    setTimeout(() => sp.remove(), 750);
  }
}

function spawnConfetti(count = 30) {
  if (prefersReducedMotion()) return;
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#4D96FF', '#FF9F1C', '#6BCB77', '#FF6B6B', '#9B5DE5', '#F15BB5', '#FFD93D'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.insetInlineStart = `${Math.random() * 100}%`;
    p.style.setProperty('--cw', `${7 + Math.random() * 6}px`);
    p.style.setProperty('--ch', `${8 + Math.random() * 7}px`);
    p.style.setProperty('--cc', colors[i % colors.length]);
    p.style.setProperty('--cr', Math.random() > 0.5 ? '50%' : '2px');
    p.style.animationDelay = `${Math.random() * 0.35}s`;
    p.style.animationDuration = `${1.6 + Math.random() * 0.5}s`;
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2200);
}

function updateTopBar() {
  stageDotsContainer.setAttribute('aria-label', t('stagesAria'));
  stageDotsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('div');
    dot.className = 'stage-dot';
    if (i < currentStageIndex) {
      dot.classList.add('completed');
      dot.textContent = '★';
    } else if (i === currentStageIndex) {
      dot.classList.add('active');
      dot.innerHTML = `<bdi class="bdi-num">${i + 1}</bdi>`;
    } else {
      dot.innerHTML = `<bdi class="bdi-num">${i + 1}</bdi>`;
    }
    stageDotsContainer.appendChild(dot);
  }

  pairPipsContainer.setAttribute('aria-label', t('pairsAria'));
  pairPipsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const pip = document.createElement('div');
    pip.className = 'pair-pip' + (i < matchedCount ? ' filled' : '');
    pip.textContent = i < matchedCount ? '⭐' : '•';
    pairPipsContainer.appendChild(pip);
  }
}

function applyLanguage() {
  const html = document.documentElement;
  html.lang = currentLang;
  html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');

  // Start screen
  startTitleText.textContent = t('title');
  startSubtitle.textContent = t('pickHero');
  startLangBtn.textContent = t('langSwitch');
  topbarLangBtn.textContent = t('langSwitch');
  muteBtn.setAttribute('aria-label', t('muteLabel'));
  heroBox.setAttribute('aria-label', t('heroAria'));

  document.querySelectorAll('.hero-card').forEach(card => {
    const hero = GAME_DATA.heroes.find(h => h.id === card.dataset.hero);
    if (!hero) return;
    const label = t(hero.nameKey);
    const nameEl = card.querySelector('.hero-name');
    const imgEl = card.querySelector('img');
    if (nameEl) nameEl.textContent = label;
    if (imgEl) imgEl.alt = label;
  });

  // Active stage banner & modal text
  const stage = GAME_DATA.stages[currentStageIndex];
  if (stage) {
    const stageText = t('stageLabel')
      .replace('{n}', String(stage.stageNum))
      .replace('{title}', stage.title[currentLang]);
    stageBannerTitle.innerHTML = formatBdi(stageText);
    stageBannerHint.textContent = t('matchHint');
    stageRecapText.innerHTML = `"${formatBdi(stage.recap[currentLang])}"`;
  }

  stageCompleteTitle.textContent = t('stageComplete');
  nextStageBtn.textContent = `${t('next')} ${t('nextArrow')}`;
  victoryTitle.textContent = `${t('finalTitle')} 🏆`;
  victorySub.textContent = t('finalSubtitle');
  playAgainBtn.textContent = t('playAgain');
  rotateTitle.textContent = t('turnUpright');
  rotateSub.textContent = t('turnUprightSub');

  // Update open/closed cards in place without reshuffling
  boardContainer.querySelectorAll('.card-slot').forEach(slot => {
    const idx = parseInt(slot.dataset.index, 10);
    const card = currentDeck[idx];
    if (!card) return;
    const textEl = slot.querySelector('.card-front-text');
    if (textEl) {
      textEl.innerHTML = formatBdi(card.text[currentLang]);
    }
  });

  updateTopBar();
}

function toggleLanguage() {
  sfx.init();
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  try {
    localStorage.setItem(LANG_KEY, currentLang);
  } catch {}
  applyLanguage();
}

function buildStageDeck(stage) {
  const cards = [];
  stage.pairs.forEach(pair => {
    cards.push({
      cardId: `${pair.id}-q`,
      pairId: pair.id,
      type: 'q',
      text: pair.q.text,
      emoji: pair.q.emoji
    });
    cards.push({
      cardId: `${pair.id}-a`,
      pairId: pair.id,
      type: 'a',
      text: pair.a.text,
      emoji: pair.a.emoji
    });
  });
  return shuffle(cards);
}

function renderBoard() {
  boardContainer.innerHTML = '';
  currentDeck.forEach((card, index) => {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    slot.dataset.index = String(index);
    slot.style.setProperty('--deal-idx', String(index));

    slot.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back type-${card.type}">
          <div class="card-back-icon">${card.type === 'q' ? '❓' : '💡'}</div>
        </div>
        <div class="card-face card-front type-${card.type}">
          <div class="match-check">✔</div>
          <div class="card-front-emoji">${card.emoji}</div>
          <div class="card-front-text">${formatBdi(card.text[currentLang])}</div>
        </div>
      </div>
    `;

    boardContainer.appendChild(slot);
  });
}

function markFlipping(slot) {
  slot.classList.add('flipping');
  registerTimeout(() => slot.classList.remove('flipping'), 420);
}

function onCardTap(slotElement) {
  if (isBoardLocked) return;
  if (!slotElement || slotElement.classList.contains('flipped') || slotElement.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;
  if (flippedCards.some(c => c.element === slotElement)) return;

  const cardIndex = parseInt(slotElement.dataset.index, 10);
  const cardData = currentDeck[cardIndex];
  if (!cardData) return;

  sfx.flip();
  markFlipping(slotElement);
  slotElement.classList.add('flipped');
  flippedCards.push({ element: slotElement, data: cardData });

  if (flippedCards.length === 2) {
    isBoardLocked = true;
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (!c1 || !c2) {
    isBoardLocked = false;
    return;
  }
  const isMatch = c1.data.pairId === c2.data.pairId && c1.data.type !== c2.data.type;

  if (isMatch) {
    isBoardLocked = true;
    sfx.match();

    c1.element.classList.add('matched');
    c2.element.classList.add('matched');
    triggerHeroAnimation('hero-jump', 350);
    spawnCardSparkles(c1.element);
    spawnCardSparkles(c2.element);

    matchedCount++;
    updateTopBar();

    registerTimeout(() => {
      flippedCards = [];
      isBoardLocked = false;
      if (matchedCount === 5) {
        onStageWon();
      }
    }, 300);
  } else {
    isBoardLocked = true;
    sfx.mismatch();

    c1.element.classList.add('mismatch-shake');
    c2.element.classList.add('mismatch-shake');
    triggerHeroAnimation('hero-head-shake', 350);

    registerTimeout(() => {
      markFlipping(c1.element);
      markFlipping(c2.element);
      c1.element.classList.remove('flipped', 'mismatch-shake');
      c2.element.classList.remove('flipped', 'mismatch-shake');
      flippedCards = [];
      isBoardLocked = false;
    }, 900);
  }
}

function onStageWon() {
  clearAllTimeouts();
  isBoardLocked = true;
  stagesWon++;

  triggerHeroAnimation('hero-hop', 500);
  updateHeroScale();
  spawnHeroSparkles();

  const currentStage = GAME_DATA.stages[currentStageIndex];
  const isSmallScreen = window.innerWidth < 600;

  if (currentStageIndex === GAME_DATA.stages.length - 1) {
    sfx.fanfare();
    spawnConfetti(isSmallScreen ? 40 : 60);
    registerTimeout(() => {
      gameScreen.classList.add('hidden');
      renderHeroIn(victoryHeroBox, selectedHero, true);
      victoryScreen.classList.remove('hidden');
    }, 500);
  } else {
    sfx.stageWin();
    spawnConfetti(isSmallScreen ? 20 : 30);
    stageRecapText.innerHTML = `"${formatBdi(currentStage.recap[currentLang])}"`;
    stageCompleteModal.classList.remove('hidden');
  }
}

function startStage(stageIdx) {
  clearAllTimeouts();
  cleanupTemporaryElements();
  currentStageIndex = stageIdx;
  matchedCount = 0;
  flippedCards = [];
  isBoardLocked = true;

  const stage = GAME_DATA.stages[currentStageIndex];
  currentDeck = buildStageDeck(stage);

  updateTopBar();
  renderHeroIn(heroBox, selectedHero);
  applyLanguage();

  stageBannerEmoji.textContent = stage.topicEmoji;
  stageBannerHint.style.display = stage.stageNum === 1 ? 'inline-block' : 'none';

  stageCompleteModal.classList.add('hidden');
  victoryScreen.classList.add('hidden');
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  stageBanner.classList.remove('hidden');

  renderBoard();

  registerTimeout(() => {
    stageBanner.classList.add('hidden');
    isBoardLocked = false;
  }, 1500);
}

function resetGame() {
  clearAllTimeouts();
  cleanupTemporaryElements();
  currentStageIndex = 0;
  stagesWon = 0;
  matchedCount = 0;
  flippedCards = [];
  isBoardLocked = false;
  isPickingHero = false;
  selectedHero = null;

  document.querySelectorAll('.hero-card.hero-picked').forEach(c => c.classList.remove('hero-picked'));
  stageBanner.classList.add('hidden');
  stageCompleteModal.classList.add('hidden');
  victoryScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  updateTopBar();
}

function setupStartScreen() {
  const container = document.getElementById('hero-select-row');
  if (!container) return;
  container.innerHTML = GAME_DATA.heroes.map(hero => {
    const imgUrl = getHeroImgUrl(hero.id);
    const label = t(hero.nameKey);
    return `
      <div class="hero-card" data-hero="${hero.id}">
        <div class="hero-avatar-wrap">
          <img src="${imgUrl}" alt="${escapeHtml(label)}" decoding="async" />
          <span class="hero-avatar-fallback">${hero.emoji}</span>
        </div>
        <div class="hero-name">${escapeHtml(label)}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.hero-card').forEach(card => {
    const img = card.querySelector('img');
    const fallback = card.querySelector('.hero-avatar-fallback');
    if (img && fallback) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      }, { once: true });
    }
  });
}

function initListeners() {
  const unlockAudio = () => {
    sfx.init();
    window.removeEventListener('pointerdown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });

  muteBtn.addEventListener('click', () => {
    sfx.init();
    const isMuted = sfx.toggleMute();
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  startLangBtn.addEventListener('click', toggleLanguage);
  topbarLangBtn.addEventListener('click', toggleLanguage);

  document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('click', () => {
      if (isPickingHero) return;
      isPickingHero = true;
      sfx.init();
      sfx.flip();
      card.classList.add('hero-picked');
      const heroId = card.dataset.hero;
      selectedHero = GAME_DATA.heroes.find(h => h.id === heroId) || GAME_DATA.heroes[0];
      stagesWon = 0;
      registerTimeout(() => {
        card.classList.remove('hero-picked');
        isPickingHero = false;
        startStage(0);
      }, 260);
    });
  });

  boardContainer.addEventListener('click', e => {
    const slot = e.target.closest('.card-slot');
    if (slot && boardContainer.contains(slot)) {
      onCardTap(slot);
    }
  });

  nextStageBtn.addEventListener('click', () => {
    stageCompleteModal.classList.add('hidden');
    startStage(currentStageIndex + 1);
  });

  playAgainBtn.addEventListener('click', () => {
    resetGame();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && flippedCards.length === 2) {
      const [c1, c2] = flippedCards;
      if (c1 && c2 && !c1.element.classList.contains('matched')) {
        c1.element.classList.remove('flipped', 'mismatch-shake', 'flipping');
        c2.element.classList.remove('flipped', 'mismatch-shake', 'flipping');
        flippedCards = [];
        isBoardLocked = false;
      }
    }
  });
}

// Boot game
setupStartScreen();
applyLanguage();
initListeners();
