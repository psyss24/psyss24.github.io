// post page module
// handles post loading, markdown processing, and page initialization for individual post pages

// get post name from url param
const urlParams = new URLSearchParams(window.location.search);
const postName = urlParams.get('post') || 'money'; // default to money post

// fallback functions in case modules don't load
function parseTagsFromMarkdown(markdown) {
    const tagMatch = markdown.match(/^\{([^}]+)\}/m);
    if (!tagMatch) return ['other'];
    
    return tagMatch[1]
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
}

function normalizeTag(tag) {
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

function generateGenreColors(normalizedTags, colorMap) {
    const uniqueTags = [...new Set(normalizedTags)];
    
    if (uniqueTags.length === 1) {
        const color = colorMap[uniqueTags[0]] || colorMap.other;
        return {
            color: color,
            gradient: color
        };
    } else {
        const colors = uniqueTags.map(tag => colorMap[tag] || colorMap.other);
        const primaryColor = colors[0];
        
        let gradient;
        if (colors.length === 2) {
            gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
        } else if (colors.length === 3) {
            gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
        } else {
            gradient = `linear-gradient(135deg, ${colors.slice(0, 4).join(', ')})`;
        }
        
        return {
            color: primaryColor,
            gradient: gradient
        };
    }
}

// load and render markdown
async function loadPost(postName) {
    try {
        const response = await fetch(`../posts/${postName}.md`);
        if (!response.ok) throw new Error('Post not found');
        
        const markdown = await response.text();
        
        // parse tags from markdown
        const tags = window.PostManager ? window.PostManager.parseTagsFromMarkdown(markdown) : parseTagsFromMarkdown(markdown);
        
        // remove tags from markdown before parsing
        let cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
        
        // convert reference-style links to inline links
        cleanMarkdown = convertReferenceLinksToInline(cleanMarkdown);
        
        // remove (#) and () suffixes from definitions before markdown parsing
        cleanMarkdown = cleanMarkdown.replace(/\]\(\#?\)/g, ']');
        
        const html = marked.parse(cleanMarkdown);
        
        // update page title with post title
        const titleMatch = cleanMarkdown.match(/^# (.+)$/m);
        if (titleMatch) {
            document.title = `${titleMatch[1]} - Saad`;
        }
        
        // apply custom styling to parsed HTML
        const styledHTML = styleMarkdownContent(html, tags);
        const postContentElement = document.getElementById('post-content');
        postContentElement.innerHTML = styledHTML;
        
        // store raw markdown for reading time calculation
        postContentElement.dataset.rawMarkdown = markdown;
        
        // apply genre colors to post page
        applyGenreColors(tags);
        
        // calculate and insert reading time immediately
        if (window.UIComponents && window.UIComponents.insertReadingTime) {
            window.UIComponents.insertReadingTime();
        }
        
        // parse definitions after content is loaded
        const postContent = document.querySelector('.post-page');
        if (postContent) {
            if (window.TooltipSystem && window.TooltipSystem.parseDefinitions) {
                window.TooltipSystem.parseDefinitions(postContent);
            } else if (window.parseDefinitions) {
                window.parseDefinitions(postContent);
            }
        }
        
    } catch (error) {
        document.getElementById('post-content').innerHTML = `
            <div class="error">
                <h1>Post Not Found</h1>
                <p>Sorry, the requested post could not be loaded.</p>
            </div>
        `;
    }
}

// convert reference-style links to inline links
function convertReferenceLinksToInline(markdown) {
    // extract all reference definitions from the bottom of the document
    const referenceMap = {};
    const referenceRegex = /^\[(\d+|\w+)\]:\s*(.+)$/gm;
    let match;
    
    while ((match = referenceRegex.exec(markdown)) !== null) {
        referenceMap[match[1]] = match[2].trim();
    }
    
    // remove reference definitions from the markdown
    let cleanedMarkdown = markdown.replace(/^\[(\d+|\w+)\]:\s*(.+)$/gm, '');
    
    // convert reference-style links to inline links
    cleanedMarkdown = cleanedMarkdown.replace(/\[([^\]]+)\]\[(\d+|\w+)\]/g, (fullMatch, linkText, refKey) => {
        const url = referenceMap[refKey];
        return url ? `[${linkText}](${url})` : fullMatch;
    });
    
    // clean up any extra empty lines at the end
    cleanedMarkdown = cleanedMarkdown.replace(/\n\n+$/, '\n\n');
    
    return cleanedMarkdown;
}

// apply genre colors based on tags
function applyGenreColors(tags) {
    const postPage = document.querySelector('.post-page');
    if (!postPage) return;
    
    // remove existing genre classes
    postPage.classList.remove('economics', 'neuroscience', 'technology', 'other');
    
    // add genre classes based on tags
    tags.forEach(tag => {
        const normalizedTag = window.ColorUtils ? window.ColorUtils.normaliseTag(tag) : normalizeTag(tag);
        postPage.classList.add(normalizedTag);
    });
    
    // set css custom property for genre colors and gradients
    const normalizedTags = tags.map(tag => window.ColorUtils ? window.ColorUtils.normaliseTag(tag) : normalizeTag(tag));
    const colorMap = {
        'economics': '#4caf50',
        'neuroscience': '#ba68c8',
        'technology': '#64b5f6',
        'other': '#ffb74d'
    };
    
    const genreColors = window.ColorUtils ? window.ColorUtils.generateGenreColors(normalizedTags, colorMap) : generateGenreColors(normalizedTags, colorMap);
    postPage.style.setProperty('--genre-color', genreColors.color);
    postPage.style.setProperty('--genre-gradient', genreColors.gradient);
}

// apply custom styling to markdown HTML
function styleMarkdownContent(html, tags) {
    const genreTags = tags.map(tag => {
        const normalizedTag = window.ColorUtils ? window.ColorUtils.normaliseTag(tag) : normalizeTag(tag);
        const displayName = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<div class="genre-tag ${normalizedTag}"><span>${displayName}</span></div>`;
    }).join('');
    
    // add multiple-tags class if there are multiple tags
    const readingTimeClass = tags.length > 1 ? 'reading-time multiple-tags' : 'reading-time';
    
    return html
        // style main title (first h1) and add genre tags below it
        .replace(
            /^<h1>(.*?)<\/h1>/,
            `<h1>$1</h1><div class="post-meta-row"><div class="${readingTimeClass}"></div><div class="tag-container">${genreTags}</div></div>`
        )
        // publication date next (first em in italics)
        .replace(/^<p><em>Published on (.*?)<\/em><\/p>/, '<div class="post-date">Published on $1</div>')
        // then intro quote (first blockquote as intro)
        .replace(/^<blockquote>\s*<p>(.*?)<\/p>\s*<\/blockquote>/, '<p class="post-intro">$1</p>')
        // then closing section (content after hr)
        .replace(/<hr>\s*<p><em>(.*?)<\/em><\/p>/, '<div class="post-closing"><p>$1</p></div>');
}

// initialize post page
function initPostPage() {
    // load the post when page loads
    loadPost(postName);
    
    // setup back-to-home transition after page loads
    if (window.PageTransitions && window.PageTransitions.attachBackToHomeTransition) {
        window.PageTransitions.attachBackToHomeTransition();
    } else if (window.attachBackToHomeTransition) {
        window.attachBackToHomeTransition();
    }
}

// export functions to global scope
window.PostPage = {
    loadPost,
    convertReferenceLinksToInline,
    applyGenreColors,
    styleMarkdownContent,
    initPostPage,
    parseTagsFromMarkdown,
    normalizeTag,
    generateGenreColors
};

// auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostPage);
} else {
    initPostPage();
}
