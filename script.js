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

    function initSearch() {
        const sidebar = document.querySelector('.sidebar');
        const navList = document.querySelector('.nav-list:not(.nav-sub)');
        const navSub = document.querySelector('.nav-list.nav-sub');
        
        if (!sidebar || !navList) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-box';
        searchContainer.innerHTML = `
            <i class="fas fa-search search-icon"></i>
            <input type="text" id="searchInput" placeholder="Поиск по странице..." autocomplete="off">
            <button class="clear-btn" id="clearSearch"><i class="fas fa-times"></i></button>
        `;

        const title = sidebar.querySelector('.sidebar-title');
        if (title) {
            title.parentNode.insertBefore(searchContainer, title.nextSibling);
        }

        const stats = document.createElement('div');
        stats.className = 'search-stats';
        stats.id = 'searchStats';
        searchContainer.after(stats);

        const input = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        const statsEl = document.getElementById('searchStats');

        function performSearch(query) {
            const q = query.trim().toLowerCase();
            
            document.querySelectorAll('.highlighted, .rule-card.highlighted, .nav-list li a.highlighted').forEach(el => {
                el.classList.remove('highlighted');
            });
            
            document.querySelectorAll('.search-highlight').forEach(el => {
                const parent = el.parentNode;
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            });

            const allNavLinks = document.querySelectorAll('.nav-list li a');
            const allRuleCards = document.querySelectorAll('.rule-card');
            const allSections = document.querySelectorAll('.section, .rule-grid, .faq-item, .term-block, .meta-block, .info-card, .rule-card');
            
            if (!q) {
                allNavLinks.forEach(link => link.style.display = '');
                allRuleCards.forEach(card => card.style.display = '');
                document.querySelectorAll('.section').forEach(s => s.style.display = '');
                document.querySelectorAll('.rule-grid').forEach(g => g.style.display = '');
                document.querySelectorAll('.faq-item').forEach(f => f.style.display = '');
                document.querySelectorAll('.term-block').forEach(t => t.style.display = '');
                document.querySelectorAll('.meta-block').forEach(m => m.style.display = '');
                document.querySelectorAll('.info-card').forEach(i => i.style.display = '');
                
                statsEl.classList.remove('visible');
                clearBtn.classList.remove('visible');
                document.querySelector('.no-results')?.classList.remove('visible');
                return;
            }

            clearBtn.classList.add('visible');

            const searchables = [];

            allNavLinks.forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: link, match, text, type: 'nav' });
            });

            allRuleCards.forEach(card => {
                const text = card.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: card, match, text, type: 'rule' });
            });

            document.querySelectorAll('.faq-item').forEach(item => {
                const text = item.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: item, match, text, type: 'faq' });
            });

            document.querySelectorAll('.term-block').forEach(block => {
                const text = block.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: block, match, text, type: 'term' });
            });

            document.querySelectorAll('.meta-block').forEach(block => {
                const text = block.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: block, match, text, type: 'meta' });
            });

            document.querySelectorAll('.info-card').forEach(card => {
                const text = card.textContent.trim().toLowerCase();
                const match = text.includes(q);
                searchables.push({ element: card, match, text, type: 'info' });
            });

            document.querySelectorAll('.section-title').forEach(title => {
                const text = title.textContent.trim().toLowerCase();
                const match = text.includes(q);
                const parentSection = title.closest('.section');
                if (parentSection) {
                    searchables.push({ element: parentSection, match, text, type: 'section' });
                }
            });

            const matches = searchables.filter(s => s.match);
            
            allNavLinks.forEach(link => link.style.display = 'none');
            allRuleCards.forEach(card => card.style.display = 'none');
            document.querySelectorAll('.faq-item').forEach(f => f.style.display = 'none');
            document.querySelectorAll('.term-block').forEach(t => t.style.display = 'none');
            document.querySelectorAll('.meta-block').forEach(m => m.style.display = 'none');
            document.querySelectorAll('.info-card').forEach(i => i.style.display = 'none');
            document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

            matches.forEach(({ element, type }) => {
                if (type === 'nav') {
                    element.style.display = '';
                    element.classList.add('highlighted');
                } else if (type === 'rule') {
                    element.style.display = '';
                    element.classList.add('highlighted');
                    const section = element.closest('.section');
                    if (section) section.style.display = '';
                } else if (type === 'faq') {
                    element.style.display = '';
                    const answer = element.querySelector('.answer');
                    const icon = element.querySelector('.fa-chevron-down');
                    if (answer) {
                        answer.classList.add('open');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                    const section = element.closest('.section');
                    if (section) section.style.display = '';
                } else if (type === 'term' || type === 'meta') {
                    element.style.display = '';
                    const section = element.closest('.section');
                    if (section) section.style.display = '';
                } else if (type === 'info') {
                    element.style.display = '';
                    const section = element.closest('.section');
                    if (section) section.style.display = '';
                } else if (type === 'section') {
                    element.style.display = '';
                    element.querySelectorAll('.rule-card, .faq-item, .term-block, .meta-block, .info-card').forEach(el => {
                        const text = el.textContent.trim().toLowerCase();
                        if (text.includes(q)) {
                            el.style.display = '';
                            if (el.classList.contains('rule-card')) el.classList.add('highlighted');
                        } else {
                            el.style.display = '';
                        }
                    });
                }
            });

            document.querySelectorAll('.rule-card:not([style*="display: none"]), .faq-item:not([style*="display: none"]), .term-block:not([style*="display: none"]), .meta-block:not([style*="display: none"]), .info-card:not([style*="display: none"])').forEach(el => {
                highlightText(el, q);
            });

            const totalMatches = matches.length;
            if (totalMatches > 0) {
                statsEl.textContent = `Найдено: ${totalMatches} совпадений`;
                statsEl.classList.add('visible');
            } else {
                statsEl.textContent = 'Ничего не найдено';
                statsEl.classList.add('visible');
                // Показываем сообщение "ничего не найдено"
                let noResults = document.querySelector('.no-results');
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.innerHTML = `<i class="fas fa-search"></i><br>Ничего не найдено по запросу «${q}»`;
                    const container = document.querySelector('.container');
                    if (container) container.prepend(noResults);
                } else {
                    noResults.innerHTML = `<i class="fas fa-search"></i><br>Ничего не найдено по запросу «${q}»`;
                }
                noResults.classList.add('visible');
            }

            if (totalMatches > 0) {
                document.querySelector('.no-results')?.classList.remove('visible');
            }
        }

        function highlightText(element, query) {
            const nodes = element.childNodes;
            const q = query.toLowerCase();
            const toReplace = [];

            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    const text = node.textContent;
                    const lowerText = text.toLowerCase();
                    let index = lowerText.indexOf(q);
                    if (index !== -1) {
                        toReplace.push({ node, text, index });
                    }
                }
            });

            toReplace.forEach(({ node, text, index }) => {
                const fragment = document.createDocumentFragment();
                const before = text.substring(0, index);
                const match = text.substring(index, index + q.length);
                const after = text.substring(index + q.length);

                if (before) fragment.appendChild(document.createTextNode(before));
                const span = document.createElement('span');
                span.className = 'search-highlight';
                span.style.cssText = 'background: #4a4a6a; color: #e8e8ff; padding: 0 2px; border-radius: 4px;';
                span.textContent = match;
                fragment.appendChild(span);
                if (after) fragment.appendChild(document.createTextNode(after));

                node.parentNode.replaceChild(fragment, node);
            });
        }

        input.addEventListener('input', function() {
            performSearch(this.value);
        });

        clearBtn.addEventListener('click', function() {
            input.value = '';
            performSearch('');
            input.focus();
        });

        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                input.focus();
                input.select();
            }
            if (e.key === 'Escape') {
                if (input.value) {
                    input.value = '';
                    performSearch('');
                }
                input.blur();
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .search-highlight {
                background: #4a4a6a;
                color: #e8e8ff;
                padding: 0 2px;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    // Инициализация поиска после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();