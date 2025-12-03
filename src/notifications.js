/**
 * Email Notifications Module - Frontend Interface for Notification System
 * Handles: Booking confirmations, payment receipts, reminder emails
 */

class NotificationSystem {
  constructor(apiEndpoint = '/api/notifications') {
    this.apiEndpoint = apiEndpoint;
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Send booking confirmation email
   * @param {Object} bookingData - Booking information
   */
  async sendBookingConfirmation(bookingData) {
    try {
      const payload = {
        type: 'booking-confirmation',
        recipient: bookingData.email,
        subject: 'Booking Confirmed - Paradise Eden Villa',
        data: {
          guestName: bookingData.guestName,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          nights: bookingData.nights,
          totalPrice: bookingData.totalPrice,
          bookingId: bookingData.bookingId,
          roomType: bookingData.roomType,
          guests: bookingData.guests
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return false;
    }
  }

  /**
   * Send payment receipt email
   * @param {Object} paymentData - Payment information
   */
  async sendPaymentReceipt(paymentData) {
    try {
      const payload = {
        type: 'payment-receipt',
        recipient: paymentData.email,
        subject: 'Payment Receipt - Paradise Eden Villa Booking',
        data: {
          guestName: paymentData.guestName,
          paymentId: paymentData.paymentId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          paymentDate: new Date().toISOString(),
          orderId: paymentData.orderId,
          paymentMethod: paymentData.paymentMethod || 'Razorpay'
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending payment receipt:', error);
      return false;
    }
  }

  /**
   * Send check-in reminder email
   * @param {Object} reminderData - Reminder information
   */
  async sendCheckInReminder(reminderData) {
    try {
      const payload = {
        type: 'check-in-reminder',
        recipient: reminderData.email,
        subject: 'Reminder: Your Check-in at Paradise Eden Villa',
        data: {
          guestName: reminderData.guestName,
          checkInDate: reminderData.checkInDate,
          checkInTime: reminderData.checkInTime || '3:00 PM',
          contactNumber: reminderData.contactNumber,
          bookingId: reminderData.bookingId
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending check-in reminder:', error);
      return false;
    }
  }

  /**
   * Send cancellation notification email
   * @param {Object} cancellationData - Cancellation information
   */
  async sendCancellationNotice(cancellationData) {
    try {
      const payload = {
        type: 'booking-cancelled',
        recipient: cancellationData.email,
        subject: 'Booking Cancelled - Paradise Eden Villa',
        data: {
          guestName: cancellationData.guestName,
          bookingId: cancellationData.bookingId,
          originalCheckIn: cancellationData.checkInDate,
          refundAmount: cancellationData.refundAmount,
          cancellationReason: cancellationData.reason
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending cancellation notice:', error);
      return false;
    }
  }

  /**
   * Send review invitation email
   * @param {Object} reviewData - Review invitation data
   */
  async sendReviewInvitation(reviewData) {
    try {
      const payload = {
        type: 'review-invitation',
        recipient: reviewData.email,
        subject: 'Share Your Experience at Paradise Eden Villa',
        data: {
          guestName: reviewData.guestName,
          bookingId: reviewData.bookingId,
          checkOutDate: reviewData.checkOutDate,
          reviewLink: reviewData.reviewLink
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending review invitation:', error);
      return false;
    }
  }

  /**
   * Send newsletter/promotional email
   * @param {Object} newsletterData - Newsletter data
   */
  async sendNewsletter(newsletterData) {
    try {
      const payload = {
        type: 'newsletter',
        recipient: newsletterData.email,
        subject: newsletterData.subject || 'Latest Offers from Paradise Eden Villa',
        data: {
          content: newsletterData.content,
          offers: newsletterData.offers || [],
          unsubscribeLink: newsletterData.unsubscribeLink
        }
      };

      const response = await fetch(this.apiEndpoint + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending newsletter:', error);
      return false;
    }
  }

  /**
   * Get notification preferences for user
   * @param {String} userId - User ID
   */
  async getNotificationPreferences(userId) {
    try {
      const response = await fetch(this.apiEndpoint + `/preferences/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  /**
   * Update notification preferences
   * @param {String} userId - User ID
   * @param {Object} preferences - Preference settings
   */
  async updateNotificationPreferences(userId, preferences) {
    try {
      const response = await fetch(this.apiEndpoint + `/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationSystem;
}
