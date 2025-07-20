class GitHubPagesSite {
    constructor() {
        this.currentPage = 'home';
        this.cache = new Map();
        this.portfolioIndex = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMarkdown();
        this.setupResizeHandler();
        this.loadInitialPage();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
                this.updateActiveNav(link);
            });
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const grid = document.getElementById('portfolio-grid');
                if (grid && this.currentPage === 'portfolio') {
                    const cards = Array.from(grid.children);
                    if (cards.length > 0) {
                        this.optimizeGridLayout(grid, cards);
                    }
                }
            }, 250);
        });
    }

    setupMarkdown() {
        const renderer = new marked.Renderer();
        
        renderer.image = (href, title, text) => {
            if (!href.startsWith('http') && !href.startsWith('/images/')) {
                href = `/images/${href}`;
            }
            
            return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''}>`;
        };

        marked.setOptions({
            renderer: renderer,
            highlight: function(code, lang) {
                return code;
            },
            breaks: true
        });
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    loadInitialPage() {
        // Parse the hash for route information
        const route = this.parseRoute();
        
        if (route.type === 'post') {
            // Load individual post
            this.loadPost(route.category, route.slug);
            const navLink = document.querySelector(`[data-page="${route.category}"]`);
            if (navLink) this.updateActiveNav(navLink);
        } else {
            // Load regular page
            const page = route.page || 'home';
            this.navigateToPage(page);
            const navLink = document.querySelector(`[data-page="${page}"]`);
            if (navLink) {
                this.updateActiveNav(navLink);
            } else {
                this.updateActiveNav(document.querySelector('[data-page="home"]'));
            }
        }
    }

    parseRoute() {
        const hash = window.location.hash.slice(1);
        
        if (!hash) return { page: 'home' };
        
        // Check if it's a post route (portfolio/post-slug)
        const parts = hash.split('/');
        if (parts.length === 2 && parts[0] === 'portfolio') {
            return {
                type: 'post',
                category: parts[0],
                slug: parts[1]
            };
        }
        
        // Regular page route
        return { page: hash };
    }

    async navigateToPage(page) {
        this.currentPage = page;
        window.location.hash = page;
        
        const content = document.getElementById('content');
        content.innerHTML = '<div class="loading">Loading...</div>';

        try {
            if (page === 'portfolio') {
                await this.loadPortfolioListing();
            } else {
                await this.loadMarkdownPage(page);
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.showError('Failed to load page content');
        }
    }

    async loadMarkdownPage(page) {
        try {
            const content = await this.fetchMarkdown(`pages/${page}.md`);
            const html = marked.parse(content);
            
            document.getElementById('content').innerHTML = `
                <div class="markdown-content">
                    ${html}
                </div>
            `;
        } catch (error) {
            this.showError(`Could not load ${page}.md`);
        }
    }

    async loadPortfolioIndex() {
        if (this.portfolioIndex) {
            return this.portfolioIndex;
        }

        try {
            const response = await fetch('pages/portfolio/index.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.portfolioIndex = await response.json();
            return this.portfolioIndex;
        } catch (error) {
            console.error('Failed to load portfolio index:', error);
            // Fallback to empty array if index.json doesn't exist
            this.portfolioIndex = [];
            return this.portfolioIndex;
        }
    }

    async loadPortfolioListing() {
        try {
            const portfolioItems = await this.loadPortfolioIndex();
            
            let html = `
                <div class="markdown-content">
                    <h1>Portfolio</h1>
            `;

            if (portfolioItems.length === 0) {
                html += `
                    <p>No portfolio items found. Create an <code>index.json</code> file in your <code>pages/portfolio/</code> directory to list your projects.</p>
                    <h3>Example index.json structure:</h3>
                    <pre><code>[
  {
    "slug": "my-awesome-project",
    "title": "My Awesome Project",
    "description": "A brief description of the project",
    "tags": ["React", "Node.js", "MongoDB"],
    "date": "2024-01-15",
    "featured": true
  }
]</code></pre>
                `;
                html += '</div>';
                document.getElementById('content').innerHTML = html;
            } else {
                // Sort by featured first, then by date (newest first)
                const sortedItems = portfolioItems.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01');
                });

                html += '<div class="post-grid" id="portfolio-grid">';
                html += '</div>';
                html += '</div>';

                // Insert the HTML first
                document.getElementById('content').innerHTML = html;

                // Then populate the grid with masonry layout
                this.populatePortfolioGrid(sortedItems);
            }
        } catch (error) {
            this.showError('Could not load portfolio items');
        }
    }

    populatePortfolioGrid(items) {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        // Clear any existing content
        grid.innerHTML = '';

        // Create all cards first
        const cards = items.map(item => {
            const tagsHtml = item.tags ? item.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('') : '';

            // Display date in MDT (America/Denver)
            let dateHtml = '';
            if (item.date) {
                const dateParts = item.date.split('-').map(Number);
                let dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                dateHtml = dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'America/Denver'
                });
            }

            const cardElement = document.createElement('div');
            cardElement.className = 'post-card';
            cardElement.onclick = () => this.navigateToPost('portfolio', item.slug);
            cardElement.innerHTML = `
                <h3>${item.title || item.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                ${dateHtml ? `<div class="meta">${dateHtml}</div>` : ''}
                <div class="excerpt">${item.description || 'No description available'}</div>
                ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
            `;

            return cardElement;
        });

        // Use CSS Grid with dynamic positioning for better space utilization
        this.layoutCardsInGrid(grid, cards);
    }

    layoutCardsInGrid(grid, cards) {
        // Set up the grid container
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        grid.style.gap = '1.2rem';
        grid.style.alignItems = 'start';

        // Add all cards to the grid
        cards.forEach(card => {
            grid.appendChild(card);
        });

        // Wait for layout to be calculated, then optimize positioning
        requestAnimationFrame(() => {
            this.optimizeGridLayout(grid, cards);
        });
    }

    optimizeGridLayout(grid, cards) {
        // Get grid properties
        const gridComputedStyle = window.getComputedStyle(grid);
        const gridColumnGap = parseFloat(gridComputedStyle.columnGap);
        const gridRowGap = parseFloat(gridComputedStyle.rowGap);
        
        // Calculate number of columns
        const gridWidth = grid.offsetWidth;
        const columnWidth = 280; // minmax base width
        const availableWidth = gridWidth - (gridColumnGap * 2); // Account for gaps
        const columns = Math.floor(availableWidth / (columnWidth + gridColumnGap));

        if (columns <= 1) return; // No optimization needed for single column

        // Track column heights for placement optimization
        const columnHeights = new Array(columns).fill(0);
        
        cards.forEach((card, index) => {
            // Find the shortest column (uppermost available position)
            const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            
            // Calculate grid position
            const row = Math.floor(columnHeights[shortestColumnIndex] / 100) + 1; // Rough estimation
            const col = shortestColumnIndex + 1;
            
            // Set explicit grid position for better control
            card.style.gridColumn = col;
            
            // Update column height (rough estimation)
            const cardHeight = card.offsetHeight || 150; // fallback height
            columnHeights[shortestColumnIndex] += cardHeight + gridRowGap;
        });
    }

    navigateToPost(type, slug) {
        // Update URL first
        window.location.hash = `${type}/${slug}`;
        // Then load the post
        this.loadPost(type, slug);
    }

    async loadPost(type, filename) {
        try {
            const content = await this.fetchMarkdown(`pages/${type}/${filename}.md`);
            const html = marked.parse(content);
            
            document.getElementById('content').innerHTML = `
                <div class="markdown-content">
                    ${html}
                </div>
            `;
        } catch (error) {
            this.showError(`Could not load ${filename}.md`);
        }
    }

    async fetchMarkdown(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();
        this.cache.set(path, content);
        return content;
    }

    showError(message) {
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h2>Oops!</h2>
                <p>${message}</p>
                <p>Please check that the file exists and try again.</p>
            </div>
        `;
    }
}

// Initialize the site
window.site = new GitHubPagesSite();

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    window.site.loadInitialPage();
});