# JavaScript Module Documentation

## Overview

This website uses a **modular JavaScript architecture** where different functionalities are separated into individual files. This makes the code easier to maintain, understand, and debug. Instead of having one massive file with all the code, we split it into logical modules that each handle specific tasks.

## How Modules Work

Each module:
- Contains related functions grouped together
- Exports functions to a global `window` object so other modules can use them
- Has a specific responsibility (like theme management or page transitions)
- Can depend on other modules for certain functionality

---

## Module Files

### 1. `core-utils.js` - Helper Functions & Utilities

**What it does:** Contains essential helper functions used throughout the website.

**Key Concepts for Beginners:**
- **Utility functions**: Small, reusable pieces of code that solve common problems
- **Color management**: Functions that handle the colorful genre tags you see on posts
- **Device detection**: Code that checks if you're on a phone or computer

**Main Functions:**

#### `generateGenreColors(normalizedTags, colorMap)`
```javascript
// Takes an array of tags like ['economics', 'technology'] 
// Returns colors and gradients for styling posts
```
- **What it does**: Creates solid colors for single tags, gradients for multiple tags
- **Example**: A post tagged with "economics" gets green, "economics + tech" gets a green-to-blue gradient

#### `normaliseTag(tag)`
```javascript
// Converts tag variations to standard names
// 'econ' → 'economics', 'tech' → 'technology'
```
- **Why it's useful**: Lets you type shortened tag names but still get consistent styling

#### `isMobileDevice()` and `isDesktop()`
```javascript
// Checks screen size and device type
// Returns true/false
```
- **Usage**: Enables different behaviors on phones vs computers

#### `initMobileScrollAnimations()`
- **What it does**: Makes post cards fade in as you scroll on mobile
- **How it works**: Uses `IntersectionObserver` (a browser API that watches when elements come into view)

**Exports:** Makes functions available as `window.CoreUtils.functionName` and `window.ColorUtils.functionName`

---

### 2. `theme-manager.js` - Light/Dark Mode

**What it does:** Handles switching between light and dark themes.

**Key Concepts for Beginners:**
- **localStorage**: Browser storage that remembers your theme choice between visits
- **CSS classes**: Adding/removing `.dark-theme` class changes the entire site's appearance
- **Event listeners**: Code that waits for button clicks

**Main Functions:**

#### `setTheme(isDark)`
```javascript
// isDark is true/false
// Adds or removes 'dark-theme' class from <body>
```
- **What it does**: Actually changes the visual theme
- **How it works**: CSS has different styles for `.dark-theme` class

#### `getThemePref()`
```javascript
// Checks localStorage first, then system preference
// Returns true for dark, false for light
```
- **Smart behavior**: Remembers your choice, or matches your computer's setting

#### `setupThemeToggle()`
```javascript
// Finds all theme toggle buttons and adds click listeners
// When clicked: toggles theme and saves preference
```

#### `initTheme()`
```javascript
// Called when page loads
// Sets initial theme and sets up toggle buttons
```

**How Theme Switching Works:**
1. User clicks "Lights off/on" button
2. `setupThemeToggle()` detects the click
3. Determines new theme (opposite of current)
4. `setTheme()` adds/removes CSS class
5. `saveThemePref()` remembers choice in localStorage

---

### 3. `page-transitions.js` - Smooth Page Navigation

**What it does:** Creates smooth fade animations when navigating between pages.

**Key Concepts for Beginners:**
- **DOM manipulation**: Creating and styling HTML elements with JavaScript
- **CSS transitions**: Smooth animations between style changes
- **Event prevention**: Stopping normal link behavior to add custom effects

**Main Functions:**

#### `createDotTransitionAnimation(callback)`
```javascript
// Creates a fade-out overlay
// Executes callback function after animation
// Used when leaving index page
```

**How it works:**
1. Creates invisible overlay element
2. Adds CSS styles for fade effect
3. Makes overlay visible (fade out effect)
4. After 600ms, runs callback (usually navigation)
5. Removes overlay

#### `attachDotTransitionToPostLinks()`
```javascript
// Finds all post links
// Adds click listeners for smooth transitions
```

**The Process:**
1. User clicks a post link
2. `e.preventDefault()` stops normal navigation
3. Fade animation plays
4. After animation completes, navigate to post

#### `attachBackToHomeTransition()`
```javascript
// Similar to above, but for "back to home" links
// Sets flag for dots to fade in on index page
```

**Why These Transitions Matter:**
- Creates professional, app-like feel
- Provides visual continuity between pages
- Makes navigation feel smooth rather than jarring

---

### 4. `post-manager.js` - Blog Post Handling

**What it does:** Loads blog posts, creates post preview cards, and processes markdown content.

**Key Concepts for Beginners:**
- **Fetch API**: JavaScript way to load files from the server
- **Regular expressions**: Pattern matching to find specific text
- **Dynamic HTML creation**: Building webpage elements with JavaScript
- **Async/Await**: Handling operations that take time (like loading files)

**Main Functions:**

#### `parseTagsFromMarkdown(markdown)`
```javascript
// Looks for {tag1, tag2} at start of markdown files
// Returns array of tag names
```

**Example:**
```markdown
{economics, technology}
# My Post Title
Content here...
```
Returns: `['economics', 'technology']`

#### `extractTitleFromMarkdown(markdown)`
```javascript
// Finds first # heading in markdown
// Returns the title text
```

#### `extractExcerptFromMarkdown(markdown)`
```javascript
// Looks for italic text or first paragraph
// Returns preview text for post cards
```

#### `createPostCard(post, tags)`
```javascript
// Builds HTML for post preview cards
// Applies genre colors based on tags
// Returns complete <article> element
```

**How Post Cards are Built:**
1. Calculate colors based on tags
2. Create HTML structure with title, excerpt, tags
3. Apply CSS custom properties for colors
4. Add click handlers for transitions

#### `loadPostPreviews()`
```javascript
// Main function that loads all posts
// Called when index page loads
```

**The Complete Process:**
1. Define list of posts to load
2. For each post:
   - Fetch markdown file
   - Extract title, tags, excerpt
   - Create visual card
   - Add to page
3. Set up interactions (arrows, transitions)

---

### 5. `tooltip-system.js` - Definition Tooltips

**What it does:** Creates hover tooltips for defined terms in blog posts.

**Key Concepts for Beginners:**
- **Regular expressions**: Finding patterns in text
- **Event delegation**: Efficient way to handle many similar elements
- **Positioning**: Calculating where tooltips should appear
- **Mobile vs Desktop**: Different interaction patterns for different devices

**How Definition System Works:**

#### Markdown Format:
```markdown
*[API]: Application Programming Interface
*[REST]: Representational State Transfer

An API is a way for programs to talk to each other.
```

#### `parseDefinitions(content)`
```javascript
// Scans text for *[term]: definition patterns
// Returns object mapping terms to definitions
```

#### `TooltipManager` Class
A class that handles all tooltip behavior:

**Constructor:**
```javascript
// Sets up event listeners for hover and touch
// Handles both desktop (hover) and mobile (tap) interactions
```

**Key Methods:**
- `showTooltip()`: Displays tooltip with proper positioning
- `hideTooltip()`: Removes tooltip from view
- `handleMouseEnter/Leave()`: Desktop hover behavior
- `handleTouchStart/End()`: Mobile tap behavior

**Smart Positioning:**
```javascript
// Checks if tooltip would go off-screen
// Automatically positions above or below term
// Ensures tooltips are always visible
```

**Why This System is Useful:**
- Provides definitions without cluttering the text
- Works on both desktop and mobile
- Automatically finds and processes definitions
- No manual HTML required - just markdown syntax

---

### 6. `ui-components.js` - User Interface Elements

**What it does:** Handles various UI components like reading progress bars, tab switching, and mobile layouts.

**Key Concepts for Beginners:**
- **Scroll events**: Code that runs when user scrolls
- **Progress calculation**: Math to determine reading progress
- **Tab switching**: Showing/hiding different content sections
- **Responsive design**: Different behavior on different screen sizes

**Main Functions:**

#### `createReadingProgressBar()`
```javascript
// Creates progress bar that shows reading position
// Updates as user scrolls through post
```

**How Progress Bar Works:**
1. Calculate total scrollable height
2. Track current scroll position
3. Convert to percentage (0-100%)
4. Update progress bar width

#### `calculateReadingTime(text)`
```javascript
// Estimates reading time based on word count
// Assumes average reading speed of 200 words per minute
```

#### `addReadMoreArrows()`
```javascript
// Adds animated arrows to "Read More" links
// Creates hover effects
```

#### `setupTabSwitching()`
```javascript
// Handles Journal/Projects tab switching on index page
```

**Tab Switching Process:**
1. User clicks tab
2. Remove 'active' class from current tab/content
3. Add 'active' class to clicked tab/content
4. CSS handles the visual transition

#### `checkMobileMetaRowLayout()`
```javascript
// Adjusts layout of reading time and tags on mobile
// Prevents cramped appearance
```

**Mobile Layout Intelligence:**
- Measures available space
- Stacks elements vertically if too cramped
- Ensures readable layout on all screen sizes

---

### 7. `main.js` - Application Coordinator

**What it does:** Initializes all modules in the correct order and maintains compatibility.

**Key Concepts for Beginners:**
- **DOMContentLoaded**: Event that fires when HTML is fully loaded
- **Initialization sequence**: Order matters when setting up modules
- **Event coordination**: Making sure all systems work together

**Initialization Sequence:**

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 1. Theme first (affects all visual elements)
    window.ThemeManager.initTheme();
    
    // 2. UI components
    window.UIComponents.initUIComponents();
    
    // 3. Tooltips for existing content
    window.TooltipSystem.initTooltips();
    
    // 4. Mobile animations
    window.CoreUtils.initMobileScrollAnimations();
    
    // 5. Page transitions
    window.PageTransitions.attachDotTransitionToPostLinks();
});
```

**Why Order Matters:**
- Theme must be set before other visual elements
- Tooltips need content to be processed
- Animations need elements to be styled
- Transitions need links to be ready

**Compatibility Layer:**
```javascript
// Ensures old code still works with new modules
if (!window.parseDefinitions && window.TooltipSystem) {
    window.parseDefinitions = window.TooltipSystem.parseDefinitions;
}
```

---

## How Everything Works Together

### Page Load Sequence:
1. **HTML loads** with module script tags
2. **Each module loads** and exports functions to `window`
3. **main.js initializes** everything in correct order
4. **User interactions** trigger module functions

### Example: Clicking a Post Link
1. **User clicks** → `page-transitions.js` detects click
2. **Animation starts** → Fade overlay appears
3. **Navigation happens** → Browser loads post page
4. **New page loads** → `main.js` initializes modules
5. **Content processes** → Tooltips, themes, etc. activate

### Module Dependencies:
```
main.js
├── theme-manager.js (no dependencies)
├── core-utils.js (no dependencies)
├── page-transitions.js (no dependencies)
├── post-manager.js (depends on core-utils.js)
├── tooltip-system.js (no dependencies)
└── ui-components.js (depends on core-utils.js)
```

## Benefits of This Architecture

### For Developers:
- **Easier debugging**: Problems are isolated to specific modules
- **Easier maintenance**: Changes only affect relevant files
- **Reusable code**: Functions can be used across different pages
- **Clear responsibility**: Each file has a specific job

### For Users:
- **Faster loading**: Modules can be loaded as needed
- **Better performance**: No duplicate code
- **Consistent behavior**: Same functions work everywhere
- **Reliable interactions**: Well-tested, isolated components

## Key JavaScript Concepts Used

### 1. **Module Pattern**
```javascript
// Export functions to global scope
window.ModuleName = {
    functionOne,
    functionTwo
};
```

### 2. **Event Handling**
```javascript
// Listen for user interactions
element.addEventListener('click', function(e) {
    // Handle the click
});
```

### 3. **DOM Manipulation**
```javascript
// Create and modify HTML elements
const element = document.createElement('div');
element.className = 'my-class';
document.body.appendChild(element);
```

### 4. **Async Operations**
```javascript
// Handle operations that take time
async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
}
```

### 5. **CSS Custom Properties**
```javascript
// Set CSS variables from JavaScript
element.style.setProperty('--color', 'blue');
```

This modular approach makes the website more maintainable, performant, and easier to understand. Each module has a clear purpose, and together they create a smooth, interactive user experience.
