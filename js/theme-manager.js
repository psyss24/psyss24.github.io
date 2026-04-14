// theme management module
// handles theme switching, preferences, and ui updates

function updateProjectIcons(isDark) {
    const macroIcon = document.getElementById('macroscope-icon');
    const personalIcon = document.getElementById('personal-icon');

    if (macroIcon) {
        macroIcon.src = isDark ? 'media/macroscope-icon-dark.svg' : 'media/macroscope-icon.svg';
    }

    if (personalIcon) {
        personalIcon.src = isDark ? 'media/personal-icon-dark.svg' : 'media/personal-icon.svg';
    }
}

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    updateProjectIcons(isDark);

    // update all theme-toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.textContent = isDark ? 'Light' : 'Dark';
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
    document.querySelectorAll('.theme-toggle').forEach(btn => {
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
    updateProjectIcons,
    setTheme,
    getThemePref,
    saveThemePref,
    setupThemeToggle,
    initTheme
};
