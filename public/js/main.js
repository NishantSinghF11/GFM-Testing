// GFM Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Common render helpers
  window.renderStars = (rating) => {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa-solid fa-star" style="color: var(--color-accent);"></i>';
    }
    
    if (hasHalfStar) {
      starsHtml += '<i class="fa-solid fa-star-half-stroke" style="color: var(--color-accent);"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa-regular fa-star" style="color: var(--color-text-muted);"></i>';
    }
    
    return starsHtml;
  };

  // Before/After Slider Logic
  window.initBeforeAfterSliders = () => {
    const sliders = document.querySelectorAll('.ba-slider-container');
    sliders.forEach(slider => {
      const handle = slider.querySelector('.ba-slider-handle');
      const beforeImg = slider.querySelector('.ba-img-before');
      let isDragging = false;

      const updateSlider = (xPos) => {
        const sliderWidth = slider.offsetWidth;
        // Keep handle within bounds (0 to 100%)
        let percent = (xPos / sliderWidth) * 100;
        percent = Math.max(0, Math.min(percent, 100));
        
        handle.style.left = percent + '%';
        beforeImg.style.width = percent + '%';
      };

      const startDrag = (e) => {
        isDragging = true;
      };

      const stopDrag = () => {
        isDragging = false;
      };

      const handleDrag = (e) => {
        if (!isDragging) return;
        const rect = slider.getBoundingClientRect();
        // Handle both mouse and touch events
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const xPos = clientX - rect.left;
        updateSlider(xPos);
      };

      // Mouse events
      handle.addEventListener('mousedown', startDrag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('mousemove', handleDrag);

      // Touch events
      handle.addEventListener('touchstart', startDrag);
      window.addEventListener('touchend', stopDrag);
      window.addEventListener('touchmove', handleDrag);
    });
  };

  // Initialize sliders if any exist on the page
  initBeforeAfterSliders();

});
