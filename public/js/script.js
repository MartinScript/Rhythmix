// Sticky Navigation
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navHeight = nav.getBoundingClientRect().height;
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnLogin = document.querySelector('#login');

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

//Modal window

const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnLogin.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    // console.log(e.key);

    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


