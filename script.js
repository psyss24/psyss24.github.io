// --- Theme Toggle Logic ---
function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    // Update all theme-toggle buttons
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.textContent = isDark ? 'Lights on' : 'Lights off';
    });
}

function getThemePref() {
    if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
    }
    // Default: match system
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function saveThemePref(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function setupThemeToggle() {
    // Attach to all theme-toggle buttons (header and footer)
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const isDark = !document.body.classList.contains('dark-theme');
            setTheme(isDark);
            saveThemePref(isDark);
        });
    });
}

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
}

// --- Mobile tooltip positioning for definition terms ---
// --- Reading Progress Bar ---
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

// Only show on post/journal pages
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.post-page')) {
    createReadingProgressBar();
    window.addEventListener('scroll', updateReadingProgressBar, { passive: true });
    window.addEventListener('resize', updateReadingProgressBar);
    updateReadingProgressBar();
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    setTheme(getThemePref());
    setupThemeToggle();
});
// --- Mobile tooltip positioning for definition terms ---
function adjustMobileTooltip(term) {
    const tooltip = term.querySelector('.definition-tooltip');
    if (!tooltip) return;
    tooltip.classList.add('tooltip-below');
    tooltip.classList.remove('shift-left', 'shift-right');
    // Make tooltip absolutely positioned for mobile
    tooltip.style.position = 'absolute';
    // Save previous styles
    const prevOpacity = tooltip.style.opacity;
    const prevPointer = tooltip.style.pointerEvents;
    const prevDisplay = tooltip.style.display;
    const prevVisibility = tooltip.style.visibility;
    // For measurement, make tooltip invisible but measurable
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    // Reset positioning
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.top = '';
    tooltip.style.transform = '';
    tooltip.style.marginLeft = '';
    tooltip.style.marginRight = '';
    function doAdjust() {
        const termRect = term.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const padding = 32;
        // Make tooltip as close as possible vertically to the term
        let top = termRect.bottom + window.scrollY;
        // Set tooltip width to container width (viewport width minus padding)
        const containerWidth = viewportWidth - (padding * 2);
        tooltip.style.width = containerWidth + 'px';
        tooltip.style.minWidth = containerWidth + 'px';
        tooltip.style.maxWidth = containerWidth + 'px';
        // Position tooltip below, left-aligned to viewport container start
        const leftPosition = padding;
        // Force the positioning with !important if needed
        tooltip.style.setProperty('left', leftPosition + 'px', 'important');
        tooltip.style.setProperty('top', top + 'px', 'important');
        tooltip.style.setProperty('position', 'fixed', 'important'); // Try fixed instead of absolute
        tooltip.style.transform = 'none';
        tooltip.style.marginLeft = '0';
        tooltip.style.marginRight = '0';
        // Restore visibility
        tooltip.style.visibility = '';
        tooltip.style.display = '';
        tooltip.style.opacity = prevOpacity;
        tooltip.style.pointerEvents = prevPointer;
        // More detailed debug logs
        console.log('[Tooltip Debug] termRect:', termRect);
        console.log('[Tooltip Debug] Set tooltip width to:', containerWidth);
        console.log('[Tooltip Debug] Final left:', leftPosition, 'top:', top);
        console.log('[Tooltip Debug] Computed styles after setting:', {
          position: getComputedStyle(tooltip).position,
          left: getComputedStyle(tooltip).left,
          top: getComputedStyle(tooltip).top,
          transform: getComputedStyle(tooltip).transform
        });
        console.log('[Tooltip Debug] Tooltip getBoundingClientRect:', tooltip.getBoundingClientRect());
    }
    setTimeout(doAdjust, 10);
}


document.addEventListener('DOMContentLoaded', function() {
    // Animate journal post page on load
    const postPage = document.querySelector('.post-page');
    if (postPage) {
        setTimeout(() => {
            postPage.classList.add('page-animate-in');
        }, 60); // slight delay for smoothness

        // Animate back-to-home with smooth exit, only if .back-to-home exists
        const backHome = document.querySelector('.back-to-home');
        if (backHome) {
            backHome.addEventListener('click', function(e) {
                e.preventDefault();
                postPage.classList.remove('page-animate-in');
                postPage.classList.add('page-animate-out');
                // Smooth scroll to top, then trigger fade-out
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    window.location.href = backHome.getAttribute('href');
                }, 1300); // match exit duration
            });
        }
    }

    // Insert reading time into .post-meta-row after post content is loaded (for post.html)
    if (window.location.pathname.endsWith('/posts/post.html')) {
        const observer = new MutationObserver(() => {
            const postPage = document.querySelector('.post-page');
            if (!postPage) return;
            const loading = postPage.querySelector('.loading');
            if (loading) return;
            // Ensure .reading-time is present inside .post-meta-row
            const metaRow = postPage.querySelector('.post-meta-row');
            if (!metaRow) return;
            let timeElem = metaRow.querySelector('.reading-time');
            if (!timeElem) {
                timeElem = document.createElement('div');
                timeElem.className = 'reading-time';
                metaRow.insertBefore(timeElem, metaRow.firstChild);
            }
            // Only fill if not already filled
            if (timeElem && !timeElem.textContent.trim()) {
                insertReadingTime();
            }
        });
        const postPage = document.querySelector('.post-page');
        if (postPage) {
            observer.observe(postPage, { childList: true, subtree: true });
        }
    }

    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            // get rid of active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            // add active class to clicked tab
            this.classList.add('active');
            // show corresponding content
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Attach mobile tooltip tap handler after definitions are parsed
    function attachMobileTooltipHandler() {
        document.querySelectorAll('.definition-term').forEach(term => {
            if (term._mobileTooltipHandlerAttached) return;
            term._mobileTooltipHandlerAttached = true;
            term.addEventListener('click', function(e) {
                if (window.innerWidth > 768) return; // Only on mobile
                e.stopPropagation();
                // Toggle this one, close others
                const isActive = term.classList.contains('tooltip-active');
                document.querySelectorAll('.definition-term.tooltip-active').forEach(other => {
                    if (other !== term) other.classList.remove('tooltip-active');
                });
                if (isActive) {
                    term.classList.remove('tooltip-active');
                } else {
                    term.classList.add('tooltip-active');
                    adjustMobileTooltip(term);
                }
            });
        });
        // Close tooltip if tapping outside
        if (!window._mobileTooltipGlobalHandlerAttached) {
            document.body.addEventListener('click', function(e) {
                if (window.innerWidth > 768) return;
                document.querySelectorAll('.definition-term.tooltip-active').forEach(term => {
                    term.classList.remove('tooltip-active');
                });
            });
            window._mobileTooltipGlobalHandlerAttached = true;
        }
    }

    // Attach after definitions are parsed
    setTimeout(attachMobileTooltipHandler, 200);

    // loaad post previews automatically
    loadPostPreviews();
});

// readmore arrow anim
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

// add arrows
document.addEventListener('DOMContentLoaded', function() {
    addReadMoreArrows();
});

// tooltipmanager
class TooltipManager {
    static activeTooltip = null;
    static hideTimeout = null;
    static isDesktop = () => window.innerWidth > 768;
    
    static register(termElement, tooltipElement) {
        // Store references
        termElement.tooltip = tooltipElement;
        
        // mouse enter handler
        termElement.addEventListener('mouseenter', () => {
            if (this.isDesktop()) {
                this.showTooltip(termElement);
            }
        });
        
        // mouse leave handler
        termElement.addEventListener('mouseleave', () => {
            if (this.isDesktop()) {
                this.scheduleHide(termElement);
            }
        });
        
        // toltip hover handlers to prevent hiding
        tooltipElement.addEventListener('mouseenter', () => {
            if (this.isDesktop()) {
                this.cancelHide();
            }
        });
        
        tooltipElement.addEventListener('mouseleave', () => {
            if (this.isDesktop()) {
                this.scheduleHide(termElement);
            }
        });
    }
    
    static showTooltip(termElement) {
        // cacnel any pending hide
        this.cancelHide();
        
        // instantly hide current tooltip if different
        if (this.activeTooltip && this.activeTooltip !== termElement) {
            this.hideTooltip(this.activeTooltip, true);
        }
        
        // set new active tooltip
        this.activeTooltip = termElement;
        
        // position and show tooltip
        this.positionTooltip(termElement);
        termElement.classList.add('tooltip-active');
    }
    
    static scheduleHide(termElement) {
        // only schedule hide if this is the active tooltip
        if (this.activeTooltip === termElement) {
            this.hideTimeout = setTimeout(() => {
                this.hideTooltip(termElement, false);
            }, 200); // short delay for smooth and coolness factors
        }
    }
    
    static cancelHide() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    
    static hideTooltip(termElement, instant = false) {
        if (instant) {
            // instantly hide = disable transitions temporarily
            const tooltip = termElement.tooltip;
            const originalTransition = tooltip.style.transition;
            tooltip.style.transition = 'none';
            termElement.classList.remove('tooltip-active');
            
            // cool transition after a frame
            requestAnimationFrame(() => {
                tooltip.style.transition = originalTransition;
            });
        } else {
            // cool fade out
            termElement.classList.remove('tooltip-active');
        }
        
        // clear active state
        if (this.activeTooltip === termElement) {
            this.activeTooltip = null;
        }
    }
    
    static positionTooltip(termElement) {
        const tooltip = termElement.tooltip;
        
        // reset positioning 
        tooltip.style.left = '';
        tooltip.style.top = '';
        tooltip.style.transform = '';
        tooltip.classList.remove('tooltip-below');
        

        tooltip.offsetHeight;
        
        // get position info
        const termRect = termElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // calc if tooltip would overflow based on term position and tooltip width
        // positon tooltip to the right first to get its natural width
        tooltip.style.transform = 'translateY(-50%)';
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // calc potential right edge position
        const potentialRight = termRect.right + tooltipRect.width;
        const wouldOverflow = potentialRight > viewportWidth - 20;
        
        if (wouldOverflow) {
            // reset and position below
            tooltip.style.left = '0';
            tooltip.style.top = '100%';
            tooltip.style.transform = 'translateY(0.5rem)';
            tooltip.classList.add('tooltip-below');
        }
        // if no overflow, keep the right positioning that was already set
    }
}

// hover def-parser (this a lot took longer than expected )
function parseDefinitions(element) {
    // find definition patterns
    function findDefinitions(text) {
        const definitions = [];
        let i = 0;
        
        while (i < text.length) {
            // look for opening parenthesis
            if (text[i] === '(') {
                const termStart = i + 1;
                let parenCount = 1;
                let termEnd = -1;
                
                // find matching closing parenthesis for the term
                for (let j = termStart; j < text.length; j++) {
                    if (text[j] === '(') parenCount++;
                    else if (text[j] === ')') parenCount--;
                    
                    if (parenCount === 0) {
                        termEnd = j;
                        break;
                    }
                }
                
                // check if we found a complete term and if it's followed by [
                if (termEnd !== -1 && termEnd + 1 < text.length && text[termEnd + 1] === '[') {
                    const defStart = termEnd + 2;
                    let bracketCount = 1;
                    let defEnd = -1;
                    
                    // find matching closing bracket for the definition
                    for (let j = defStart; j < text.length; j++) {
                        if (text[j] === '[') bracketCount++;
                        else if (text[j] === ']') bracketCount--;
                        
                        if (bracketCount === 0) {
                            defEnd = j;
                            break;
                        }
                    }
                    
                    // if we found a complete definition, add it to our list
                    if (defEnd !== -1) {
                        const term = text.slice(termStart, termEnd).trim();
                        const definition = text.slice(defStart, defEnd).trim();
                        
                        definitions.push({
                            start: i,
                            end: defEnd + 1,
                            term: term,
                            definition: definition
                        });
                        i = defEnd + 1;
                        continue;
                    }
                }
            }
            i++;
        }
        
        return definitions;
    }
    
    // get all text nodes in the element
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    // process each text node
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const definitions = findDefinitions(text);
        
        if (definitions.length > 0) {
            const parent = textNode.parentNode;
            const fragment = document.createDocumentFragment();
            
            let lastIndex = 0;
            
            definitions.forEach(def => {
                // add text before the definition
                if (def.start > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, def.start)));
                }
                
                // create definition element
                const termElement = document.createElement('span');
                termElement.className = 'definition-term';
                termElement.textContent = def.term;
                
                const tooltipElement = document.createElement('span');
                tooltipElement.className = 'definition-tooltip';
                tooltipElement.textContent = def.definition;
                
                // add tooltip management
                TooltipManager.register(termElement, tooltipElement);
                
                termElement.appendChild(tooltipElement);
                fragment.appendChild(termElement);
                
                lastIndex = def.end;
            });
            
            // add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            
            // replace the text node with the fragment
            parent.replaceChild(fragment, textNode);
        }
    });
}

// make parseDefinitions available globally
window.parseDefinitions = parseDefinitions;

document.addEventListener('DOMContentLoaded', function() {
    // parse definitions in post content
    const postContent = document.querySelector('.post-page');
    if (postContent) {
        parseDefinitions(postContent);
    }
    
    // parse definitions in post cards
    const postCards = document.querySelectorAll('.post');
    postCards.forEach(card => {
        parseDefinitions(card);
    });
});

// make the cool (post/journal ) cards from markdown files
async function loadPostPreviews() {
    const posts = [
        { filename: 'money', excerpt: 'The form of money has seen many changes, though its foundation still lies in trust and agreement' },
        { filename: 'bitcoin', excerpt: 'Bitcoin’s history is one of accumulation: of code, of ideas, and of value. At first, it was a technical experiment. Then a protest. Then a market.' }
        // i shall add more posts soon ^(tm)
    ];
    
    const journalContainer = document.getElementById('journal');
    if (!journalContainer) return;
    
    // remove existing auto-generated posts but keep manual ones
    const existingPosts = journalContainer.querySelectorAll('.post[data-auto-generated="true"]');
    existingPosts.forEach(post => post.remove());
    
    for (const post of posts) {
        try {
            const response = await fetch(`posts/${post.filename}.md`);
            if (!response.ok) continue;
            
            const markdown = await response.text();
            const tags = parseTagsFromMarkdown(markdown);
            
            // get title from markdown
            const title = extractTitleFromMarkdown(markdown);
            
            // get excerpt from markdown
            const excerpt = extractExcerptFromMarkdown(markdown);
            
            // make post card
            const postCard = createPostCard({
                ...post,
                title: title || post.filename,
                excerpt: excerpt
            }, tags);
            
            journalContainer.appendChild(postCard);
        } catch (error) {
            console.error(`Error loading post ${post.filename}:`, error);
        }
    }
    
    // add the cool arrows to readmore
    addReadMoreArrows();
}

// extract excerpt from markdown (italic text after title)
function extractExcerptFromMarkdown(markdown) {
    // remove tags first
    const cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
    
    // find first italic text (between * or _)
    const excerptMatch = cleanMarkdown.match(/\*([^*]+)\*/);
    if (excerptMatch) {
        return excerptMatch[1].trim();
    }
    
    // fallback to first paragraph after title
    const lines = cleanMarkdown.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('# '));
    if (titleIndex !== -1) {
        for (let i = titleIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#')) {
                return line.substring(0, 120) + (line.length > 120 ? '...' : '');
            }
        }
    }
    
    return 'No excerpt available';
}

// get title from markdown which is wayyy cooler than hardcoding them
function extractTitleFromMarkdown(markdown) {
    // remove tags 
    const cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
    
    // find  first h1 title
    const titleMatch = cleanMarkdown.match(/^# (.+)$/m);
    return titleMatch ? titleMatch[1].trim() : null;
}

// parse tags from markdown which is (again) wayyy cooler than hardcoding them
function parseTagsFromMarkdown(markdown) {
    const tagMatch = markdown.match(/^\{([^}]+)\}/m);
    if (!tagMatch) return ['other'];
    
    return tagMatch[1]
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
}

// create card element
function createPostCard(post, tags) {
    const article = document.createElement('article');
    article.className = 'post';
    article.setAttribute('data-auto-generated', 'true');
    
    const normalizedTags = tags.map(tag => normaliseTag(tag));
    
    // set tag color
    const colorMap = {
        'economics': '#4caf50',
        'neuroscience': '#ba68c8',
        'technology': '#64b5f6',
        'other': '#ffb74d'
    };
    
    const genreColors = generateGenreColors(normalizedTags, colorMap);
    article.style.setProperty('--genre-color', genreColors.color);
    article.style.setProperty('--genre-gradient', genreColors.gradient);
    
    const genreTags = tags.map(tag => {
        const normalizedTag = normaliseTag(tag);
        const displayName = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<div class="genre-tag ${normalizedTag}"><span>${displayName}</span></div>`;
    }).join('');
    
    article.innerHTML = `
        <h2><a href="posts/post.html?post=${post.filename}">${post.title}</a></h2>
        <p>${post.excerpt}</p>
        <div class="post-footer">
            <div class="post-tags">
                ${genreTags}
            </div>
            <a href="posts/post.html?post=${post.filename}" class="read-more">Read More</a>
        </div>
    `;
    
    return article;
}

// get genre colors and gradients for multiple tags
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
        
        // make  gradient based on number of colors
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
        'other': 'other'
    };
    
    return tagMap[tag.toLowerCase()] || 'other';
}

// Simple mobile scroll animations
function initMobileScrollAnimations() {
    const cards = document.querySelectorAll('.post, .project-card');
    if (window.innerWidth > 768) {
        // On desktop, remove animation classes
        cards.forEach(card => {
            card.classList.remove('animate-ready', 'animate-in');
        });
        return;
    }

    // Intersection Observer for scroll animations
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

    // Only add .animate-ready and observe cards not already animated in
    cards.forEach(card => {
        if (!card.classList.contains('animate-in')) {
            card.classList.add('animate-ready');
            observer.observe(card);
        } else {
            card.classList.remove('animate-ready');
        }
    });
}

// Initialize mobile scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileScrollAnimations();
});

// Re-initialize on window resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        initMobileScrollAnimations();
    }, 100);
});

// Mobile tap-to-toggle for definition tooltips
function isMobileDevice() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
}

function closeAllTooltips(except) {
    document.querySelectorAll('.definition-term.tooltip-active').forEach(term => {
        if (term !== except) {
            term.classList.remove('tooltip-active');
        }
    });
}

// Attach mobile tap-to-toggle handler to a term (no clone, just toggle)
function attachMobileTooltipHandler(term) {
    if (term._tooltipHandlerAttached) return;
    term._tooltipHandlerAttached = true;
    term.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        const wasActive = term.classList.contains('tooltip-active');
        closeAllTooltips();
        if (!wasActive) {
            term.classList.add('tooltip-active');
            setTimeout(() => adjustMobileTooltip(term), 0);
        }
        e.stopPropagation();
    });
}

// Hide tooltip when tapping outside (only once)
let outsideTooltipListenerAdded = false;
function addOutsideTooltipListener() {
    if (outsideTooltipListenerAdded) return;
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.definition-term')) {
            closeAllTooltips();
        }
    });
    outsideTooltipListenerAdded = true;
}

// Patch parseDefinitions to attach tap handler on mobile, and fix double-tap toggle
const origParseDefinitions = window.parseDefinitions;
window.parseDefinitions = function(element) {
    origParseDefinitions(element);
    if (isMobileDevice()) {
        element.querySelectorAll('.definition-term').forEach(term => {
            attachMobileTooltipHandler(term);
        });
        addOutsideTooltipListener();
    }
};
