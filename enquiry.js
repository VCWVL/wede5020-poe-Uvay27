// ENQUIRY FORM VALIDATION AND PROCESSING SCRIPT
// This script handles the enquiry form validation, submission, and response

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the enquiry form and response message elements
    const form = document.getElementById('enquiryForm');
    const responseMessage = document.getElementById('responseMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitBtn = document.getElementById('submitBtn');
    
    // If form doesn't exist, stop execution
    if (!form) return;
    
    // FORM CONTROLS: Real-time validation on blur (when user leaves a field)
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(control => {
        // Validate field when user leaves it
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors when user starts typing
        control.addEventListener('input', function() {
            clearFieldError(this);
            updateSubmitButton();
        });
    });
    
    // FORM SUBMISSION: Handle form submit event
    form.addEventListener('submit', function(e) {
        // Prevent default form submission
        e.preventDefault();
        
        // Validate entire form before submission
        if (validateForm()) {
            // If form is valid, process the enquiry
            processEnquiry();
        }
    });
    
    // FUNCTION: Validate a single form field
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + 'Error');
        
        // Remove any existing validation classes
        field.classList.remove('valid', 'invalid');
        
        // Validate based on field type and requirements
        switch(field.type) {
            case 'text':
                if (field.required && value === '') {
                    showFieldError(field, errorElement, 'This field is required');
                    return false;
                }
                if (value.length < 2 || value.length > 50) {
                    showFieldError(field, errorElement, 'Must be between 2-50 characters');
                    return false;
                }
                break;
                
            case 'email':
                if (field.required && value === '') {
                    showFieldError(field, errorElement, 'Email address is required');
                    return false;
                }
                if (value && !isValidEmail(value)) {
                    showFieldError(field, errorElement, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                if (value && !isValidPhone(value)) {
                    showFieldError(field, errorElement, 'Please enter a valid 10-digit phone number');
                    return false;
                }
                break;
        }
        
        // Validate select elements
        if (field.tagName === 'SELECT' && field.required) {
            if (value === '') {
                showFieldError(field, errorElement, 'Please select an option');
                return false;
            }
        }
        
        // Validate textarea elements
        if (field.tagName === 'TEXTAREA' && field.required) {
            if (value === '') {
                showFieldError(field, errorElement, 'Message is required');
                return false;
            }
            if (value.length < 10 || value.length > 1000) {
                showFieldError(field, errorElement, 'Message must be between 10-1000 characters');
                return false;
            }
        }
        
        // If field passes validation, mark as valid
        field.classList.add('valid');
        clearFieldError(field);
        return true;
    }
    
    // FUNCTION: Validate entire form
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Validate each required field
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // FUNCTION: Show field error message
    function showFieldError(field, errorElement, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // FUNCTION: Clear field error message
    function clearFieldError(field) {
        field.classList.remove('invalid');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // FUNCTION: Update submit button state
    function updateSubmitButton() {
        const isValid = validateForm();
        submitBtn.disabled = !isValid;
    }
    
    // FUNCTION: Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // FUNCTION: Validate phone format (10 digits)
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    
    // FUNCTION: Process enquiry form submission
    function processEnquiry() {
        // Get form data
        const formData = new FormData(form);
        const enquiryData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            enquiryType: formData.get('enquiryType'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        showLoadingState();
        
        // SIMULATE AJAX REQUEST TO SERVER (in real application, this would be fetch() or XMLHttpRequest)
        setTimeout(() => {
            // Process the enquiry and generate response
            const response = processEnquiryResponse(enquiryData);
            
            // Show success message
            showResponseMessage('success', response.message, enquiryData);
            
            // Reset form and hide loading state
            resetForm();
            hideLoadingState();
            
        }, 2000); // Simulate 2 second processing time
    }
    
    // FUNCTION: Show loading state
    function showLoadingState() {
        form.classList.add('loading');
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
    
    // FUNCTION: Hide loading state
    function hideLoadingState() {
        form.classList.remove('loading');
        loadingSpinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
    }
    
    // FUNCTION: Process enquiry and generate appropriate response
    function processEnquiryResponse(enquiryData) {
        const { enquiryType, name } = enquiryData;
        
        // Define response templates based on enquiry type
        const responseTemplates = {
            'product': {
                title: 'Product Information Request',
                message: `Thank you for your product enquiry, ${name}! Our product specialists will send you detailed specifications, availability, and competitive pricing within 24 hours.`,
                followUp: 'We will also include any current promotions or bundle deals.'
            },
            'pricing': {
                title: 'Pricing Enquiry Received',
                message: `Thanks for your pricing enquiry, ${name}! Our sales team will provide you with our most competitive pricing and available payment plans.`,
                followUp: 'We will check for any loyalty discounts or ongoing promotions.'
            },
            'support': {
                title: 'Technical Support Request',
                message: `We have received your technical support request, ${name}. Our support team will contact you to help resolve your issue.`,
                followUp: 'Please have your product details and any error messages ready.'
            },
            'volunteer': {
                title: 'Volunteer Application',
                message: `Thank you for your interest in volunteering with Checkpoint Gaming, ${name}! Our community manager will contact you about upcoming events and initiatives.`,
                followUp: 'We appreciate your passion for the gaming community!'
            },
            'sponsor': {
                title: 'Sponsorship Enquiry',
                message: `We appreciate your interest in sponsorship opportunities, ${name}. Our partnership team will reach out to discuss potential collaborations.`,
                followUp: 'We look forward to supporting the gaming community together.'
            },
            'other': {
                title: 'Enquiry Received',
                message: `Thank you for your enquiry, ${name}. We have received your message and will route it to the appropriate department.`,
                followUp: 'One of our team members will contact you soon.'
            }
        };
        
        // Get the appropriate response template
        const template = responseTemplates[enquiryType] || responseTemplates['other'];
        
        return {
            success: true,
            title: template.title,
            message: template.message,
            followUp: template.followUp
        };
    }
    
    // FUNCTION: Show response message to user
    function showResponseMessage(type, message, enquiryData) {
        const { name, email, enquiryType } = enquiryData;
        
        responseMessage.innerHTML = `
            <h3 style="color: #4CAF50; margin-top: 0;">✅ ${type === 'success' ? 'Enquiry Submitted Successfully!' : 'Error'}</h3>
            <p><strong>Thank you, ${name}!</strong></p>
            <p>${message}</p>
            <p><em>${getResponseFollowUp(enquiryType)}</em></p>
            <p><strong>We will contact you at ${email} within 24 hours.</strong></p>
            <button onclick="this.parentElement.style.display='none'" 
                    style="background:#00bfff; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; margin-top:15px;">
                Close Message
            </button>
        `;
        
        responseMessage.className = type === 'success' ? 'success' : 'error';
        responseMessage.style.display = 'block';
        
        // Scroll to response message
        responseMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // FUNCTION: Get follow-up message based on enquiry type
    function getResponseFollowUp(enquiryType) {
        const followUps = {
            'product': 'Our product experts are reviewing your request...',
            'pricing': 'Checking for current promotions and discounts...',
            'support': 'Our support team is preparing to assist you...',
            'volunteer': 'Reviewing upcoming community events...',
            'sponsor': 'Exploring partnership opportunities...',
            'other': 'Routing your message to the appropriate team...'
        };
        
        return followUps[enquiryType] || 'Processing your enquiry...';
    }
    
    // FUNCTION: Reset form after successful submission
    function resetForm() {
        form.reset();
        
        // Remove validation classes from all fields
        formControls.forEach(control => {
            control.classList.remove('valid', 'invalid');
        });
        
        // Update submit button state
        updateSubmitButton();
    }
    
    // Initialize submit button state
    updateSubmitButton();
});