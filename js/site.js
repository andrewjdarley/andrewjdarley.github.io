class GitHubPagesSite {
    constructor() {
        this.currentPage = 'home';
        this.cache = new Map();
        this.portfolioIndex = null;
        this.user = null;
        this.isAdmin = false;
        this.adminEmails = ['andrewjdarley@gmail.com']; // Add your admin emails here
        this.init();
    }

    init() {
        this.initGoogleAuth();
        this.setupNavigation();
        this.setupMarkdown();
        this.setupResizeHandler();
        this.setupNavToggle();
        this.loadInitialPage();
    }

    async initGoogleAuth() {
        // Load Google Identity Services
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            
            // Wait for the script to load
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        // Initialize Google Auth
        if (window.google) {
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
        }

        this.createAuthUI();
    }

    createAuthUI() {
        // The auth nav item already exists in HTML, just set up the functionality
        const authNavLink = document.getElementById('auth-nav-link');
        const authNavItem = document.getElementById('auth-nav-item');
        
        if (!authNavLink || !authNavItem) {
            console.error('Auth nav elements not found');
            return;
        }
    
        // Add click handler for sign in - make sure to prevent default and stop propagation
        authNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent any other navigation handlers from firing
            
            if (this.user) {
                // If signed in, toggle dropdown or sign out directly
                this.toggleSignOutDropdown();
            } else {
                // If not signed in, trigger Google auth
                if (window.google) {
                    google.accounts.id.prompt();
                } else {
                    console.log('Google auth not loaded yet');
                }
            }
        });
        
        // Create sign out dropdown (hidden by default)
        const dropdown = document.createElement('div');
        dropdown.id = 'sign-out-dropdown';
        dropdown.innerHTML = `
            <button onclick="window.site.signOut()">Sign Out</button>
        `;
        authNavItem.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('sign-out-dropdown');
            if (dropdown && !authNavItem.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    toggleSignOutDropdown() {
        const dropdown = document.getElementById('sign-out-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    updateAuthUI() {
        const authNavLink = document.getElementById('auth-nav-link');
        const authNavItem = document.getElementById('auth-nav-item');
        
        if (!authNavLink || !authNavItem) return;

        if (this.user) {
            // User is signed in - show user info
            authNavItem.classList.add('signed-in');
            authNavLink.innerHTML = `
                <img id="user-avatar" src="${this.user.picture}" alt="User Avatar">
                <span id="user-name">${this.user.name}</span>
            `;
        } else {
            // User is not signed in - show sign in button
            authNavItem.classList.remove('signed-in');
            authNavLink.innerHTML = 'Sign In';
            
            // Hide dropdown if it exists
            const dropdown = document.getElementById('sign-out-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    }

    signOut() {
        this.user = null;
        this.isAdmin = false;
        this.updateAuthUI();
        this.refreshCurrentPage();
        
        // Hide dropdown
        const dropdown = document.getElementById('sign-out-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        
        // Sign out from Google
        if (window.google) {
            google.accounts.id.disableAutoSelect();
        }
    }

    handleGoogleSignIn(response) {
        try {
            // Decode the JWT token to get user info
            const userInfo = this.parseJwt(response.credential);
            this.user = {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                sub: userInfo.sub
            };

            // Check if user is admin
            this.isAdmin = this.adminEmails.includes(this.user.email);

            this.updateAuthUI();
            
            // Refresh current page to show/hide unpublished content
            this.refreshCurrentPage();
            
            console.log('User signed in:', this.user);
        } catch (error) {
            console.error('Error handling sign in:', error);
        }
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    refreshCurrentPage() {
        // Refresh the current page to apply auth changes
        if (this.currentPage === 'portfolio') {
            this.loadPortfolioListing();
        } else {
            this.loadMarkdownPage(this.currentPage);
        }
    }

    setupNavigation() {
        // Only add navigation listeners to actual page navigation links, not the auth link
        const navLinks = document.querySelectorAll('.nav-links a:not(#auth-nav-link)');
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

    setupNavToggle() {
        const navToggle = document.getElementById('nav-toggle');
        const nav = document.querySelector('nav');
        const navContainer = document.querySelector('.nav-container');
        
        if (!navToggle || !nav || !navContainer) {
            console.error('Navigation toggle elements not found');
            return;
        }

        // Check if nav was previously collapsed (from localStorage)
        const wasCollapsed = localStorage.getItem('navCollapsed') === 'true';
        if (wasCollapsed) {
            nav.classList.add('collapsed');
        }

        // Function to check if nav is multi-row
        const checkMultiRow = () => {
            const navLinks = navContainer.querySelector('.nav-links');
            const navItems = navContainer.querySelectorAll('.nav-links li');
            const navContainerHeight = navContainer.offsetHeight;
            const navLinksHeight = navLinks.offsetHeight;
            
            console.log('Nav container height:', navContainerHeight);
            console.log('Nav links height:', navLinksHeight);
            
            // Method 1: Check if container height indicates wrapping
            let isMultiRow = navContainerHeight > navLinksHeight + 30;
            
            // Method 2: Check if any nav items are positioned below the first item
            if (navItems.length > 1) {
                const firstItemTop = navItems[0].getBoundingClientRect().top;
                const lastItemTop = navItems[navItems.length - 1].getBoundingClientRect().top;
                
                console.log('First item top:', firstItemTop);
                console.log('Last item top:', lastItemTop);
                
                if (lastItemTop > firstItemTop + 15) {
                    isMultiRow = true;
                }
            }
            
            if (isMultiRow) {
                navContainer.classList.add('multi-row');
                console.log('Multi-row detected - toggle button should be visible');
            } else {
                navContainer.classList.remove('multi-row');
                console.log('Single row - toggle button hidden');
            }
        };

        // Check on load and resize
        setTimeout(checkMultiRow, 100); // Small delay to ensure DOM is rendered
        window.addEventListener('resize', checkMultiRow);

        navToggle.addEventListener('click', () => {
            nav.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isCollapsed = nav.classList.contains('collapsed');
            localStorage.setItem('navCollapsed', isCollapsed.toString());
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
        // Remove active class from all navigation links (but not auth link)
        document.querySelectorAll('.nav-links a:not(#auth-nav-link)').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the clicked link (if it's not the auth link)
        if (activeLink && activeLink.id !== 'auth-nav-link') {
            activeLink.classList.add('active');
        }
    }

    loadInitialPage() {
        // Parse the current path for route information
        const route = this.parseRoute();
        
        if (route.type === 'post') {
            // Load individual post
            this.updatePostMeta(route.category, route.slug);
            this.loadPost(route.category, route.slug);
            const navLink = document.querySelector(`[data-page="${route.category}"]`);
            if (navLink) this.updateActiveNav(navLink);
        } else {
            // Load regular page
            const page = route.page || 'home';
            this.navigateToPage(page, false); // Don't update URL since we're loading initial page
            const navLink = document.querySelector(`[data-page="${page}"]`);
            if (navLink) {
                this.updateActiveNav(navLink);
            } else {
                this.updateActiveNav(document.querySelector('[data-page="home"]'));
            }
        }
    }

    parseRoute() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        // Handle root path
        if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === '')) {
            return { page: 'home' };
        }
        
        // Check if it's a post route (portfolio/post-slug)
        if (pathSegments.length === 2 && pathSegments[0] === 'portfolio') {
            return {
                type: 'post',
                category: pathSegments[0],
                slug: pathSegments[1]
            };
        }
        
        // Regular page route
        return { page: pathSegments[0] };
    }

    async navigateToPage(page, updateHistory = true) {
        this.currentPage = page;
        
        if (updateHistory) {
            const url = page === 'home' ? '/' : `/${page}`;
            window.history.pushState({ page }, '', url);
        }
        
        // Update page title and meta tags
        this.updatePageMeta(page);
        
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

    updatePageMeta(page) {
        const titles = {
            'home': 'Andrew Darley',
            'about': 'About - Andrew Darley',
            'resume': 'Resume - Andrew Darley',
            'portfolio': 'Portfolio - Andrew Darley'
        };
        
        const descriptions = {
            'home': 'Andrew Darley\'s personal portfolio showcasing data science projects, including machine learning and statistical analysis work.',
            'about': 'Learn more about Andrew Darley, his background, and expertise in data science and machine learning.',
            'resume': 'Andrew Darley\'s professional resume and work experience in data science and analytics.',
            'portfolio': 'Explore Andrew Darley\'s portfolio of data science projects, machine learning models, and statistical analyses.'
        };
        
        document.title = titles[page] || titles['home'];
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = descriptions[page] || descriptions['home'];
        
        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        const baseUrl = 'https://andrewjdarley.github.io';
        canonical.href = page === 'home' ? baseUrl : `${baseUrl}/${page}`;
    }

    async loadMarkdownPage(page) {
        try {
            const content = await this.fetchMarkdown(`/pages/${page}.md`);
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
            const response = await fetch('/pages/portfolio/index.json');
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
            
            // Filter out unpublished items unless user is admin
            const visibleItems = portfolioItems.filter(item => {
                if (item.published === false && !this.isAdmin) {
                    return false;
                }
                return true;
            });
            
            let html = `
                <div class="markdown-content">
                    <h1>Portfolio</h1>
            `;

            if (visibleItems.length === 0) {
                if (portfolioItems.length > visibleItems.length && !this.isAdmin) {
                    html += `
                        <p>No published portfolio items found. Some items may be in draft status.</p>
                    `;
                } else {
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
    "featured": true,
    "published": true
  }
]</code></pre>
                    `;
                }
                html += '</div>';
                document.getElementById('content').innerHTML = html;
            } else {
                // Sort by featured first, then by date (newest first)
                const sortedItems = visibleItems.sort((a, b) => {
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

            // Add draft indicator for admins
            const draftIndicator = (item.published === false && this.isAdmin) ? 
                '<div class="draft-indicator" style="background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-bottom: 0.5rem; display: inline-block;">DRAFT</div>' : '';

            const cardElement = document.createElement('div');
            cardElement.className = 'post-card';
            cardElement.onclick = () => this.navigateToPost('portfolio', item.slug);
            cardElement.innerHTML = `
                ${draftIndicator}
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
        // Update URL with clean path
        const url = `/${type}/${slug}`;
        window.history.pushState({ type, slug }, '', url);
        
        // Update page title and meta tags for the post
        this.updatePostMeta(type, slug);
        
        // Then load the post
        this.loadPost(type, slug);
    }

    updatePostMeta(type, slug) {
        // For now, use a generic title and description
        // In a more advanced implementation, you could fetch the post metadata
        // from the markdown frontmatter or a separate metadata file
        const title = `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Andrew Darley`;
        const description = `View Andrew Darley's project: ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
        
        document.title = title;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
        
        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `https://andrewjdarley.github.io/${type}/${slug}`;
    }

    async loadPost(type, filename) {
        try {
            // Check if this post should be visible
            if (!this.isAdmin) {
                const portfolioItems = await this.loadPortfolioIndex();
                const item = portfolioItems.find(item => item.slug === filename);
                if (item && item.published === false) {
                    this.showError('This post is not published yet.');
                    return;
                }
            }

            const content = await this.fetchMarkdown(`/pages/${type}/${filename}.md`);
            const html = marked.parse(content);
            
            // Add draft banner for admins viewing unpublished posts
            let draftBanner = '';
            if (this.isAdmin) {
                const portfolioItems = await this.loadPortfolioIndex();
                const item = portfolioItems.find(item => item.slug === filename);
                if (item && item.published === false) {
                    draftBanner = '<div style="background: #ff6b6b; color: white; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; text-align: center; font-weight: bold;">⚠️ DRAFT POST - Only visible to admins</div>';
                }
            }
            
            document.getElementById('content').innerHTML = `
                <div class="markdown-content">
                    ${draftBanner}
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
window.addEventListener('popstate', (event) => {
    window.site.loadInitialPage();
});