const canvas = document.getElementById('tendrils-canvas');
const ctx = canvas.getContext('2d');
const starsCanvas = document.getElementById ('canvas');
const starsCtx = starsCanvas ? starsCanvas.getContext('2d') : null;

let width, height;
let stars = [];
const mouse = { x: -1000, y: -1000, active: false };
const STAR_REPULSION_RADIUS = 150;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  if (starsCanvas && starsCtx) {
    starsCanvas.width = width;
    starsCanvas.height = height;
    const starCount = Math.min(1700, Math.floor(width * height / 3000));
    stars = Array.from({ length: starCount }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
      x,
      y,
      originX: x,
      originY: y,
      velocityX: 0,
      velocityY: 0,
      radius: Math.random() * 1.5 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.035 + 0.01
      };
    });
  }
}
window.addEventListener('resize', resize);
resize();

function drawStars() {
  if (!starsCtx) return;

  starsCtx.clearRect(0, 0, width, height);
  stars.forEach((star) => {
    star.phase += star.speed;
    const dx = star.x - mouse.x;
    const dy = star.y - mouse.y;
    const distance = Math.hypot(dx, dy);

    if (mouse.active && distance < STAR_REPULSION_RADIUS) {
      const force = (1 - distance / STAR_REPULSION_RADIUS) * 0.8;
      const safeDistance = Math.max(distance, 1);
      star.velocityX += (dx / safeDistance) * force;
      star.velocityY += (dy / safeDistance) * force;
    }

    star.velocityX += (star.originX - star.x) * 0.012;
    star.velocityY += (star.originY - star.y) * 0.012;
    star.velocityX *= 0.88;
    star.velocityY *= 0.88;
    star.x += star.velocityX;
    star.y += star.velocityY;

    const opacity = 0.35 + (Math.sin(star.phase) + 1) * 0.325;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(225, 242, 255, ${opacity})`;
    starsCtx.shadowBlur = star.radius > 1.4 ? 8 : 3;
    starsCtx.shadowColor = `rgba(145, 205, 255, ${opacity})`;
    starsCtx.fill();
  });
  starsCtx.shadowBlur = 0;
}

const tendrils = [];
window.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;

  // Genera tendones/tentáculos al mover el cursor
  const dist = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
  if (dist > 1) {
    for (let i = 0; i < 2; i++) {
      tendrils.push(new Tendril(mouse.x, mouse.y));
    }
  }
});

document.documentElement.addEventListener('pointerleave', () => {
  mouse.active = false;
});

class Tendril {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.floor(Math.random() * 10) + 8;
    this.segments = [];

    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 3 + 2;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let currX = x;
    let currY = y;

    for (let i = 0; i < this.length; i++) {
      this.segments.push({ x: currX, y: currY, vx: vx, vy: vy });
      angle += (Math.random() - 0.5) * 0.7;
      vx = Math.cos(angle) * (speed * (1 - i / this.length));
      vy = Math.sin(angle) * (speed * (1 - i / this.length));
      currX += vx;
      currY += vy;
    }

    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.015;
    this.hue = Math.random() * 40 + 180; // Tonos cian/azul/púrpura
  }

  update() {
    this.life -= this.decay;
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      seg.x += seg.vx;
      seg.y += seg.vy;
      seg.vx *= 0.94;
      seg.vy *= 0.94;
    }
  }

  draw() {
    if (this.life <= 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.segments[0].x, this.segments[0].y);

    for (let i = 1; i < this.segments.length - 1; i++) {
      let xc = (this.segments[i].x + this.segments[i + 1].x) / 2;
      let yc = (this.segments[i].y + this.segments[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.segments[i].x, this.segments[i].y, xc, yc);
    }

    ctx.strokeStyle = `hsla(${this.hue}, 90%, 65%, ${this.life})`;
    ctx.lineWidth = Math.max(0.5, this.life * 2.5);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Punto brillante en el extremo
    const last = this.segments[this.segments.length - 1];
    ctx.fillStyle = `hsla(${this.hue + 20}, 100%, 80%, ${this.life})`;
    ctx.beginPath();
    ctx.arc(last.x, last.y, this.life * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function animate() {
  drawStars();

  // Desvanecer la estela hacia transparencia para no cubrir las estrellas.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  for (let i = tendrils.length - 1; i >= 0; i--) {
    tendrils[i].update();
    tendrils[i].draw();
    if (tendrils[i].life <= 0) {
      tendrils.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
const botonVolver = document.getElementById('btn-back');
const contenedor = document.getElementById('preview-box');
const ventana = document.getElementById('preview-iframe');
if (botonVolver && contenedor && ventana) {
  const OFFSET_X = 15;
  const OFFSET_Y = 15;

  botonVolver.addEventListener('mousemove', function(e) {
    contenedor.style.display = 'block';
    if (!ventana.src && document.referrer) {
      ventana.src = document.referrer;
    }
    contenedor.style.left = (e.clientX + OFFSET_X) + 'px';
    contenedor.style.top = (e.clientY + OFFSET_Y) + 'px';
  });

  botonVolver.addEventListener('mouseleave', function() {
    contenedor.style.display = 'none';
  });

  botonVolver.addEventListener('click', function() {
    document.body.classList.add('animacion-salida');
    setTimeout(function() {
      window.history.back();
    }, 500);
  });
}
