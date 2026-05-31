/**
 * Advanced Portfolio Loader with Dynamic Subcategories
 * Fetches images from Unsplash API
 */

const UNSPLASH_ACCESS_KEY = 'F4xVd0NWxE-pnZCBvJvR9lFqv1B2rKbMw0cFMUNL4K4'; // Free tier key
const PEXELS_API_KEY = 'JmS9CZAZhQb1kYaQBVEp6fkIQXzDFhv9RdLBB4KcGVDY4lv9Y7AzNpnf';

const portfolioData = {
  webDevelopment: [
    {
      id: 1,
      category: 'filter-web-dev filter-websites',
      title: 'Responsive Website',
      description: 'Modern responsive web design',
      searchQuery: 'responsive web design, website',
      subcategory: 'Websites',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 2,
      category: 'filter-web-dev filter-ecommerce',
      title: 'E-Commerce Platform',
      description: 'Complete online shopping solution',
      searchQuery: 'ecommerce website, online store',
      subcategory: 'E-Commerce',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 3,
      category: 'filter-web-dev filter-web-apps',
      title: 'Web Application',
      description: 'Full-stack web application',
      searchQuery: 'web application, dashboard, software',
      subcategory: 'Web Apps',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 4,
      category: 'filter-web-dev filter-websites',
      title: 'Portfolio Website',
      description: 'Professional portfolio design',
      searchQuery: 'portfolio website, creative web',
      subcategory: 'Websites',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 5,
      category: 'filter-web-dev filter-web-apps',
      title: 'SaaS Platform',
      description: 'Software as a Service application',
      searchQuery: 'saas platform, web application interface',
      subcategory: 'Web Apps',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 6,
      category: 'filter-web-dev filter-ecommerce',
      title: 'Mobile Commerce',
      description: 'Responsive e-commerce mobile site',
      searchQuery: 'mobile shopping, ecommerce app',
      subcategory: 'E-Commerce',
      detailsUrl: 'portfolio-details.html'
    }
  ],
  graphicDesign: [
    {
      id: 7,
      category: 'filter-graphic-design filter-logos',
      title: 'Brand Logo Design',
      description: 'Professional logo creation',
      searchQuery: 'logo design, brand identity',
      subcategory: 'Logos',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 8,
      category: 'filter-graphic-design filter-logos',
      title: 'Modern Logo',
      description: 'Contemporary brand identity',
      searchQuery: 'modern logo, graphic design',
      subcategory: 'Logos',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 9,
      category: 'filter-graphic-design filter-posters',
      title: 'Marketing Poster',
      description: 'Event promotion material',
      searchQuery: 'marketing poster, event design',
      subcategory: 'Posters',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 10,
      category: 'filter-graphic-design filter-posters',
      title: 'Campaign Poster',
      description: 'Advertising design poster',
      searchQuery: 'advertising poster, marketing campaign',
      subcategory: 'Posters',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 11,
      category: 'filter-graphic-design filter-video-editing',
      title: 'Video Intro',
      description: 'Professional video introduction',
      searchQuery: 'video production, motion graphics',
      subcategory: 'Video Editing',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 12,
      category: 'filter-graphic-design filter-video-editing',
      title: 'Video Outro',
      description: 'Professional video ending',
      searchQuery: 'video editing, motion design',
      subcategory: 'Video Editing',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 13,
      category: 'filter-graphic-design filter-thumbnails',
      title: 'YouTube Thumbnail',
      description: 'Eye-catching video thumbnail',
      searchQuery: 'youtube thumbnail, video cover',
      subcategory: 'Thumbnails',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 14,
      category: 'filter-graphic-design filter-thumbnails',
      title: 'Social Media Thumbnail',
      description: 'Engaging social media design',
      searchQuery: 'social media design, content thumbnail',
      subcategory: 'Thumbnails',
      detailsUrl: 'portfolio-details.html'
    }
  ],
  administration: [
    {
      id: 15,
      category: 'filter-admin',
      title: 'Inventory Management',
      description: 'Professional record keeping system',
      searchQuery: 'office administration, inventory system',
      subcategory: 'Admin',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 16,
      category: 'filter-admin',
      title: 'File Management',
      description: 'Organized filing and documentation',
      searchQuery: 'office management, file organization',
      subcategory: 'Admin',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 17,
      category: 'filter-admin',
      title: 'Office Suite Mastery',
      description: 'Microsoft Office expertise showcase',
      searchQuery: 'microsoft office, productivity',
      subcategory: 'Admin',
      detailsUrl: 'portfolio-details.html'
    },
    {
      id: 18,
      category: 'filter-admin',
      title: 'Data Organization',
      description: 'Professional data management',
      searchQuery: 'data management, office work',
      subcategory: 'Admin',
      detailsUrl: 'portfolio-details.html'
    }
  ]
};

/**
 * Fetch image from Unsplash or Pexels
 */
async function getPortfolioImage(searchQuery, itemId) {
  try {
    // Try Unsplash first
    if (UNSPLASH_ACCESS_KEY) {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&w=600&h=400&fit=crop&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        return {
          url: data.urls.regular,
          thumbUrl: data.urls.thumb,
          largeUrl: data.urls.full,
          photographer: data.user.name,
          photographerUrl: data.user.portfolio_url || data.links.html,
          attribution: data.links.html
        };
      }
    }

    // Fallback to Pexels
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (pexelsResponse.ok) {
      const pexelsData = await pexelsResponse.json();
      if (pexelsData.photos.length > 0) {
        const photo = pexelsData.photos[0];
        return {
          url: photo.src.medium,
          thumbUrl: photo.src.small,
          largeUrl: photo.src.large,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          attribution: photo.url
        };
      }
    }

    return generatePlaceholderImage(searchQuery, itemId);
  } catch (error) {
    console.error('Error fetching image:', error);
    return generatePlaceholderImage(searchQuery, itemId);
  }
}

/**
 * Generate placeholder with gradient
 */
function generatePlaceholderImage(searchQuery, itemId) {
  const colors = [
    'ff6b6b,ee5a6f,f23c3c',
    '4ecdc4,44a08d,95e1d3',
    '667eea,764ba2,f093fb',
    'f093fb,f5576c,4facfe',
    '43e97b,38f9d7,fa709a',
    'fe8c00,f07231,fec163'
  ];

  const colorSet = colors[itemId % colors.length];
  const term = encodeURIComponent(searchQuery.split(',')[0]);

  return {
    url: `https://via.placeholder.com/600x400?text=${term}`,
    thumbUrl: `https://via.placeholder.com/300x200?text=${term}`,
    largeUrl: `https://via.placeholder.com/1200x800?text=${term}`,
    photographer: 'Placeholder',
    photographerUrl: '#',
    attribution: '#'
  };
}

/**
 * Create portfolio item HTML
 */
function createPortfolioItem(item, imageData) {
  const categoryId = item.category.split(' ')[0].replace('filter-', '');
  const galleryId = `portfolio-gallery-${categoryId}`;

  return `
    <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${item.category}" data-aos="fade-up">
      <div class="portfolio-content h-100">
        <div class="portfolio-image-wrapper">
          <img 
            src="${imageData.thumbUrl}" 
            srcset="${imageData.thumbUrl} 300w, ${imageData.url} 600w, ${imageData.largeUrl} 1200w"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            class="img-fluid lazy-img" 
            alt="${item.title} - ${item.description}"
            loading="lazy"
            decoding="async">
        </div>
        
        <div class="portfolio-info">
          <span class="portfolio-category">${item.subcategory}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="portfolio-links">
            <a href="${imageData.largeUrl}" 
               title="${item.title}" 
               data-gallery="${galleryId}" 
               class="glightbox preview-link"
               data-glightbox="gallery:${galleryId}">
              <i class="bi bi-zoom-in"></i>
            </a>
            <a href="${item.detailsUrl}" 
               title="More Details" 
               class="details-link">
              <i class="bi bi-link-45deg"></i>
            </a>
          </div>
        </div>
        
        <div class="photo-credit">
          <a href="${imageData.photographerUrl}" 
             target="_blank" 
             rel="noopener noreferrer"
             style="color: #fff; text-decoration: none;">
            © ${imageData.photographer}
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Load all portfolio items
 */
async function loadPortfolioItems() {
  const container = document.getElementById('portfolio-container');

  if (!container) return;

  try {
    // Combine all portfolio data
    const allItems = [
      ...portfolioData.webDevelopment,
      ...portfolioData.graphicDesign,
      ...portfolioData.administration
    ];

    // Load images for all items
    const items = await Promise.all(
      allItems.map(async (item) => {
        const imageData = await getPortfolioImage(item.searchQuery, item.id);
        return createPortfolioItem(item, imageData);
      })
    );

    container.innerHTML = items.join('');

    // Initialize Isotope
    initializeIsotope();

    // Reinitialize GLightbox
    if (window.GLightbox) {
      GLightbox();
    }

    // Setup subcategory filters
    setupSubcategoryFilters();

  } catch (error) {
    console.error('Error loading portfolio:', error);
    container.innerHTML = '<div class="col-12 text-center text-danger"><p>Error loading portfolio. Please refresh.</p></div>';
  }
}

/**
 * Initialize Isotope layout
 */
function initializeIsotope() {
  const container = document.querySelector('.isotope-container');
  
  if (!container || !window.Isotope) return;

  const iso = new Isotope(container, {
    itemSelector: '.portfolio-item',
    layoutMode: 'masonry',
    masonry: {
      columnWidth: '.portfolio-item',
      percentPosition: true
    }
  });

  // Main filter buttons
  document.querySelectorAll('#main-filters li').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('#main-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      iso.arrange({ filter: filterValue });

      // Handle subcategory filter visibility
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
}

/**
 * Setup subcategory filters
 */
function setupSubcategoryFilters() {
  // Graphic Design subcategory filters
  document.querySelectorAll('#graphic-design-filters li').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('#graphic-design-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      const iso = Isotope.data(document.querySelector('.isotope-container'));
      iso.arrange({ filter: filterValue });
    });
  });

  // Web Development subcategory filters
  document.querySelectorAll('#web-dev-filters li').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('#web-dev-filters li').forEach(btn => {
        btn.classList.remove('filter-active');
      });
      this.classList.add('filter-active');

      const filterValue = this.getAttribute('data-filter');
      const iso = Isotope.data(document.querySelector('.isotope-container'));
      iso.arrange({ filter: filterValue });
    });
  });
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', loadPortfolioItems);