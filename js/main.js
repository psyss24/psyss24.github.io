// Main Application Initialization
// Coordinates all modules and handles initialization sequence

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first
    if (window.ThemeManager) {
        window.ThemeManager.initTheme();
    }
    
    // Initialize UI components
    if (window.UIComponents) {
        window.UIComponents.initUIComponents();
    }
    
    // Initialize tooltips for existing content
    if (window.TooltipSystem) {
        // Parse definitions in post content
        const postContent = document.querySelector('.post-page');
        if (postContent) {
            window.TooltipSystem.initTooltips(postContent);
        }
        
        // Parse definitions in post cards
        const postCards = document.querySelectorAll('.post');
        postCards.forEach(card => {
            window.TooltipSystem.initTooltips(card);
        });
    }
    
    // Initialize mobile scroll animations
    if (window.CoreUtils) {
        window.CoreUtils.initMobileScrollAnimations();
    }
    
    // Initialize page transitions
    if (window.PageTransitions) {
        window.PageTransitions.attachDotTransitionToPostLinks();
        
        // Setup back-to-home transition for post pages
        if (window.attachBackToHomeTransition) {
            window.attachBackToHomeTransition();
        }
    }
});

// Re-initialize on window resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        if (window.CoreUtils) {
            window.CoreUtils.initMobileScrollAnimations();
            window.CoreUtils.checkMobileMetaRowLayout();
        }
    }, 100);
});

// Legacy compatibility - ensure global functions are available
window.addEventListener('load', function() {
    // Ensure legacy functions are available for post.html
    if (!window.parseDefinitions && window.TooltipSystem) {
        window.parseDefinitions = window.TooltipSystem.parseDefinitions;
    }
    
    if (!window.checkMobileMetaRowLayout && window.CoreUtils) {
        window.checkMobileMetaRowLayout = window.CoreUtils.checkMobileMetaRowLayout;
    }
});
