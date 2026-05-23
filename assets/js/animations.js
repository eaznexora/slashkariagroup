document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Once visible, we can stop observing this specific element
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly negative margin to trigger a bit later
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Special handling for the Stats numbers animation
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                const endValue = parseFloat(text.replace('+', ''));
                const isPlus = text.includes('+');
                let startValue = 0;
                
                const duration = 1500; // 1.5 seconds for all
                const frameRate = 20; // 50 frames per second
                const totalFrames = duration / frameRate;
                const increment = endValue / totalFrames;
                
                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= endValue) {
                        target.innerText = endValue + (isPlus ? '+' : '');
                        clearInterval(timer);
                    } else {
                        // For large numbers, don't show decimals. For small ones, show 1 decimal.
                        if (endValue >= 100) {
                            target.innerText = Math.floor(startValue) + (isPlus ? '+' : '');
                        } else {
                            target.innerText = startValue.toFixed(1) + (isPlus ? '+' : '');
                        }
                    }
                }, frameRate);
                
                observer.unobserve(target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
});
