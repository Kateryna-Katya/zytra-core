/**
 * ZYTRA CORE - Absolute Final Script v6
 * Исправлено: закрытие меню и мобильная адаптация
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // 1. ПЛАВНЫЙ СКРОЛЛ (Lenis)
    const lenis = new Lenis();
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    lucide.createIcons();

    // 3. THREE.JS: ФОН В HERO
    const initHeroScene = () => {
        const container = document.querySelector('#hero-canvas');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const geometry = new THREE.BufferGeometry();
        const pts = new Float32Array(1800 * 3);
        for(let i=0; i<5400; i++) pts[i] = (Math.random() - 0.5) * 12;
        geometry.setAttribute('position', new THREE.BufferAttribute(pts, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 0.018,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            points.rotation.y += 0.001;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };
    initHeroScene();

    // 4. МОБИЛЬНОЕ МЕНЮ (Исправленная логика закрытия)
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('#menuOverlay');
    const mobileLinks = document.querySelectorAll('.nav-mobile__link');

    const toggleMenu = () => {
        const isActive = menu.classList.toggle('is-active');
        burger?.classList.toggle('is-active');
        
        if (isActive) {
            lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis.start();
            document.body.style.overflow = '';
        }
    };

    // Открытие/закрытие по бургеру
    burger?.addEventListener('click', toggleMenu);

    // ЗАКРЫТИЕ ПРИ КЛИКЕ НА ЛЮБУЮ ССЫЛКУ
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('is-active')) {
                toggleMenu();
            }
        });
    });

    // 5. COOKIE POPUP
    const cookiePopup = document.querySelector('#cookiePopup');
    const cookieBtn = document.querySelector('#cookieAccept');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookiePopup?.classList.add('is-visible'), 2000);
    }

    cookieBtn?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiePopup?.classList.remove('is-visible');
    });

    // 6. АНИМАЦИИ ПОЯВЛЕНИЯ (Reveal)
    const revealItems = document.querySelectorAll('.js-reveal');
    revealItems.forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 92%" },
            y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
    });

    // 7. СТЕКОВЫЕ КАРТОЧКИ (Innovations)
    const stacks = document.querySelectorAll('.stack-card');
    stacks.forEach((card, i) => {
        if(i < stacks.length - 1) {
            gsap.to(card, {
                scale: 0.9,
                opacity: 0.6,
                scrollTrigger: {
                    trigger: card,
                    start: "top 100px",
                    scrub: true,
                    pinSpacing: false
                }
            });
        }
    });

    // 8. КОНТАКТНАЯ ФОРМА
    const form = document.querySelector('#mainForm');
    const phoneInput = document.querySelector('#userPhone');
    const captchaLabel = document.querySelector('#captchaLabel');

    if(phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    let n1 = Math.floor(Math.random() * 5) + 1, n2 = Math.floor(Math.random() * 5) + 1;
    let sum = n1 + n2;
    if(captchaLabel) captchaLabel.innerText = `Решите: ${n1} + ${n2} = ?`;

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const ans = document.querySelector('#userCaptcha').value;
        if(parseInt(ans) !== sum) { alert('Капча неверна!'); return; }
        
        document.querySelector('#submitBtn').style.display = 'none';
        document.querySelector('#formSuccess').classList.add('is-visible');
        form.reset();
    });

    // 9. ХЕДЕР ПРИ СКРОЛЛЕ
    window.addEventListener('scroll', () => {
        document.querySelector('#header')?.classList.toggle('header--scrolled', window.scrollY > 50);
    });

    console.log("Zytra Core v6: All fixed.");
});