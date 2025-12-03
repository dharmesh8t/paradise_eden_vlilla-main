/**
 * SEO Optimization Module - Meta Tags and Structured Data Management
 * Features: Dynamic meta tags, schema.org structured data, Open Graph, JSON-LD
 */

class SEOOptimizer {
  constructor() {
    this.metaTags = {};
    this.init();
  }

  init() {
    this.setupDefaultTags();
  }

  setupDefaultTags() {
    // Default meta tags for Paradise Eden Villa
    this.metaTags = {
      title: 'Paradise Eden Villa - Luxury Resort in Pondicherry',
      description: 'Experience luxury at Paradise Eden Villa in Pondicherry. Book your stay for unforgettable vacations near Paradise Beach.',
      keywords: 'resort pondicherry, villa rental pondicherry, beach resort, luxury accommodation',
      canonical: window.location.href,
      ogTitle: 'Paradise Eden Villa - Luxury Resort',
      ogDescription: 'Discover your paradise at our luxury beach resort in Pondicherry',
      ogType: 'website',
      ogImage: '/assets/villa-og-image.jpg',
      ogUrl: window.location.href,
      twitterCard: 'summary_large_image',
      twitterTitle: 'Paradise Eden Villa',
      twitterDescription: 'Luxury resort in Pondicherry',
      twitterImage: '/assets/villa-twitter-image.jpg'
    };
  }

  setPageMeta(options) {
    // Update meta tags for specific pages
    const { title, description, keywords, type, image, url } = options;

    if (title) {
      this.setTitle(title);
      this.metaTags.title = title;
    }
    if (description) {
      this.setMetaTag('description', description);
      this.metaTags.description = description;
    }
    if (keywords) {
      this.setMetaTag('keywords', keywords);
      this.metaTags.keywords = keywords;
    }
    if (type) {
      this.metaTags.ogType = type;
    }
    if (image) {
      this.setMetaTag('og:image', image);
      this.metaTags.ogImage = image;
    }
    if (url) {
      this.setMetaTag('og:url', url);
      this.metaTags.ogUrl = url;
    }
  }

  setTitle(title) {
    document.title = title + ' | Paradise Eden Villa';
    this.setMetaTag('og:title', title);
    this.setMetaTag('twitter:title', title);
  }

  setMetaTag(name, content) {
    let metaTag = document.querySelector(`meta[name='${name}'], meta[property='${name}']`);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      // Determine if it's a property (for og: tags) or name attribute
      if (name.includes('og:') || name.includes('twitter:')) {
        metaTag.setAttribute('property', name);
      } else {
        metaTag.setAttribute('name', name);
      }
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }

  addStructuredData(data) {
    // Add JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  addHotelSchema() {
    const hotelSchema = {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      'name': 'Paradise Eden Villa',
      'description': 'Luxury beach resort in Pondicherry offering premium accommodation and amenities',
      'url': 'https://paradiseedenvillla.com',
      'telephone': '+91-9876543210',
      'email': 'info@paradiseedenvillla.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Paradise Beach, Pondicherry',
        'addressLocality': 'Pondicherry',
        'addressRegion': 'Puducherry',
        'postalCode': '605122',
        'addressCountry': 'IN'
      },
      'image': '/assets/villa-hero.jpg',
      'priceRange': '₹3500 - ₹15000',
      'rating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'reviewCount': '150'
      },
      'amenities': [
        'Free WiFi',
        'Swimming Pool',
        'Beach Access',
        'Restaurant',
        'Room Service',
        'Spa Services'
      ]
    };
    this.addStructuredData(hotelSchema);
  }

  addLocalBusinessSchema() {
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Paradise Eden Villa',
      'image': '/assets/logo.png',
      'description': 'Premier luxury resort and accommodation provider in Pondicherry',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Paradise Beach Road',
        'addressLocality': 'Pondicherry',
        'addressRegion': 'Puducherry',
        'postalCode': '605122',
        'addressCountry': 'IN'
      },
      'telephone': '+91-9876543210',
      'url': 'https://paradiseedenvillla.com',
      'sameAs': [
        'https://www.facebook.com/paradiseedenvillla',
        'https://www.instagram.com/paradiseedenvillla',
        'https://www.twitter.com/paradiseedenvillla'
      ]
    };
    this.addStructuredData(localBusinessSchema);
  }

  addBreadcrumbSchema(breadcrumbs) {
    // breadcrumbs format: [{name: 'Home', url: '/'}, {name: 'Rooms', url: '/rooms'}]
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': window.location.origin + crumb.url
      }))
    };
    this.addStructuredData(breadcrumbSchema);
  }

  optimizeForLocalSearch() {
    // Add location-specific keywords
    this.setMetaTag('geo.position', '12.0141° N, 79.8066° E'); // Pondicherry coordinates
    this.setMetaTag('ICBM', '12.0141, 79.8066');
    this.setMetaTag('geo.placename', 'Pondicherry, India');
    
    // Update keywords for local search
    const localKeywords = 'Pondicherry resort, villa rental Pondicherry, beach accommodation Puducherry, luxury stays Pondicherry';
    this.setMetaTag('keywords', localKeywords);
  }

  generateRobotsMeta() {
    this.setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  setCanonicalURL(url = null) {
    const canonicalURL = url || window.location.href;
    let link = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalURL;
  }

  addOpenGraphTags() {
    this.setMetaTag('og:type', this.metaTags.ogType);
    this.setMetaTag('og:title', this.metaTags.ogTitle);
    this.setMetaTag('og:description', this.metaTags.ogDescription);
    this.setMetaTag('og:image', this.metaTags.ogImage);
    this.setMetaTag('og:url', this.metaTags.ogUrl);
    this.setMetaTag('og:site_name', 'Paradise Eden Villa');
  }

  addTwitterCardTags() {
    this.setMetaTag('twitter:card', this.metaTags.twitterCard);
    this.setMetaTag('twitter:title', this.metaTags.twitterTitle);
    this.setMetaTag('twitter:description', this.metaTags.twitterDescription);
    this.setMetaTag('twitter:image', this.metaTags.twitterImage);
  }

  optimizePage(pageType, customOptions = {}) {
    // General optimization for all pages
    this.generateRobotsMeta();
    this.setCanonicalURL();
    this.addOpenGraphTags();
    this.addTwitterCardTags();
    this.optimizeForLocalSearch();

    // Page-specific optimization
    switch(pageType) {
      case 'home':
        this.setPageMeta({
          title: 'Paradise Eden Villa - Luxury Resort in Pondicherry',
          description: 'Experience luxury at Paradise Eden Villa. Book your beachfront villa in Pondicherry with stunning views and world-class amenities.'
        });
        this.addHotelSchema();
        this.addLocalBusinessSchema();
        break;
      case 'rooms':
        this.setPageMeta({
          title: 'Luxury Rooms & Villas - Paradise Eden Villa',
          description: 'Explore our collection of beautifully designed rooms and villas offering comfort and elegance.'
        });
        this.addHotelSchema();
        break;
      case 'booking':
        this.setPageMeta({
          title: 'Book Your Stay - Paradise Eden Villa',
          description: 'Secure your reservation at Paradise Eden Villa. Easy booking process with instant confirmation.'
        });
        break;
      default:
        if (customOptions.title) {
          this.setPageMeta(customOptions);
        }
    }
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOOptimizer;
}
