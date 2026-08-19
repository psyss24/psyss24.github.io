// sort posts by publish date, newest first (stack order)
// fetches the first-commit date for each post from the GitHub API
async function sortPostsByDate(posts) {
    // fetch all publish dates in parallel
    const postsWithDates = await Promise.all(
        posts.map(async (post) => {
            const isoDate = await window.GitHubUtils.fetchPostPublishedDateISO(post.filename);
            return { ...post, publishedAt: isoDate };
        })
    );

    // sort newest first; posts without dates sink to the bottom
    return postsWithDates.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        if (dateA !== dateB) return dateB - dateA; // newest first
        return a.filename.localeCompare(b.filename); // alphabetical tiebreaker
    });
}


// extract excerpt from markdown
function extractExcerptFromMarkdown(markdown) {
    // remove tags first
    const cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
    
    // first, look for intro paragraph (first valid paragraph after title)
    const lines = cleanMarkdown.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('# '));
    if (titleIndex !== -1) {
        for (let i = titleIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            // skip empty lines, headers, and italic-only lines
            if (line && 
                !line.startsWith('#') && 
                !line.match(/^\*[^*]+\*$/)) { // skip lines that are entirely italic
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
    const encodedFilename = encodeURIComponent(post.filename);
    
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
        <h2><a href="post.html?post=${encodedFilename}">${post.title}</a></h2>
        <div style="position: relative;">
            <p>${post.excerpt}</p>
            <div class="post-tags">
                ${genreTags}
            </div>
        </div>
        <div class="post-footer">
            <a href="post.html?post=${encodedFilename}" class="read-more">Read More</a>
        </div>
    `;
    
    return article;
}

// discover markdown files in posts/ without a hardcoded list
async function discoverPostsFromDirectoryListing() {
    try {
        const response = await fetch('posts/', { cache: 'no-store' });
        if (!response.ok) throw new Error('Directory listing not available');

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a[href]'))
            .map(link => link.getAttribute('href') || '')
            .map(href => decodeURIComponent(href.split('/').pop() || ''))
            .filter(name => name.toLowerCase().endsWith('.md'));

        const uniqueFiles = Array.from(new Set(links));
        return uniqueFiles
            .map(name => ({ filename: name.replace(/\.md$/i, '') }))
            .sort((a, b) => a.filename.localeCompare(b.filename));
    } catch (error) {
        console.warn('Directory listing discovery unavailable:', error);
        return [];
    }
}

async function discoverPostsFromGitHubApi() {
    try {
        const response = await fetch('https://api.github.com/repos/psyss24/psyss24.github.io/contents/posts?ref=main', {
            cache: 'no-store',
            headers: {
                Accept: 'application/vnd.github+json'
            }
        });
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const entries = await response.json();
        if (!Array.isArray(entries)) throw new Error('Invalid GitHub response format');

        return entries
            .filter(entry => entry && entry.type === 'file' && typeof entry.name === 'string' && entry.name.toLowerCase().endsWith('.md'))
            .map(entry => ({ filename: entry.name.replace(/\.md$/i, '') }))
            .sort((a, b) => a.filename.localeCompare(b.filename));
    } catch (error) {
        console.error('Failed to auto-discover posts from GitHub:', error);
        return [];
    }
}

async function loadPostIndex() {
    const directoryPosts = await discoverPostsFromDirectoryListing();
    if (directoryPosts.length > 0) return sortPostsByDate(directoryPosts);

    const githubPosts = await discoverPostsFromGitHubApi();
    return sortPostsByDate(githubPosts);
}

// make the cool (post/journal) cards from markdown files
async function loadPostPreviews() {
    const posts = await loadPostIndex();
    
    const journalContainer = document.getElementById('journal');
    if (!journalContainer) return;
    
    // remove existing auto-generated posts but keep manual ones
    const existingPosts = journalContainer.querySelectorAll('.post[data-auto-generated="true"]');
    existingPosts.forEach(post => post.remove());
    
    // Fetch all markdown files in parallel to prevent network waterfall
    const postDataPromises = posts.map(async (post) => {
        try {
            const response = await fetch(`posts/${encodeURIComponent(post.filename)}.md`);
            if (!response.ok) return null;
            const markdown = await response.text();
            return { post, markdown };
        } catch (error) {
            console.error(`Error loading post ${post.filename}:`, error);
            return null;
        }
    });

    const results = await Promise.all(postDataPromises);
    
    for (const result of results) {
        if (!result) continue;
        const { post, markdown } = result;
        
        const tags = parseTagsFromMarkdown(markdown);
        const title = extractTitleFromMarkdown(markdown);
        const excerpt = extractExcerptFromMarkdown(markdown);
        
        const postCard = createPostCard({
            ...post,
            title: title || post.filename,
            excerpt: excerpt
        }, tags);
        
        journalContainer.appendChild(postCard);
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
    discoverPostsFromDirectoryListing,
    discoverPostsFromGitHubApi,
    sortPostsByDate,
    loadPostIndex,
    loadPostPreviews
};
