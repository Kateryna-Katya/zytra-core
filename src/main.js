// 1. Инициализация иконок
lucide.createIcons();

// 2. Плавный скролл (Lenis)
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. Мобильное меню
const burger = document.querySelector('.burger');
const menuOverlay = document.querySelector('#menuOverlay');
const navLinks = document.querySelectorAll('.nav-mobile__link');

function toggleMenu() {
    burger.classList.toggle('is-active');
    menuOverlay.classList.toggle('is-active');
    document.body.style.overflow = menuOverlay.classList.contains('is-active') ? 'hidden' : '';
}

burger.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuOverlay.classList.contains('is-active')) toggleMenu();
    });
});

// 4. Эффект хедера при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('#header');
    header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// 5. THREE.JS Анимация (Neural Cloud)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const canvasContainer = document.querySelector('#hero-canvas');
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

// Создание точек (частиц)
const particlesGeometry = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.6
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

// Анимация при движении мыши
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    // Плавное следование за мышью
    gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        duration: 2
    });

    renderer.render(scene, camera);
}

animate();

// Ресайз окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. GSAP Анимация контента Hero
gsap.from(".hero__badge", { opacity: 0, y: 20, duration: 1, delay: 0.5 });
gsap.from(".hero__title", { opacity: 0, y: 30, duration: 1, delay: 0.7 });
gsap.from(".hero__description", { opacity: 0, y: 30, duration: 1, delay: 0.9 });
gsap.from(".hero__btns", { opacity: 0, y: 30, duration: 1, delay: 1.1 });

// 7. Анимация появления секции About
gsap.registerPlugin(ScrollTrigger);

const aboutTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%", // Начинать, когда верх секции на 80% высоты экрана
    }
});

aboutTl.from(".about__image-wrapper", {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
})
.from(".about__content > *", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // Появление элементов по очереди
    ease: "power2.out"
}, "-=0.5"); // Начать чуть раньше завершения предыдущей анимации