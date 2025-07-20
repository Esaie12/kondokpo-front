// src/utils/uiHelpers.js

export function toggleMobileMenu() {
    const sidebar = document.querySelector('.nav-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (sidebar && overlay && menuBtn) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        menuBtn.classList.toggle('active');
    }
}

export function closeMobileMenu() {
    const sidebar = document.querySelector('.nav-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (sidebar && overlay && menuBtn) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        menuBtn.classList.remove('active');
    }
}

// Observer + animation au scroll
export function observeCampaignCards() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.campaign-card').forEach(card => {
        observer.observe(card);
    });
}

// Hover interactions
export function setupHoverEffects() {
    document.querySelectorAll('.campaign-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}
