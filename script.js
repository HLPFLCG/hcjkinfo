// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add interactive hover effects to links
document.querySelectorAll('.link-button, .social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Poem reading experience enhancement
let poemReadingTime = null;
const poemContent = document.querySelector('.poem-content');

if (poemContent) {
    // Calculate reading time for featured poem
    const text = poemContent.textContent;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    // Add reading time indicator
    const poemHeader = document.querySelector('.poem-header');
    if (poemHeader) {
        const readingTimeElement = document.createElement('span');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.textContent = `• ${readingTime} min read`;
        readingTimeElement.style.cssText = 'font-size: 0.75rem; color: var(--text-muted); margin-left: var(--space-xs);';
        poemHeader.querySelector('.poem-label').appendChild(readingTimeElement);
    }
}

// Newsletter signup functionality
const newsletterLinks = document.querySelectorAll('a[href="#"]');
newsletterLinks.forEach(link => {
    if (link.querySelector('.link-title')?.textContent === 'Newsletter') {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNewsletterModal();
        });
    }
});

function showNewsletterModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('newsletterModal');
    if (!modal) {
        modal = createNewsletterModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function createNewsletterModal() {
    const modal = document.createElement('div');
    modal.id = 'newsletterModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Join the Poetry Circle</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Receive weekly poetry directly to your inbox. Each email features a carefully selected poem that speaks to the heart.</p>
                <form id="newsletterForm">
                    <input type="email" placeholder="Your email address" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.active {
            opacity: 1;
        }
        
        .modal-content {
            background: var(--bg-primary);
            padding: var(--space-xl);
            border-radius: var(--radius-lg);
            max-width: 400px;
            width: 90%;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }
        
        .modal-header h3 {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            color: var(--text-primary);
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-muted);
            padding: var(--space-xs);
            line-height: 1;
        }
        
        .modal-body p {
            color: var(--text-secondary);
            margin-bottom: var(--space-lg);
            line-height: 1.6;
        }
        
        #newsletterForm {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }
        
        #newsletterForm input {
            padding: var(--space-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-size: 1rem;
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        #newsletterForm button {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: var(--space-sm);
            border-radius: var(--radius-sm);
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        #newsletterForm button:hover {
            background: var(--accent-hover);
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

function closeModal() {
    const modal = document.getElementById('newsletterModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('newsletterModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Handle newsletter form submission
document.addEventListener('submit', function(e) {
    if (e.target.id === 'newsletterForm') {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would normally send the email to your newsletter service
        // For now, we'll show a success message
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div style="text-align: center; padding: var(--space-lg) 0;">
                <div style="font-size: 3rem; margin-bottom: var(--space-md);">🎉</div>
                <h4>Welcome to the Poetry Circle!</h4>
                <p>Thank you for subscribing. Check your inbox for a confirmation email.</p>
            </div>
        `;
        
        // Close modal after 3 seconds
        setTimeout(closeModal, 3000);
    }
});

// Add subtle animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.link-item, .stat-item, .social-link');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Copy poem functionality
document.addEventListener('DOMContentLoaded', function() {
    const poemActions = document.querySelector('.poem-actions');
    if (poemActions) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-poem-button';
        copyButton.textContent = '📋 copy poem';
        copyButton.style.cssText = `
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            cursor: pointer;
            margin-left: var(--space-sm);
            transition: all 0.3s ease;
        `;
        
        copyButton.addEventListener('click', function() {
            const poemText = document.querySelector('.poem-content').textContent;
            navigator.clipboard.writeText(poemText).then(() => {
                copyButton.textContent = '✓ copied';
                setTimeout(() => {
                    copyButton.textContent = '📋 copy poem';
                }, 2000);
            });
        });
        
        copyButton.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--accent-color)';
            this.style.color = 'var(--accent-color)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.color = 'var(--text-muted)';
        });
        
        poemActions.appendChild(copyButton);
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        themeToggle.click();
    }
    
    // Press 'Escape' to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Performance optimization - lazy load images if any are added later
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Analytics placeholder (replace with your actual analytics code)
function trackEvent(action, category = 'User Interaction') {
    // Replace with your analytics tracking code
    console.log(`Event tracked: ${category} - ${action}`);
}

// Track link clicks
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim();
        trackEvent(`Link clicked: ${linkText}`, 'Navigation');
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('Page loaded', 'Page View');
});
