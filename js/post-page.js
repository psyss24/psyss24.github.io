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

function renderLatex(postContentElement) {
    if (!postContentElement || !window.renderMathInElement) return;

    window.renderMathInElement(postContentElement, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        strict: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    });
}

function isAbsoluteOrSpecialUrl(url) {
    return /^(?:[a-z]+:)?\/\//i.test(url) ||
        url.startsWith('#') ||
        url.startsWith('data:') ||
        url.startsWith('blob:');
}

function encodePathSegment(segment) {
    try {
        return encodeURIComponent(decodeURIComponent(segment));
    } catch (_error) {
        return encodeURIComponent(segment);
    }
}

function resolvePostImageSrc(src) {
    if (!src || isAbsoluteOrSpecialUrl(src)) return src;

    const [pathAndQuery, hashPart] = src.split('#');
    const [pathPart, queryPart] = pathAndQuery.split('?');

    let normalizedPath = pathPart
        .replace(/^(\.\/)+/, '')
        .replace(/^\/+/, '');

    while (normalizedPath.startsWith('../')) {
        normalizedPath = normalizedPath.slice(3);
    }

    const encodedPath = normalizedPath
        .split('/')
        .filter(part => part.length > 0)
        .map(encodePathSegment)
        .join('/');

    if (!encodedPath) return src;

    // Resolve common root-level media references while keeping post-local images convenient.
    const isRootLevelContent =
        normalizedPath.startsWith('posts/') ||
        normalizedPath.startsWith('media/');

    let resolved = isRootLevelContent ? encodedPath : `posts/${encodedPath}`;

    if (queryPart !== undefined) {
        resolved += `?${queryPart}`;
    }

    if (hashPart !== undefined) {
        resolved += `#${hashPart}`;
    }

    return resolved;
}

function markImageBlockParagraph(paragraph) {
    const children = Array.from(paragraph.children);
    if (children.length !== 1) return;

    const onlyChild = children[0];
    const isStandaloneImage =
        onlyChild.tagName === 'IMG' ||
        (onlyChild.tagName === 'A' &&
            onlyChild.children.length === 1 &&
            onlyChild.children[0].tagName === 'IMG');

    if (isStandaloneImage) {
        paragraph.classList.add('post-image-block');
    }
}

function buildDarkVariantSrc(src) {
    if (!src || !/media\/nn_plots\//.test(src)) return null;
    if (/-dark\.[a-z0-9]+(?:[?#].*)?$/i.test(src)) return src;

    const [pathAndQuery, hashPart] = src.split('#');
    const [pathPart, queryPart] = pathAndQuery.split('?');
    const darkPath = pathPart.replace(/(\.[^.\/]+)$/i, '-dark$1');

    let darkSrc = darkPath;
    if (queryPart !== undefined) darkSrc += `?${queryPart}`;
    if (hashPart !== undefined) darkSrc += `#${hashPart}`;
    return darkSrc;
}

function updatePostThemeImages(isDark) {
    document.querySelectorAll('.post-page img[data-light-src][data-dark-src]').forEach(img => {
        const targetSrc = isDark ? img.dataset.darkSrc : img.dataset.lightSrc;
        if (targetSrc && img.getAttribute('src') !== targetSrc) {
            img.setAttribute('src', targetSrc);
        }
    });
}

function enhancePostImages(postContentElement) {
    if (!postContentElement) return;

    postContentElement.querySelectorAll('img').forEach(img => {
        const rawSrc = img.getAttribute('src') || '';
        const resolvedSrc = resolvePostImageSrc(rawSrc);

        if (resolvedSrc && resolvedSrc !== rawSrc) {
            img.setAttribute('src', resolvedSrc);
        }

        const lightSrc = img.getAttribute('src') || resolvedSrc;
        const darkSrc = buildDarkVariantSrc(lightSrc);
        if (lightSrc && darkSrc) {
            img.dataset.lightSrc = lightSrc;
            img.dataset.darkSrc = darkSrc;

            if (!img.dataset.darkFallbackBound) {
                img.addEventListener('error', () => {
                    const currentSrc = img.getAttribute('src') || '';
                    if (img.dataset.darkSrc && currentSrc === img.dataset.darkSrc && img.dataset.lightSrc) {
                        img.setAttribute('src', img.dataset.lightSrc);
                    }
                });
                img.dataset.darkFallbackBound = 'true';
            }
        }

        img.loading = 'lazy';
        img.decoding = 'async';

        const parent = img.parentElement;
        if (parent && parent.tagName === 'P') {
            markImageBlockParagraph(parent);
        } else if (parent && parent.tagName === 'A' && parent.parentElement && parent.parentElement.tagName === 'P') {
            markImageBlockParagraph(parent.parentElement);
        }
    });

    updatePostThemeImages(document.body.classList.contains('dark-theme'));
}

function protectMathFromMarkdownParsing(markdown) {
    const protectedSegments = [];
    let segmentCounter = 0;

    const createToken = (type) => `MATH_${type}_${segmentCounter++}_TOKEN`;

    // protect block math first so inline regex does not split it
    let protectedMarkdown = markdown.replace(/\$\$([\s\S]+?)\$\$/g, (fullMatch, expression) => {
        const token = createToken('BLOCK');
        protectedSegments.push({ token, content: `$$${expression}$$` });
        return token;
    });

    // protect inline math; keep leading character so punctuation/spacing is preserved
    protectedMarkdown = protectedMarkdown.replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (fullMatch, prefix, expression) => {
        const token = createToken('INLINE');
        protectedSegments.push({ token, content: `$${expression}$` });
        return `${prefix}${token}`;
    });

    return { protectedMarkdown, protectedSegments };
}

function restoreProtectedMath(html, protectedSegments) {
    let restoredHtml = html;

    protectedSegments.forEach(({ token, content }) => {
        restoredHtml = restoredHtml.split(token).join(content);
    });

    return restoredHtml;
}

// load and render markdown
async function loadPost(postName) {
        try {
            const response = await fetch(`posts/${encodeURIComponent(postName)}.md`);
            if (!response.ok) throw new Error('Post not found');        const markdown = await response.text();
        
        // parse tags from markdown
        const tags = window.PostManager ? window.PostManager.parseTagsFromMarkdown(markdown) : parseTagsFromMarkdown(markdown);
        
        // remove tags from markdown before parsing
        let cleanMarkdown = markdown.replace(/^\{[^}]+\}\s*\n?/m, '');
        
        // convert reference-style links to inline links
        cleanMarkdown = convertReferenceLinksToInline(cleanMarkdown);
        
        // remove (#) and () suffixes from definitions before markdown parsing
        cleanMarkdown = cleanMarkdown.replace(/\]\(\#?\)/g, ']');

        // protect latex so markdown parser does not consume math symbols like underscores
        const { protectedMarkdown, protectedSegments } = protectMathFromMarkdownParsing(cleanMarkdown);
        const html = marked.parse(protectedMarkdown);
        const htmlWithMath = restoreProtectedMath(html, protectedSegments);
        
        // update page title with post title
        const titleMatch = cleanMarkdown.match(/^# (.+)$/m);
        if (titleMatch) {
            document.title = `${titleMatch[1]} - Saad`;
        }
        
        // apply custom styling to parsed HTML
        const styledHTML = styleMarkdownContent(htmlWithMath, tags);
        const postContentElement = document.getElementById('post-content');
        postContentElement.innerHTML = styledHTML;

        // upgrade markdown images (responsive styles + reliable relative src resolution)
        enhancePostImages(postContentElement);
        
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

        // render latex equations after content/tooltip processing
        renderLatex(postContentElement);
        
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
    resolvePostImageSrc,
    updatePostThemeImages,
    enhancePostImages,
    protectMathFromMarkdownParsing,
    restoreProtectedMath,
    renderLatex,
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
