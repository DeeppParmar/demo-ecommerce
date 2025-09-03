// About page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats on scroll
    const statItems = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => {
        observer.observe(item);
    });
});

function animateStatNumber(statItem) {
    const numberElement = statItem.querySelector('.stat-number');
    const finalText = numberElement.textContent;
    const hasPlus = finalText.includes('+');
    const hasPercent = finalText.includes('%');
    const hasSlash = finalText.includes('/');
    
    let finalNumber;
    let suffix = '';
    
    if (hasSlash) {
        // Handle "24/7" case
        numberElement.textContent = finalText;
        return;
    } else if (hasPercent) {
        finalNumber = parseFloat(finalText.replace('%', ''));
        suffix = '%';
    } else if (hasPlus) {
        finalNumber = parseInt(finalText.replace(/[K+]/g, ''));
        if (finalText.includes('K')) {
            finalNumber *= 1000;
            suffix = 'K+';
        } else {
            suffix = '+';
        }
    } else {
        finalNumber = parseInt(finalText);
    }

    let currentNumber = 0;
    const increment = finalNumber / 50;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(currentNumber);
        if (suffix === 'K+') {
            displayNumber = Math.floor(currentNumber / 1000);
        }
        
        numberElement.textContent = displayNumber + suffix;
    }, 40);
}