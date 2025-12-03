/**
 * Contact Enquiry Form Module - Customer Enquiry Collection
 * Features: Form submission, email notifications, social media links
 * Business Details: Email, Phone, Instagram
 */

class ContactEnquiry {
  constructor(formId = 'contactForm') {
    // Business Details - configured for Paradise Eden Villa
    this.businessEmail = 'dharmesh8m@gmail.com';
    this.businessPhone = '9585394396';
    this.businessInstagram = 'paradiseedenvilla';
    this.apiEndpoint = '/api/enquiries';
    
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.populateContactLinks();
  }

  attachEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitEnquiry();
      });
    }
  }

  populateContactLinks() {
    // WhatsApp
    const whatsappBtn = document.querySelector('[data-contact="whatsapp"]');
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/91${this.businessPhone}?text=Hi%20Paradise%20Eden%20Villa`;
    }

    // Phone
    const phoneBtn = document.querySelector('[data-contact="phone"]');
    if (phoneBtn) {
      phoneBtn.href = `tel:+91${this.businessPhone}`;
    }

    // Instagram
    const instaBtn = document.querySelector('[data-contact="instagram"]');
    if (instaBtn) {
      instaBtn.href = `https://instagram.com/${this.businessInstagram}`;
    }

    // Email
    const emailBtn = document.querySelector('[data-contact="email"]');
    if (emailBtn) {
      emailBtn.href = `mailto:${this.businessEmail}`;
    }
  }

  async submitEnquiry() {
    try {
      const formData = new FormData(this.form);
      
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const phone = formData.get('phone')?.trim();
      const subject = formData.get('subject')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !email || !phone || !subject || !message) {
        this.showError('Please fill in all fields');
        return;
      }

      if (!this.isValidEmail(email)) {
        this.showError('Please enter a valid email address');
        return;
      }

      if (phone.length < 10) {
        this.showError('Please enter a valid phone number');
        return;
      }

      const enquiryData = {
        name,
        email,
        phone,
        subject,
        message,
        receiverEmail: this.businessEmail,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enquiryData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      const result = await response.json();

      if (result.success) {
        this.showSuccess('Enquiry submitted successfully! We will contact you soon.');
        this.form.reset();
        this.sendConfirmationEmail(email, name);
      } else {
        this.showError('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      this.showError('Error submitting enquiry: ' + error.message);
    }
  }

  async sendConfirmationEmail(customerEmail, customerName) {
    try {
      const confirmationData = {
        type: 'enquiry-confirmation',
        recipient: customerEmail,
        subject: 'Your Enquiry at Paradise Eden Villa',
        data: {
          guestName: customerName,
          businessEmail: this.businessEmail,
          businessPhone: this.businessPhone,
          businessInstagram: this.businessInstagram
        }
      };

      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(confirmationData)
      });
    } catch (error) {
      console.warn('Could not send confirmation email:', error);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message) {
    const errorDiv = document.getElementById('contactError') || this.createNotification('contactError', 'error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
  }

  showSuccess(message) {
    const successDiv = document.getElementById('contactSuccess') || this.createNotification('contactSuccess', 'success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
  }

  createNotification(id, type) {
    const div = document.createElement('div');
    div.id = id;
    div.className = `notification ${type}`;
    div.style.cssText = `
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
      display: none;
      font-weight: 500;
      ${type === 'error' ? 'background-color: #fee; color: #c33;' : 'background-color: #efe; color: #3c3;'}
    `;
    const form = document.getElementById('contactForm');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(div, form);
    }
    return div;
  }

  getContactDetails() {
    return {
      email: this.businessEmail,
      phone: this.businessPhone,
      instagram: this.businessInstagram,
      whatsapp: `https://wa.me/91${this.businessPhone}`
    };
  }

  updateContactDetails(email, phone, instagram) {
    this.businessEmail = email;
    this.businessPhone = phone;
    this.businessInstagram = instagram;
    this.populateContactLinks();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactEnquiry;
}
