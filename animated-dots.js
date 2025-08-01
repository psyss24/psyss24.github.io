// animated-dots.js
// Canvas-based animated dots with elegant transitions
// - Index page: full opacity throughout
// - Post page: linger briefly, then fade out gracefully

(function() {
  // Detect page type
  const isIndexPage = document.body.classList.contains('index-page');
  const isPostPage = document.body.classList.contains('post-body');
  
  // Only run on index or post pages
  if (!isIndexPage && !isPostPage) return;
  
  // Configurable parameters
  const DOT_RADIUS = 0.8; // Smaller dots
  const DOT_SPACING = 24; // Closer spacing for more dots
  const ANIMATION_SPEED = 0.025; // Much slower movement
  
  // Post page fade timing
  const POST_LINGER_TIME = 1200; // ms to linger at full opacity on post page
  const POST_FADE_DURATION = 1800; // ms for fade-out animation

  // Create canvas - absolutely fixed to viewport
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: -1 !important;
    pointer-events: none !important;
    display: block !important;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  let animationOffset = 0;
  let startTime = Date.now();
  let globalOpacity = 1;
  let indexPageFadeIn = false;

  // Check if we're coming from a post page using multiple methods
  let shouldFadeIn = false;
  
  if (isIndexPage) {
    // Method 1: Check localStorage flag set by post page navigation
    const fromPost = localStorage.getItem('comingFromPost') === 'true';
    
    // Method 2: Check document.referrer as backup
    const referrerFromPost = document.referrer && (
      document.referrer.includes('/posts/') || 
      document.referrer.includes('post.html')
    );
    
    // Method 3: Check URL hash or params as backup
    const urlFromPost = window.location.hash === '#from-post' || 
                        new URLSearchParams(window.location.search).has('from-post');
    
    shouldFadeIn = fromPost || referrerFromPost || urlFromPost;
    
    // Clear the flag
    localStorage.removeItem('comingFromPost');
    
    if (shouldFadeIn) {
      console.log('Dots fade-in triggered: fromPost=' + fromPost + ', referrer=' + referrerFromPost + ', url=' + urlFromPost);
      indexPageFadeIn = true;
      globalOpacity = 0;
    } else {
      console.log('No fade-in: referrer=' + document.referrer);
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function calculatePostPageOpacity() {
    if (isIndexPage) {
      if (indexPageFadeIn) {
        // Fade in dots when arriving at index page from post page
        const elapsed = Date.now() - startTime;
        const fadeInDuration = 800; // ms for fade-in
        
        if (elapsed < fadeInDuration) {
          // Smooth fade from 0 to 1 with easeOut curve
          const progress = elapsed / fadeInDuration;
          globalOpacity = Math.pow(progress, 0.5); // Square root for smooth ease-out
          console.log('Fade-in progress:', progress.toFixed(3), 'opacity:', globalOpacity.toFixed(3), 'elapsed:', elapsed);
          return globalOpacity;
        } else {
          console.log('Fade-in complete');
          globalOpacity = 1; // Fully visible after fade-in
          indexPageFadeIn = false; // Stop the fade-in process
          return 1;
        }
      } else {
        return 1; // Normal index page - always full opacity
      }
    }
    
    const elapsed = Date.now() - startTime;
    
    if (elapsed < POST_LINGER_TIME) {
      // Linger phase: full opacity
      return 1;
    } else if (elapsed < POST_LINGER_TIME + POST_FADE_DURATION) {
      // Fade phase: smooth fade from 1 to 0
      const fadeProgress = (elapsed - POST_LINGER_TIME) / POST_FADE_DURATION;
      // Use easeOut curve for natural fading
      return 1 - Math.pow(fadeProgress, 2);
    } else {
      // Fully faded
      return 0;
    }
  }

  function drawDots(deltaTime) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate global opacity for post page fade effect
    globalOpacity = calculatePostPageOpacity();
    
    // Skip drawing if fully transparent (but allow very low opacity for fade-in)
    if (globalOpacity <= 0.01 && !indexPageFadeIn) return;
    
    // Update animation
    animationOffset += ANIMATION_SPEED * deltaTime;
    
    // Calculate smooth offsets for animation
    const xOffset = animationOffset % DOT_SPACING;
    const yOffset = animationOffset % DOT_SPACING;
    
    // Detect theme
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const baseOpacity = 0.3;
    
    // Draw a grid of dots across the entire viewport
    for (let gridY = -DOT_SPACING; gridY <= height + DOT_SPACING; gridY += DOT_SPACING) {
      for (let gridX = -DOT_SPACING; gridX <= width + DOT_SPACING; gridX += DOT_SPACING) {
        
        // Calculate actual dot position with animation offset
        const dotX = gridX + xOffset;
        const dotY = gridY + yOffset;
        
        // Skip if outside viewport bounds
        if (dotX < -DOT_RADIUS || dotX > width + DOT_RADIUS) continue;
        if (dotY < -DOT_RADIUS || dotY > height + DOT_RADIUS) continue;
        
        // Draw the dot with global opacity
        ctx.beginPath();
        ctx.arc(dotX, dotY, DOT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${isDarkTheme ? '200,200,210' : '60,64,67'}, ${baseOpacity * globalOpacity})`;
        ctx.fill();
      }
    }
  }

  let lastTime = 0;
  function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    drawDots(deltaTime);
    
    // Continue animation on index page (including during fade-in) or while fading on post page
    if (isIndexPage || globalOpacity > 0 || indexPageFadeIn) {
      requestAnimationFrame(animate);
    }
  }

  // Initialize
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
