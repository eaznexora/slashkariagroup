const fs = require('fs');
const path = require('path');

const filesToProcess = [
    'index.html',
    'contact.html',
    'careers.html',
    'projects.html',
    'about.html',
    'blog.html',
    'blog-view.html',
    'assets/js/main.js'
];

filesToProcess.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Full Name
    content = content.replace(/<input([^>]*?)name="Full Name"([^>]*?)>/g, (match, p1, p2) => {
        let tag = `<input${p1}name="Full Name"${p2}>`;
        if (!tag.includes('pattern=')) tag = tag.replace('name="Full Name"', 'name="Full Name" pattern="^[A-Za-z\\\\s]{2,50}$"');
        if (!tag.includes('title=')) tag = tag.replace('name="Full Name"', 'name="Full Name" title="Name should only contain letters and spaces (e.g., John Doe)"');
        if (!tag.includes('onkeypress=')) tag = tag.replace('name="Full Name"', 'name="Full Name" onkeypress="return /[a-zA-Z\\\\s]/i.test(event.key)"');
        return tag;
    });

    // Phone Number
    content = content.replace(/<input([^>]*?)name="Phone Number"([^>]*?)>/g, (match, p1, p2) => {
        let tag = `<input${p1}name="Phone Number"${p2}>`;
        if (!tag.includes('pattern=')) tag = tag.replace('name="Phone Number"', 'name="Phone Number" pattern="^[0-9]{10,12}$"');
        if (!tag.includes('title=')) tag = tag.replace('name="Phone Number"', 'name="Phone Number" title="Please enter a valid phone number (digits only)"');
        if (!tag.includes('onkeypress=')) tag = tag.replace('name="Phone Number"', 'name="Phone Number" onkeypress="return /[0-9]/i.test(event.key)"');
        if (!tag.includes('type="tel"')) tag = tag.replace(/type="[^"]+"/, 'type="tel"');
        return tag;
    });

    // Email
    content = content.replace(/<input([^>]*?)name="(Your Email|Email Address)"([^>]*?)>/g, (match, p1, nameAttr, p2) => {
        let tag = `<input${p1}name="${nameAttr}"${p2}>`;
        if (!tag.includes('type="email"')) tag = tag.replace(/type="[^"]+"/, 'type="email"');
        return tag;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
