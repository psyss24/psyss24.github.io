// main application initialization
// coordinates all modules and handles initialization sequence

// initialize everything when dom is loaded
document.addEventListener('DOMContentLoaded', function() {
    // initialize theme first
    if (window.ThemeManager) {
        window.ThemeManager.initTheme();
    }
    
    // initialize ui components
    if (window.UIComponents) {
        window.UIComponents.initUIComponents();
    }
    
    // initialize tooltips for existing content
    if (window.TooltipSystem) {
        // parse definitions in post content
        const postContent = document.querySelector('.post-page');
        if (postContent) {
            window.TooltipSystem.initTooltips(postContent);
        }
        
        // parse definitions in post cards
        const postCards = document.querySelectorAll('.post');
        postCards.forEach(card => {
            window.TooltipSystem.initTooltips(card);
        });
    }
    
    // initialize mobile scroll animations
    if (window.CoreUtils) {
        window.CoreUtils.initMobileScrollAnimations();
    }
    
    // initialize page transitions
    if (window.PageTransitions) {
        window.PageTransitions.attachDotTransitionToPostLinks();
        
        // setup back-to-home transition for post pages
        if (window.attachBackToHomeTransition) {
            window.attachBackToHomeTransition();
        }
    }
});

// re-initialize on window resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        if (window.CoreUtils) {
            window.CoreUtils.initMobileScrollAnimations();
            window.CoreUtils.checkMobileMetaRowLayout();
        }
    }, 100);
});

// legacy compatibility - ensure global functions are available
window.addEventListener('load', function() {
    // ensure legacy functions are available for post.html
    if (!window.parseDefinitions && window.TooltipSystem) {
        window.parseDefinitions = window.TooltipSystem.parseDefinitions;
    }
    
    if (!window.checkMobileMetaRowLayout && window.CoreUtils) {
        window.checkMobileMetaRowLayout = window.CoreUtils.checkMobileMetaRowLayout;
    }
});
