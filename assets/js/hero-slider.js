document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.hero-slider-container');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-slider-dots .dot');
    const prevBtn = document.querySelector('.hero-slider-arrow.prev');
    const nextBtn = document.querySelector('.hero-slider-arrow.next');

    if (!sliderContainer || slides.length === 0) return;

    // Clone slides for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    
    // Remove duplicate IDs from clones if any (though not strictly necessary here)
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    sliderContainer.appendChild(firstClone);
    sliderContainer.insertBefore(lastClone, slides[0]);

    // Updated slides list including clones
    const allSlides = document.querySelectorAll('.hero-slide');
    const slideCount = slides.length; // Original count
    let currentIndex = 1; // Start at the first real slide (index 1 because of prepended clone)
    
    let startX = 0;
    let isDragging = false;
    let startTime = 0;
    let isTransitioning = false;

    let fallbackTimeout;

    function checkBoundary() {
        if (currentIndex === 0) {
            currentIndex = slideCount;
            updateSlider(false);
        } else if (currentIndex === slideCount + 1) {
            currentIndex = 1;
            updateSlider(false);
        }
    }

    function updateSlider(withTransition = true) {
        if (!withTransition) {
            sliderContainer.style.transition = 'none';
            isTransitioning = false;
        } else {
            sliderContainer.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
            isTransitioning = true;
            clearTimeout(fallbackTimeout);
            fallbackTimeout = setTimeout(() => {
                isTransitioning = false;
                checkBoundary();
            }, 650); // Fallback to unlock
        }
        
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Calculate dot index (normalized to original slide count)
        let dotIndex = currentIndex - 1;
        if (currentIndex === 0) dotIndex = slideCount - 1;
        if (currentIndex === slideCount + 1) dotIndex = 0;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });

        // Trigger reveal animation
        const activeSlide = allSlides[currentIndex];
        if (!activeSlide) return; // Prevent out-of-bounds error
        const content = activeSlide.querySelector('.hero-content');
        if (content && !content.classList.contains('reveal-visible')) {
            setTimeout(() => content.classList.add('reveal-visible'), 100);
        }
    }

    // Handle the jump at the end of transition for seamless loop
    sliderContainer.addEventListener('transitionend', (e) => {
        if (e.target !== sliderContainer) return;
        clearTimeout(fallbackTimeout);
        isTransitioning = false;
        checkBoundary();
    });

    function goToNextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        updateSlider();
    }

    function goToPrevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        updateSlider();
    }

    // Button Click Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPrevSlide();
            resetAutoSlide();
        });
    }

    // Dot Click Listeners
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = parseInt(dot.getAttribute('data-index')) + 1;
            updateSlider();
            resetAutoSlide();
        });
    });

    // Touch Events for Mobile Swiping
    sliderContainer.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        startX = e.touches[0].clientX;
        startTime = new Date().getTime();
        isDragging = true;
        sliderContainer.style.transition = 'none';
        resetAutoSlide();
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        const containerWidth = sliderContainer.offsetWidth;
        let movePercent = (diff / containerWidth) * 100;
        movePercent = Math.max(-100, Math.min(100, movePercent)); // Prevent moving more than one slide
        const translate = (-currentIndex * 100) + movePercent;
        
        sliderContainer.style.transform = `translateX(${translate}%)`;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        const endTime = new Date().getTime();
        const timeDiff = endTime - startTime;
        
        sliderContainer.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
        isTransitioning = true;
        
        const threshold = sliderContainer.offsetWidth * 0.2;
        const isFastFlick = timeDiff < 300 && Math.abs(diff) > 30;

        if (diff < -threshold || (isFastFlick && diff < 0)) {
            currentIndex++;
        } else if (diff > threshold || (isFastFlick && diff > 0)) {
            currentIndex--;
        }
        
        updateSlider();
    });

    // Auto-slide
    let autoSlideInterval = setInterval(goToNextSlide, 6000);

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(goToNextSlide, 8000);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        sliderContainer.style.transition = 'none';
        isTransitioning = false;
        updateSlider(false);
    });

    // Initial positioning
    updateSlider(false);
});
