(function() {
    const searchInput = document.getElementById('search');
    const rulesContainer = document.getElementById('rulesContainer');

    if (!searchInput || !rulesContainer) return;

    const allRules = rulesContainer.querySelectorAll('.rule');

    function clearHighlights(element) {
        const highlighted = element.querySelectorAll('.highlight');
        highlighted.forEach(el => {
            const parent = el.parentNode;
            const textNode = document.createTextNode(el.textContent);
            parent.replaceChild(textNode, el);
            parent.normalize();
        });
    }

    function highlightTextInNode(node, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') return;

        const term = searchTerm.trim();
        const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(textNode) {
                    if (textNode.parentElement && textNode.parentElement.classList.contains('highlight')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (!textNode.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodesToReplace = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            const text = currentNode.textContent;
            if (regex.test(text)) {
                nodesToReplace.push(currentNode);
            }
        }

        nodesToReplace.forEach(textNode => {
            const text = textNode.textContent;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;

            regex.lastIndex = 0;
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                }
                const highlighted = document.createElement('span');
                highlighted.className = 'highlight';
                highlighted.textContent = match[0];
                fragment.appendChild(highlighted);
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }

            textNode.parentNode.replaceChild(fragment, textNode);
            textNode.parentNode.normalize();
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value;

        allRules.forEach(rule => {
            rule.classList.remove('rule-hidden');
            clearHighlights(rule);
        });

        if (!searchTerm || searchTerm.trim() === '') {
            return;
        }

        const term = searchTerm.trim().toLowerCase();

        allRules.forEach(rule => {
            const titleEl = rule.querySelector('.title');
            const contentEl = rule.querySelector('.content');

            const titleText = titleEl ? titleEl.textContent : '';
            const contentText = contentEl ? contentEl.textContent : '';

            const titleMatch = titleText.toLowerCase().includes(term);
            const contentMatch = contentText.toLowerCase().includes(term);

            if (titleMatch || contentMatch) {
                rule.classList.remove('rule-hidden');
                if (titleEl) {
                    clearHighlights(titleEl);
                    highlightTextInNode(titleEl, searchTerm);
                }
                if (contentEl) {
                    clearHighlights(contentEl);
                    highlightTextInNode(contentEl, searchTerm);
                }
            } else {
                rule.classList.add('rule-hidden');
            }
        });
    }

    searchInput.addEventListener('input', performSearch);

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch();
            this.blur();
        }
    });

    allRules.forEach(rule => {
        clearHighlights(rule);
    });
})();