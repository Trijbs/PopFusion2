/**
 * Contact Page Fetch Integration
 */

class ContactPageHandler {
    constructor() {
        this.isSubmitting = false;
        this.formData = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.loadContactInfo();
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.querySelector('#contact-form, .contact-form');
        contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // File upload handling
        this.setupFileUpload();
        
        // Social media links
        this.setupSocialLinks();
    }

    setupFormValidation() {
        const form = document.querySelector('#contact-form, .contact-form');
        if (!form) {
            this.createContactForm();
        }
    }

    createContactForm() {
        const formContainer = document.createElement('div');
        formContainer.className = 'contact-form-container';
        
        formContainer.innerHTML = `
            <form id="contact-form" class="contact-form">
                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" name="name" required>
                    <span class="error-message" data-field="name"></span>
                </div>
                
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required>
                    <span class="error-message" data-field="email"></span>
                </div>
                
                <div class="form-group">
                    <label for="subject">Subject *</label>
                    <select id="subject" name="subject" required>
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Press Inquiry</option>
                        <option value="other">Other</option>
                    </select>
                    <span class="error-message" data-field="subject"></span>
                </div>
                
                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="6" required 
                              placeholder="Please provide details about your inquiry..."></textarea>
                    <span class="error-message" data-field="message"></span>
                    <span class="character-count">0/1000</span>
                </div>
                
                <div class="form-group">
                    <label for="attachment">Attachment (optional)</label>
                    <input type="file" id="attachment" name="attachment" 
                           accept=".jpg,.jpeg,.png,.pdf,.doc,.docx">
                    <span class="file-info">Max file size: 5MB</span>
                </div>
                
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="newsletter" name="newsletter">
                        <span class="checkmark"></span>
                        Subscribe to our newsletter for music updates
                    </label>
                </div>
                
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="privacy" name="privacy" required>
                        <span class="checkmark"></span>
                        I agree to the <a href="privacy.html" target="_blank">Privacy Policy</a> *
                    </label>
                    <span class="error-message" data-field="privacy"></span>
                </div>
                
                <button type="submit" class="submit-button">
                    <span class="button-text">Send Message</span>
                    <span class="button-spinner" style="display: none;">Sending...</span>
                </button>
            </form>
        `;
        
        const main = document.querySelector('main') || document.body;
        main.appendChild(formContainer);
        
        // Setup event listeners for the new form
        this.setupFormEventListeners();
    }

    setupFormEventListeners() {
        const form = document.querySelector('#contact-form');
        form?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Character counter for message
        const messageField = form?.querySelector('#message');
        messageField?.addEventListener('input', (e) => this.updateCharacterCount(e.target));
        
        // File upload validation
        const fileInput = form?.querySelector('#attachment');
        fileInput?.addEventListener('change', (e) => this.validateFileUpload(e.target));
    }

    setupRealTimeValidation() {
        const form = document.querySelector('#contact-form, .contact-form');
        const inputs = form?.querySelectorAll('input, textarea, select');
        
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Please select a subject';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Message must be less than 1000 characters';
                    isValid = false;
                }
                break;
                
            case 'privacy':
                if (field.type === 'checkbox' && !field.checked) {
                    errorMessage = 'You must agree to the privacy policy';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.querySelector(`[data-field="${field.name}"]`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
        
        field.classList.toggle('error', !!message);
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    updateCharacterCount(textarea) {
        const count = textarea.value.length;
        const maxLength = 1000;
        const counterElement = textarea.parentNode.querySelector('.character-count');
        
        if (counterElement) {
            counterElement.textContent = `${count}/${maxLength}`;
            counterElement.classList.toggle('over-limit', count > maxLength);
        }
    }

    validateFileUpload(fileInput) {
        const file = fileInput.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file) {
            let errorMessage = '';
            
            if (file.size > maxSize) {
                errorMessage = 'File size must be less than 5MB';
            } else if (!allowedTypes.includes(file.type)) {
                errorMessage = 'File type not supported. Please use JPG, PNG, PDF, or DOC files.';
            }
            
            if (errorMessage) {
                this.showMessage(errorMessage, 'error');
                fileInput.value = '';
            } else {
                this.showMessage('File uploaded successfully', 'success');
            }
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const isValid = this.validateForm(form);
        if (!isValid) {
            this.showMessage('Please correct the errors in the form', 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.showSubmittingState(true);
        
        try {
            // Convert FormData to regular object for JSON submission
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key === 'attachment' && value.size === 0) continue;
                data[key] = value;
            }
            
            const result = await popFusionFetch.submitContactForm(data);
            
            if (result.success) {
                this.handleSubmissionSuccess(result.message);
                form.reset();
                this.updateCharacterCount(form.querySelector('#message'));
            } else {
                this.handleSubmissionError(result.message);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError('Failed to send message. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.showSubmittingState(false);
        }
        
        // Track form submission
        if (window.trackEvent) {
            trackEvent('contact_form_submit', {
                subject: formData.get('subject'),
                hasAttachment: formData.get('attachment')?.size > 0,
                newsletter: formData.get('newsletter') === 'on'
            });
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    handleSubmissionSuccess(message) {
        this.showMessage(message || 'Message sent successfully!', 'success');
        
        // Show success state
        const form = document.querySelector('#contact-form');
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Thank you for contacting us!</h3>
            <p>We'll get back to you within 24 hours.</p>
        `;
        
        form?.parentNode.appendChild(successMessage);
        
        // Hide form temporarily
        if (form) {
            form.style.display = 'none';
            setTimeout(() => {
                form.style.display = 'block';
                successMessage.remove();
            }, 5000);
        }
    }

    handleSubmissionError(message) {
        this.showMessage(message || 'Failed to send message. Please try again.', 'error');
    }

    showSubmittingState(isSubmitting) {
        const submitButton = document.querySelector('.submit-button');
        const buttonText = submitButton?.querySelector('.button-text');
        const buttonSpinner = submitButton?.querySelector('.button-spinner');
        
        if (submitButton) {
            submitButton.disabled = isSubmitting;
            submitButton.classList.toggle('submitting', isSubmitting);
        }
        
        if (buttonText && buttonSpinner) {
            buttonText.style.display = isSubmitting ? 'none' : 'inline';
            buttonSpinner.style.display = isSubmitting ? 'inline' : 'none';
        }
    }

    setupFileUpload() {
        const fileInput = document.querySelector('#attachment');
        if (!fileInput) return;
        
        // Create custom file upload UI
        const fileUploadContainer = document.createElement('div');
        fileUploadContainer.className = 'file-upload-container';
        
        fileUploadContainer.innerHTML = `
            <div class="file-drop-zone">
                <div class="file-drop-content">
                    <span class="file-icon">📎</span>
                    <span class="file-text">Drop file here or click to browse</span>
                </div>
            </div>
            <div class="file-preview" style="display: none;"></div>
        `;
        
        fileInput.parentNode.insertBefore(fileUploadContainer, fileInput.nextSibling);
        
        // Setup drag and drop
        const dropZone = fileUploadContainer.querySelector('.file-drop-zone');
        
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.validateFileUpload(fileInput);
                this.showFilePreview(files[0], fileUploadContainer);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                this.showFilePreview(fileInput.files[0], fileUploadContainer);
            }
        });
    }

    showFilePreview(file, container) {
        const preview = container.querySelector('.file-preview');
        const dropZone = container.querySelector('.file-drop-zone');
        
        preview.innerHTML = `
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
                <button type="button" class="remove-file">×</button>
            </div>
        `;
        
        preview.style.display = 'block';
        dropZone.style.display = 'none';
        
        // Remove file functionality
        preview.querySelector('.remove-file').addEventListener('click', () => {
            const fileInput = document.querySelector('#attachment');
            fileInput.value = '';
            preview.style.display = 'none';
            dropZone.style.display = 'block';
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupSocialLinks() {
        // Track social media link clicks
        document.querySelectorAll('.social-link, .social-media a').forEach(link => {
            link.addEventListener('click', () => {
                const platform = this.getSocialPlatform(link.href);
                
                if (window.trackEvent) {
                    trackEvent('social_link_click', {
                        platform: platform,
                        page: 'contact'
                    });
                }
            });
        });
    }

    getSocialPlatform(url) {
        if (url.includes('twitter.com')) return 'twitter';
        if (url.includes('facebook.com')) return 'facebook';
        if (url.includes('instagram.com')) return 'instagram';
        if (url.includes('linkedin.com')) return 'linkedin';
        if (url.includes('youtube.com')) return 'youtube';
        if (url.includes('tiktok.com')) return 'tiktok';
        return 'other';
    }

    async loadContactInfo() {
        // Load additional contact information if available
        try {
            const contactInfo = await popFusionFetch.fetch('/api/contact-info');
            this.renderContactInfo(contactInfo);
        } catch (error) {
            console.log('Contact info not available:', error);
            // Use fallback contact info
            this.renderContactInfo(this.getFallbackContactInfo());
        }
    }

    renderContactInfo(info) {
        let infoContainer = document.querySelector('.contact-info');
        if (!infoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.className = 'contact-info';
            
            const main = document.querySelector('main');
            const form = document.querySelector('.contact-form-container');
            if (main && form) {
                main.insertBefore(infoContainer, form);
            }
        }

        infoContainer.innerHTML = `
            <div class="contact-details">
                <h2>Get in Touch</h2>
                <div class="contact-methods">
                    <div class="contact-method">
                        <span class="contact-icon">📧</span>
                        <div class="contact-text">
                            <strong>Email</strong>
                            <p>${info.email || 'contact@popfusion.com'}</p>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">📱</span>
                        <div class="contact-text">
                            <strong>Phone</strong>
                            <p>${info.phone || '+1 (555) 123-4567'}</p>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">📍</span>
                        <div class="contact-text">
                            <strong>Address</strong>
                            <p>${info.address || '123 Music Street, Sound City, SC 12345'}</p>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">🕒</span>
                        <div class="contact-text">
                            <strong>Business Hours</strong>
                            <p>${info.hours || 'Mon-Fri: 9AM-6PM EST'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFallbackContactInfo() {
        return {
            email: 'contact@popfusion.com',
            phone: '+1 (555) 123-4567',
            address: '123 Music Street, Sound City, SC 12345',
            hours: 'Mon-Fri: 9AM-6PM EST'
        };
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        };
        
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            max-width: 300px;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('contact-page') || 
        window.location.pathname.includes('contact')) {
        new ContactPageHandler();
    }
});

// Export for external use
window.ContactPageHandler = ContactPageHandler;