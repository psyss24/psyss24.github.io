// Tooltip System Module
// Handles definition parsing, tooltip management, and mobile interaction

// Tooltip Manager Class
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
        
        // tooltip hover handlers to prevent hiding
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
        // cancel any pending hide
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
        // Skip positioning on mobile - let mobile-specific handler do it
        if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
            return;
        }
        
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
        // position tooltip to the right first to get its natural width
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

// Mobile tooltip positioning for definition terms
function adjustMobileTooltip(term) {
    const tooltip = term.querySelector('.definition-tooltip');
    if (!tooltip) return;
    
    // Force tooltip below positioning for mobile
    tooltip.classList.add('tooltip-below');
    tooltip.classList.remove('shift-left', 'shift-right');
    
    // Reset any desktop positioning
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.top = '';
    tooltip.style.transform = '';
    tooltip.style.marginLeft = '';
    tooltip.style.marginRight = '';
    tooltip.style.position = '';
    tooltip.style.width = '';
    tooltip.style.minWidth = '';
    tooltip.style.maxWidth = '';
    
    // Position tooltip after next frame to ensure proper sizing
    setTimeout(() => {
        const termRect = term.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const margin = 16;
        
        // Set width based on available space
        const availableWidth = viewportWidth - (2 * margin);
        const preferredWidth = Math.min(280, availableWidth);
        
        tooltip.style.width = `${preferredWidth}px`;
        tooltip.style.maxWidth = `${availableWidth}px`;
        
        // Position horizontally
        const tooltipRect = tooltip.getBoundingClientRect();
        const termCenter = termRect.left + (termRect.width / 2);
        const tooltipHalfWidth = tooltipRect.width / 2;
        
        let leftOffset = termCenter - tooltipHalfWidth;
        
        // Ensure tooltip doesn't go off screen
        if (leftOffset < margin) {
            leftOffset = margin;
        } else if (leftOffset + tooltipRect.width > viewportWidth - margin) {
            leftOffset = viewportWidth - margin - tooltipRect.width;
        }
        
        // Apply positioning relative to term
        const termLeftRelative = termRect.left;
        const finalLeft = leftOffset - termLeftRelative;
        
        tooltip.style.left = `${finalLeft}px`;
    }, 10);
}

// Definition parser (this took a lot longer than expected)
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

// Mobile tooltip handlers
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
            // Run mobile positioning immediately, not after setTimeout
            adjustMobileTooltip(term);
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

// Mobile tooltip handler initialization
function attachMobileTooltipHandlers() {
    document.querySelectorAll('.definition-term').forEach(term => {
        attachMobileTooltipHandler(term);
    });
    addOutsideTooltipListener();
}

// Initialize tooltips for an element
function initTooltips(element) {
    parseDefinitions(element);
    
    if (window.CoreUtils && window.CoreUtils.isMobileDevice()) {
        setTimeout(() => {
            element.querySelectorAll('.definition-term').forEach(term => {
                attachMobileTooltipHandler(term);
            });
            addOutsideTooltipListener();
        }, 10);
    }
}

// Export functions to global scope
window.TooltipSystem = {
    TooltipManager,
    parseDefinitions,
    adjustMobileTooltip,
    closeAllTooltips,
    attachMobileTooltipHandler,
    attachMobileTooltipHandlers,
    initTooltips
};

// Legacy global exports for compatibility
window.parseDefinitions = parseDefinitions;
