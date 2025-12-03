/**
 * Gallery Module - Image Gallery with Lightbox Viewer
 * Features: Responsive grid, modal lightbox, keyboard navigation, touch support
 */

class GallerySystem {
  constructor(galleryContainerId = 'galleryGrid', images = []) {
    this.galleryContainer = document.getElementById(galleryContainerId);
    this.images = images;
    this.currentImageIndex = 0;
    this.init();
  }

  init() {
    this.createLightboxHTML();
    this.attachEventListeners();
  }

  createLightboxHTML() {
    // Create lightbox modal
    const lightboxHTML = `
      <div id="galleryLightbox" class="lightbox-modal" style="display: none;">
        <div class="lightbox-container">
          <button class="lightbox-close" aria-label="Close lightbox">×</button>
          <button class="lightbox-prev" aria-label="Previous image">❮</button>
          <div class="lightbox-image-wrapper">
            <img id="lightboxImage" src="" alt="Gallery image" class="lightbox-image">
          </div>
          <button class="lightbox-next" aria-label="Next image">❯</button>
          <div class="lightbox-info">
            <span id="imageCount" class="image-count">1/1</span>
            <p id="imageCaption" class="image-caption"></p>
          </div>
        </div>
      </div>
    `;
    
    // Append to body
    if (!document.getElementById('galleryLightbox')) {
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
  }

  attachEventListeners() {
    // Gallery grid click handlers
    if (this.galleryContainer) {
      this.galleryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-thumbnail')) {
          this.currentImageIndex = Array.from(this.galleryContainer.querySelectorAll('.gallery-thumbnail')).indexOf(e.target);
          this.openLightbox();
        }
      });
    }

    // Lightbox controls
    const lightbox = document.getElementById('galleryLightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevImage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());

    // Close on background click
    if (lightbox) lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowRight') this.nextImage();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'Escape') this.closeLightbox();
      }
    });

    // Touch support for mobile
    let touchStartX = 0;
    if (lightbox) {
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });

      lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) this.nextImage();
        if (touchEndX - touchStartX > 50) this.prevImage();
      });
    }
  }

  openLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    const galleryThumbnails = this.galleryContainer.querySelectorAll('.gallery-thumbnail');
    const image = galleryThumbnails[this.currentImageIndex];

    if (image) {
      document.getElementById('lightboxImage').src = image.src;
      document.getElementById('lightboxImage').alt = image.alt;
      document.getElementById('imageCaption').textContent = image.alt || '';
      document.getElementById('imageCount').textContent = `${this.currentImageIndex + 1}/${galleryThumbnails.length}`;
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    const galleryThumbnails = this.galleryContainer.querySelectorAll('.gallery-thumbnail');
    this.currentImageIndex = (this.currentImageIndex + 1) % galleryThumbnails.length;
    this.openLightbox();
  }

  prevImage() {
    const galleryThumbnails = this.galleryContainer.querySelectorAll('.gallery-thumbnail');
    this.currentImageIndex = (this.currentImageIndex - 1 + galleryThumbnails.length) % galleryThumbnails.length;
    this.openLightbox();
  }

  loadGalleryImages(imageUrls) {
    if (!this.galleryContainer) return;
    
    this.galleryContainer.innerHTML = '';
    imageUrls.forEach((url, index) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Gallery image ${index + 1}`;
      img.className = 'gallery-thumbnail';
      img.loading = 'lazy';
      this.galleryContainer.appendChild(img);
    });
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GallerySystem;
}
