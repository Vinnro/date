const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const introCard = document.getElementById("introCard");
const activityCard = document.getElementById("activityCard");
const finalCard = document.getElementById("finalCard");
const finalActivity = document.getElementById("finalActivity");

const activityOptions = document.querySelectorAll(".activity-option");

let stars = [];
let constellations = [];
let selectedActivity = "";

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createSky();
}

function createSky() {
    stars = [];

    const count = Math.floor((canvas.width * canvas.height) / 1800);

    for (let i = 0; i < count; i++) {
        stars.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            r: random(0.35, 1.8),
            alpha: random(0.25, 1),
            speed: random(0.002, 0.01),
            glow: Math.random() > 0.92
        });
    }

    constellations = [
        [
            { x: canvas.width * 0.10, y: canvas.height * 0.25 },
            { x: canvas.width * 0.18, y: canvas.height * 0.32 },
            { x: canvas.width * 0.27, y: canvas.height * 0.25 },
            { x: canvas.width * 0.34, y: canvas.height * 0.37 },
            { x: canvas.width * 0.22, y: canvas.height * 0.49 }
        ],
        [
            { x: canvas.width * 0.68, y: canvas.height * 0.28 },
            { x: canvas.width * 0.78, y: canvas.height * 0.22 },
            { x: canvas.width * 0.86, y: canvas.height * 0.34 },
            { x: canvas.width * 0.80, y: canvas.height * 0.49 },
            { x: canvas.width * 0.91, y: canvas.height * 0.55 }
        ]
    ];
}

function drawNebula() {
    const g1 = ctx.createRadialGradient(
        canvas.width * 0.25,
        canvas.height * 0.42,
        0,
        canvas.width * 0.25,
        canvas.height * 0.42,
        canvas.width * 0.5
    );

    g1.addColorStop(0, "rgba(110, 140, 255, 0.16)");
    g1.addColorStop(1, "rgba(110, 140, 255, 0)");

    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const g2 = ctx.createRadialGradient(
        canvas.width * 0.76,
        canvas.height * 0.65,
        0,
        canvas.width * 0.76,
        canvas.height * 0.65,
        canvas.width * 0.4
    );

    g2.addColorStop(0, "rgba(255, 175, 115, 0.10)");
    g2.addColorStop(1, "rgba(255, 175, 115, 0)");

    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars(time) {
    for (const star of stars) {
        const twinkle = star.alpha + Math.sin(time * star.speed) * 0.25;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.glow ? "#ffe3a1" : "#ffffff";
        ctx.fill();

        if (star.glow) {
            ctx.globalAlpha = 0.18;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r * 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffd88d";
            ctx.fill();
        }
    }

    ctx.globalAlpha = 1;
}

function drawConstellations() {
    for (const group of constellations) {
        ctx.strokeStyle = "rgba(255, 220, 160, 0.28)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(group[0].x, group[0].y);

        for (let i = 1; i < group.length; i++) {
            ctx.lineTo(group[i].x, group[i].y);
        }

        ctx.stroke();

        for (const point of group) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 226, 170, 0.82)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 226, 170, 0.10)";
            ctx.fill();
        }
    }
}

function drawShootingStar(time) {
    const cycle = (time / 9000) % 1;

    if (cycle < 0.18) {
        const x = canvas.width * (cycle / 0.18);
        const y = canvas.height * 0.18 + x * 0.14;

        ctx.globalAlpha = 1 - cycle / 0.18;
        ctx.strokeStyle = "rgba(255, 245, 210, 0.9)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 140, y - 45);
        ctx.stroke();

        ctx.globalAlpha = 1;
    }
}

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebula();
    drawStars(time);
    drawConstellations();
    drawShootingStar(time);

    requestAnimationFrame(animate);
}

function createMagicParticles(element, count = 70) {
    const rect = element.getBoundingClientRect();
    const colors = ["#ffd88d", "#fff1bd", "#ffb45c", "#b9c7ff"];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.className = "magic-particle";

        const x = random(rect.left, rect.right);
        const y = random(rect.top, rect.bottom);

        const angle = random(0, Math.PI * 2);
        const distance = random(80, 260);

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        const size = random(2, 6);
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.boxShadow = `0 0 18px ${color}`;

        document.body.appendChild(particle);

        particle.animate(
            [
                { opacity: 1, transform: "translate(0, 0) scale(1)" },
                { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(0)` }
            ],
            {
                duration: 900,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        setTimeout(() => {
            finalActivity.textContent = selectedActivity;

            fetch("/api/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    answer: "Да",
                    activity: selectedActivity
                })
            }).catch((error) => {
                console.error("Ошибка отправки в Telegram:", error);
            });

            transitionToNextCard(activityCard, finalCard);
        }, 500);
    }
}

function createMagicRing(element) {
    const rect = element.getBoundingClientRect();

    const ring = document.createElement("span");
    ring.className = "magic-ring";

    ring.style.left = `${rect.left}px`;
    ring.style.top = `${rect.top}px`;
    ring.style.width = `${rect.width}px`;
    ring.style.height = `${rect.height}px`;

    document.body.appendChild(ring);

    ring.animate(
        [
            { opacity: 0, transform: "scale(0.94)" },
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(1.12)" }
        ],
        {
            duration: 850,
            easing: "ease-out",
            fill: "forwards"
        }
    );

    setTimeout(() => {
        ring.remove();
    }, 900);
}

function transitionToNextCard(currentCard, nextCard) {
    createMagicRing(currentCard);
    createMagicParticles(currentCard, 90);

    currentCard.classList.add("card-exit-magic");

    setTimeout(() => {
        currentCard.classList.remove("card-exit-magic");
        currentCard.style.display = "none";

        nextCard.classList.add("show");

        createMagicRing(nextCard);
        createMagicParticles(nextCard, 45);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 850);
}

startBtn.addEventListener("click", () => {
    transitionToNextCard(introCard, activityCard);
});

activityOptions.forEach((option) => {
    option.addEventListener("click", () => {
        selectedActivity = option.dataset.activity;

        activityOptions.forEach((item) => item.classList.remove("selected"));
        option.classList.add("selected");

        createMagicRing(option);
        createMagicParticles(option, 32);

        setTimeout(() => {
            finalActivity.textContent = selectedActivity;
            transitionToNextCard(activityCard, finalCard);
        }, 500);
    });
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
requestAnimationFrame(animate);