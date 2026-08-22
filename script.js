/* ============================================
   茂达智联 V3.0 — Interactive JavaScript
   ============================================ */

(function() {
    'use strict';

    /* ===== Theme Toggle ===== */
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;

    var savedTheme = localStorage.getItem('maoda-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('maoda-theme', next);
        });
    }

    /* ===== Mobile Menu ===== */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
            });
        });
    }

    /* ===== Navbar Scroll + Back to Top ===== */
    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        var y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 50);
        if (backToTop) backToTop.classList.toggle('visible', y > 600);
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===== Cases & News Tabs ===== */
    function bindTabs(tabSel, panelSel) {
        document.querySelectorAll(tabSel).forEach(function(tab) {
            tab.addEventListener('click', function() {
                var key = this.dataset.tab;
                document.querySelectorAll(tabSel).forEach(function(t) {
                    t.classList.toggle('active', t === tab);
                });
                document.querySelectorAll(panelSel).forEach(function(p) {
                    p.classList.toggle('active', p.id === key);
                });
            });
        });
    }
    bindTabs('.case-tab', '.case-panel');
    bindTabs('.news-tab', '.news-panel');

    /* ===== Stat Counter Animation ===== */
    var counters = document.querySelectorAll('.stat-number');
    var counterAnimated = false;

    function animateCounter(el) {
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 1600;
        var start = performance.now();
        function step(now) {
            var t = Math.min((now - start) / duration, 1);
            var ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
            var val = Math.floor(target * ease);
            el.textContent = val + suffix;
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
    }

    if (counters.length && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    counters.forEach(animateCounter);
                    io.disconnect();
                }
            });
        }, { threshold: 0.3 });
        if (counters[0]) io.observe(counters[0].closest('.hero-stats'));
    }

    /* ===== Reveal on Scroll ===== */
    if ('IntersectionObserver' in window) {
        var revealTargets = document.querySelectorAll(
            '.service-block, .case-field, .result-block, .team-card, ' +
            '.country-item, .qual-fact, .qual-figure, .culture-card, ' +
            '.stat-item, .partner-logo, .contact-item, .news-article-card'
        );
        revealTargets.forEach(function(el) {
            el.classList.add('reveal');
        });
        var ro = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    ro.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
        revealTargets.forEach(function(el) { ro.observe(el); });
    }

    /* ===== Contact Form Validation ===== */
    var contactForm = document.getElementById('contactForm');
    var formNotice = document.getElementById('formNotice');

    if (contactForm && formNotice) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = contactForm.name.value.trim();
            var phone = contactForm.phone.value.trim();

            if (!name || !phone) {
                formNotice.className = 'form-notice error';
                formNotice.textContent = '请填写姓名和联系电话';
                return;
            }
            if (!/^[\d\-\+\s\(\)]{7,20}$/.test(phone)) {
                formNotice.className = 'form-notice error';
                formNotice.textContent = '请填写有效的联系电话';
                return;
            }

            formNotice.className = 'form-notice';
            formNotice.textContent = '正在提交…';

            setTimeout(function() {
                formNotice.className = 'form-notice success';
                formNotice.textContent = '提交成功！我们将在24小时内联系您。';
                contactForm.reset();
                setTimeout(function() {
                    formNotice.textContent = '';
                    formNotice.className = 'form-notice';
                }, 5000);
            }, 800);
        });
    }

    /* ===== Smooth Scroll ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 76;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    /* ===== Magnetic Effect (subtle) ===== */
    document.querySelectorAll('.btn-primary').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var r = this.getBoundingClientRect();
            var x = (e.clientX - r.left - r.width / 2) * 0.12;
            var y = (e.clientY - r.top - r.height / 2) * 0.12;
            this.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        });
        btn.addEventListener('mouseleave', function() { this.style.transform = ''; });
    });

    /* ===== Qualification Image Lightbox ===== */
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.qual-figure[data-zoom]').forEach(function(fig) {
            fig.addEventListener('click', function() {
                lightboxImg.src = this.getAttribute('data-zoom');
                lightboxImg.alt = this.querySelector('img') ? this.querySelector('img').alt : '';
                lightbox.classList.add('is-open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    console.log('%c茂达智联 V3.0', 'font-size: 24px; font-weight: bold; color: #C9A84C;');
    console.log('%c知识产权全生命周期管理专家', 'font-size: 14px; color: #1A3A5C;');
    console.log('%c© 2016-2026 深圳茂达智联知识产权代理事务所（普通合伙）', 'font-size: 12px; color: #888;');

})();