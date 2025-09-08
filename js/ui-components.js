// UI Components Module
// Handles reading progress bar, read-more arrows, reading time calculation, and mobile layouts

// Reading Progress Bar
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

// Reading time calculation
function insertReadingTime() {
    const postPage = document.querySelector('.post-page');
    if (!postPage) return;
    const timeElem = postPage.querySelector('.reading-time');
    if (!timeElem) return;
    // Find the main content (excluding .reading-time and .loading)
    let text = '';
    postPage.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('reading-time') || node.classList.contains('loading'))) return;
        if (node.nodeType === Node.TEXT_NODE) text += node.textContent + ' ';
        if (node.nodeType === Node.ELEMENT_NODE) text += node.innerText + ' ';
    });
    // Fallback: if nothing, try innerText
    if (!text.trim()) text = postPage.innerText || '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    timeElem.textContent = `Estimated read: ${minutes} min${minutes > 1 ? 's' : ''}`;
    
    // Check mobile layout spacing after inserting reading time
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
    
    // Insert reading time for post pages
    if (window.location.pathname.endsWith('/posts/post.html')) {
        setTimeout(insertReadingTime, 500);
    }
    
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
