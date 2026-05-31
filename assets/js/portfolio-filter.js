/**
 * Portfolio Filter Handler
 * Manages main and subcategory filters with Isotope
 */

document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.isotope-container');
  
  if (!container || !window.Isotope) return;

  // Initialize Isotope
  const iso = new Isotope(container, {
    itemSelector: '.portfolio-item',
    layoutMode: 'masonry',
    masonry: {
      columnWidth: '.portfolio-item',
      percentPosition: true
    }
  });

  /**
   * Main filter buttons
   */
  document.querySelectorAll('#main-filters li').forEach(button => {
    button.addEventListener('click', function () {
      // Update active state
      document.querySelectorAll('#main-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      iso.arrange({ filter: filterValue });

      // Show/hide subcategory filters
      if (filterValue.includes('graphic-design')) {
        document.getElementById('graphic-design-filters').classList.remove('d-none');
        document.getElementById('web-dev-filters').classList.add('d-none');
      } else if (filterValue.includes('web-dev')) {
        document.getElementById('web-dev-filters').classList.remove('d-none');
        document.getElementById('graphic-design-filters').classList.add('d-none');
      } else {
        document.getElementById('graphic-design-filters').classList.add('d-none');
        document.getElementById('web-dev-filters').classList.add('d-none');
      }
    });
  });

  /**
   * Graphic Design subcategory filters
   */
  document.querySelectorAll('#graphic-design-filters li').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('#graphic-design-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      iso.arrange({ filter: filterValue });
    });
  });

  /**
   * Web Development subcategory filters
   */
  document.querySelectorAll('#web-dev-filters li').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('#web-dev-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      iso.arrange({ filter: filterValue });
    });
  });

  // Reinitialize on window resize
  window.addEventListener('resize', function () {
    iso.layout();
  });
});