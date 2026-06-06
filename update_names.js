const fs = require('fs');
const files = ['index.html', 'contact.html', 'careers.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Consultation Form + Contact Form Shared + Careers Form Shared
    // Use regex to avoid duplicating name attributes if they already exist
    
    // Replace placeholder='Full Name'
    html = html.replace(/<input([^>]*?)placeholder="Full Name"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Full Name" placeholder="Full Name"${p2}>`;
    });
    
    // Replace placeholder='Phone Number'
    html = html.replace(/<input([^>]*?)placeholder="Phone Number"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Phone Number" placeholder="Phone Number"${p2}>`;
    });
    
    // Replace placeholder='Your Email'
    html = html.replace(/<input([^>]*?)placeholder="Your Email"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Your Email" placeholder="Your Email"${p2}>`;
    });

    // Replace textarea placeholder='Your Message'
    html = html.replace(/<textarea([^>]*?)placeholder="Your Message"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<textarea${p1}name="Your Message" placeholder="Your Message"${p2}>`;
    });

    // 2. Contact Page Specific
    html = html.replace(/<input([^>]*?)placeholder="Email Address"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Email Address" placeholder="Email Address"${p2}>`;
    });
    html = html.replace(/<textarea([^>]*?)placeholder="Message"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<textarea${p1}name="Message" placeholder="Message"${p2}>`;
    });
    html = html.replace(/<select class="input-field appearance-none"/g, (match) => {
        if (match.includes('name=')) return match;
        return `<select name="Interested Project" class="input-field appearance-none"`;
    });

    // 3. Careers Page Specific
    html = html.replace(/<input([^>]*?)placeholder="Applying For"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Applying For" placeholder="Applying For"${p2}>`;
    });
    html = html.replace(/<select id="experienceInput"/g, (match) => {
        if (match.includes('name=')) return match;
        return `<select name="Total Experience" id="experienceInput"`;
    });
    html = html.replace(/<select id="noticePeriodInput"/g, (match) => {
        if (match.includes('name=')) return match;
        return `<select name="Notice Period" id="noticePeriodInput"`;
    });
    html = html.replace(/<input([^>]*?)placeholder="Expected CTC \(LPA\)"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<input${p1}name="Expected CTC" placeholder="Expected CTC (LPA)"${p2}>`;
    });
    html = html.replace(/<textarea([^>]*?)placeholder="Brief Cover Note \/ Message"([^>]*?)>/g, (match, p1, p2) => {
        if (match.includes('name=')) return match;
        return `<textarea${p1}name="Brief Cover Note" placeholder="Brief Cover Note / Message"${p2}>`;
    });

    fs.writeFileSync(file, html);
});
