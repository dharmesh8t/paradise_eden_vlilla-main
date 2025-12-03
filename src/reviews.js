// Reviews & Ratings System for Paradise Eden Villa

const API_BASE_URL = 'http://localhost:5000/api';

class ReviewSystem {
  constructor() {
    this.reviews = [];
    this.averageRating = 0;
    this.totalReviews = 0;
    this.loadReviews();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
    }
  }

  // Load reviews from backend
  async loadReviews() {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`);
      if (response.ok) {
        this.reviews = await response.json();
        this.displayReviews();
        this.updateAverageRating();
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  // Handle review form submission
  async handleReviewSubmit(event) {
    event.preventDefault();

    const reviewData = {
      guestName: document.getElementById('reviewerName')?.value,
      guestEmail: document.getElementById('reviewerEmail')?.value,
      rating: parseInt(document.getElementById('rating')?.value || 5),
      comment: document.getElementById('reviewComment')?.value
    };

    // Validate form
    if (!reviewData.guestName || !reviewData.guestEmail || !reviewData.comment) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        this.showSuccessMessage('Thank you! Your review has been posted.');
        document.getElementById('reviewForm').reset();
        this.loadReviews(); // Reload reviews
      }
    } catch (error) {
      console.error('Review submission error:', error);
      this.showErrorMessage('Error posting review. Please try again.');
    }
  }

  // Display reviews on page
  displayReviews() {
    const reviewsContainer = document.getElementById('reviewsList');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = '';

    this.reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review-card';
      reviewElement.innerHTML = `
        <div class="review-header">
          <h4>${review.guestName}</h4>
          <div class="review-rating">
            ${this.getStarRating(review.rating)}
          </div>
        </div>
        <p class="review-comment">${review.comment}</p>
        <small class="review-date">${new Date(review.createdAt).toLocaleDateString()}</small>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  }

  // Generate star rating HTML
  getStarRating(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆';
    }
    return `<span class="stars">${stars}</span>`;
  }

  // Update and display average rating
  async updateAverageRating() {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/stats`);
      if (response.ok) {
        const stats = await response.json();
        this.averageRating = stats.averageRating || 0;
        this.totalReviews = stats.totalReviews || 0;
        
        const ratingDisplay = document.getElementById('averageRating');
        const ratingCount = document.getElementById('reviewCount');
        
        if (ratingDisplay) {
          ratingDisplay.innerHTML = `
            <div class="rating-summary">
              <span class="rating-value">${this.averageRating.toFixed(1)}</span>
              <span class="stars">${this.getStarRating(Math.round(this.averageRating))}</span>
            </div>
          `;
        }
        
        if (ratingCount) {
          ratingCount.textContent = `${this.totalReviews} guest reviews`;
        }
      }
    } catch (error) {
      console.error('Error updating rating:', error);
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
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.reviewSystem = new ReviewSystem();
  });
} else {
  window.reviewSystem = new ReviewSystem();
}
