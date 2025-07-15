const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');
const headerContainer = document.querySelector('.header-container');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('mobile');
});

let lastScroll = 0;
const checkPoint = 42;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > checkPoint) {
        headerContainer.classList.add('header-fixed');
    } else if (currentScroll < lastScroll && currentScroll < checkPoint) {
        headerContainer.classList.remove('header-fixed');
    }
    lastScroll = currentScroll;
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    if (width > 842) {
        nav.classList.remove('mobile');
        burger.classList.remove('active');
    }
    nav.style.top = width > 600 ? '80px' : '50px';
});