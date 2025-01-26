       // Enhanced JavaScript
       const menuToggle = document.querySelector('.menu-toggle');
       const navLinks = document.querySelector('.nav-links');
       const navbar = document.querySelector('.navbar');

       // Mobile menu toggle
       menuToggle.addEventListener('click', () => {
           menuToggle.classList.toggle('active');
           navLinks.classList.toggle('active');
       });

       // Close menu on click outside
       document.addEventListener('click', (e) => {
           if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
               menuToggle.classList.remove('active');
               navLinks.classList.remove('active');
           }
       });

       // Smooth scroll
       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
           anchor.addEventListener('click', function(e) {
               e.preventDefault();
               const target = document.querySelector(this.getAttribute('href'));
               target.scrollIntoView({
                   behavior: 'smooth',
                   block: 'start'
               });
           });
       });

       // Sticky navbar
       window.addEventListener('scroll', () => {
           if (window.scrollY > 100) {
               navbar.style.background = 'rgba(255,255,255,0.98)';
               navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
           } else {
               navbar.style.background = 'rgba(255,255,255,0.98)';
               navbar.style.boxShadow = 'none';
           }
       });

       // Parallax effect
       window.addEventListener('scroll', () => {
           const scrolled = window.pageYOffset;
           document.querySelector('.hero').style.backgroundPositionY = `calc(50% + ${scrolled * 0.5}px)`;
       });










       class PremiumCarousel {
        constructor() {
            this.container = document.querySelector('.carousel-container');
            this.track = document.querySelector('.carousel-track');
            this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
            this.indicators = Array.from(document.querySelectorAll('.carousel-indicator'));
            this.loadingOverlay = document.querySelector('.loading-overlay');
            this.currentIndex = 0;
            this.isAnimating = false;
            this.autoPlayInterval = null;
            this.slideWidth = this.container.offsetWidth;

            this.init();
        }

        init() {
            this.setupSlidePositions();
            this.setupEventListeners();
            this.preloadImages();
            this.setupIntersectionObserver();
            this.startAutoPlay();
            this.updateAccessibility();
        }

        setupSlidePositions() {
            this.slideWidth = this.container.offsetWidth;
            this.slides.forEach((slide, index) => {
                slide.style.left = `${this.slideWidth * index}px`;
            });
            this.track.style.transform = `translateX(-${this.slideWidth * this.currentIndex}px)`;
        }

        setupEventListeners() {
            document.querySelector('.carousel-button--right').addEventListener('click', () => this.nextSlide());
            document.querySelector('.carousel-button--left').addEventListener('click', () => this.prevSlide());
            
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            window.addEventListener('resize', () => {
                this.setupSlidePositions();
            });

            // Touch events
            let touchStartX = 0;
            this.track.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            this.track.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchStartX - touchEndX;
                Math.abs(deltaX) > 50 && (deltaX > 0 ? this.nextSlide() : this.prevSlide());
            });

            // Keyboard navigation
            document.addEventListener('keydown', e => {
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'ArrowLeft') this.prevSlide();
            });

            // Auto-play control
            this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        async preloadImages() {
            this.loadingOverlay.style.opacity = '1';
            const images = this.slides.map(slide => slide.querySelector('img'));
            
            await Promise.all(images.map(img => {
                return new Promise(resolve => {
                    const src = img.dataset.src;
                    if (!src) return resolve();
                    
                    const imageLoader = new Image();
                    imageLoader.src = src;
                    imageLoader.onload = () => {
                        img.src = src;
                        img.removeAttribute('data-src');
                        resolve();
                    };
                    imageLoader.onerror = resolve;
                });
            }));
            
            this.loadingOverlay.style.opacity = '0';
        }

        updateAccessibility() {
            this.slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== this.currentIndex);
            });
            this.indicators[this.currentIndex].setAttribute('aria-current', 'true');
        }

        nextSlide() {
            if (this.isAnimating) return;
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.animateTransition(nextIndex);
        }

        prevSlide() {
            if (this.isAnimating) return;
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.animateTransition(prevIndex);
        }

        goToSlide(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            this.animateTransition(index);
        }

        animateTransition(newIndex) {
            this.isAnimating = true;
            this.slides[this.currentIndex].classList.remove('active');
            this.slides[newIndex].classList.add('active');
            this.track.style.transform = `translateX(-${this.slideWidth * newIndex}px)`;
            
            this.currentIndex = newIndex;
            this.updateIndicators();
            this.updateAccessibility();

            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        }

        updateIndicators() {
            this.indicators.forEach(indicator => indicator.classList.remove('active'));
            this.indicators[this.currentIndex].classList.add('active');
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 8000);
        }

        stopAutoPlay() {
            clearInterval(this.autoPlayInterval);
        }

        setupIntersectionObserver() {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startAutoPlay();
                    } else {
                        this.stopAutoPlay();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.container);
        }
    }

    // Initialize carousel
    new PremiumCarousel();








    const teamCarousel = document.querySelector('.team-carousel');
    const teamCards = document.querySelectorAll('.team-card');
    const teamPrevBtn = document.querySelector('.team-carousel-prev');
    const teamNextBtn = document.querySelector('.team-carousel-next');
    const teamDotsContainer = document.querySelector('.team-dots-container');
    let teamCurrentIndex = 0;
    
    function teamUpdateCarousel() {
        const cardWidth = teamCards[0].offsetWidth + 32;
        teamCarousel.scrollTo({
            left: teamCurrentIndex * cardWidth,
            behavior: 'smooth'
        });
        teamUpdateDots();
    }
    
    function teamUpdateDots() {
        document.querySelectorAll('.team-dot').forEach((dot, index) => {
            dot.style.background = index === teamCurrentIndex ? '#6c5ce7' : '#dfe6e9';
        });
    }
    
    teamNextBtn.addEventListener('click', () => {
        teamCurrentIndex = (teamCurrentIndex + 1) % teamCards.length;
        teamUpdateCarousel();
    });
    
    teamPrevBtn.addEventListener('click', () => {
        teamCurrentIndex = (teamCurrentIndex - 1 + teamCards.length) % teamCards.length;
        teamUpdateCarousel();
    });
    
    // Touch swipe handling
    let teamTouchStartX = 0;
    
    teamCarousel.addEventListener('touchstart', e => {
        teamTouchStartX = e.touches[0].clientX;
    });
    
    teamCarousel.addEventListener('touchend', e => {
        const teamTouchEndX = e.changedTouches[0].clientX;
        const teamSwipeThreshold = 50;
        
        if (teamTouchStartX - teamTouchEndX > teamSwipeThreshold) {
            teamNextBtn.click();
        }
        if (teamTouchEndX - teamTouchStartX > teamSwipeThreshold) {
            teamPrevBtn.click();
        }
    });
    
    // Create dots navigation
    teamCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('team-dot');
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${index === 0 ? '#6c5ce7' : '#dfe6e9'};
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        dot.addEventListener('click', () => {
            teamCurrentIndex = index;
            teamUpdateCarousel();
        });
        teamDotsContainer.appendChild(dot);
    });









     // YouTube Carousel Logic
     let youtubeCurrentSlide = 0;
     const youtubeSlides = document.querySelectorAll('.youtube-slide');
     const youtubeTotalSlides = youtubeSlides.length;

     function youtubeShowSlide(n) {
         youtubeSlides.forEach(slide => slide.classList.remove('youtube-active'));
         youtubeCurrentSlide = (n + youtubeTotalSlides) % youtubeTotalSlides;
         youtubeSlides[youtubeCurrentSlide].classList.add('youtube-active');
         youtubeResetVideos();
     }

     function youtubeResetVideos() {
         document.querySelectorAll('.youtube-iframe').forEach(iframe => {
             iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
         });
     }

     // Navigation Controls
     document.querySelector('.youtube-carousel-prev').addEventListener('click', () => {
         youtubeShowSlide(youtubeCurrentSlide - 1);
     });

     document.querySelector('.youtube-carousel-next').addEventListener('click', () => {
         youtubeShowSlide(youtubeCurrentSlide + 1);
     });

     // Play Button Functionality
     document.querySelectorAll('.youtube-play-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
             const iframe = e.target.closest('.youtube-video-wrapper').querySelector('.youtube-iframe');
             iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
             btn.style.display = 'none';
         });
     });

     // YouTube API Loader
     const tag = document.createElement('script');
     tag.src = "https://www.youtube.com/iframe_api";
     document.body.appendChild(tag);










     // JavaScript for particles
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.particles-container');
    const particleCount = 50;
  
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position and size
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        background: ${color};
      `;
      
      container.appendChild(particle);
    }
  });