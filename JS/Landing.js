// ==============================
// SCROLL ZOOM ANIMATION LOGIC
// ==============================

const scrollContainer = document.getElementById('scrollContainer');
const zoomSection = document.getElementById('zoomSection');
const zoomTitle = document.getElementById('zoomTitle');
const zoomTagline = document.getElementById('zoomTagline');
const videoContainer = document.getElementById('videoContainer');
const mainVideo = document.getElementById('mainVideo');
const videoOverlay = document.getElementById('videoOverlay');
const scrollIndicator = document.getElementById('scrollIndicator');
const continueIndicator = document.getElementById('continueIndicator');
const mainContent = document.getElementById('mainContent');
const mainHeader = document.getElementById('mainHeader');
const letterE = document.querySelector('.letter-e');
const letterRest = document.querySelector('.letter-rest');
const zoomBackground = document.getElementById('zoomBackground');
const zoomContent = document.querySelector('.zoom-content');

let videoPlayed = false;

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function handleScroll() {
    // Safety: if main elements are missing, do nothing
    if (!scrollContainer || !zoomSection || !zoomTitle || !zoomTagline || !videoContainer) {
        return;
    }

    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollable = scrollContainer.offsetHeight - window.innerHeight;

    if (totalScrollable <= 0) return;

    // progress 0 → 1 while we scroll through scrollContainer
    const insideScroll = clamp(-rect.top, 0, totalScrollable);
    const scrollProgress = clamp(insideScroll / totalScrollable, 0, 1);

    // Optional: fade/zoom background slightly
    if (zoomBackground) {
        zoomBackground.style.transform = `scale(${1 + scrollProgress * 0.4})`;
        zoomBackground.style.opacity = String(0.7 + scrollProgress * 0.2);
    }

    // PHASE BREAKPOINTS
    const ZOOM_END = 0.30;
    const VIDEO_PHASE = 0.55;
    const TRANSITION_START = 0.75;

    // Phase 1: Zoom into the E (0 → ZOOM_END)
    if (scrollProgress <= ZOOM_END) {
        const zoomProgress = scrollProgress / ZOOM_END;

        // scale ~ 1 → 3 (not insane 15x)
        const scale = 1 + zoomProgress * 2;
        zoomTitle.style.transform = `scale(${scale})`;
        zoomTitle.style.opacity = '1';

        if (letterRest) {
            letterRest.style.opacity = String(clamp(1 - zoomProgress * 3, 0, 1));
        }

        zoomTagline.style.opacity = String(clamp(1 - zoomProgress * 2, 0, 1));

        if (scrollIndicator) {
            scrollIndicator.style.opacity = String(clamp(1 - zoomProgress * 2, 0, 1));
            scrollIndicator.classList.remove('hidden');
        }

        videoContainer.classList.remove('expanded');
        continueIndicator && continueIndicator.classList.remove('visible');

        if (zoomContent) {
            zoomContent.style.opacity = '1';
            zoomContent.style.visibility = 'visible';
        }
    }

    // Phase 2: Title fades, video expands (ZOOM_END → VIDEO_PHASE)
    else if (scrollProgress <= VIDEO_PHASE) {
        const videoProgress = (scrollProgress - ZOOM_END) / (VIDEO_PHASE - ZOOM_END);

        zoomTitle.style.opacity = String(clamp(1 - videoProgress * 2, 0, 1));
        zoomTagline.style.opacity = '0';
        letterRest && (letterRest.style.opacity = '0');

        if (videoProgress > 0.3) {
            videoContainer.classList.add('expanded');
            continueIndicator && continueIndicator.classList.add('visible');
        }

        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.classList.add('hidden');
        }

        if (zoomContent) {
            zoomContent.style.opacity = '0';
            zoomContent.style.visibility = 'hidden';
        }
    }

    // Phase 3: Video fully visible, waiting to transition (VIDEO_PHASE → TRANSITION_START)
    else if (scrollProgress <= TRANSITION_START) {
        videoContainer.classList.add('expanded');
        continueIndicator && continueIndicator.classList.add('visible');
        zoomTitle.style.opacity = '0';

        if (zoomContent) {
            zoomContent.style.opacity = '0';
            zoomContent.style.visibility = 'hidden';
        }
    }

    // Phase 4: Fade out zoom section and show main content (> TRANSITION_START)
    else {
        const contentProgress = clamp(
            (scrollProgress - TRANSITION_START) / (1 - TRANSITION_START),
            0,
            1
        );

        zoomSection.style.opacity = String(clamp(1 - contentProgress, 0, 1));

        if (contentProgress > 0.3) {
            mainContent && mainContent.classList.add('visible');
            mainHeader && mainHeader.classList.add('visible');
        }

        if (zoomContent) {
            zoomContent.style.opacity = '0';
            zoomContent.style.visibility = 'hidden';
        }
    }
}

// Video play/pause on overlay click
if (videoOverlay && mainVideo) {
    videoOverlay.addEventListener('click', function () {
        if (mainVideo.paused) {
            mainVideo.play().catch(() => {});
            videoOverlay.classList.add('hidden');
            videoPlayed = true;
        }
    });

    mainVideo.addEventListener('click', function () {
        if (!mainVideo.paused) {
            mainVideo.pause();
            videoOverlay.classList.remove('hidden');
        } else {
            mainVideo.play().catch(() => {});
            videoOverlay.classList.add('hidden');
        }
    });

    mainVideo.addEventListener('ended', function () {
        videoOverlay.classList.remove('hidden');
    });
}

// Throttled scroll handler
let ticking = false;
window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Initial call
handleScroll();
        // Mobile Menu Toggle
        function toggleMenu() {
            const mobileNav = document.getElementById('mobileNav');
            mobileNav.classList.toggle('active');
        }

        // Close mobile menu when link clicked
        document.addEventListener('DOMContentLoaded', () => {
            const mobileNav = document.getElementById('mobileNav');
            const navLinks = mobileNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('active');
                });
            });
        });

        // Animated Counter
        function animateCounter(element, target, duration) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = Math.floor(target);
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start);
                }
            }, 16);
        }

        // Intersection Observer for counters
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            observer.observe(statsContainer);
        }

        // Sponsors Data
        const sponsors = [
            { src: './images/Sponsors/SIUK.png', alt: 'SI-UK - Study Abroad  Partner' },
            { src: './images/Sponsors/paradise_group.png', alt: 'Paradise Group - Associate Partner' },
            { src: './images/Sponsors/upgrad.png', alt: 'UpGrad - Academic Partner' },
            { src: './images/Sponsors/krawlnet.png', alt: 'Krawlnet - Technical Partner' },
            { src: './images/Sponsors/cosyloom.png', alt: 'Cosyloom - Clothing Partner' },
            { src: './images/Sponsors/Social_Affair.png', alt: 'The Social Affair Cafe - Refreshment Partner' },
            { src: './images/Sponsors/Habbit.png', alt: 'Habhit - Bubbly Fruity Drink' },
            { src: './images/Sponsors/rvr arena.png', alt: 'RVR World - Gaming Partner' },
            { src: './images/Sponsors/maannomay.png', alt: 'Maannomay - Enterprise Partner' },
        ];

        // Speakers Data
        const speakers = [
            { id: 1, image: './images/Speakers/Ashish.jpeg', name: 'Mr. Ashish Chanchlani' },
            { id: 3, image: './images/Speakers/RK Sir.png', name: 'Mr. Rajendra Kadam' },
            { id: 4, image: './images/Speakers/Shridhar-Mankar.png', name: 'Mr. Shridhar Mankar' },
            { id: 5, image: './images/Speakers/Devesh-Chawla.png', name: 'Mr. Devesh Chawla' },
            { id: 6, image: './images/Speakers/Ali-Solanki.png', name: 'Mr. Ali Solanki' },
            { id: 7, image: './images/Speakers/aditi-madhan.png', name: 'Ms. Aditi Madhan' },
            { id: 8, image: './images/Speakers/Ammar-khanna.png', name: 'Dr. Amar Khanna' },
            { id: 9, image: './images/Speakers/Arjun-Deshpande.png', name: 'Mr. Arjun Deshpande' },
            { id: 10, image: './images/Speakers/raj-padiyar.jpg', name: 'Dr. Raj Padhiyar' },
            { id: 11, image: './images/Speakers/Annimika-shukla.jpg', name: 'Ms. Annamika Shukla' }
        ];

        // Populate Sponsors
        const sponsorsTrack = document.getElementById('sponsorsTrack');
        const sponsorsLoop = [...sponsors, ...sponsors];
        sponsorsLoop.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card';
            card.innerHTML = `
                <div class="sponsor-image-container">
                    <img src="${sponsor.src}" alt="${sponsor.alt}"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22%3E${sponsor.alt}%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="sponsor-name">
                    <h3>${sponsor.alt}</h3>
                </div>
            `;
            sponsorsTrack.appendChild(card);
        });

        // Populate Speakers
        const speakersTrack = document.getElementById('speakersTrack');
        const speakersLoop = [...speakers, ...speakers];
        speakersLoop.forEach(speaker => {
            const card = document.createElement('div');
            card.className = 'speaker-card';
            card.innerHTML = `
                <div class="speaker-image-container">
                    <img src="${speaker.image}" alt="${speaker.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22220%22%3E%3Crect fill=%22%23242222%22 width=%22280%22 height=%22220%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23fff%22%3ESpeaker%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="speaker-name">
                    <h3>${speaker.name}</h3>
                </div>
            `;
            speakersTrack.appendChild(card);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    const mobileNav = document.getElementById('mobileNav');
                    if (mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                    }
                }
            });
        });

        // Pause carousel animations when not visible
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const track = entry.target.querySelector('.sponsors-track, .speakers-track');
                if (track) {
                    if (entry.isIntersecting) {
                        track.style.animationPlayState = 'running';
                    } else {
                        track.style.animationPlayState = 'paused';
                    }
                }
            });
        }, { threshold: 0.2 });

        const sponsorsSection = document.querySelector('.sponsors');
        const speakersSection = document.querySelector('.speakers');
        if (sponsorsSection) carouselObserver.observe(sponsorsSection);
        if (speakersSection) carouselObserver.observe(speakersSection);