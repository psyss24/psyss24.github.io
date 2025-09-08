// theme management module
// handles theme switching, preferences, and ui updates

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    // update all theme-toggle buttons
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.textContent = isDark ? 'Lights on' : 'Lights off';
    });
}

function getThemePref() {
    if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
    }
    // default: match system
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function saveThemePref(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function setupThemeToggle() {
    // attach to all theme-toggle buttons (header and footer)
    document.querySelectorAll('#theme-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const isDark = !document.body.classList.contains('dark-theme');
            setTheme(isDark);
            saveThemePref(isDark);
        });
    });
}

// initialize theme on load
function initTheme() {
    setTheme(getThemePref());
    setupThemeToggle();
}

// export functions to global scope
window.ThemeManager = {
    setTheme,
    getThemePref,
    saveThemePref,
    setupThemeToggle,
    initTheme
};
