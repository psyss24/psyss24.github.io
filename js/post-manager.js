// post management module
// handles post loading, card creation, and markdown processing

// extract excerpt from markdown
function extractExcerptFromMarkdown(markdown) {
    // remove tags first
    const cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
    
    // first, look for intro paragraph (first substantial paragraph after title)
    const lines = cleanMarkdown.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('# '));
    if (titleIndex !== -1) {
        for (let i = titleIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            // skip empty lines, headers, and italic-only lines
            if (line && 
                !line.startsWith('#') && 
                !line.match(/^\*[^*]+\*$/) && // skip lines that are entirely italic
                line.length > 50) { // ensure it's substantial content
                return line.substring(0, 250) + (line.length > 250 ? '...' : '');
            }
        }
    }
    
    // fallback to first italic text if no substantial paragraph found
    const excerptMatch = cleanMarkdown.match(/\*([^*]+)\*/);
    if (excerptMatch) {
        return excerptMatch[1].trim();
    }
    
    return 'No excerpt available';
}

// get title from markdown which is wayyy cooler than hardcoding them
function extractTitleFromMarkdown(markdown) {
    // remove tags 
    const cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
    
    // find first h1 title
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
    
    const normalizedTags = tags.map(tag => window.ColorUtils.normaliseTag(tag));
    
    // set tag color
    const colorMap = {
        'economics': '#4caf50',
        'neuroscience': '#ba68c8',
        'technology': '#64b5f6',
        'other': '#ffb74d'
    };
    
    const genreColors = window.ColorUtils.generateGenreColors(normalizedTags, colorMap);
    article.style.setProperty('--genre-color', genreColors.color);
    article.style.setProperty('--genre-gradient', genreColors.gradient);
    
    const genreTags = tags.map(tag => {
        const normalizedTag = window.ColorUtils.normaliseTag(tag);
        const displayName = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<div class="genre-tag ${normalizedTag}"><span>${displayName}</span></div>`;
    }).join('');
    
    article.innerHTML = `
        <h2><a href="post.html?post=${post.filename}">${post.title}</a></h2>
        <div style="position: relative;">
            <p>${post.excerpt}</p>
            <div class="post-tags">
                ${genreTags}
            </div>
        </div>
        <div class="post-footer">
            <a href="post.html?post=${post.filename}" class="read-more">Read More</a>
        </div>
    `;
    
    return article;
}

// load post slugs from manifest for auto-discovery
async function loadPostIndex() {
    try {
        const response = await fetch('posts/index.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Post index not found');

        const manifest = await response.json();
        const entries = Array.isArray(manifest) ? manifest : manifest.posts;
        if (!Array.isArray(entries)) throw new Error('Invalid post index format');

        return entries
            .map(entry => {
                if (typeof entry === 'string') {
                    return { filename: entry };
                }

                if (entry && typeof entry.filename === 'string') {
                    return { filename: entry.filename };
                }

                return null;
            })
            .filter(Boolean);
    } catch (error) {
        console.error('Failed to load post index:', error);
        return [];
    }
}

// make the cool (post/journal) cards from markdown files
async function loadPostPreviews() {
    const posts = await loadPostIndex();
    
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
    if (window.UIComponents && window.UIComponents.addReadMoreArrows) {
        window.UIComponents.addReadMoreArrows();
    }
    
    // Attach dot transition animation to post links
    if (window.PageTransitions && window.PageTransitions.attachDotTransitionToPostLinks) {
        window.PageTransitions.attachDotTransitionToPostLinks();
    }
}

// export
window.PostManager = {
    extractExcerptFromMarkdown,
    extractTitleFromMarkdown,
    parseTagsFromMarkdown,
    createPostCard,
    loadPostIndex,
    loadPostPreviews
};
