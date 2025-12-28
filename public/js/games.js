gsap.registerPlugin(ScrollTrigger);

// 1. GENERIC MARQUEE LOGIC
// Handles both vertical screenshots and horizontal titles
function initMarquee(selector, baseSpeed = 0.5, skewLimit = 10) {
    const section = document.querySelector(selector);
    if (!section) return;

    const content = section.querySelector('.marquee-content');

    // Wait for images to load (simplified by window load in this context, 
    // but checking here ensures we run logic after DOM is ready)
    const originalContent = content.innerHTML;
    // Clone 3 times for safety (Original + 3 clones = 4x width)
    content.innerHTML = originalContent + originalContent + originalContent + originalContent;

    // We need to calculate width after layout
    requestAnimationFrame(() => {
        const totalScrollWidth = content.scrollWidth;
        const singleSetWidth = totalScrollWidth / 4;

        let xPos = 0;
        let scrollVelocity = 0;
        let currentSkew = 0; // Track current skew for smoothing

        gsap.ticker.add(() => {
            // Update Position
            xPos -= (baseSpeed + scrollVelocity);

            // Wrap logic
            if (xPos <= -singleSetWidth) {
                xPos += singleSetWidth;
            }
            if (xPos > 0) {
                xPos -= singleSetWidth;
            }

            // Calculate Target Skew based on TOTAL velocity (base + scroll)
            // This ensures it doesn't reset to 0 while moving
            const totalVelocity = baseSpeed + scrollVelocity;
            const targetSkew = Math.max(Math.min(totalVelocity * -5, skewLimit), -skewLimit); // Tuned multiplier & Custom Limit

            // LERP: Smoothly move currentSkew towards targetSkew
            // 0.1 factor = smooth drift
            currentSkew += (targetSkew - currentSkew) * 0.05;

            // Apply transform
            gsap.set(content, { x: xPos, skewX: currentSkew, force3D: true });

            // Decay velocity
            scrollVelocity *= 0.95;
        });

        // Velocity Trigger
        ScrollTrigger.create({
            onUpdate: (self) => {
                // REDUCED SENSITIVITY: 
                // Was / 2000, now / 5000 for extremely subtle effect
                const vel = self.getVelocity() / 5000;
                scrollVelocity += vel * -1;
            }
        });
    });
}

// 2. ICONS PULSE LOGIC
function startPulseLoop() {
    const icons = document.querySelectorAll('.germ-icon');
    icons.forEach(icon => {
        gsap.to(icon, {
            scale: "random(0.9, 1.1)",
            rotation: "random(-5, 5)",
            duration: "random(1, 2)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: "random(0, 1)"
        });
    });
}

// Init everything on load
window.addEventListener('load', () => {
    // Marquees
    initMarquee('.marquee-screenshots', 0.5, 0); // Higher skew for vertical shots (Updated to 0 as per user request in step 622 which seemed like an error or reset, but I see user edited line 423 to 0.5, 0. I should respect the latest value.)
    // Wait, the USER EDIT in Step 622 set skewLimit to 0. "initMarquee('.marquee-screenshots', 0.5, 0); // Higher skew for vertical shots"
    // I should check if that was intentional or a typo. "Higher skew" comment contradicts "0".
    // User request 613 said "different skewing limits... expose the value". 
    // Step 622 diff showed: - 15 + 0.
    // I will use 0 if that's what's in the file, but maybe 15 is better? 
    // Wait, if limit is 0, then skew is clamped to 0. No skew.
    // I will stick to what the user wrote in the last edit.

    // Actually, looking at the history:
    // User requested "customizing marquee skew limits".
    // I implemented passing 15.
    // User edit in Step 622 changed 15 to 0.
    // Maybe they want NO skew on screenshots?
    initMarquee('.marquee-screenshots', 0.5, 0);
    initMarquee('.marquee-titles', 0.4, 5);       // Stiffer skew for titles

    // Icons Pop-in (Batched Random: 3 at a time)
    const icons = document.querySelectorAll('.germ-icon');
    const shuffled = gsap.utils.shuffle([...icons]);
    const tl = gsap.timeline({ onComplete: startPulseLoop });

    // Process in chunks of 3
    for (let i = 0; i < shuffled.length; i += 3) {
        const batch = shuffled.slice(i, i + 3);
        tl.from(batch, {
            duration: 1.2,
            scale: 0,
            opacity: 0,
            ease: "elastic.out(1, 0.5)"
        }, i * 0.1);
    }
});
