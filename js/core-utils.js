// core utilities module
// helper functions for color management, device detection, and common utilities

// generate genre colors and gradients for multiple tags
function generateGenreColors(normalizedTags, colorMap) {
    const uniqueTags = [...new Set(normalizedTags)];
    
    if (uniqueTags.length === 1) {
        // single tag = use solid color
        const color = colorMap[uniqueTags[0]] || colorMap.other;
        return {
            color: color,
            gradient: color
        };
    } else {
        // mult tags = create gradient
        const colors = uniqueTags.map(tag => colorMap[tag] || colorMap.other);
        const primaryColor = colors[0];
        
        // make gradient based on number of colors
        let gradient;
        if (colors.length === 2) {
            gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
        } else if (colors.length === 3) {
            gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
        } else {
            // for 4+ colors, use a more complex gradient
            // will probably never need this but sure lets include it why not
            gradient = `linear-gradient(135deg, ${colors.slice(0, 4).join(', ')})`;
        }
        
        return {
            color: primaryColor,
            gradient: gradient
        };
    }
}

// normalise tag names because i am lazy and sometimes not typing the full tag name is what keeps me happy
function normaliseTag(tag) {
    const tagMap = {
        'economics': 'economics',
        'economy': 'economics',
        'econ': 'economics',
        'neuroscience': 'neuroscience',
        'neuro': 'neuroscience',
        'ns': 'neuroscience',
        'technology': 'technology',
        'tech': 'technology',
        'ai': 'technology',
        'programming': 'technology',
        'other': 'other'
    };
    
    return tagMap[tag.toLowerCase()] || 'other';
}

// device detection utilities
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isDesktop() {
    return window.innerWidth > 768;
}

// simple mobile scroll animations
function initMobileScrollAnimations() {
    const cards = document.querySelectorAll('.post, .project-card');
    if (window.innerWidth > 768) {
        // on desktop, remove animation classes
        cards.forEach(card => {
            card.classList.remove('animate-ready', 'animate-in');
        });
        return;
    }

    // intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.classList.remove('animate-ready');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // only add .animate-ready and observe cards not already animated in
    cards.forEach(card => {
        if (!card.classList.contains('animate-in')) {
            card.classList.add('animate-ready');
            observer.observe(card);
        } else {
            card.classList.remove('animate-ready');
        }
    });
}

// check if reading time and tags are too close on mobile and adjust layout
function checkMobileMetaRowLayout() {
    if (window.innerWidth > 768) return; // only on mobile
    
    const metaRow = document.querySelector('.post-meta-row');
    if (!metaRow) return;
    
    const readingTime = metaRow.querySelector('.reading-time');
    const tagContainer = metaRow.querySelector('.tag-container');
    if (!readingTime || !tagContainer) return;
    
    // reset layout classes
    metaRow.classList.remove('mobile-stacked', 'mobile-cramped');
    
    // force horizontal layout temporarily to measure
    metaRow.style.flexDirection = 'row';
    metaRow.style.flexWrap = 'nowrap';
    
    // measure the elements
    const metaRowRect = metaRow.getBoundingClientRect();
    const readingTimeRect = readingTime.getBoundingClientRect();
    const tagContainerRect = tagContainer.getBoundingClientRect();
    
    // calculate available space and minimum padding needed
    const usedWidth = readingTimeRect.width + tagContainerRect.width;
    const availableWidth = metaRowRect.width;
    const currentGap = parseFloat(getComputedStyle(metaRow).gap) || 4;
    const minPadding = 16; // minimum padding between elements
    
    // reset inline styles
    metaRow.style.flexDirection = '';
    metaRow.style.flexWrap = '';
    
    // determine layout based on available space
    if (usedWidth + minPadding > availableWidth) {
        // stack vertically
        metaRow.classList.add('mobile-stacked');
    } else if (usedWidth + currentGap + 8 > availableWidth) {
        // cramped horizontal layout
        metaRow.classList.add('mobile-cramped');
    }
    // else: normal horizontal layout (no additional classes)
}

// export functions to global scope
window.CoreUtils = {
    isMobileDevice,
    isDesktop,
    initMobileScrollAnimations,
    checkMobileMetaRowLayout
};

window.ColorUtils = {
    generateGenreColors,
    normaliseTag
};

// legacy global exports for compatibility
window.checkMobileMetaRowLayout = checkMobileMetaRowLayout;
