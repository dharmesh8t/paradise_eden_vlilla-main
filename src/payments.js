/**
 * Payment Integration Module - Razorpay Integration
 * Features: Initialize checkout, handle payment verification, receipts, error handling
 */

class PaymentSystem {
  constructor(keyId = null, bookingForm = 'bookingForm') {
    this.keyId = keyId || window.RAZORPAY_KEY_ID;
    this.bookingForm = document.getElementById(bookingForm);
    this.orderId = null;
    this.amount = 0;
    this.init();
  }

  init() {
    if (!window.Razorpay) {
      console.warn('Razorpay SDK not loaded. Loading now...');
      this.loadRazorpaySDK();
    }
    this.attachEventListeners();
  }

  loadRazorpaySDK() {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
  }

  attachEventListeners() {
    if (this.bookingForm) {
      this.bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.initiatePayment();
      });
    }
  }

  async initiatePayment() {
    try {
      // Get booking details from form
      const bookingData = new FormData(this.bookingForm);
      const amount = parseInt(bookingData.get('totalPrice')) * 100; // Convert to paise
      const guestName = bookingData.get('guestName');
      const guestEmail = bookingData.get('guestEmail');
      const guestPhone = bookingData.get('guestPhone');

      if (!amount || !guestName || !guestEmail || !guestPhone) {
        this.showError('Please fill in all booking details');
        return;
      }

      // Create order on backend
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          customer: {
            name: guestName,
            email: guestEmail,
            phone: guestPhone
          }
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();
      this.orderId = order.orderId;
      this.amount = amount;

      // Open Razorpay checkout
      this.openCheckout(guestName, guestEmail, guestPhone, amount, order.orderId);
    } catch (error) {
      console.error('Payment initiation error:', error);
      this.showError('Payment initialization failed: ' + error.message);
    }
  }

  openCheckout(name, email, phone, amount, orderId) {
    const options = {
      key: this.keyId,
      amount: amount,
      currency: 'INR',
      name: 'Paradise Eden Villa',
      description: 'Resort Booking Payment',
      order_id: orderId,
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      handler: (response) => this.paymentSuccessHandler(response),
      modal: {
        ondismiss: () => this.paymentCancelledHandler()
      },
      timeout: 600,
      retry: {
        enabled: true,
        max_count: 3
      },
      theme: {
        color: '#1a5f7a'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  async paymentSuccessHandler(response) {
    try {
      // Verify payment on backend
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: this.orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }

      const verifyData = await verifyResponse.json();

      if (verifyData.verified) {
        // Update booking status
        await this.updateBookingStatus('paid');
        this.showSuccess('Payment successful! Booking confirmed.');
        this.generateReceipt(response.razorpay_payment_id);
        
        // Reset form
        setTimeout(() => {
          this.bookingForm.reset();
          window.location.href = '/bookings/confirmation?paymentId=' + response.razorpay_payment_id;
        }, 2000);
      } else {
        this.showError('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      this.showError('Payment verification failed: ' + error.message);
    }
  }

  paymentCancelledHandler() {
    this.showError('Payment cancelled. Please try again.');
  }

  async updateBookingStatus(status) {
    try {
      const bookingData = new FormData(this.bookingForm);
      const response = await fetch('/api/bookings/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: bookingData.get('bookingId'),
          status: status
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Update booking status error:', error);
      return false;
    }
  }

  generateReceipt(paymentId) {
    const receiptWindow = window.open('', 'PRINT', 'height=400,width=600');
    const bookingData = new FormData(this.bookingForm);
    
    const receiptHTML = `
      <html>
      <head><title>Payment Receipt</title></head>
      <body>
        <h2>Paradise Eden Villa - Payment Receipt</h2>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Guest Name:</strong> ${bookingData.get('guestName')}</p>
        <p><strong>Email:</strong> ${bookingData.get('guestEmail')}</p>
        <p><strong>Amount:</strong> ₹${this.amount / 100}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>Thank you for booking with us!</p>
      </body>
      </html>
    `;
    
    receiptWindow.document.write(receiptHTML);
    receiptWindow.print();
  }

  showError(message) {
    const errorDiv = document.getElementById('paymentError') || this.createNotification('paymentError', 'error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
  }

  showSuccess(message) {
    const successDiv = document.getElementById('paymentSuccess') || this.createNotification('paymentSuccess', 'success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
  }

  createNotification(id, type) {
    const div = document.createElement('div');
    div.id = id;
    div.className = `notification ${type}`;
    div.style.cssText = `
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
      display: none;
      ${type === 'error' ? 'background-color: #fee; color: #c33;' : 'background-color: #efe; color: #3c3;'}
    `;
    document.body.insertBefore(div, document.body.firstChild);
    return div;
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaymentSystem;
}
