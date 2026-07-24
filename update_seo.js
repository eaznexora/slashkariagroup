const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const files = [
    'index.html', 'about.html', 'projects.html', 'blog.html', 
    'blog-view.html', 'contact.html', 'careers.html', 'privacy.html', 'terms.html'
];

function getTitle(html) {
    const match = html.match(/<title>([^<]*)<\/title>/i);
    return match ? match[1].trim() : 'S. Lashkaria Group | Premium Real Estate Mumbai';
}

function getDescription(html) {
    const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    return match ? match[1].trim() : 'Premium Real Estate in Mumbai by S. Lashkaria Group.';
}

function processHTML(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    // 1. SEO & META TAGS & JSON-LD SCHEMA OVERHAUL
    const title = getTitle(html);
    const description = getDescription(html);
    const pageName = file.replace('.html', '');
    const canonicalFilename = file === 'index.html' ? '' : file; // e.g. https://slashkariagroup.com/ or https://slashkariagroup.com/about.html
    const pageUrl = `https://slashkariagroup.com/${canonicalFilename}`;

    // Remove existing canonical, keywords, OG, twitter if any (to be safe, though they are missing)
    html = html.replace(/<link\s+rel="canonical"[^>]*>\n?/gi, '');
    html = html.replace(/<meta\s+name="keywords"[^>]*>\n?/gi, '');
    html = html.replace(/<meta\s+property="og:[^>]*>\n?/gi, '');
    html = html.replace(/<meta\s+name="twitter:[^>]*>\n?/gi, '');
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/gi, '');

    const seoTags = `
    <link rel="canonical" href="${pageUrl}">
    <meta name="keywords" content="Lashkaria, S Lashkaria Group, Lashkaria Developers, Real Estate Mumbai, Luxury Apartments Andheri, S. Lashkaria">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://slashkariagroup.com/assets/logo/logo-footer.svg">
    <meta property="og:url" content="${pageUrl}">
    <meta name="twitter:card" content="summary_large_image">`;

    let schemaTag = '';
    if (file === 'index.html' || file === 'about.html') {
        schemaTag = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "S. Lashkaria Group",
      "alternateName": ["Lashkaria", "Lashkaria Group", "S Lashkaria"],
      "url": "https://slashkariagroup.com/",
      "logo": "https://slashkariagroup.com/assets/logo/logo-footer.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9876543210",
        "contactType": "customer service"
      }
    }
    </script>`;
    } else if (file === 'projects.html') {
        schemaTag = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "S. Lashkaria Group",
      "url": "https://slashkariagroup.com/projects.html",
      "image": "https://slashkariagroup.com/assets/logo/logo-footer.svg",
      "description": "Premium luxury residential apartments in Mumbai."
    }
    </script>`;
    } else if (file === 'blog.html' || file === 'blog-view.html') {
        schemaTag = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "S. Lashkaria Group Insights",
      "url": "https://slashkariagroup.com/blog.html"
    }
    </script>`;
    } else if (file === 'contact.html') {
        schemaTag = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "S. Lashkaria Group",
      "url": "https://slashkariagroup.com/contact.html",
      "telephone": "+91-9876543210",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Andheri West",
        "addressLocality": "Mumbai",
        "addressRegion": "MH",
        "addressCountry": "IN"
      }
    }
    </script>`;
    }

    html = html.replace('</head>', `${seoTags}\n${schemaTag}\n</head>`);

    // 2. CLS & IMAGE ALT ATTRIBUTES AUDIT
    html = html.replace(/<\s*img\s+([^>]+)>/gi, (match, attrsStr) => {
        let srcMatch = attrsStr.match(/src="([^"]+)"/i);
        let src = srcMatch ? srcMatch[1] : null;
        let originalAltMatch = attrsStr.match(/alt="([^"]*)"/i);
        let hasWidth = /width="/i.test(attrsStr) || /width\s*=/i.test(attrsStr);
        let hasHeight = /height="/i.test(attrsStr) || /height\s*=/i.test(attrsStr);

        let newAttrsStr = attrsStr;

        // Enhance Alt tag
        if (!originalAltMatch || originalAltMatch[1].trim() === '') {
            if (originalAltMatch) {
                newAttrsStr = newAttrsStr.replace(/alt="[^"]*"/i, 'alt="Lashkaria - S. Lashkaria Group Residential Project"');
            } else {
                newAttrsStr += ' alt="Lashkaria - S. Lashkaria Group Residential Project"';
            }
        }

        // Inject Dimensions
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            try {
                let imgPath = path.join(__dirname, src);
                if (fs.existsSync(imgPath)) {
                    let dimensions = sizeOf(imgPath);
                    if (!hasWidth) {
                        newAttrsStr += ` width="${dimensions.width}"`;
                    }
                    if (!hasHeight) {
                        newAttrsStr += ` height="${dimensions.height}"`;
                    }
                }
            } catch (e) {
                // Ignore error, maybe image doesn't exist locally
                console.log("Could not process image dimensions for: " + src);
            }
        }

        return `<img ${newAttrsStr}>`;
    });

    // 3. ACCESSIBILITY (A11y) - Form Labels
    html = html.replace(/<\s*(input|textarea|select)\s+([^>]+)>/gi, (match, tag, attrsStr) => {
        // Exclude hidden inputs or checkboxes that already have labels
        if (attrsStr.includes('type="hidden"') || attrsStr.includes('type="checkbox"')) {
            return match;
        }

        if (!attrsStr.includes('aria-label=')) {
            let nameMatch = attrsStr.match(/name="([^"]+)"/i);
            let placeholderMatch = attrsStr.match(/placeholder="([^"]+)"/i);
            let ariaLabelValue = '';
            
            if (placeholderMatch && placeholderMatch[1]) {
                ariaLabelValue = placeholderMatch[1];
            } else if (nameMatch && nameMatch[1]) {
                ariaLabelValue = nameMatch[1];
            } else {
                ariaLabelValue = "Form Field";
            }

            // Only add if we got a value
            if (ariaLabelValue) {
                return `<${tag} ${attrsStr} aria-label="${ariaLabelValue}">`;
            }
        }
        return match;
    });

    // Write back
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Processed ${file}`);
}

files.forEach(file => {
    if (fs.existsSync(file)) {
        processHTML(file);
    } else {
        console.log(`File not found: ${file}`);
    }
});
