const canvas = document.getElementById('espacio-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let estrellas = [];

class Estrella {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.velocidadY = (Math.random() - 0.5) * 0.5;
    }
    actualizar() {
        this.y += this.velocidadY;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    dibujar() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function iniciarEstrellas() {
    for (let i = 0; i < 150; i++) {
        estrellas.push(new Estrella());
    }
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < estrellas.length; i++) {
        estrellas[i].actualizar();
        estrellas[i].dibujar();
    }
    requestAnimationFrame(animar);
}

iniciarEstrellas();
animar();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});