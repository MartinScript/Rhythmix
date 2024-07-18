// Sticky Navigation
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting)
        nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const obsOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
};

const observer = new IntersectionObserver(stickyNav, obsOptions);
observer.observe(header);

