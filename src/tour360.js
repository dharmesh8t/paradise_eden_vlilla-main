/**
 * 360 Virtual Tour Module - Panoramic View Experience
 * Features: Mouse drag navigation, touch swipe, keyboard controls, fullscreen mode
 */

class VirtualTour360 {
  constructor(containerId = 'tour360Viewer', imageUrl = null) {
    this.container = document.getElementById(containerId);
    this.imageUrl = imageUrl;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.isFullscreen = false;
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Tour360 container not found');
      return;
    }
    this.createViewerHTML();
    this.attachEventListeners();
  }

  createViewerHTML() {
    const viewerHTML = `
      <div class="tour360-wrapper" style="position: relative; width: 100%; height: 500px; background: #000; border-radius: 10px; overflow: hidden;">
        <canvas id="tour360Canvas" style="width: 100%; height: 100%; display: block; cursor: grab;"></canvas>
        <div class="tour360-controls" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 10;">
          <button class="tour360-btn" id="tourZoomIn" title="Zoom In" style="padding: 10px 15px; background: rgba(255,255,255,0.8); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">+</button>
          <button class="tour360-btn" id="tourZoomOut" title="Zoom Out" style="padding: 10px 15px; background: rgba(255,255,255,0.8); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">-</button>
          <button class="tour360-btn" id="tourReset" title="Reset View" style="padding: 10px 15px; background: rgba(255,255,255,0.8); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Reset</button>
          <button class="tour360-btn" id="tourFullscreen" title="Fullscreen" style="padding: 10px 15px; background: rgba(255,255,255,0.8); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Fullscreen</button>
        </div>
        <div class="tour360-info" style="position: absolute; top: 10px; left: 10px; color: white; font-size: 12px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px;">
          <p>Drag mouse to look around | Scroll to zoom | Press R to reset</p>
        </div>
      </div>
    `;
    this.container.innerHTML = viewerHTML;
  }

  attachEventListeners() {
    const canvas = document.getElementById('tour360Canvas');
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.onMouseUp());
    canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));

    // Touch events
    canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    canvas.addEventListener('touchend', () => this.onTouchEnd());

    // Keyboard events
    document.addEventListener('keydown', (e) => this.onKeyDown(e));

    // Button events
    document.getElementById('tourZoomIn').addEventListener('click', () => this.zoom(1.1));
    document.getElementById('tourZoomOut').addEventListener('click', () => this.zoom(0.9));
    document.getElementById('tourReset').addEventListener('click', () => this.resetView());
    document.getElementById('tourFullscreen').addEventListener('click', () => this.toggleFullscreen());
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    e.target.style.cursor = 'grabbing';
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;

    this.rotation.y += deltaX * 0.5;
    this.rotation.x += deltaY * 0.5;

    this.rotation.x = Math.max(-90, Math.min(90, this.rotation.x));
    this.rotation.y = this.rotation.y % 360;

    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    this.updateView();
  }

  onMouseUp() {
    this.isDragging = false;
    document.getElementById('tour360Canvas').style.cursor = 'grab';
  }

  onMouseWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoom(zoomFactor);
  }

  onTouchStart(e) {
    this.isDragging = true;
    const touch = e.touches[0];
    this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.previousMousePosition.x;
    const deltaY = touch.clientY - this.previousMousePosition.y;

    this.rotation.y += deltaX * 0.5;
    this.rotation.x += deltaY * 0.5;
    this.rotation.x = Math.max(-90, Math.min(90, this.rotation.x));

    this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    this.updateView();
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  onKeyDown(e) {
    if (e.key === 'r' || e.key === 'R') {
      this.resetView();
    }
    if (e.key === 'ArrowLeft') {
      this.rotation.y -= 5;
    }
    if (e.key === 'ArrowRight') {
      this.rotation.y += 5;
    }
    if (e.key === 'ArrowUp') {
      this.rotation.x = Math.max(-90, this.rotation.x - 5);
    }
    if (e.key === 'ArrowDown') {
      this.rotation.x = Math.min(90, this.rotation.x + 5);
    }
    if (e.key === ' ') {
      e.preventDefault();
      this.toggleFullscreen();
    }
    this.updateView();
  }

  zoom(factor) {
    const canvas = document.getElementById('tour360Canvas');
    const currentHeight = canvas.parentElement.style.height;
    const numHeight = parseFloat(currentHeight);
    const newHeight = Math.max(300, Math.min(800, numHeight * factor));
    canvas.parentElement.style.height = newHeight + 'px';
  }

  resetView() {
    this.rotation = { x: 0, y: 0 };
    this.updateView();
  }

  toggleFullscreen() {
    const wrapper = document.querySelector('.tour360-wrapper');
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().then(() => {
        this.isFullscreen = true;
        this.updateView();
      }).catch(err => console.error('Fullscreen request failed:', err));
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
      });
    }
  }

  updateView() {
    const canvas = document.getElementById('tour360Canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Apply rotation transformation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.rotation.y * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Clear canvas and draw panoramic image
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.imageUrl) {
      const img = new Image();
      img.onload = () => {
        const hOffset = (this.rotation.y / 360) * img.width;
        ctx.drawImage(img, -hOffset, 0);
        ctx.drawImage(img, img.width - hOffset, 0);
      };
      img.src = this.imageUrl;
    } else {
      // Placeholder gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a5f7a');
      gradient.addColorStop(1, '#0d3a4a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('360 Virtual Tour - Load Image URL', canvas.width / 2, canvas.height / 2);
    }

    ctx.restore();
  }

  loadTourImage(imageUrl) {
    this.imageUrl = imageUrl;
    this.updateView();
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualTour360;
}
