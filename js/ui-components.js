// ui components module
// handles reading progress bar, read-more arrows, reading time calculation, and mobile layouts

// reading progress bar
function createReadingProgressBar() {
    if (document.querySelector('.reading-progress-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    const inner = document.createElement('div');
    inner.className = 'reading-progress-bar__inner';
    bar.appendChild(inner);
    document.body.appendChild(bar);
}

function updateReadingProgressBar() {
    const bar = document.querySelector('.reading-progress-bar__inner');
    if (!bar) return;
    // Find the main content area for posts
    const post = document.querySelector('.post-page') || document.querySelector('.post');
    if (!post) return;
    // Get computed genre gradient/color from the post
    let genreGradient = getComputedStyle(post).getPropertyValue('--genre-gradient');
    let genreColor = getComputedStyle(post).getPropertyValue('--genre-color');
    let accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    // Always prefer genre gradient, fallback to accent
    bar.style.background = genreGradient || accentColor;
    bar.style.boxShadow = `0 1px 8px 0 ${genreColor || accentColor}`;
    // Progress calculation
    const rect = post.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const start = rect.top + scrollTop;
    const end = rect.bottom + scrollTop - window.innerHeight;
    const total = Math.max(end - start, 1);
    const progress = Math.min(Math.max((scrollTop - start) / total, 0), 1);
    // Use requestAnimationFrame for ultra-smooth update
    if (bar._raf) cancelAnimationFrame(bar._raf);
    const targetWidth = (progress * 100) + '%';
    function animateWidth() {
        bar.style.width = targetWidth;
    }
    bar._raf = requestAnimationFrame(animateWidth);
}

// Initialize reading progress bar
function initReadingProgressBar() {
    if (document.querySelector('.post-page')) {
        createReadingProgressBar();
        window.addEventListener('scroll', updateReadingProgressBar, { passive: true });
        window.addEventListener('resize', updateReadingProgressBar);
        updateReadingProgressBar();
    }
}

// Read-more arrow animation
function addReadMoreArrows() {
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        // skip if arrow already exists
        if (button.querySelector('.arrow')) return;
        
        // add arrow element with one static arrow
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = ' →';
        button.appendChild(arrow);
    });
}

// reading time calculation
function insertReadingTime() {
    const postPage = document.querySelector('.post-page');
    if (!postPage) return;
    const timeElem = postPage.querySelector('.reading-time');
    if (!timeElem) return;
    
    // get the raw markdown content if available, otherwise use processed html
    let text = '';
    const postContent = document.getElementById('post-content');
    
    if (postContent && postContent.dataset.rawMarkdown) {
        // use raw markdown if available
        text = postContent.dataset.rawMarkdown;
        
        // remove reference link definitions (lines like [1]: https://example.com)
        text = text.replace(/^\[\d+\]:\s*.+$/gm, '');
        
        // remove tooltip definitions (lines like *[API]: Application Programming Interface)
        text = text.replace(/^\*\[[^\]]+\]:\s*.+$/gm, '');
        
        // remove tag definitions at the start
        text = text.replace(/^\{[^}]+\}\s*\n?/m, '');
        
        // remove markdown formatting for more accurate word count
        text = text
            .replace(/#+\s/g, '') // remove heading markers
            .replace(/\*\*(.+?)\*\*/g, '$1') //  bold
            .replace(/\*(.+?)\*/g, '$1') //  italic
            .replace(/`(.+?)`/g, '$1') // inline code
            .replace(/```[\s\S]*?```/g, '') // code blocks
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // keep link text, remove url
            .replace(/^\s*[-*+]\s/gm, '') // list markers
            .replace(/^\s*\d+\.\s/gm, '') // numbered list markers
            .replace(/^>\s*/gm, '') // blockquote markers
    } else {
        // fallback to processed html content
        const clone = postPage.cloneNode(true);
        
        // remove elements we don't want to count
        clone.querySelectorAll('.reading-time, .loading, .post-meta-row, .tag-container, .definition-tooltip').forEach(el => el.remove());
        
        text = clone.innerText || '';
    }
    
    // calculate reading time
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.max(1, Math.round(words / 250));
    timeElem.textContent = `Estimated read: ${minutes} min${minutes > 1 ? 's' : ''}`;
    
    // check mobile layout spacing after inserting reading time
    setTimeout(() => {
        if (window.CoreUtils && window.CoreUtils.checkMobileMetaRowLayout) {
            window.CoreUtils.checkMobileMetaRowLayout();
        }
    }, 100);
}

// Tab switching functionality
function initTabSwitching() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
            
            // Re-run scroll animations for mobile
            if (window.CoreUtils && window.CoreUtils.initMobileScrollAnimations) {
                setTimeout(() => window.CoreUtils.initMobileScrollAnimations(), 100);
            }
        });
    });
}

// Post page animation on load
function animatePostPageOnLoad() {
    const postPage = document.querySelector('.post-page');
    if (postPage) {
        postPage.style.opacity = '0';
        postPage.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            postPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            postPage.style.opacity = '1';
            postPage.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Mobile tooltip tap handler setup
function attachMobileTooltipHandler() {
    if (window.CoreUtils && window.CoreUtils.isMobileDevice()) {
        document.querySelectorAll('.definition-term').forEach(term => {
            if (window.TooltipSystem && window.TooltipSystem.attachMobileTooltipHandler) {
                window.TooltipSystem.attachMobileTooltipHandler(term);
            }
        });
    }
}

// Initialize all UI components
function initUIComponents() {
    // Initialize reading progress bar for post pages
    initReadingProgressBar();
    
    // Add read more arrows
    addReadMoreArrows();
    
    // Initialize tab switching
    initTabSwitching();
    
    // Animate post page on load
    animatePostPageOnLoad();
    
    // Note: Reading time is now calculated immediately when post loads in post.html
    
    // Mobile tooltip handlers
    setTimeout(attachMobileTooltipHandler, 200);
    
    // Check mobile layout after initialization
    setTimeout(() => {
        if (window.CoreUtils && window.CoreUtils.checkMobileMetaRowLayout) {
            window.CoreUtils.checkMobileMetaRowLayout();
        }
    }, 200);
    
    // Load post previews
    if (window.PostManager && window.PostManager.loadPostPreviews) {
        window.PostManager.loadPostPreviews();
    }
}

// Export functions to global scope
window.UIComponents = {
    createReadingProgressBar,
    updateReadingProgressBar,
    initReadingProgressBar,
    addReadMoreArrows,
    insertReadingTime,
    initTabSwitching,
    animatePostPageOnLoad,
    attachMobileTooltipHandler,
    initUIComponents
};
