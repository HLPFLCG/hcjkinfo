// Poetry Collection with Featured Poem Rotation
const poemsCollection = [
    {
        id: 1,
        title: "Finding Comfort in Silence",
        content: `<p>In the quiet moments between breaths,<br>
        Where thoughts soften and hearts mend,<br>
        There exists a sacred space<br>
        Where peace becomes your friend.</p>
        
        <p>Silence speaks the loudest truths,<br>
        When noise can no longer stay,<br>
        It teaches us to listen<br>
        To what our hearts need to say.</p>`,
        reflection: "I wrote this during a particularly stressful period in my life, sitting on my balcony at dawn. The world was still asleep, and in that silence, I found the clarity I had been seeking for weeks.",
        theme: "peace",
        mood: "reflective",
        season: "spring"
    },
    {
        id: 2,
        title: "Urban Whispers",
        content: `<p>Concrete jungles breathe,<br>
        With stories in every crack,<br>
        Each street corner holds<br>
        Memories we can't take back.</p>
        
        <p>City lights dance<br>
        Across rain-kissed streets,<br>
        While lonely hearts find<br>
        Rhythm in hurried beats.</p>`,
        reflection: "This piece was born from countless nights walking through downtown after long work shifts. There's a certain poetry in urban loneliness that I wanted to capture.",
        theme: "city",
        mood: "melancholy",
        season: "autumn"
    },
    {
        id: 3,
        title: "Summer's Last Breath",
        content: `<p>Golden hour stretches,<br>
        Painting memories in warm hues,<br>
        While fireflies dance<br>
        Their final evening cues.</p>
        
        <p>Tomorrow brings change,<br>
        But tonight belongs to us,<br>
        Wrapped in summer's embrace<br>
        Beneath the moon's soft touch.</p>`,
        reflection: "Written on the last day of summer vacation, watching sunset with friends. It captures that bittersweet feeling of endings and the promise of new beginnings.",
        theme: "seasons",
        mood: "nostalgic",
        season: "summer"
    },
    {
        id: 4,
        title: "Words Unsaid",
        content: `<p>Letters never written,<br>
        Words caught in my throat,<br>
        Feelings buried deep<br>
        In emotions I can't quote.</p>
        
        <p>Maybe someday I'll find<br>
        The courage to speak true,<br>
        Until then, these verses<br>
        Will have to speak for you.</p>`,
        reflection: "This poem explores the universal experience of unexpressed feelings. I wrote it after a difficult conversation where I couldn't find the right words in the moment.",
        theme: "love",
        mood: "wistful",
        season: "winter"
    },
    {
        id: 5,
        title: "Morning Coffee Rituals",
        content: `<p>Steam rises like prayers,<br>
        From ceramic vessels warm,<br>
        Each sip a moment<br>
        Safe from life's storm.</p>
        
        <p>In this simple ritual,<br>
        I find my center true,<br>
        One cup at a time,<br>
        Making my world new.</p>`,
        reflection: "My daily morning coffee inspired this. It's amazing how such a simple routine can become a sacred space for reflection and preparation for the day ahead.",
        theme: "daily life",
        mood: "peaceful",
        season: "all"
    }
];

// Function to get today's featured poem
function getFeaturedPoem() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Simple hash function to get consistent daily rotation
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    const poemIndex = Math.abs(hash) % poemsCollection.length;
    return poemsCollection[poemIndex];
}

// Function to update featured poem on page
function updateFeaturedPoem() {
    const featuredPoem = getFeaturedPoem();
    const poemTitle = document.querySelector('.poem-header h3');
    const poemContent = document.querySelector('.poem-content');
    
    if (poemTitle && poemContent) {
        poemTitle.textContent = featuredPoem.title;
        poemContent.innerHTML = featuredPoem.content;
        
        // Add reflection toggle button
        const poemActions = document.querySelector('.poem-actions');
        if (poemActions && !document.querySelector('.reflection-toggle')) {
            const reflectionButton = document.createElement('button');
            reflectionButton.className = 'reflection-toggle';
            reflectionButton.textContent = '📖 read reflection';
            reflectionButton.style.cssText = `
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
            
            let reflectionVisible = false;
            reflectionButton.addEventListener('click', function() {
                if (!reflectionVisible) {
                    // Add reflection section
                    const reflectionSection = document.createElement('div');
                    reflectionSection.className = 'poem-reflection';
                    reflectionSection.style.cssText = `
                        margin-top: var(--space-lg);
                        padding-top: var(--space-md);
                        border-top: 1px solid var(--border-color);
                        font-style: italic;
                        color: var(--text-secondary);
                        font-size: 0.875rem;
                        line-height: 1.6;
                        display: none;
                    `;
                    reflectionSection.innerHTML = `
                        <strong>Reflection:</strong><br>
                        ${featuredPoem.reflection}
                    `;
                    
                    poemContent.appendChild(reflectionSection);
                    
                    // Animate in
                    setTimeout(() => {
                        reflectionSection.style.display = 'block';
                        reflectionSection.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                    
                    reflectionButton.textContent = '📕 hide reflection';
                    reflectionVisible = true;
                } else {
                    const reflectionSection = poemContent.querySelector('.poem-reflection');
                    if (reflectionSection) {
                        reflectionSection.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(() => reflectionSection.remove(), 300);
                    }
                    reflectionButton.textContent = '📖 read reflection';
                    reflectionVisible = false;
                }
            });
            
            poemActions.appendChild(reflectionButton);
        }
    }
}

// Initialize featured poem when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateFeaturedPoem();
    
    // Update poem metadata
    const poemContent = document.querySelector('.poem-content');
    if (poemContent) {
        // Update reading time
        const text = poemContent.textContent;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        
        const readingTimeElement = document.querySelector('.reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `• ${readingTime} min read`;
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { poemsCollection, getFeaturedPoem, updateFeaturedPoem };
}