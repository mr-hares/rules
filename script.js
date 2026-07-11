(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list li a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const id = href.substring(1);
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.substring(1);
            const target = document.getElementById(id);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    });
})();