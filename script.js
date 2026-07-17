/* ============================================
   茂达智联 V1.0 — Interactive JavaScript
   ============================================ */

(function() {
    'use strict';

    /* ===== Theme Toggle ===== */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('maoda-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('maoda-theme', newTheme);
    });

    /* ===== Mobile Menu ===== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ===== Navbar Scroll Effect ===== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    /* ===== Back to Top ===== */
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== Active Nav Link on Scroll ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        var scrollY = window.scrollY + 100;

        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* ===== Counter Animation ===== */
    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'), 10);
        var suffix = element.getAttribute('data-suffix') || '';
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    /* ===== Intersection Observer for Reveal & Counter ===== */
    var revealElements = document.querySelectorAll('.section-header, .about-intro, .about-culture, .service-card, .process-step, .case-card, .partner-logo, .contact-item, .contact-form-wrapper, .advantage-item, .culture-card, .highlight-item, .intl-section, .qual-item');

    revealElements.forEach(function(el, index) {
        el.classList.add('reveal');
        if (index % 4 === 1) el.classList.add('reveal-delay-1');
        if (index % 4 === 2) el.classList.add('reveal-delay-2');
        if (index % 4 === 3) el.classList.add('reveal-delay-3');
    });

    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counter animation for stat numbers
                var counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(function(counter) {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });

                // Also check if the element itself is a stat number
                if (entry.target.classList.contains('stat-number') && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements and stat numbers
    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });

    // Also observe stat numbers directly (in hero section)
    document.querySelectorAll('.stat-number').forEach(function(el) {
        revealObserver.observe(el);
    });

    // Trigger hero counters immediately
    setTimeout(function() {
        document.querySelectorAll('.hero .stat-number').forEach(function(counter) {
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }, 500);

    /* ===== Service Card Expand/Collapse ===== */
    document.querySelectorAll('.service-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            var card = this.closest('.service-card');
            card.classList.toggle('expanded');

            if (card.classList.contains('expanded')) {
                this.textContent = '收起详情';
            } else {
                this.textContent = '查看详情';
            }
        });
    });

    /* ===== Case Tabs ===== */
    var caseTabs = document.querySelectorAll('.case-tab');
    var casePanels = document.querySelectorAll('.case-panel');

    caseTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var targetTab = this.getAttribute('data-tab');

            caseTabs.forEach(function(t) { t.classList.remove('active'); });
            casePanels.forEach(function(p) { p.classList.remove('active'); });

            this.classList.add('active');
            var targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    /* ===== Contact Form ===== */
    var contactForm = document.getElementById('contactForm');
    var formNotice = document.getElementById('formNotice');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var phone = document.getElementById('phone').value.trim();

            if (!name || !phone) {
                formNotice.className = 'form-notice error';
                formNotice.textContent = '请填写姓名和联系电话';
                return;
            }

            // Phone validation (Chinese mobile)
            var phonePattern = /^1[3-9]\d{9}$/;
            if (!phonePattern.test(phone)) {
                formNotice.className = 'form-notice error';
                formNotice.textContent = '请输入正确的手机号码';
                return;
            }

            // Simulate form submission
            formNotice.className = 'form-notice';
            formNotice.textContent = '正在提交...';

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

    /* ===== Smooth Scroll for Anchor Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 72; // navbar height
                var targetPosition = target.offsetTop - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    /* ===== Magnetic Effect for Buttons ===== */
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    console.log('%c茂达智联 V1.0', 'font-size: 24px; font-weight: bold; color: #C9A84C;');
    console.log('%c知识产权全生命周期管理专家', 'font-size: 14px; color: #1A3A5C;');
    console.log('%c© 2016-2026 深圳茂达智联知识产权代理事务所', 'font-size: 12px; color: #888;');

})();
