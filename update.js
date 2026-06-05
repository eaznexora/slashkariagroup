const fs = require('fs');
const path = require('path');

const files = [
    'about.html',
    'blog-view.html',
    'blog.html',
    'careers.html',
    'contact.html',
    'disclaimer.html',
    'index.html',
    'privacy.html',
    'projects.html',
    'terms.html'
];

const faviconTags = `    <link rel="icon" href="https://slashkariagroup.com/favicon.png">\n    <link rel="apple-touch-icon" sizes="180x180" href="https://slashkariagroup.com/apple-touch-icon.png">`;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove all existing icon links
    content = content.replace(/.*<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>\r?\n?/g, '');
    
    // Inject the new favicon tags before </head>
    content = content.replace('</head>', `${faviconTags}\n</head>`);

    // Only for contact.html: replace FAQ
    if (file === 'contact.html') {
        const faqRegex = /<div class="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?(?=<\/div>\s*<\/section>)/;
        const newFaq = `<div class="max-w-4xl mx-auto space-y-4">
                    <!-- FAQ Item 1 -->
                    <div class="faq-item bg-white rounded-none md:rounded-xl shadow-sm border-b md:border border-gray-100 overflow-hidden">
                        <button class="faq-toggle w-full px-8 py-6 text-left flex justify-between items-center group">
                            <span class="text-brandNavy font-bold text-lg group-hover:text-brandCyan transition-colors">Who is the premier developer for luxury residential landmarks in Mumbai?</span>
                            <span class="faq-icon transform transition-transform duration-300">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 8L10 13L15 8" />
                                </svg>
                            </span>
                        </button>
                        <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50">
                            <div class="px-8 py-6 text-gray-600 leading-relaxed">
                                S. Lashkaria Group stands as the preeminent name in Mumbai's luxury real estate landscape. With a legacy of crafting bespoke residential masterpieces, we blend cutting-edge architectural innovation with uncompromising elegance to redefine sophisticated urban living.
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Item 2 -->
                    <div class="faq-item bg-white rounded-none md:rounded-xl shadow-sm border-b md:border border-gray-100 overflow-hidden">
                        <button class="faq-toggle w-full px-8 py-6 text-left flex justify-between items-center group">
                            <span class="text-brandNavy font-bold text-lg group-hover:text-brandCyan transition-colors">Where is the corporate headquarters of S. Lashkaria Group?</span>
                            <span class="faq-icon transform transition-transform duration-300">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 8L10 13L15 8" />
                                </svg>
                            </span>
                        </button>
                        <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50">
                            <div class="px-8 py-6 text-gray-600 leading-relaxed">
                                Our corporate headquarters is strategically situated in the heart of Mumbai's premium business district. You can find us at Unit no. 111, 1st Floor, Juhu Azad Nagar CHS, C.D. Barfiwala Road, Andheri (W), Mumbai 400053, where our visionary team orchestrates our landmark developments.
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Item 3 -->
                    <div class="faq-item bg-white rounded-none md:rounded-xl shadow-sm border-b md:border border-gray-100 overflow-hidden">
                        <button class="faq-toggle w-full px-8 py-6 text-left flex justify-between items-center group">
                            <span class="text-brandNavy font-bold text-lg group-hover:text-brandCyan transition-colors">What is S. Lashkaria Group's track record regarding construction quality and delivery timelines?</span>
                            <span class="faq-icon transform transition-transform duration-300">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 8L10 13L15 8" />
                                </svg>
                            </span>
                        </button>
                        <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50">
                            <div class="px-8 py-6 text-gray-600 leading-relaxed">
                                We pride ourselves on an impeccable track record built on the pillars of absolute transparency, superior construction standards, and punctual delivery. Our ISO-certified processes ensure that every project not only meets but exceeds industry benchmarks, guaranteeing our residents a flawless transition into their new homes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        content = content.replace(faqRegex, newFaq);
    }

    fs.writeFileSync(filePath, content, 'utf8');
});
console.log("Done");
