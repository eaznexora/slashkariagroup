document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const pageBtns = document.querySelectorAll('.page-number');
    const pageArrows = document.querySelectorAll('.page-arrow');

    let currentCategory = 'all';
    let currentPage = 1;
    const cardsPerPage = 16; // 4 rows of 4 columns

    function updateBlogDisplay() {
        // 1. Filter cards by category
        const filteredCards = Array.from(blogCards).filter(card => {
            const category = card.getAttribute('data-category');
            return currentCategory === 'all' || category === currentCategory;
        });

        // 2. Handle Pagination logic
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // 3. Show/Hide cards with animation
        blogCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('reveal-visible');
        });

        const startIdx = (currentPage - 1) * cardsPerPage;
        const endIdx = startIdx + cardsPerPage;
        const cardsToShow = filteredCards.slice(startIdx, endIdx);

        cardsToShow.forEach((card, index) => {
            card.style.display = 'block';
            // Reset state for re-animation
            card.classList.remove('reveal-visible');
            // Force reflow
            void card.offsetWidth;
            
            // Staggered reveal
            setTimeout(() => {
                card.classList.add('reveal-visible');
            }, index * 100);
        });

        // 4. Update Pagination Buttons
        updatePaginationUI(totalPages);
    }

    function updatePaginationUI(totalPages) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        // Only show page numbers up to totalPages
        pageBtns.forEach((btn, index) => {
            const pageNum = index + 1;
            if (pageNum <= totalPages) {
                btn.style.display = 'flex';
                btn.classList.toggle('active-page', pageNum === currentPage);
            } else {
                btn.style.display = 'none';
            }
        });

        // Hide pagination if only 1 page
        paginationContainer.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    // Filter Button Clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-category');
            currentPage = 1; // Reset to page 1 on filter
            updateBlogDisplay();
        });
    });

    // Page Number Clicks
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.textContent);
            updateBlogDisplay();
            // Scroll to top of blog section
            document.querySelector('.blog-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Arrow Clicks
    if (pageArrows.length === 2) {
        pageArrows[0].addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateBlogDisplay();
            }
        });
        pageArrows[1].addEventListener('click', () => {
            const filteredCardsCount = Array.from(blogCards).filter(card => {
                const category = card.getAttribute('data-category');
                return currentCategory === 'all' || category === currentCategory;
            }).length;
            const totalPages = Math.ceil(filteredCardsCount / cardsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateBlogDisplay();
            }
        });
    }

    // Dynamic Blog View Logic
    const clickableElements = document.querySelectorAll('.read-more-btn, .blog-image');
    clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
            // Find the parent card
            const card = el.closest('.blog-card');
            if (card) {
                const title = card.querySelector('.blog-title').innerText;
                const category = card.querySelector('.blog-category').innerText;
                const date = card.querySelector('.blog-date').innerText;
                const imgSrc = card.querySelector('.blog-image').getAttribute('src');
                
                const postData = {
                    title: title,
                    category: category,
                    date: date,
                    imgSrc: imgSrc
                };
                
                sessionStorage.setItem('currentBlogPost', JSON.stringify(postData));
                
                // If it's an image or image wrapper, manually redirect
                if (el.classList.contains('blog-image') || el.classList.contains('img-wrapper')) {
                    window.location.href = 'blog-view.html';
                }
            }
        });
    });

    // Add Image Wrappers for Hover Animation
    const blogImages = document.querySelectorAll('.blog-image');
    blogImages.forEach(img => {
        if (!img.parentElement.classList.contains('img-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'img-wrapper';
            
            // Apply wrapper styles
            wrapper.style.overflow = 'hidden';
            wrapper.style.borderRadius = '12px';
            wrapper.style.cursor = 'pointer';
            wrapper.style.width = '100%';
            wrapper.style.height = '160px';
            
            // Move img into wrapper
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // Reset img styles to fill wrapper
            img.style.borderRadius = '0';
            img.style.height = '100%';
            
            // Add click listener to wrapper
            wrapper.addEventListener('click', () => img.click());
        }
    });

    // Initial load
    updateBlogDisplay();
});
