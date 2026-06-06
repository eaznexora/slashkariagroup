document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Handling
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Global Success Modal Injection
    const showSuccessModal = (message) => {
        let modal = document.getElementById('global-success-modal');
        if (!modal) {
            const modalHtml = `
                <div id="global-success-modal" style="position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
                    <div style="background: white; padding: 40px; border-radius: 12px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: transform 0.3s ease;">
                        <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 style="font-family: 'Mulish', sans-serif; font-size: 24px; font-weight: 800; color: #192954; margin-bottom: 10px;">Success!</h3>
                        <p id="global-success-message" style="font-family: 'Mulish', sans-serif; font-size: 16px; color: #64748B; margin-bottom: 25px; line-height: 1.5;"></p>
                        <button id="close-success-modal" style="background: #192954; color: white; border: none; padding: 12px 30px; border-radius: 6px; font-family: 'Mulish', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; transition: background 0.3s ease;">Got it</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            modal = document.getElementById('global-success-modal');
            document.getElementById('close-success-modal').addEventListener('click', () => {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                modal.children[0].style.transform = 'translateY(20px)';
            });
        }
        document.getElementById('global-success-message').innerText = message;
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.children[0].style.transform = 'translateY(0)';
    };

    window.showSuccessModal = showSuccessModal; // Expose globally for careers.html

    const googleWebAppUrl = 'https://script.google.com/macros/s/AKfycbzQY7bVWT6lJiF9Dm_M6ux_E8ysMK_z5oHAf0rV-eCRKgWSk03EDUulNYKvaYiPNPf-Dw/exec';

    // 1. Global Consultation Form
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = consultationForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            const inputs = consultationForm.querySelectorAll('input, textarea');
            const payload = { formType: 'consultation' };
            
            inputs.forEach(input => {
                if (input.placeholder && input.placeholder.includes('Full Name')) payload['Full Name'] = input.value;
                if (input.placeholder && input.placeholder.includes('Phone')) payload['Phone Number'] = input.value;
                if (input.placeholder && input.placeholder.includes('Email')) payload['Your Email'] = input.value;
                if (input.tagName.toLowerCase() === 'textarea') payload['Your Message'] = input.value;
            });

            fetch(googleWebAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(payload).toString()
            }).then(() => {
                showSuccessModal('Thank you! Our team will connect with you shortly.');
                consultationForm.reset();
            }).catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }).finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }

    // 2. Contact Page Enquiry Form
    const enquiryFormContainer = document.getElementById('enquiry-form');
    if (enquiryFormContainer) {
        const enquiryForm = enquiryFormContainer.querySelector('form');
        if (enquiryForm) {
            enquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = enquiryForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                btn.disabled = true;

                const payload = { formType: 'enquiry' };
                const inputs = enquiryForm.querySelectorAll('input, textarea, select');
                
                inputs.forEach(input => {
                    if (input.placeholder === 'Full Name') payload['Full Name'] = input.value;
                    if (input.placeholder === 'Phone Number') payload['Phone Number'] = input.value;
                    if (input.placeholder === 'Email Address') payload['Email Address'] = input.value;
                    if (input.tagName.toLowerCase() === 'select') payload['Interested Project'] = input.options[input.selectedIndex].text;
                    if (input.tagName.toLowerCase() === 'textarea') payload['Message'] = input.value;
                });

                fetch(googleWebAppUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(payload).toString()
                }).then(() => {
                    showSuccessModal('Your enquiry has been submitted successfully.');
                    enquiryForm.reset();
                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                }).finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
            });
        }
    }

    // Active Link Highlighting - Removed to keep 'HOME' active on index page
    // Header Scroll Handling - Removed as header is now solid by default via CSS

    // Developments Map Interactivity
    const projectItems = document.querySelectorAll('.project-items li');
    const projectInfoCard = document.querySelector('.project-info-card');
    
    if (projectItems.length > 0 && projectInfoCard) {
        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all
                projectItems.forEach(i => i.classList.remove('active'));
                // Add to current
                item.classList.add('active');
                
                // Here you would normally fetch data or update from an object
                // For now we just trigger an animation to show it's interactive
                projectInfoCard.style.animation = 'none';
                void projectInfoCard.offsetWidth; // trigger reflow
                projectInfoCard.style.animation = 'zoomIn 0.5s ease';
            });
        });
    }

    // Projects Slider
    const slider = document.querySelector('.projects-slider');
    const nextBtnSlider = document.querySelector('.slider-next');
    const prevBtnSlider = document.querySelector('.slider-prev');

    if (slider && nextBtnSlider && prevBtnSlider) {
        nextBtnSlider.addEventListener('click', () => {
            slider.scrollBy({ left: 300, behavior: 'smooth' });
        });
        prevBtnSlider.addEventListener('click', () => {
            slider.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    // SCROLL TO TOP BUTTON LOGIC
    const injectScrollTop = () => {
        const scrollTopHtml = `
            <div class="scroll-top-wrapper" id="scrollTop">
                <svg class="progress-ring" width="66" height="66" viewBox="0 0 66 66">
                    <path class="progress-ring__path" d="M33,3 L61,17 L61,49 L33,63 L5,49 L5,17 Z" stroke-width="3" fill="transparent" />
                </svg>
                <div class="scroll-top-btn">
                    <svg class="scroll-top-arrow" width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="arrow-hexagon" d="M18.5 0L34.5215 9.25V27.75L18.5 37L2.47853 27.75V9.25L18.5 0Z" />
                        <path class="arrow-path" d="M19.3498 14.2655C19.5507 14.0955 19.8232 14 20.1073 14C20.3914 14 20.6639 14.0955 20.8648 14.2655L25.6863 18.3468C25.8872 18.5168 26 18.7475 26 18.988C26 19.2285 25.8872 19.4591 25.6863 19.6292L20.8648 23.7104C20.6627 23.8756 20.3921 23.967 20.1111 23.965C19.8302 23.9629 19.5615 23.8675 19.3628 23.6994C19.1642 23.5312 19.0515 23.3037 19.049 23.0659C19.0466 22.8282 19.1546 22.5991 19.3498 22.428L22.2502 19.8949H12.0714C11.7873 19.8949 11.5148 19.7994 11.3138 19.6293C11.1129 19.4592 11 19.2285 11 18.988C11 18.7474 11.1129 18.5168 11.3138 18.3467C11.5148 18.1766 11.7873 18.081 12.0714 18.081H22.2502L19.3498 15.548C19.1489 15.3779 19.0361 15.1472 19.0361 14.9067C19.0361 14.6663 19.1489 14.4356 19.3498 14.2655Z" />
                    </svg>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', scrollTopHtml);

        const scrollTop = document.getElementById('scrollTop');
        const progressPath = scrollTop.querySelector('.progress-ring__path');
        const pathLength = progressPath.getTotalLength();

        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;

        const updateScrollProgress = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollTotal <= 0) return;

            const scrollPercent = window.scrollY / scrollTotal;
            const offset = pathLength - (scrollPercent * pathLength);
            progressPath.style.strokeDashoffset = offset;

            if (window.scrollY > 400) {
                scrollTop.classList.add('show');
            } else {
                scrollTop.classList.remove('show');
            }

            // Check if scroll top button overlaps any dark sections, dark elements, or dark images
            const btnRect = scrollTop.getBoundingClientRect();
            let isDark = false;
            
            const darkElements = document.querySelectorAll(
                '.site-footer, .stats-section, .bg-legacy-polygon, .projects-page-hero, .hero-bg-wrapper, .bg-poly-right-bottom, .bg-poly-right-2, .bg-poly-left-1, .chairman-section, .features-wrapper, .visionary-section, .commitment-section, .shaping-section, .director-section'
            );
            
            for (const el of darkElements) {
                const elRect = el.getBoundingClientRect();
                const overlap = !(btnRect.right < elRect.left || 
                                  btnRect.left > elRect.right || 
                                  btnRect.bottom < elRect.top || 
                                  btnRect.top > elRect.bottom);
                if (overlap) {
                    isDark = true;
                    break;
                }
            }

            if (isDark) {
                scrollTop.classList.add('dark-bg');
            } else {
                scrollTop.classList.remove('dark-bg');
            }
        };

        window.addEventListener('scroll', updateScrollProgress);
        
        scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        updateScrollProgress();
    };

    // BROCHURE MODAL LOGIC
    const injectBrochureModal = () => {
        const modalHtml = `
            <div class="modal-overlay" id="brochureModal">
                <div class="brochure-modal-card">
                    <button class="modal-close" id="closeBrochure">&times;</button>
                    <div class="brochure-form">
                        <h3>Download Profile</h3>
                        <div class="form-heading-line"></div>
                        <p>Share your contact details to download our exclusive project profile.</p>
                        <form id="brochure-download-form">
                            <div class="form-group">
                                <img src="assets/icons/profile.svg" alt="Name">
                                <input type="text" name="Full Name" onkeypress="return /[a-zA-Z\\s]/i.test(event.key)" title="Name should only contain letters and spaces (e.g., John Doe)" pattern="^[A-Za-z\\s]{2,50}$" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <img src="assets/icons/contact-call.svg" alt="Phone">
                                <input type="tel" name="Phone Number" onkeypress="return /[0-9]/i.test(event.key)" title="Please enter a valid phone number (digits only)" pattern="^[0-9]{10,12}$" placeholder="Phone Number" required>
                            </div>
                            <div class="form-group">
                                <img src="assets/icons/contact-mail.svg" alt="Email">
                                <input type="email" name="Your Email" placeholder="Your Email" required>
                            </div>
                            <button type="submit" class="btn btn-solid-dark" style="width: 100%; height: 54px; margin-top: 10px; justify-content: center;">
                                DOWNLOAD NOW &rarr;
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('brochureModal');
        const closeBtn = document.getElementById('closeBrochure');
        const form = document.getElementById('brochure-download-form');
        
        // Find all brochure links site-wide
        const brochureLinks = Array.from(document.querySelectorAll('a')).filter(a => 
            a.textContent.toLowerCase().includes('profile')
        );

        brochureLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            const payload = { formType: 'brochure' };
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.placeholder === 'Full Name') payload['Full Name'] = input.value;
                if (input.placeholder === 'Phone Number') payload['Phone Number'] = input.value;
                if (input.placeholder === 'Your Email') payload['Your Email'] = input.value;
            });

            const googleWebAppUrl = 'https://script.google.com/macros/s/AKfycbzQY7bVWT6lJiF9Dm_M6ux_E8ysMK_z5oHAf0rV-eCRKgWSk03EDUulNYKvaYiPNPf-Dw/exec';

            fetch(googleWebAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(payload).toString()
            }).then(() => {
                // Trigger Download after successful logging
                const downloadLink = document.createElement('a');
                downloadLink.href = 'S. Lashkaria Group Brochure.pdf';
                downloadLink.download = 'S. Lashkaria Group Brochure.pdf';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                if (window.showSuccessModal) {
                    window.showSuccessModal('Your brochure is downloading automatically.');
                } else {
                    alert('Your brochure is downloading automatically.');
                }
                modal.classList.remove('active');
                form.reset();
            }).catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }).finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    };


    injectScrollTop();
    injectBrochureModal();
});

