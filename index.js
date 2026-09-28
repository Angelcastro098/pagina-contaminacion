const canvas = document.getElementById('tendrils-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const tendrils = [];
const mouse = { x: width / 2, y: height / 2, px: width / 2, py: height / 2 };

window.addEventListener('mousemove', (e) => {
  mouse.px = mouse.x;
  mouse.py = mouse.y;
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // Genera tendones/tentáculos al mover el cursor
  const dist = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
  if (dist > 1) {
    for (let i = 0; i < 2; i++) {
      tendrils.push(new Tendril(mouse.x, mouse.y));
    }
  }
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
  // Limpieza semi-transparente para crear rastro de estela suave
  ctx.fillStyle = 'rgba(8, 9, 17, 0.25)';
  ctx.fillRect(0, 0, width, height);

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
const contenedor = document.getElementById ('preview-box');
const ventana = document.getElementById('preview-iframe');
botonVolver.addEventListener('click', function(){
  document.body.classList.add('animacion-salida');
  setTimeout(function(){
    window.history.back();

  }, 500);
});