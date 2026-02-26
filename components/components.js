// Inject loader only on index page
if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    loadLoader();
}

// Load and inject header and footer components
document.addEventListener('DOMContentLoaded', function() {
    setupScrollAnimations();
    loadHeader();
    loadFooter();
    loadAccessibilityScript();
    setYear();
    setupMobileDropdown();
    setupFAQAccordion();
    injectFAQSchema();
    injectSEOSchema();
    setupShrinkHeader();
    setupBackToTop();
});

function setupBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
}

function setActiveNavLink() {
    const path = window.location.pathname;
    const current = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === current || (current === '' && href === 'index.html'))) {
            link.classList.add('nav-active');
        }
    });
}

function setupShrinkHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const topbar = document.querySelector('.topbar');
        if (!header) return;
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
            header.style.top = '0';
            if (topbar) topbar.classList.add('hidden');
        } else {
            header.classList.remove('scrolled');
            header.style.top = '36px';
            if (topbar) topbar.classList.remove('hidden');
        }
    }, { passive: true });
}

function setupScrollAnimations() {
    const autoFadeSelectors = [
        '.service-card',
        '.service-card-detail',
        '.testimonial-card',
        '.work-step',
        '.project-card',
        '.faq-item',
        '.why-card',
        '.capability-card',
        '.process-step',
        '.about-content',
        '.services-link',
        '.about-link',
        '.testimonials-link',
        '.how-we-work-link'
    ];

    const allElements = [];
    autoFadeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => allElements.push(el));
    });

    allElements.forEach(el => el.classList.add('fade-in-on-scroll'));

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function initObserver() {
        const rows = {};
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('fade-in-visible');
            } else {
                const rowKey = Math.round(rect.top / 20) * 20;
                if (!rows[rowKey]) rows[rowKey] = [];
                rows[rowKey].push(el);
                observer.observe(el);
            }
        });
        Object.values(rows).forEach(row => {
            row.forEach((el, i) => {
                el.style.animationDelay = (i * 0.12) + 's';
            });
        });
    }

    if (document.readyState === 'complete') {
        initObserver();
    } else {
        window.addEventListener('load', initObserver);
    }
}

function loadHeader() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            } else {
                document.body.insertAdjacentHTML('afterbegin', data);
            }
            setupShrinkHeader();
            setActiveNavLink();
        })
        .catch(error => console.error('Error loading header:', error));
}

function buildServiceSchemas(providerId) {
    const services = [
        {
            name: "Concrete Construction",
            description: "Professional concrete construction: foundations, flatwork, slabs, pads, repairs for residential and commercial projects in Northern Virginia.",
            areaServed: ["Northern Virginia", "Loudoun County", "Fairfax County"],
            keywords: "concrete construction, foundations, flatwork, concrete slabs, concrete pads",
            priceRange: "$$",
            availability: "Available"
        },
        {
            name: "Specialty Concrete & Sport Courts",
            description: "Custom concrete surfaces for sport courts, recreational areas, and specialty installations with professional finishing.",
            areaServed: ["Northern Virginia"],
            keywords: "sport courts, specialty concrete, recreational surfaces, tennis courts",
            priceRange: "$$$",
            availability: "Available"
        },
        {
            name: "Site & Property Services",
            description: "Site preparation, access areas, equipment pads, grading, and property support for residential and commercial clients.",
            areaServed: ["Northern Virginia", "Loudoun County"],
            keywords: "site preparation, site services, equipment pads, property services",
            priceRange: "$$",
            availability: "Available"
        },
        {
            name: "Snow Removal & Facility Support",
            description: "Emergency snow removal and ice management with seasonal contracts and 24/7 response for residential and commercial properties.",
            areaServed: ["Northern Virginia", "Loudoun County", "Prince William County", "Fairfax County"],
            keywords: "snow removal, ice management, snow removal services, snow removal contracts, emergency snow removal",
            priceRange: "$$",
            availability: "Seasonal (November-March)",
            offers: [
                { name: "Emergency Snow Removal", price: "Call for quote" },
                { name: "Seasonal Snow Removal Contracts", price: "Call for quote" },
                { name: "Ice Management & De-icing", price: "Call for quote" }
            ]
        },
        {
            name: "Data Center Concrete & Site Services",
            description: "Specialized concrete and site services for data center campuses: equipment pads, foundations, demolition, and precision work.",
            areaServed: ["Northern Virginia", "Loudoun County", "Prince William County"],
            keywords: "data center concrete, critical facility services, data center site services, controlled-access facilities",
            priceRange: "$$$",
            availability: "Available",
            specialization: "Mission-critical facilities, 24/7 coordination, precision tolerances"
        }
    ];

    return services.map(service => {
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.description,
            provider: {
                "@id": providerId
            },
            areaServed: service.areaServed.map(area => ({
                "@type": "City",
                name: area
            })),
            keywords: service.keywords,
            priceRange: service.priceRange,
            availability: service.availability
        };

        // Add offers if available
        if (service.offers) {
            baseSchema.offers = service.offers.map(offer => ({
                "@type": "Offer",
                name: offer.name,
                price: offer.price,
                priceCurrency: "USD"
            }));
        }

        // Add specialization for data center services
        if (service.specialization) {
            baseSchema.specialization = service.specialization;
        }

        return baseSchema;
    });
}

function buildReviewSchemas() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    return Array.from(testimonialCards).map(card => {
        const quote = card.querySelector('.testimonial-text');
        const author = card.querySelector('.testimonial-author');
        const source = card.querySelector('.testimonial-source');
        const ratingElement = card.querySelector('.testimonial-stars');

        if (!quote || !author || !ratingElement) {
            return null;
        }

        const ratingValue = (ratingElement.textContent.match(/★/g) || []).length || 5;

        return {
            "@type": "Review",
            reviewBody: quote.textContent.trim(),
            author: {
                "@type": "Person",
                name: author.textContent.replace(source ? source.textContent : '', '').trim()
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue,
                bestRating: 5,
                worstRating: 1
            },
            publisher: source ? {
                "@type": "Organization",
                name: source.textContent.replace('•', '').trim()
            } : undefined
        };
    }).filter(Boolean);
}

function injectSEOSchema() {
    const schemaScriptId = 'seo-schema';
    const existingScript = document.getElementById(schemaScriptId);
    if (existingScript) {
        existingScript.remove();
    }

    const baseUrl = window.location.origin || 'https://www.rickyhorseman.com';
    const orgId = `${baseUrl}#organization`;
    const businessId = `${baseUrl}#business`;
    const personId = `${baseUrl}#founder`;
    const logoUrl = `${baseUrl}/Assets/logo%20just%20icon.png`;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": orgId,
        name: "Ricky Horseman Companies",
        url: baseUrl,
        logo: logoUrl,
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+1-000-000-0000",
            areaServed: "US"
        }
    };

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": businessId,
        name: "Ricky Horseman Companies",
        image: logoUrl,
        url: baseUrl,
        telephone: "+1-703-737-0713",
        email: "info@rickyhorseman.com",
        description: "Professional concrete construction, snow removal services, and data center site services for Northern Virginia. Specializing in concrete foundations, flatwork, snow removal contracts, and critical facility support.",
        address: {
            "@type": "PostalAddress",
            streetAddress: "318 South St SE",
            addressLocality: "Leesburg",
            addressRegion: "VA",
            postalCode: "20175",
            addressCountry: "US"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 38.9818,
            longitude: -77.6219
        },
        areaServed: [
            "Leesburg",
            "Ashburn",
            "Purcellville",
            "Hamilton",
            "Lovettsville",
            "Loudoun County",
            "Prince William County",
            "Fairfax County",
            "Northern Virginia"
        ],
        priceRange: "$$",
        knowsAbout: [
            "Concrete Construction",
            "Snow Removal Services",
            "Data Center Concrete",
            "Site Preparation",
            "Ice Management",
            "Specialty Concrete"
        ],
        sameAs: []
    };

    const reviews = buildReviewSchemas();
    if (reviews.length) {
        localBusinessSchema.review = reviews;
    }

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Ricky Horseman Companies",
        url: baseUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": personId,
        name: "Ricky Horseman",
        jobTitle: "President",
        worksFor: {
            "@id": orgId
        },
        image: `${baseUrl}/Assets/ricky.png`,
        email: "info@rickyhorseman.com",
        telephone: "+1-703-737-0713",
        sameAs: []
    };

    const serviceSchemas = buildServiceSchemas(businessId);

    const breadcrumbItems = Array.from(document.querySelectorAll('.header-nav a, .header-content a')).map((link, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: link.textContent.trim(),
        item: link.href
    })).filter(item => item.name);

    const breadcrumbSchema = breadcrumbItems.length ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems
    } : null;

    // Add AggregateRating schema from testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const ratings = Array.from(testimonialCards).map(card => {
        const starsElement = card.querySelector('.testimonial-stars');
        if (starsElement) {
            const starCount = (starsElement.textContent.match(/★/g) || []).length;
            return starCount;
        }
        return null;
    }).filter(Boolean);

    const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : null;

    const aggregateRatingSchema = averageRating ? {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        "@id": `${baseUrl}#aggregate-rating`,
        ratingValue: averageRating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: ratings.length,
        reviewCount: ratings.length
    } : null;

    // Add ProfessionalService schema for concrete/construction
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Ricky Horseman Companies",
        description: "Professional concrete construction, snow removal services, and data center site services",
        url: baseUrl,
        telephone: "+1-703-737-0713",
        email: "info@rickyhorseman.com",
        address: {
            "@type": "PostalAddress",
            streetAddress: "318 South St SE",
            addressLocality: "Leesburg",
            addressRegion: "VA",
            postalCode: "20175",
            addressCountry: "US"
        },
        areaServed: [
            "Leesburg, VA",
            "Ashburn, VA",
            "Purcellville, VA",
            "Loudoun County, VA",
            "Prince William County, VA",
            "Northern Virginia"
        ],
        priceRange: "$$",
        knowsAbout: [
            "Concrete Construction",
            "Snow Removal",
            "Data Center Services",
            "Site Preparation",
            "Ice Management"
        ]
    };

    // Add ImageObject schema for hero images
    const imageSchema = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        url: `${baseUrl}/Assets/logo%20just%20icon.png`,
        name: "Ricky Horseman Companies Logo",
        description: "Logo for Ricky Horseman Companies - concrete construction and snow removal services"
    };

    // Add CreativeWork schema for company description
    const creativeWorkSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "Ricky Horseman Companies",
        description: "Professional concrete construction, snow removal services, and data center site services for Northern Virginia. Over 30 years of experience serving Leesburg, Ashburn, Loudoun County, and surrounding areas.",
        author: {
            "@type": "Person",
            name: "Ricky Horseman"
        },
        datePublished: "1991-01-01",
        inLanguage: "en-US"
    };

    // Add ContactPoint schema for multiple contact methods
    const contactPointSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPoint",
        contactType: "Customer Service",
        telephone: "+1-703-737-0713",
        email: "info@rickyhorseman.com",
        areaServed: "Northern Virginia",
        availableLanguage: "en"
    };

    // Add location-specific service schemas for major service areas
    const locationServices = [
        {
            location: "Leesburg, VA",
            coords: { lat: 39.1166, lng: -77.5755 }
        },
        {
            location: "Ashburn, VA",
            coords: { lat: 39.0438, lng: -77.4874 }
        },
        {
            location: "Loudoun County, VA",
            coords: { lat: 39.1, lng: -77.7 }
        }
    ];

    const locationSchemas = locationServices.map(loc => ({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `Ricky Horseman Companies - ${loc.location}`,
        description: `Concrete construction, snow removal, and data center services in ${loc.location}`,
        address: {
            "@type": "PostalAddress",
            streetAddress: "318 South St SE",
            addressLocality: loc.location.split(",")[0],
            addressRegion: "VA",
            addressCountry: "US"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: loc.coords.lat,
            longitude: loc.coords.lng
        },
        telephone: "+1-703-737-0713",
        email: "info@rickyhorseman.com",
        url: baseUrl,
        areaServed: loc.location
    }));

    // Add Thing schema for specializations
    const dataCenterSpecializationSchema = {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "Data Center Concrete Specialization",
        description: "Specialized concrete services for mission-critical data center facilities with 24/7 coordination, precision tolerances, and equipment pad installation",
        sameAs: `${baseUrl}/data-centers.html`
    };

    const snowRemovalSpecializationSchema = {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "Snow Removal & Ice Management Specialization",
        description: "Professional emergency snow removal and ice management services with seasonal contracts and 24/7 response capability",
        sameAs: `${baseUrl}/seasonal-facility-support.html`
    };

    const schemaGraph = [
        organizationSchema, 
        localBusinessSchema, 
        personSchema, 
        websiteSchema, 
        professionalServiceSchema,
        imageSchema,
        creativeWorkSchema,
        contactPointSchema,
        dataCenterSpecializationSchema,
        snowRemovalSpecializationSchema,
        ...serviceSchemas,
        ...locationSchemas
    ];

    if (breadcrumbSchema) {
        schemaGraph.push(breadcrumbSchema);
    }

    if (aggregateRatingSchema) {
        schemaGraph.push(aggregateRatingSchema);
    }

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaScriptId;
    schemaScript.text = JSON.stringify(schemaGraph);
    document.head.appendChild(schemaScript);
}

function loadLoader() {
    // Only inject if not already present
    if (document.getElementById('loader-wrapper')) {
        return;
    }

    fetch('components/loader.html')
        .then(response => response.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;

            const loaderWrapper = temp.querySelector('#loader-wrapper');
            const styles = temp.querySelectorAll('style');

            if (loaderWrapper) {
                styles.forEach(style => {
                    document.head.appendChild(style.cloneNode(true));
                });

                document.body.insertAdjacentElement('afterbegin', loaderWrapper);

                const scripts = temp.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                });
            }
        })
        .catch(error => console.warn('Loader injection failed:', error));
}

function loadFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            } else {
                // If no placeholder, append to body
                document.body.insertAdjacentHTML('beforeend', data);
            }
            setYear();
        })
        .catch(error => console.error('Error loading footer:', error));
}

function loadAccessibilityScript() {
    const script = document.createElement('script');
    script.src = 'components/accessibility.js';
    script.async = true;
    document.head.appendChild(script);
}

function setYear() {
    const yearElements = document.querySelectorAll('#year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

function setupMobileDropdown() {
    // Wait a bit for header to be loaded
    setTimeout(() => {
        const navDropdowns = document.querySelectorAll('.nav-dropdown');
        navDropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    // Check if we're on mobile (menu-toggle exists and is checked)
                    const menuToggle = document.getElementById('menu-toggle');
                    if (menuToggle && window.innerWidth < 1400) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    }, 100);
}

function setupFAQAccordion() {
    document.addEventListener('click', function(e) {
        const toggle = e.target.closest('.faq-toggle');
        if (!toggle) return;

        e.preventDefault();
        e.stopPropagation();

        const faqItem = toggle.closest('.faq-item');
        if (!faqItem) return;

        const faqList = faqItem.closest('.faq-list');
        const isActive = faqItem.classList.contains('active');

        const scope = faqList ? faqList.querySelectorAll('.faq-item') : document.querySelectorAll('.faq-item');
        scope.forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        if (isActive) {
            faqItem.classList.remove('active');
        } else {
            faqItem.classList.add('active');
        }
    }, true);
}

function injectFAQSchema() {
    const faqItems = Array.from(document.querySelectorAll('.faq-item'));
    if (!faqItems.length) {
        return;
    }

    const mainEntity = faqItems.map(item => {
        const questionElement = item.querySelector('.faq-question');
        const answerElement = item.querySelector('.faq-answer');

        if (!questionElement || !answerElement) {
            return null;
        }

        return {
            "@type": "Question",
            name: questionElement.textContent.trim(),
            acceptedAnswer: {
                "@type": "Answer",
                text: answerElement.textContent.trim()
            }
        };
    }).filter(Boolean);

    if (!mainEntity.length) {
        return;
    }

    const schemaScriptId = 'faq-schema';
    const existingScript = document.getElementById(schemaScriptId);
    if (existingScript) {
        existingScript.remove();
    }

    const baseUrl = window.location.origin || 'https://www.rickyhorseman.com';
    const faqPageSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: mainEntity,
        url: baseUrl + '/faq.html',
        name: "Frequently Asked Questions - Ricky Horseman Companies",
        description: "Common questions about concrete construction, snow removal services, and data center site services in Northern Virginia"
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaScriptId;
    schemaScript.text = JSON.stringify(faqPageSchema);

    document.head.appendChild(schemaScript);
}
