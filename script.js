document.addEventListener('DOMContentLoaded', function() {

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
