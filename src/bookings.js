// Booking System Module for Paradise Eden Villa

const API_BASE_URL = 'http://localhost:5000/api';

class BookingSystem {
  constructor() {
    this.bookings = [];
    this.selectedDates = { checkIn: null, checkOut: null };
    this.initializeCalendar();
    this.attachEventListeners();
  }

  // Initialize calendar picker
  initializeCalendar() {
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');

    if (checkInInput) {
      checkInInput.type = 'date';
      checkInInput.min = new Date().toISOString().split('T')[0];
      checkInInput.addEventListener('change', (e) => this.handleDateChange(e, 'checkIn'));
    }

    if (checkOutInput) {
      checkOutInput.type = 'date';
      checkOutInput.addEventListener('change', (e) => this.handleDateChange(e, 'checkOut'));
    }
  }

  handleDateChange(event, dateType) {
    const selectedDate = new Date(event.target.value);
    this.selectedDates[dateType] = selectedDate;

    // Validate dates
    if (dateType === 'checkIn') {
      const checkOutInput = document.getElementById('checkOutDate');
      if (checkOutInput) {
        const minCheckOut = new Date(selectedDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        checkOutInput.min = minCheckOut.toISOString().split('T')[0];
      }
    }

    // Calculate price
    this.updatePrice();
  }

  updatePrice() {
    if (this.selectedDates.checkIn && this.selectedDates.checkOut) {
      const nights = Math.ceil((this.selectedDates.checkOut - this.selectedDates.checkIn) / (1000 * 60 * 60 * 24));
      const basePrice = 3500; // ₹3,500 per night
      const totalPrice = nights * basePrice;
      
      const priceDisplay = document.getElementById('totalPrice');
      if (priceDisplay) {
        priceDisplay.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
        document.getElementById('priceInput').value = totalPrice;
      }
    }
  }

  attachEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }
  }

  async handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = {
      guestName: document.getElementById('guestName')?.value,
      guestEmail: document.getElementById('guestEmail')?.value,
      guestPhone: document.getElementById('guestPhone')?.value,
      checkInDate: document.getElementById('checkInDate')?.value,
      checkOutDate: document.getElementById('checkOutDate')?.value,
      numberOfGuests: parseInt(document.getElementById('numberOfGuests')?.value || 1),
      totalPrice: parseFloat(document.getElementById('priceInput')?.value || 0),
      specialRequests: document.getElementById('specialRequests')?.value || '',
      paymentStatus: 'pending'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const booking = await response.json();
        this.showSuccessMessage('Booking created successfully! Booking ID: ' + booking._id);
        document.getElementById('bookingForm').reset();
        this.initializeCalendar();
      }
    } catch (error) {
      console.error('Booking error:', error);
      this.showErrorMessage('Error creating booking. Please try again.');
    }
  }

  showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 5000);
  }

  showErrorMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 5000);
  }

  async fetchAvailability(checkIn, checkOut) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkInDate: checkIn, checkOutDate: checkOut })
      });
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Availability check error:', error);
      return true;
    }
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bookingSystem = new BookingSystem();
  });
} else {
  window.bookingSystem = new BookingSystem();
}
