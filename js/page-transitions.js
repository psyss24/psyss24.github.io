// page transitions module
// handles smooth transitions between pages with dot animations

// create dot transition animation (fade out)
function createDotTransitionAnimation(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'dot-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        background: var(--primary-bg);
        opacity: 0;
        transition: opacity 0.6s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // trigger the fade
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    // execute callback and clean up after animation
    setTimeout(() => {
        if (callback) callback();
        overlay.remove();
    }, 600);
}

// create reverse transition (from post back to index)
function createReverseTransition(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'dot-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        background: var(--primary-bg);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // trigger the fade
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    // execute callback and clean up after animation
    setTimeout(() => {
        if (callback) callback();
        overlay.remove();
    }, 500);
}

// attach dot transition animation to post links
function attachDotTransitionToPostLinks() {
    // find all post links (both h2 links and read-more links)
    const postLinks = document.querySelectorAll('a[href^="posts/post.html"]');
    
    postLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // get the url we're navigating to
            const targetUrl = this.href;
            
            // create the dot fade-out animation
            createDotTransitionAnimation(() => {
                // navigate to the post page after animation completes
                window.location.href = targetUrl;
            });
        });
    });
}

// attach reverse transition for back-to-home links
function attachBackToHomeTransition() {
    // find all back-to-home links (including header logo on post pages)
    const backLinks = document.querySelectorAll('a[href="../index.html"], a[href="index.html"], a[href$="/index.html"]');
    
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // set flag for dots fade-in animation
            localStorage.setItem('comingFromPost', 'true');
            
            // get the url we're navigating to
            const targetUrl = this.href;
            
            // create the reverse transition (fade to background, then navigate)
            createReverseTransition(() => {
                window.location.href = targetUrl;
            });
        });
    });
}

// create the dot fade-out transition animation (for index page)
function createDotTransitionAnimationIndex(callback) {
    // only run on index page with dots
    if (!document.body.classList.contains('index-page')) {
        if (callback) callback();
        return;
    }
    
    // create a subtle transition overlay for smoothness
    const transitionOverlay = document.createElement('div');
    transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        background: var(--primary-bg);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(transitionOverlay);
    
    // brief overlay for smooth transition
    requestAnimationFrame(() => {
        transitionOverlay.style.opacity = '0.8';
    });
    
    // navigate quickly so dots can linger on the new page
    setTimeout(() => {
        if (callback) callback();
        transitionOverlay.remove();
    }, 200);
}

// create reverse transition animation for back-to-home navigation (from post page)
function createReverseTransitionFromPost(callback) {
    // only run on post pages
    if (!document.body.classList.contains('post-body')) {
        if (callback) callback();
        return;
    }
    
    // create transition overlay that fades to background
    const transitionOverlay = document.createElement('div');
    transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        background: var(--primary-bg);
        opacity: 0;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(transitionOverlay);
    
    // trigger fade
    requestAnimationFrame(() => {
        transitionOverlay.style.opacity = '1';
    });
    
    // execute callback and cleanup
    setTimeout(() => {
        if (callback) callback();
        transitionOverlay.remove();
    }, 400);
}

// export functions to global scope for post pages
window.PageTransitions = {
    createDotTransitionAnimation,
    createReverseTransition,
    attachDotTransitionToPostLinks,
    attachBackToHomeTransition,
    createDotTransitionAnimationIndex,
    createReverseTransitionFromPost
};

// legacy global exports for compatibility
window.attachDotTransitionToPostLinks = attachDotTransitionToPostLinks;
window.attachBackToHomeTransition = attachBackToHomeTransition;
window.createReverseTransition = createReverseTransition;
