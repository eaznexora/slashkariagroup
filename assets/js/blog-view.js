document.addEventListener('DOMContentLoaded', () => {
    // Check if there is data in sessionStorage
    const storedData = sessionStorage.getItem('currentBlogPost');
    
    if (storedData) {
        const postData = JSON.parse(storedData);
        
        // Update DOM elements
        const titleElement = document.querySelector('.blog-view-title-saas');
        const categoryElement = document.querySelector('.blog-view-category');
        const dateElement = document.querySelector('.meta-date');
        const heroImageElement = document.querySelector('.blog-view-featured-img');
        const documentTitle = document.querySelector('title');
        
        if (titleElement) titleElement.innerText = postData.title;
        if (categoryElement) categoryElement.innerText = postData.category.toUpperCase();
        if (documentTitle) documentTitle.innerText = postData.title + " | S. Lashkaria Group";
        if (heroImageElement) heroImageElement.src = postData.imgSrc;
        
        if (dateElement) {
            dateElement.innerText = postData.date;
        }
    }

    // Dynamic Related Blog Logic
    const sidebarPosts = document.querySelectorAll('.sidebar-post');
    sidebarPosts.forEach(post => {
        post.addEventListener('click', (e) => {
            const title = post.querySelector('h4').innerText;
            const date = post.querySelector('.sidebar-date').innerText;
            const imgSrc = post.querySelector('img').getAttribute('src');
            
            // Re-store new data
            const postData = {
                title: title,
                category: 'ARTICLE', // generic category for sidebar posts
                date: date,
                imgSrc: imgSrc
            };
            
            sessionStorage.setItem('currentBlogPost', JSON.stringify(postData));
        });
    });

    // Share Links Logic
    const currentUrl = window.location.href;
    const shareTitle = document.title;
    
    const btnFb = document.getElementById('share-fb');
    const btnTw = document.getElementById('share-tw');
    const btnLi = document.getElementById('share-li');
    const btnCopy = document.getElementById('share-copy');

    if (btnFb) {
        btnFb.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        });
    }

    if (btnTw) {
        btnTw.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
        });
    }

    if (btnLi) {
        btnLi.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
        });
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    }
});
