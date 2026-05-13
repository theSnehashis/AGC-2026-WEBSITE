(function () {
    const brightnessCache = new Map();

    function getImageSource(img) {
        return img.currentSrc || img.getAttribute('src') || '';
    }

    function getOverlayOpacity(averageBrightness) {
        if (averageBrightness >= 195) return 0.62;
        if (averageBrightness >= 160) return 0.54;
        if (averageBrightness >= 120) return 0.46;
        if (averageBrightness >= 90)  return 0.40;
        return 0.32;
    }

    function applyOverlayToMatchingSlides(imageSrc, opacity) {
        document.querySelectorAll('.hero-swiper .swiper-slide').forEach(function (slide) {
            const slideImg = slide.querySelector('img');
            if (!slideImg) return;
            const slideSrc = getImageSource(slideImg);
            if (slideSrc === imageSrc || slideImg.getAttribute('src') === imageSrc) {
                slide.style.setProperty('--adaptive-overlay-opacity', opacity.toFixed(2));
            }
        });
    }

    function analyzeSlideImage(img) {
        const imageSrc = getImageSource(img);
        if (!imageSrc) return;

        if (brightnessCache.has(imageSrc)) {
            applyOverlayToMatchingSlides(imageSrc, brightnessCache.get(imageSrc));
            return;
        }

        const canvas  = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) { applyOverlayToMatchingSlides(imageSrc, 0.5); return; }

        const sampleSize = 48;
        canvas.width = canvas.height = sampleSize;

        try {
            context.drawImage(img, 0, 0, sampleSize, sampleSize);
            const imageData = context.getImageData(0, 0, sampleSize, sampleSize).data;
            let colorTotal = 0, pixelCount = 0;

            for (let i = 0; i < imageData.length; i += 16) {
                colorTotal += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
                pixelCount++;
            }

            const averageBrightness = pixelCount ? colorTotal / pixelCount : 128;
            const overlayOpacity    = getOverlayOpacity(averageBrightness);
            brightnessCache.set(imageSrc, overlayOpacity);
            applyOverlayToMatchingSlides(imageSrc, overlayOpacity);
        } catch (error) {
            applyOverlayToMatchingSlides(imageSrc, 0.5);
        }
    }

    function setupAdaptiveHeroOverlay() {
        document.querySelectorAll('.hero-swiper .swiper-slide img').forEach(function (img) {
            const imageSrc = getImageSource(img);
            if (!imageSrc) return;

            if (brightnessCache.has(imageSrc)) {
                applyOverlayToMatchingSlides(imageSrc, brightnessCache.get(imageSrc));
                return;
            }

            if (img.complete && img.naturalWidth > 0) {
                analyzeSlideImage(img);
            } else {
                img.addEventListener('load', function () {
                    analyzeSlideImage(img);
                }, { once: true });
            }
        });
    }

    new Swiper('.hero-swiper', {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 4200,
            disableOnInteraction: false
        },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        allowTouchMove: true,           /* enables swipe on mobile with fade effect */
        touchStartPreventDefault: false,
        simulateTouch: true,
        pagination: {
            el: '.hero-swiper .swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.hero-swiper .swiper-button-next',
            prevEl: '.hero-swiper .swiper-button-prev'
        },
        on: {
            init:                       function () { setupAdaptiveHeroOverlay(); },
            slideChangeTransitionStart:  function () { setupAdaptiveHeroOverlay(); }
        }
    });
})();