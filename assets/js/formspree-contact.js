const constraints = {
  name: {
    presence: { allowEmpty: false, message: "is required" },
    length: { minimum: 2, message: "must be at least 2 characters" },
    format: {
      pattern: /^[a-zA-Z\s'-]+$/,
      message: "can only contain letters, spaces, hyphens and apostrophes"
    }
  },
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: { message: "must be a valid email address" }
  },
  phone: {
    format: {
      pattern: /^[0-9\s\-\+\(\)]{0,}$/,
      message: "has an invalid format"
    },
    length: {
      minimum: 7,
      message: "must be at least 7 characters"
    }
  },
  subject: {
    presence: { allowEmpty: false, message: "is required" },
    length: { minimum: 3, message: "must be at least 3 characters" }
  },
  message: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      minimum: 10,
      maximum: 1000,
      tooShort: "must be at least 10 characters",
      tooLong: "cannot exceed 1000 characters"
    }
  }
};

// Formspree endpoint - REPLACE WITH YOUR FORMSPREE ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdkelavq"; // Your Formspree ID here

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const successDiv = document.getElementById('success-message');
  const successText = document.getElementById('success-text');
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

  // Real-time validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', function () {
      validateField(this);
    });
  });

  // Real-time validation on input for certain fields
  form.querySelectorAll('input[type="text"], textarea').forEach(field => {
    field.addEventListener('input', function () {
      if (this.classList.contains('is-invalid')) {
        validateField(this);
      }
    });
  });

  /**
   * Validate individual field
   */
  function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const fieldConstraints = constraints[fieldName];
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (!fieldConstraints) return;

    // Create object for validation
    const dataToValidate = { [fieldName]: fieldValue };
    const fieldValidation = { [fieldName]: fieldConstraints };

    // Run validation
    const errors = validate(dataToValidate, fieldValidation, { fullMessages: false });

    if (errors && errors[fieldName]) {
      field.classList.add('is-invalid');
      if (errorElement) {
        errorElement.textContent = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' ' + errors[fieldName][0];
      }
      return false;
    } else {
      field.classList.remove('is-invalid');
      if (errorElement) {
        errorElement.textContent = '';
      }
      return true;
    }
  }

  /**
   * Validate entire form
   */
  function validateForm() {
    const formData = {
      name: document.getElementById('name-field').value.trim(),
      email: document.getElementById('email-field').value.trim(),
      phone: document.getElementById('phone-field').value.trim(),
      subject: document.getElementById('subject-field').value.trim(),
      message: document.getElementById('message-field').value.trim()
    };

    // Only validate required fields and phone if provided
    const fieldsToValidate = { ...constraints };
    if (!formData.phone) {
      delete fieldsToValidate.phone;
    }

    const errors = validate(formData, fieldsToValidate, { fullMessages: true });

    if (errors) {
      // Show errors on fields
      Object.keys(errors).forEach(fieldName => {
        const field = document.getElementById(`${fieldName}-field`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (field) {
          field.classList.add('is-invalid');
        }
        if (errorElement) {
          errorElement.textContent = errors[fieldName][0];
        }
      });
      return false;
    }

    // Clear any previous errors
    form.querySelectorAll('input, textarea').forEach(field => {
      field.classList.remove('is-invalid');
    });

    return true;
  }

  /**
   * Clear all messages
   */
  function hideMessages() {
    loadingDiv.classList.add('d-none');
    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');
  }

  /**
   * Show error message
   */
  function showError(message) {
    errorDiv.classList.remove('d-none');
    errorText.textContent = message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Show success message
   */
  function showSuccess(message) {
    successDiv.classList.remove('d-none');
    successText.textContent = message;
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Detect spam patterns
   */
  function detectSpam(formData) {
    const spamPatterns = [
      /viagra/i,
      /casino/i,
      /lottery/i,
      /prize/i,
      /bitcoin/i,
      /click\s?here/i,
      /buy\s?now/i,
      /forex/i,
      /crypto/i,
      /xxx/i
    ];

    const combinedText = Object.values(formData).join(' ').toLowerCase();

    for (let pattern of spamPatterns) {
      if (pattern.test(combinedText)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Form submission handler
   */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous messages
    hideMessages();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Spam detection
    if (detectSpam(data)) {
      showError('Your message contains restricted content. Please review and try again.');
      return;
    }

    // Show loading state
    loadingDiv.classList.remove('d-none');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

    try {
      // Prepare data for Formspree
      const formspreeData = new FormData();
      formspreeData.append('name', data.name);
      formspreeData.append('email', data.email);
      formspreeData.append('phone', data.phone || 'Not provided');
      formspreeData.append('company', data.company || 'Not provided');
      formspreeData.append('subject', data.subject);
      formspreeData.append('message', data.message);
      formspreeData.append('_subject', `New Contact: ${data.subject}`);
      formspreeData.append('_replyto', data.email);

      // Send to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formspreeData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess('Message sent successfully! I\'ll get back to you soon.');
        form.reset();
        charCount.textContent = '0';

        // Clear form after 5 seconds
        setTimeout(() => {
          hideMessages();
        }, 5000);
      } else {
        // Handle Formspree errors
        if (result.errors) {
          const errorMessages = result.errors.map(err => err.message).join(', ');
          showError(`Failed to send message: ${errorMessages}`);
        } else {
          showError('Failed to send message. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showError(`Network error: ${error.message || 'Please check your connection and try again.'}`);
    } finally {
      loadingDiv.classList.add('d-none');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});