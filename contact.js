// CONTACT FORM VALIDATION AND EMAIL PROCESSING SCRIPT
// This script handles contact form validation, email simulation, and response

document.addEventListener('DOMContentLoaded', function() {
    // Get contact form and related elements
    const contactForm = document.getElementById('contactForm');
    const responseMessage = document.getElementById('responseMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm) return;
    
    // FORM CONTROLS: Real-time validation
    const formControls = contactForm.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        control.addEventListener('input', function() {
            clearContactError(this);
            updateContactSubmitButton();
        });
    });
    
    // FORM SUBMISSION: Handle submit event
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            processContactForm();
        }
    });
    
    // FUNCTION: Validate contact form field
    function validateContactField(field) {
        const value = field.value.trim();
        const fieldName = field.id.replace('contact', '').toLowerCase();
        const errorElement = document.getElementById(fieldName + 'Error');
        
        field.classList.remove('valid', 'invalid');
        
        // Email validation
        if (field.type === 'email' && value) {
            if (!isValidEmail(value)) {
                showContactError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            if (!isValidPhone(value)) {
                showContactError(field, errorElement, 'Please enter a valid 10-digit phone number');
                return false;
            }
        }
        
        // Required field validation
        if (field.hasAttribute('required') && value === '') {
            showContactError(field, errorElement, 'This field is required');
            return false;
        }
        
        // Select validation
        if (field.tagName === 'SELECT' && field.required && value === '') {
            showContactError(field, errorElement, 'Please select a subject');
            return false;
        }
        
        // Textarea validation
        if (field.tagName === 'TEXTAREA' && value) {
            if (value.length < 10 || value.length > 1000) {
                showContactError(field, errorElement, 'Message must be between 10-1000 characters');
                return false;
            }
        }
        
        // Mark field as valid
        field.classList.add('valid');
        clearContactError(field);
        return true;
    }
    
    // FUNCTION: Validate entire contact form
    function validateContactForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateContactField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // FUNCTION: Show contact field error
    function showContactError(field, errorElement, message) {
        field.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // FUNCTION: Clear contact field error
    function clearContactError(field) {
        field.classList.remove('invalid');
        const fieldName = field.id.replace('contact', '').toLowerCase();
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // FUNCTION: Update contact submit button state
    function updateContactSubmitButton() {
        const isValid = validateContactForm();
        submitBtn.disabled = !isValid;
    }
    
    // FUNCTION: Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // FUNCTION: Validate phone format
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    
    // FUNCTION: Process contact form submission
    function processContactForm() {
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            ip: '127.0.0.1' // Simulated IP address
        };
        
        // Show loading state
        showContactLoadingState();
        
        // SIMULATE EMAIL SENDING PROCESS
        setTimeout(() => {
            // Process the contact form (simulate email sending)
            const emailResult = simulateEmailSending(contactData);
            
            if (emailResult.success) {
                showContactResponse('success', 
                    `Thank you, ${contactData.name}! Your message has been sent successfully.`,
                    `We have received your ${contactData.subject.toLowerCase()} inquiry and will respond to you at <strong>${contactData.email}</strong> within 24 hours.`,
                    contactData
                );
            } else {
                showContactResponse('error',
                    'Message Sending Failed',
                    'There was an error sending your message. Please try again or call us directly.',
                    contactData
                );
            }
            
            // Reset form
            resetContactForm();
            hideContactLoadingState();
            
        }, 3000); // Simulate 3 second email sending process
    }
    
    // FUNCTION: Simulate email sending process
    function simulateEmailSending(contactData) {
        // In a real application, this would connect to an email service
        // For demo purposes, we simulate successful sending 95% of the time
        
        const isSuccess = Math.random() > 0.05; // 95% success rate
        
        if (isSuccess) {
            // Simulate email content that would be sent
            const emailContent = {
                to: 'info@checkpointgaming.co.za',
                from: contactData.email,
                subject: `Website Contact: ${contactData.subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${contactData.name}</p>
                    <p><strong>Email:</strong> ${contactData.email}</p>
                    <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${contactData.subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${contactData.message}</p>
                    <hr>
                    <p><small>Received: ${new Date(contactData.timestamp).toLocaleString()}</small></p>
                    <p><small>IP: ${contactData.ip}</small></p>
                `
            };
            
            // Log simulated email (in real app, this would actually send)
            console.log('SIMULATED EMAIL SENT:', emailContent);
            
            return {
                success: true,
                emailId: 'simulated-' + Date.now(),
                content: emailContent
            };
        } else {
            return {
                success: false,
                error: 'Simulated network error'
            };
        }
    }
    
    // FUNCTION: Show contact loading state
    function showContactLoadingState() {
        contactForm.classList.add('loading');
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
    }
    
    // FUNCTION: Hide contact loading state
    function hideContactLoadingState() {
        contactForm.classList.remove('loading');
        loadingSpinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
    
    // FUNCTION: Show contact response message
    function showContactResponse(type, title, message, contactData) {
        responseMessage.innerHTML = `
            <h3 style="color: ${type === 'success' ? '#4CAF50' : '#ff4444'}; margin-top: 0;">
                ${type === 'success' ? '✅' : '❌'} ${title}
            </h3>
            <p>${message}</p>
            ${type === 'success' ? `
                <p><strong>Message Details:</strong></p>
                <ul style="text-align: left; margin: 15px 0;">
                    <li><strong>Name:</strong> ${contactData.name}</li>
                    <li><strong>Email:</strong> ${contactData.email}</li>
                    <li><strong>Subject:</strong> ${contactData.subject}</li>
                    <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                </ul>
                <p>For urgent matters, please call our Johannesburg store at <strong>(011) 123-4567</strong>.</p>
            ` : `
                <p>Please try again in a few moments, or contact us directly:</p>
                <p><strong>Phone:</strong> (011) 123-4567</p>
                <p><strong>Email:</strong> info@checkpointgaming.co.za</p>
            `}
            <button onclick="this.parentElement.style.display='none'" 
                    style="background:#00bfff; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; margin-top:15px;">
                Close Message
            </button>
        `;
        
        responseMessage.className = type;
        responseMessage.style.display = 'block';
        
        // Scroll to response
        responseMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Log contact submission for analytics
        logContactSubmission(contactData, type);
    }
    
    // FUNCTION: Log contact submission (for analytics)
    function logContactSubmission(contactData, status) {
        const submissionLog = {
            type: 'contact_form',
            status: status,
            data: contactData,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // In a real application, this would send to analytics service
        console.log('CONTACT SUBMISSION LOG:', submissionLog);
        
        // Store in localStorage for demo purposes
        const existingLogs = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        existingLogs.push(submissionLog);
        localStorage.setItem('contactSubmissions', JSON.stringify(existingLogs));
    }
    
    // FUNCTION: Reset contact form
    function resetContactForm() {
        contactForm.reset();
        formControls.forEach(control => {
            control.classList.remove('valid', 'invalid');
        });
        updateContactSubmitButton();
    }
    
    // Initialize contact form
    updateContactSubmitButton();
});