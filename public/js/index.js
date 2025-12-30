gsap.registerPlugin(ScrollTrigger);

// Simple Fade Up for Hero
gsap.from("[data-gsap='fade-up']", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out",
    delay: 0.2
});

// TRAJECTORY DRAWING
gsap.to(".timeline-progress", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: ".trajectory",
        start: "top center",
        end: "bottom center",
        scrub: true
    }
});

// Animate Items Fading In
gsap.utils.toArray('.t-item').forEach((item) => {
    gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        onStart: () => {
            gsap.to(item.querySelector('.t-dot'), { scale: 1, opacity: 1, duration: 0.3, ease: "back.out" });
        }
    });
});

// --- GEOMETRIC WAVE CANVAS START ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const heroSection = document.querySelector('.hero');

    let width, height;
    let particles = [];
    const gap = 40;
    let rows, cols;
    let mouse = { x: -1000, y: -1000 };
    let time = 0;
    let isHoveringText = false; // Flag for text hover
    let hoverVal = 0; // Smoothed value (0.0 to 1.0)

    function initCanvas() {
        if (!heroSection) return;
        width = canvas.width = heroSection.offsetWidth; // Now full width
        height = canvas.height = heroSection.offsetHeight;

        particles = [];
        cols = Math.ceil(width / gap);
        rows = Math.ceil(height / gap);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                particles.push({
                    x: i * gap + (gap / 2),
                    y: j * gap + (gap / 2),
                    baseX: i * gap + (gap / 2),
                    baseY: j * gap + (gap / 2),
                    size: 2
                });
            }
        }
    }

    window.addEventListener('resize', initCanvas);
    window.addEventListener('load', initCanvas);
    initCanvas();

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Detect hover over specific text elements (tight fit)
    const textElements = document.querySelectorAll('.hero-text-container .status-badge, .hero-text-container h1, .hero-text-container p');
    textElements.forEach(el => {
        el.addEventListener('mouseenter', () => isHoveringText = true);
        el.addEventListener('mouseleave', () => isHoveringText = false);
    });

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        time += 0.02;

        // Smooth Interpolation with Easing
        // Target is 1 if hovering, 0 if not
        const targetHover = isHoveringText ? 1 : 0;
        hoverVal += (targetHover - hoverVal) * 0.05;

        // 1. Dynamic Radius: 75px (Default) -> 150px (Text Hover)
        const currentMaxDist = lerp(75, 150, hoverVal);

        // 2. Dynamic Color: #ccff00 (Lime) -> #333333 (Darker)
        const r = Math.round(lerp(204, 51, hoverVal));
        const g = Math.round(lerp(255, 51, hoverVal));
        const b = Math.round(lerp(0, 51, hoverVal));
        const highlightColor = `rgb(${r}, ${g}, ${b})`;

        particles.forEach((p, i) => {
            const waveOffset = Math.sin(p.x * 0.01 + time) * 10
                + Math.sin(p.y * 0.01 + time) * 10;

            let mouseEffect = 0;

            // Calculate Dist
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < currentMaxDist) {
                // Smooth falloff based on dynamic radius
                mouseEffect = (currentMaxDist - dist) / 5;
            }

            const currentY = p.baseY + waveOffset - mouseEffect;

            ctx.beginPath();
            // Scale effect
            const scale = 1 + (mouseEffect / 10);
            const size = p.size * scale;

            // Color Logic
            if (mouseEffect > 2) ctx.fillStyle = highlightColor;
            else ctx.fillStyle = '#222';

            ctx.arc(p.x, currentY, size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
}
