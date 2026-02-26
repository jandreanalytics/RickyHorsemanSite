// Accessibility Enhancements

document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
    setupAriaLiveRegions();
    setupFormAccessibility();
    setupDropdownAccessibility();
    announcePageLoad();
});

// Keyboard Navigation Setup
function setupKeyboardNavigation() {
    // Trap focus within modals if present
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Allow escape to close any open modals
            const openModals = document.querySelectorAll('[role="dialog"][open]');
            openModals.forEach(modal => {
                modal.close();
            });
        }
    });

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON' && element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA' && element.tagName !== 'SELECT') {
            element.setAttribute('tabindex', '0');
        }
    });
}

// ARIA Live Regions for Dynamic Content
function setupAriaLiveRegions() {
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'accessibility-announcements';
    document.body.appendChild(liveRegion);
}

// Announce Page Load
function announcePageLoad() {
    const liveRegion = document.getElementById('accessibility-announcements');
    if (liveRegion) {
        const pageTitle = document.title;
        liveRegion.textContent = `Page loaded: ${pageTitle}`;
    }
}

// Form Accessibility Enhancements
function setupFormAccessibility() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Add aria-required to required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
            
            // Add visual indicator
            const label = form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.classList.contains('required')) {
                label.classList.add('required');
            }
        });

        // Add error handling with ARIA
        form.addEventListener('submit', function(event) {
            const invalidFields = form.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                event.preventDefault();
                
                // Announce error to screen readers
                const liveRegion = document.getElementById('accessibility-announcements');
                if (liveRegion) {
                    liveRegion.textContent = `Form has ${invalidFields.length} error(s). Please correct them before submitting.`;
                }

                // Focus on first invalid field
                invalidFields[0].focus();
                invalidFields[0].setAttribute('aria-invalid', 'true');
            }
        });

        // Clear error state when user corrects field
        const allFields = form.querySelectorAll('input, textarea, select');
        allFields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.removeAttribute('aria-invalid');
                }
            });
        });
    });
}

// Dropdown Menu Accessibility
function setupDropdownAccessibility() {
    const dropdowns = document.querySelectorAll('[aria-haspopup="true"]');
    dropdowns.forEach(trigger => {
        trigger.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const menu = this.nextElementSibling;
                if (menu && menu.hasAttribute('role') && menu.getAttribute('role') === 'menu') {
                    const firstMenuItem = menu.querySelector('[role="menuitem"]');
                    if (firstMenuItem) {
                        firstMenuItem.focus();
                    }
                }
            }
        });
    });

    // Menu item keyboard navigation
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextItem = menuItems[index + 1];
                if (nextItem) nextItem.focus();
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const prevItem = menuItems[index - 1];
                if (prevItem) prevItem.focus();
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                const trigger = this.closest('[role="menu"]').previousElementSibling;
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
            }
        });
    });
}

// Announce navigation changes
function announceNavigation(pageName) {
    const liveRegion = document.getElementById('accessibility-announcements');
    if (liveRegion) {
        liveRegion.textContent = `Navigating to ${pageName}`;
    }
}

// Ensure focus is visible
function ensureFocusVisibility() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
}

ensureFocusVisibility();

// Export for use in other scripts
window.AccessibilityHelper = {
    announceNavigation: announceNavigation,
    announce: function(message) {
        const liveRegion = document.getElementById('accessibility-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
};
