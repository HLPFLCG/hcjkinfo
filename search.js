// Search functionality for poetry website
class PoetrySearch {
    constructor() {
        this.searchIndex = this.buildSearchIndex();
        this.init();
    }

    buildSearchIndex() {
        const poems = typeof poemsCollection !== 'undefined' ? poemsCollection : [];
        const index = [];
        
        poems.forEach(poem => {
            const searchText = [
                poem.title,
                poem.content,
                poem.reflection,
                poem.theme,
                poem.mood,
                poem.season
            ].join(' ').toLowerCase();
            
            index.push({
                id: poem.id,
                title: poem.title,
                content: poem.content,
                theme: poem.theme,
                mood: poem.mood,
                season: poem.season,
                searchText: searchText
            });
        });
        
        return index;
    }

    init() {
        this.createSearchInterface();
        this.bindEvents();
    }

    createSearchInterface() {
        // Create search section
        const searchHTML = `
            <section id="search" class="search-section">
                <div class="search-container">
                    <h3>Search Poetry Collection</h3>
                    <div class="search-box">
                        <svg class="search-icon" width="20" height="20"><use href="#icon-quill"></use></svg>
                        <input type="text" id="poemSearch" placeholder="Search by title, theme, mood, or content...">
                        <button id="clearSearch" class="clear-search" style="display: none;">✕</button>
                    </div>
                    <div id="searchResults" class="search-results"></div>
                </div>
            </section>
        `;
        
        // Insert search section after hero
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.insertAdjacentHTML('afterend', searchHTML);
        }
    }

    bindEvents() {
        const searchInput = document.getElementById('poemSearch');
        const clearButton = document.getElementById('clearSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                this.performSearch(query);
                
                // Show/hide clear button
                if (clearButton) {
                    clearButton.style.display = query ? 'block' : 'none';
                }
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    if (query) {
                        this.performSearch(query);
                    }
                }
            });
        }
        
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.clearSearch();
                    clearButton.style.display = 'none';
                }
            });
        }
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query) {
            this.clearSearch();
            return;
        }
        
        const results = this.searchIndex.filter(item => 
            item.searchText.includes(query.toLowerCase())
        );
        
        this.displayResults(results, query);
    }

    displayResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No poems found matching "${query}"</p>
                    <p>Try searching for themes like "love", "peace", or "seasons"</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = `
            <div class="results-header">
                <span class="results-count">${results.length} poem${results.length !== 1 ? 's' : ''} found</span>
            </div>
            <div class="results-list">
                ${results.map(poem => this.createResultItem(poem, query)).join('')}
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        this.bindResultEvents();
    }

    createResultItem(poem, query) {
        const highlightedTitle = this.highlightText(poem.title, query);
        const highlightedContent = this.highlightText(this.stripHtml(poem.content), query);
        
        return `
            <div class="search-result-item" data-poem-id="${poem.id}">
                <div class="result-header">
                    <h4 class="result-title">${highlightedTitle}</h4>
                    <div class="result-tags">
                        <span class="result-tag theme">${poem.theme}</span>
                        <span class="result-tag mood">${poem.mood}</span>
                        <span class="result-tag season">${poem.season}</span>
                    </div>
                </div>
                <div class="result-content">${highlightedContent}</div>
                <button class="view-poem-btn" data-poem-id="${poem.id}">Read Full Poem</button>
            </div>
        `;
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    bindResultEvents() {
        const viewButtons = document.querySelectorAll('.view-poem-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const poemId = parseInt(e.target.dataset.poemId);
                this.viewPoem(poemId);
            });
        });
    }

    viewPoem(poemId) {
        const poem = poemsCollection.find(p => p.id === poemId);
        if (poem) {
            // Update featured poem with selected poem
            const poemTitle = document.querySelector('.poem-header h3');
            const poemContent = document.querySelector('.poem-content');
            
            if (poemTitle && poemContent) {
                poemTitle.textContent = poem.title;
                poemContent.innerHTML = poem.content;
                
                // Scroll to featured poem
                document.querySelector('.featured-poem').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Clear search
                this.clearSearch();
                
                // Track event
                if (typeof trackEvent === 'function') {
                    trackEvent(`Poem viewed from search: ${poem.title}`, 'Search');
                }
            }
        }
    }

    clearSearch() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for poemsCollection to be available
    setTimeout(() => {
        if (typeof poemsCollection !== 'undefined') {
            new PoetrySearch();
        }
    }, 100);
});