// The Kingsmen Barbers — Main JavaScript

// Booking app URL — update this when you have your own domain
var BOOKING_URL = 'https://thekingsmen-crm.fly.dev/#/app/book';
var APP_URL = 'https://thekingsmen-crm.fly.dev/#/app';
var API_BASE = 'https://thekingsmen-crm.fly.dev';

(function() {
  'use strict';

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Mobile menu toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');

      // Animate hamburger
      const spans = menuToggle.querySelectorAll('span');
      if (mobileNav.classList.contains('is-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        document.body.style.overflow = 'hidden';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        document.body.style.overflow = '';
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('is-open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Scroll reveal with IntersectionObserver ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeEls.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }

})();

// --- Dynamic barbers loader (about.html) ---
(function() {
  'use strict';

  var container = document.getElementById('team-dynamic');
  if (!container) return;

  // Show loading skeleton
  container.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;">Loading barbers…</p>';

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderStars(rating) {
    var num = parseFloat(rating) || 0;
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += '<span style="color:' + (i <= Math.round(num) ? 'var(--color-gold)' : 'rgba(191,155,81,0.2)') + ';font-size:0.85rem;">★</span>';
    }
    return html;
  }

  function renderWorkGallery(workImagesJson) {
    if (!workImagesJson) return '';
    var images;
    try { images = JSON.parse(workImagesJson); } catch(e) { return ''; }
    if (!images || !images.length) return '';
    var thumbs = images.slice(0, 6).map(function(src) {
      return '<img src="' + escapeHtml(src) + '" alt="Work" style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid rgba(191,155,81,0.2);">';
    }).join('');
    return '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:0.75rem;">' + thumbs + '</div>';
  }

  function buildBarberCard(barber) {
    var specialties = [];
    try { specialties = JSON.parse(barber.specialties || '[]') || []; } catch(e) {}

    var avatarHtml;
    if (barber.profileImage) {
      avatarHtml = '<img src="' + escapeHtml(barber.profileImage) + '" alt="' + escapeHtml(barber.firstName) + '" style="width:88px;height:88px;border-radius:50%;object-fit:cover;border:2px solid rgba(191,155,81,0.4);flex-shrink:0;">';
    } else {
      var initials = (barber.firstName || '').charAt(0) + (barber.lastName || '').charAt(0);
      avatarHtml = '<div style="width:88px;height:88px;border-radius:50%;background:rgba(191,155,81,0.15);border:2px solid rgba(191,155,81,0.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.5rem;font-weight:600;color:var(--color-gold);flex-shrink:0;">' + escapeHtml(initials) + '</div>';
    }

    var specialtyTags = specialties.map(function(sp) {
      return '<span style="display:inline-block;padding:2px 10px;border-radius:99px;border:1px solid rgba(191,155,81,0.3);color:rgba(191,155,81,0.8);font-size:0.7rem;font-family:var(--font-body);">' + escapeHtml(sp) + '</span>';
    }).join('');

    var bioHtml = barber.bio
      ? '<p style="color:rgba(255,255,255,0.6);font-size:0.875rem;line-height:1.65;margin:0.75rem 0 0;">' + escapeHtml(barber.bio) + '</p>'
      : '';

    var hobbiesHtml = barber.hobbies
      ? '<p style="color:rgba(191,155,81,0.6);font-size:0.75rem;margin:0.5rem 0 0;"><em>Interests: ' + escapeHtml(barber.hobbies) + '</em></p>'
      : '';

    var ratingHtml = barber.avgRating
      ? '<div style="display:flex;align-items:center;gap:4px;margin-top:4px;">' + renderStars(barber.avgRating) + '<span style="color:rgba(255,255,255,0.35);font-size:0.75rem;margin-left:4px;">' + parseFloat(barber.avgRating).toFixed(1) + '</span></div>'
      : '';

    var galleryHtml = renderWorkGallery(barber.workImages);

    var bookHref = BOOKING_URL;

    return [
      '<div class="value-card" style="text-align:left;position:relative;">',
        '<div style="display:flex;align-items:flex-start;gap:1.25rem;">',
          avatarHtml,
          '<div style="flex:1;min-width:0;">',
            '<h3 class="value-card__title" style="margin-bottom:2px;">' + escapeHtml(barber.firstName) + ' ' + escapeHtml(barber.lastName) + '</h3>',
            '<p style="color:var(--color-gold);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;font-family:var(--font-body);margin:0;">' + escapeHtml(barber.rank) + '</p>',
            ratingHtml,
          '</div>',
        '</div>',
        bioHtml,
        hobbiesHtml,
        specialtyTags ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:0.875rem;">' + specialtyTags + '</div>' : '',
        galleryHtml,
        '<a href="' + escapeHtml(bookHref) + '" target="_blank" rel="noopener" class="btn-outline" style="display:inline-flex;align-items:center;gap:6px;margin-top:1.25rem;font-size:0.8rem;padding:0.5rem 1.25rem;">',
          'Book an Appointment',
        '</a>',
      '</div>'
    ].join('');
  }

  fetch(API_BASE + '/api/public/staff')
    .then(function(res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(function(staff) {
      // Server already filters to active staff only — no client-side filter needed
      if (!staff.length) {
        container.innerHTML = '';
        return;
      }
      container.innerHTML = '<div class="about-values">' + staff.map(buildBarberCard).join('') + '</div>';
      // Trigger fade-in observer for the new elements
      var newEls = container.querySelectorAll('.value-card');
      newEls.forEach(function(el) {
        el.classList.add('fade-in');
        setTimeout(function() { el.classList.add('is-visible'); }, 50);
      });
    })
    .catch(function() {
      container.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;">Could not load barber profiles. Please visit us to meet the team.</p>';
    });

})();

// --- Dynamic services loader ---
(function() {
  'use strict';

  // Map API category names to tbody IDs and their parent section IDs
  var CATEGORY_MAP = {
    'Cuts & Trims':          { tbodyId: 'services-cuts',       sectionId: 'cuts' },
    'Hair':                  { tbodyId: 'services-cuts',       sectionId: 'cuts' },
    'Beard & Shave':         { tbodyId: 'services-beard',      sectionId: 'beard' },
    'Shave':                 { tbodyId: 'services-beard',      sectionId: 'beard' },
    'Grooming':              { tbodyId: 'services-grooming',   sectionId: 'grooming' },
    'Wellness':              { tbodyId: 'services-grooming',   sectionId: 'grooming' },
    'Premium Experiences':   { tbodyId: 'services-premium',    sectionId: 'signature' },
    'Signature Experiences': { tbodyId: 'services-premium',    sectionId: 'signature' },
    'Hands & Feet':          { tbodyId: 'services-hands',      sectionId: 'hands' },
    'Concierge':             { tbodyId: 'services-concierge',  sectionId: 'concierge' }
  };

  // Show loading state in all service tbodies
  function showLoadingState() {
    var tbodyIds = ['services-cuts', 'services-beard', 'services-grooming', 'services-premium', 'services-hands', 'services-concierge'];
    tbodyIds.forEach(function(id) {
      var tbody = document.getElementById(id);
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:1.5rem;opacity:0.6;">Loading services…</td></tr>';
      }
    });
  }

  // Show fallback error message in a tbody
  function showFallback(tbody) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:1.5rem;opacity:0.7;">Services are currently being updated. Please call for pricing.</td></tr>';
  }

  // Build a single table row from a service object
  function buildRow(service) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' +
        '<span class="service-name">' + escapeHtml(service.name) + '</span>' +
        '<span class="service-duration">' + service.duration + ' minutes</span>' +
      '</td>' +
      '<td class="price-cell" data-label="Senior Stylist">£' + service.priceSenior + '</td>' +
      '<td class="price-cell" data-label="Master Barber">£' + service.priceMaster + '</td>' +
      '<td class="price-cell" data-label="Director">£' + service.priceDirector + '</td>';
    return tr;
  }

  // Simple HTML escaping
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Populate the services tables from API data
  function populateServices(services) {
    // Group active services by their mapped tbody
    var grouped = {};
    services.forEach(function(service) {
      if (!service.isActive) return;
      var mapping = CATEGORY_MAP[service.category];
      if (!mapping) return;
      var id = mapping.tbodyId;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(service);
    });

    // For each known tbody, populate or hide section
    var allMappings = {
      'services-cuts':       'cuts',
      'services-beard':      'beard',
      'services-grooming':   'grooming',
      'services-premium':    'signature',
      'services-hands':      'hands',
      'services-concierge':  'concierge'
    };

    Object.keys(allMappings).forEach(function(tbodyId) {
      var sectionId = allMappings[tbodyId];
      var tbody = document.getElementById(tbodyId);
      var section = document.getElementById(sectionId);
      if (!tbody) return;

      var items = grouped[tbodyId];
      if (!items || items.length === 0) {
        // No active services for this category — hide the section
        if (section) section.style.display = 'none';
        return;
      }

      tbody.innerHTML = '';
      items.forEach(function(service) {
        tbody.appendChild(buildRow(service));
      });
    });
  }

  // Only run on the services page
  if (!document.getElementById('services-cuts')) return;

  showLoadingState();

  fetch(API_BASE + '/api/public/services')
    .then(function(response) {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(function(data) {
      populateServices(data);
    })
    .catch(function() {
      // CRM offline — show fallback in all tbodies
      var tbodyIds = ['services-cuts', 'services-beard', 'services-grooming', 'services-premium', 'services-hands', 'services-concierge'];
      tbodyIds.forEach(function(id) {
        var tbody = document.getElementById(id);
        if (tbody) showFallback(tbody);
      });
    });

})();

// ── Dynamic Gallery Loader ────────────────────────────────────────────────
(function () {
  'use strict';

  var container = document.getElementById('gallery-dynamic');
  var filtersBar = document.getElementById('gallery-filters');
  if (!container) return;

  var currentFilter = 'all';
  var allImages = []; // populated from API

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatCategory(cat) {
    var map = { Cuts: 'Cuts', Beard: 'Beard', Shave: 'Shave', Interior: 'Interior', Products: 'Products' };
    return map[cat] || cat;
  }

  function buildGalleryItem(img, index) {
    // Alternate wide/tall for visual rhythm when showing dynamic images
    var modClass = '';
    if (index === 0) modClass = ' gallery-grid__item--wide';
    else if (index === 3) modClass = ' gallery-grid__item--tall';
    else if (index === 6) modClass = ' gallery-grid__item--wide';

    return (
      '<div class="gallery-grid__item' + modClass + '" data-category="' + escapeHtml(img.category) + '" onclick="openLightbox(this)">' +
        '<img src="' + escapeHtml(img.src) + '" alt="' + escapeHtml(img.caption || 'Gallery image') + '" loading="lazy">' +
        (img.caption
          ? '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(10,14,23,0.85));padding:0.75rem;font-size:0.75rem;color:rgba(255,255,255,0.85);font-family:var(--font-body);opacity:0;transition:opacity 0.2s;pointer-events:none;" class="gallery-caption">' + escapeHtml(img.caption) + '</div>'
          : '') +
      '</div>'
    );
  }

  function applyFilter(filter) {
    currentFilter = filter;

    // Update active pill
    if (filtersBar) {
      filtersBar.querySelectorAll('.gallery-filter').forEach(function (btn) {
        btn.classList.toggle('gallery-filter--active', btn.getAttribute('data-filter') === filter);
      });
    }

    // Filter rendered items
    container.querySelectorAll('.gallery-grid__item').forEach(function (item) {
      var cat = item.getAttribute('data-category');
      item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
  }

  function setupFilterPills() {
    if (!filtersBar) return;

    // Only show filter pills if we have dynamic images with categories
    var categories = [];
    allImages.forEach(function (img) {
      if (img.category && categories.indexOf(img.category) === -1) categories.push(img.category);
    });

    if (categories.length > 1) {
      // Show/rebuild pills for the categories that are actually present
      filtersBar.style.display = 'flex';
      filtersBar.innerHTML = '<button class="gallery-filter gallery-filter--active" data-filter="all">All</button>';
      categories.forEach(function (cat) {
        filtersBar.innerHTML += '<button class="gallery-filter" data-filter="' + escapeHtml(cat) + '">' + escapeHtml(formatCategory(cat)) + '</button>';
      });
      filtersBar.querySelectorAll('.gallery-filter').forEach(function (btn) {
        btn.addEventListener('click', function () { applyFilter(btn.getAttribute('data-filter')); });
      });
    }
  }

  function renderDynamicImages(images) {
    // Remove fallback static items
    container.querySelectorAll('[data-fallback="true"]').forEach(function (el) { el.remove(); });

    // Sort by sortOrder
    var sorted = images.slice().sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });
    allImages = sorted;

    // Render
    var html = sorted.map(buildGalleryItem).join('');
    container.insertAdjacentHTML('beforeend', html);

    // Hover effect for captions
    container.querySelectorAll('.gallery-grid__item').forEach(function (item) {
      var caption = item.querySelector('.gallery-caption');
      if (!caption) return;
      item.addEventListener('mouseenter', function () { caption.style.opacity = '1'; });
      item.addEventListener('mouseleave', function () { caption.style.opacity = '0'; });
    });

    // Set data-category on items for filtering
    container.querySelectorAll('.gallery-grid__item').forEach(function (item, i) {
      if (sorted[i]) item.setAttribute('data-category', sorted[i].category || '');
    });

    setupFilterPills();

    // Trigger fade-in
    setTimeout(function () { container.classList.add('is-visible'); }, 50);
  }

  fetch(API_BASE + '/api/public/gallery')
    .then(function (res) {
      if (!res.ok) throw new Error('API unavailable');
      return res.json();
    })
    .then(function (data) {
      if (!data || !data.length) {
        // No images from API — keep fallback static content visible
        container.classList.add('is-visible');
        return;
      }
      renderDynamicImages(data);
    })
    .catch(function () {
      // API offline — static fallback stays visible
      container.classList.add('is-visible');
    });

})();

// ── Dynamic Contact Loader ────────────────────────────────────────────────
(function () {
  'use strict';

  if (!document.getElementById('contact-dynamic')) return;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTime(timeStr) {
    // Converts "07:00-20:00" to "7:00 AM – 8:00 PM"
    if (!timeStr || timeStr === 'closed') return 'Closed';
    var parts = timeStr.split('-');
    if (parts.length < 2) return timeStr;
    function to12h(t) {
      var s = t.split(':');
      var h = parseInt(s[0], 10);
      var m = s[1] || '00';
      var ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return h + ':' + m + '\u00a0' + ampm;
    }
    return to12h(parts[0]) + ' \u2013 ' + to12h(parts[1]);
  }

  function populateHoursTable(hours) {
    var table = document.getElementById('contact-hours-table');
    if (!table || !hours) return;

    var monFri = formatTime(hours.monFri || hours.mon_fri);
    var sat = formatTime(hours.saturday);
    var sun = formatTime(hours.sunday);
    var isSunClosed = !hours.sunday || hours.sunday === 'closed';
    var isSatClosed = !hours.saturday || hours.saturday === 'closed';

    table.innerHTML =
      '<tr><td>Monday</td><td>' + monFri + '</td></tr>' +
      '<tr><td>Tuesday</td><td>' + monFri + '</td></tr>' +
      '<tr><td>Wednesday</td><td>' + monFri + '</td></tr>' +
      '<tr><td>Thursday</td><td>' + monFri + '</td></tr>' +
      '<tr><td>Friday</td><td>' + monFri + '</td></tr>' +
      '<tr><td>Saturday</td><td' + (isSatClosed ? ' class="closed"' : '') + '>' + sat + '</td></tr>' +
      '<tr><td>Sunday</td><td' + (isSunClosed ? ' class="closed"' : '') + '>' + sun + '</td></tr>';
  }

  function populateSocialLinks(social) {
    var block = document.getElementById('contact-social-block');
    var linksDiv = document.getElementById('contact-social-links');
    if (!block || !linksDiv || !social) return;

    var socialDefs = [
      { key: 'facebook', label: 'Facebook', icon: 'f', color: '#1877f2' },
      { key: 'instagram', label: 'Instagram', icon: '📸', color: '#e1306c' },
      { key: 'x', label: 'X', icon: '✕', color: '#ffffff' },
      { key: 'tiktok', label: 'TikTok', icon: '♪', color: '#ffffff' },
    ];

    var links = socialDefs.filter(function (d) { return social[d.key]; });
    if (!links.length) return;

    linksDiv.innerHTML = links.map(function (d) {
      return '<a href="' + escapeHtml(social[d.key]) + '" target="_blank" rel="noopener noreferrer" ' +
        'style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:1px solid var(--color-border);border-radius:99px;font-family:var(--font-body);font-size:0.8rem;color:var(--color-text-muted);text-decoration:none;transition:all 0.2s;" ' +
        'onmouseover="this.style.borderColor=\'var(--color-gold)\';this.style.color=\'var(--color-gold)\'" ' +
        'onmouseout="this.style.borderColor=\'var(--color-border)\';this.style.color=\'var(--color-text-muted)\'">' +
        '<span style="font-size:0.9rem;">' + d.icon + '</span>' +
        d.label +
      '</a>';
    }).join('');

    block.style.display = '';
  }

  fetch(API_BASE + '/api/public/contact')
    .then(function (res) {
      if (!res.ok) throw new Error('API unavailable');
      return res.json();
    })
    .then(function (data) {
      if (!data) return;

      // Address
      if (data.address) {
        var addrEl = document.getElementById('contact-address');
        if (addrEl) addrEl.innerHTML = escapeHtml(data.address).replace(/\n/g, '<br>');
      }

      // Phone
      if (data.phone) {
        var phoneEl = document.getElementById('contact-phone');
        var phoneRaw = data.phone.replace(/\s/g, '');
        if (phoneEl) phoneEl.innerHTML = '<a href="tel:' + escapeHtml(phoneRaw) + '">' + escapeHtml(data.phone) + '</a>';
      }

      // Email
      if (data.email) {
        var emailEl = document.getElementById('contact-email');
        if (emailEl) emailEl.innerHTML = '<a href="mailto:' + escapeHtml(data.email) + '">' + escapeHtml(data.email) + '</a>';
      }

      // Hours
      if (data.hours) {
        populateHoursTable(data.hours);
      }

      // Map embed URL
      if (data.mapEmbedUrl) {
        var iframe = document.getElementById('contact-map-iframe');
        if (iframe) iframe.src = data.mapEmbedUrl;
      }

      // Social links
      if (data.social) {
        populateSocialLinks(data.social);
      }
    })
    .catch(function () {
      // API offline — static fallback content remains
    });

})();

// ── Booking Widget ────────────────────────────────────────────────────────
