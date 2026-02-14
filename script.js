const input = document.getElementById('cat')
const button = document.getElementById('button_cat')
const auth_form = document.getElementById('auth_form')
if (input) {
  button.addEventListener('click', () => {
    if (input.value.toLowerCase() === 'кеша' || input.value.toLowerCase() === 'кешка') {
      auth_form.classList.add('auth_hidden')
    }
  })
}


function updateActiveDot(container) {
  const dots = container.parentElement.querySelector('.slider-dots');
  if (!dots) return;

  const dotsList = dots.querySelectorAll('.dot');
  if (dotsList.length === 0) return;

  const scrollLeft = container.scrollLeft;
  const width = container.clientWidth;
  const activeIndex = Math.round(scrollLeft / width);

  dotsList.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function initSliders() {
  const containers = document.querySelectorAll('.image_container');

  containers.forEach((container, index) => {
    if (!container.id) {
      container.id = `slider-${index}`;
    }

    const slides = container.querySelectorAll('.image_inst');

    if (slides.length <= 1) return;

    let dotsContainer = container.parentElement.querySelector('.slider-dots');

    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'slider-dots';
      container.parentElement.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = '';

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        const slideWidth = container.clientWidth;
        container.scrollTo({
          left: slideWidth * i,
          behavior: 'smooth'
        });
      });

      dotsContainer.appendChild(dot);
    });

    container.addEventListener('scroll', () => {
      updateActiveDot(container);
    });

    window.addEventListener('resize', () => {
      updateActiveDot(container);
    });
  });
}

document.addEventListener('DOMContentLoaded', initSliders);

function createFloatingHearts(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '💖', '💗', '💓'][Math.floor(Math.random() * 10)];

    const size = Math.random() * 20 + 16;
    heart.style.fontSize = size + 'px';

    const offsetX = (Math.random() - 0.5) * 100;
    const offsetY = (Math.random() - 0.5) * 50;

    heart.style.left = (x + offsetX) + 'px';
    heart.style.top = (y + offsetY) + 'px';


    const angle = (Math.random() - 0.5) * 60;
    heart.style.transform = `rotate(${angle}deg)`;

    const duration = Math.random() * 1 + 0.8;
    heart.style.animation = `floatHeart ${duration}s ease-out forwards`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }
}

function createCanvasHearts(x, y, count = 20) {
  const canvas = document.getElementById('heartsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const hearts = [];


  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < count; i++) {
    hearts.push({
      x: x + (Math.random() - 0.5) * 150,
      y: y + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 2,
      size: Math.random() * 20 + 10,
      opacity: 1,
      color: `hsl(${Math.random() * 20 + 340}, 80%, 65%)`,
      text: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '💖', '💗', '💓'][Math.floor(Math.random() * 10)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allDead = true;

    hearts.forEach(heart => {
      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.opacity -= 0.01;
      heart.vy += 0.05;

      if (heart.opacity > 0 && heart.y > -50) {
        allDead = false;

        ctx.font = `${heart.size}px Arial`;
        ctx.globalAlpha = heart.opacity;
        ctx.fillText(heart.text, heart.x, heart.y);
      }
    });

    if (!allDead) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function createConfettiHearts() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      shapes: ['heart'],
      colors: ['#ff4d6d', '#ff8aa1', '#ffb3c6', '#ff69b4', '#ff1493']
    });
  }
}

function initHeartsAnimation() {
  const likesElements = document.querySelectorAll('.action-icon');

  likesElements.forEach(likesElement => {
    likesElement.addEventListener('click', (e) => {
      const rect = likesElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;


      createFloatingHearts(x, y, 15);


      likesElement.style.transform = 'scale(1.2)';
      setTimeout(() => {
        likesElement.style.transform = 'scale(1)';
      }, 200);

      const heartIcon = likesElement.parentElement.querySelector('.action-icon:first-child');
      if (heartIcon) {
        heartIcon.style.color = '#ff4d6d';
        heartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
          heartIcon.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

const FIREWORK_CONFIG = {
  count: 50,           
  gravity: 0.1,        
  speed: 5,            
  heartEmojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '💖', '💗', '💓', '💞', '💕']
};

class FireworkParticle {
  constructor(x, y, color, emoji) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * FIREWORK_CONFIG.speed * 2;
    this.vy = (Math.random() - 0.8) * FIREWORK_CONFIG.speed * 2;
    this.size = Math.random() * 20 + 16;
    this.opacity = 1;
    this.color = color;
    this.emoji = emoji;
    this.gravity = FIREWORK_CONFIG.gravity;
    this.life = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= 0.01;
    this.opacity = this.life;
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px Arial`;
    ctx.fillText(this.emoji, this.x, this.y);
  }
}

class Firework {
  constructor(x, y) {
    this.particles = [];
    this.exploded = false;

    const colors = ['#ff4d6d', '#ff8aa1', '#ffb3c6', '#ff69b4', '#ff1493'];

    for (let i = 0; i < FIREWORK_CONFIG.count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const emoji = FIREWORK_CONFIG.heartEmojis[Math.floor(Math.random() * FIREWORK_CONFIG.heartEmojis.length)];
      this.particles.push(new FireworkParticle(x, y, color, emoji));
    }

    this.exploded = true;
  }

  update() {
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  isAlive() {
    return this.particles.length > 0;
  }
}

class FireworkManager {
  constructor() {
    this.canvas = document.getElementById('fireworksCanvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'fireworksCanvas';
      this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998;';
      document.body.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];
    this.intervalId = null;
    this.isAnimating = false;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.fireworks = [];

    this.animate();

    this.intervalId = setInterval(() => {
      if (!this.isAnimating) return;

     
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height * 0.8; 

      this.fireworks.push(new Firework(x, y));
    }, 500);
  }

  stop() {
    this.isAnimating = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fireworks = [];
  }

  animate() {
    if (!this.isAnimating) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.fireworks.forEach(fw => {
      fw.update();
      fw.draw(this.ctx);
    });

    this.fireworks = this.fireworks.filter(fw => fw.isAlive());

    requestAnimationFrame(() => this.animate());
  }
}

const fireworkManager = new FireworkManager();

function createHeartConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      shapes: ['heart'],
      colors: ['#ff4d6d', '#ff8aa1', '#ffb3c6', '#ff69b4', '#ff1493']
    });
  } else {
    // Или создаем свои частицы
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createFloatingHearts(
          window.innerWidth / 2 + (Math.random() - 0.5) * 300,
          window.innerHeight / 2 + (Math.random() - 0.5) * 200,
          10
        );
      }, i * 50);
    }
  }
}

function createScreenHearts() {
  const heartCount = 50;

  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const heart = document.createElement('div');
      heart.innerHTML = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '💖', '💗', '💓'][Math.floor(Math.random() * 10)];
      heart.style.position = 'fixed';
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.fontSize = (Math.random() * 40 + 20) + 'px';
      heart.style.zIndex = '9999';
      heart.style.pointerEvents = 'none';
      heart.style.filter = 'drop-shadow(0 0 10px hotpink)';
      heart.style.transition = 'all 2s ease-out';
      heart.style.opacity = '1';
      heart.style.transform = 'scale(0)';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = `scale(1) translateY(-100px) translateX(${(Math.random() - 0.5) * 200}px)`;
        heart.style.opacity = '0.8';
      }, 10);

      setTimeout(() => {
        heart.style.opacity = '0';
        heart.style.transform = `scale(0.5) translateY(-200px)`;
      }, 1000);

      setTimeout(() => {
        heart.remove();
      }, 3000);
    }, i * 50);
  }
}

function initMagicButton() {
  const button = document.getElementById('magicButton');
  if (!button) return;

  let isAnimating = false;

  button.addEventListener('click', () => {
    console.log('Magic button clicked!');

    if (isAnimating) {
      fireworkManager.stop();
      button.classList.remove('active');
      button.innerHTML = `
        <span class="button-text">✨ Нажми на меня ✨</span>
        <span class="button-heart">❤️</span>
      `;
      isAnimating = false;
    } else {
      fireworkManager.start();
      button.classList.add('active');
      button.innerHTML = `
        <span class="button-text">🎉 Анимация включена 🎉</span>
        <span class="button-heart">✨</span>
      `;
      isAnimating = true;

      createScreenHearts(); 

      const confettiInterval = setInterval(() => {
        if (!isAnimating) {
          clearInterval(confettiInterval);
          return;
        }
        createHeartConfetti();
      }, 3000);

      button.confettiInterval = confettiInterval;
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initHeartsAnimation();
  initSliders();
  initMagicButton();
  window.addEventListener('resize', () => {
    const canvas = document.getElementById('heartsCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
});