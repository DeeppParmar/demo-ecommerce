// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFAQ();
});

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate all fields
    if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        
        // Show success message
        showSuccessMessage();
        showToast('Message sent successfully! We\'ll get back to you soon.');
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    // Remove existing error state
    fieldGroup.classList.remove('error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        fieldGroup.classList.add('error');
        let errorElement = fieldGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            fieldGroup.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

function clearFieldError(e) {
    const fieldGroup = e.target.closest('.form-group');
    fieldGroup.classList.remove('error');
}

function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    let successMessage = form.querySelector('.success-message');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        form.insertBefore(successMessage, form.firstChild);
    }
    
    successMessage.innerHTML = `
        <strong>Thank you for your message!</strong><br>
        We've received your inquiry and will respond within 24 hours.
    `;
    successMessage.classList.add('show');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}