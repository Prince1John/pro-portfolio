document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error-message');
  const successDiv = document.getElementById('success-message');
  const charCount = document.getElementById('char-count');
  const messageField = document.getElementById('message-field');

  // Character counter
  if (messageField) {
    messageField.addEventListener('input', function () {
      charCount.textContent = this.value.length;
      if (this.value.length > 1000) {
        this.value = this.value.substring(0, 1000);
        charCount.textContent = '1000';
      }
    });
  }

  // Form validation
  const validateForm = () => {
    const errors = [];
    const name = document.getElementById('name-field').value.trim();
    const email = document.getElementById('email-field').value.trim();
    const subject = document.getElementById('subject-field').value.trim();
    const message = document.getElementById('message-field').value.trim();
    const phone = document.getElementById('phone-field').value.trim();

    // Name validation
    if (!name || name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push('Name can only contain letters, spaces, hyphens and apostrophes');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation (if provided)
    if (phone && !/^[0-9\s\-\+\(\)]{7,}$/.test(phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Subject validation
    if (!subject || subject.length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }

    // Message validation
    if (!message || message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    if (message.length > 1000) {
      errors.push('Message cannot exceed 1000 characters');
    }

    // Spam check
    const spamWords = ['viagra', 'casino', 'lottery', 'prize', 'bitcoin'];
    const combinedText = (name + subject + message).toLowerCase();
    for (const word of spamWords) {
      if (combinedText.includes(word)) {
        errors.push('Your message contains restricted content');
        break;
      }
    }

    return errors;
  };

  // Show error messages
  const showErrors = (errors) => {
    errorDiv.classList.remove('d-none');
    errorDiv.innerHTML = '<strong>Please fix the following errors:</strong><ul>';
    errors.forEach(error => {
      errorDiv.innerHTML += `<li>${error}</li>`;
    });
    errorDiv.innerHTML += '</ul>';
  };

  // Hide all message divs
  const hideMessages = () => {
    loadingDiv.classList.add('d-none');
    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');
  };

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous messages
    hideMessages();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Show loading
    loadingDiv.classList.remove('d-none');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    try {
      const formData = new FormData(form);
      const response = await fetch('forms/contact.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        successDiv.classList.remove('d-none');
        document.getElementById('success-text').textContent = result.message;
        form.reset();
        charCount.textContent = '0';
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        errorDiv.classList.remove('d-none');
        if (result.errors && Array.isArray(result.errors)) {
          errorDiv.innerHTML = '<strong>Please fix the following errors:</strong><ul>';
          result.errors.forEach(error => {
            errorDiv.innerHTML += `<li>${error}</li>`;
          });
          errorDiv.innerHTML += '</ul>';
        } else {
          errorDiv.innerHTML = `<strong>Error:</strong> ${result.message}`;
        }
      }
    } catch (error) {
      errorDiv.classList.remove('d-none');
      errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
    } finally {
      loadingDiv.classList.add('d-none');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
    }
  });
});