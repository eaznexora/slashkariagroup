/**
 * Lashkaria Group - Projects & Developments Logic
 * This file handles:
 * 1. The "Crafted Developments" Slider (Main Carousel)
 * 2. The "Explore Our Developments" Map (Leaflet.js)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       SECTION 1: CRAFTED DEVELOPMENTS SLIDER
       ============================================================ */

    const craftedProjects = [
        {
            id: 'p1',
            title: "Amann Hills",
            location: "Andheri West",
            desc: "Discover elevated living in the heart of Andheri. Amann Hills offers a perfect blend of modern architecture and premium amenities for a refined urban lifestyle.",
            image: "assets/projects/amann-hills-d.png",
            bgClass: "active-bg-1"
        },
        {
            id: 'p2',
            title: "Amann Marina",
            location: "Worli",
            desc: "Experience the ultimate in seafront luxury. Amann Marina redefined the Worli skyline with its iconic design and breathtaking views of the Arabian Sea.",
            image: "assets/projects/amann-marina-d.png",
            bgClass: "active-bg-2"
        },
        {
            id: 'p3',
            title: "Rashmi Heights",
            location: "Malad East",
            desc: "A sanctuary of green living amidst the city. Rashmi Heights combines modern comforts with serene surroundings and rapid connectivity.",
            image: "assets/projects/rashmi-heights-d.jpeg",
            bgClass: "active-bg-3"
        },
        {
            id: 'p4',
            title: "Amann Solitaire",
            location: "Borivali West",
            desc: "Elite residences designed for those who expect more. Amann Solitaire stands as a testament to craftsmanship and luxury in Borivali.",
            image: "assets/projects/amann-solitare-d.png",
            bgClass: "active-bg-4"
        }
    ];

    let currentCraftedIndex = 0;

    // Helper: convert project title to a URL-friendly slug for deep linking
    function projectSlug(title) {
        return 'project-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const activeProjectContainer = document.getElementById('active-project-container');
    const smallProjectsGrid = document.getElementById('small-projects-grid');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');

    function renderCraftedSlider(direction = 'right') {
        if (!activeProjectContainer || !smallProjectsGrid) return;

        const active = craftedProjects[currentCraftedIndex];
        const animationClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';

        // 1. Render Big Card
        activeProjectContainer.innerHTML = `
            <div class="card-image-wrapper ${animationClass}">
                <img src="${active.image}" alt="${active.title}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="project-overlay fade-up-content">
                <div class="overlay-inner">
                    <h3 class="overlay-title">${active.title}</h3>
                    <div class="overlay-loc">
                        <img src="assets/icons/project-location.svg" alt="Loc">
                        (${active.location})
                    </div>
                    <div class="overlay-divider"></div>
                    <p class="overlay-desc">${active.desc}</p>
                </div>
                <a href="projects.html#${projectSlug(active.title)}" class="btn-view-project">View Project &rarr;</a>
            </div>
        `;

        // 2. Render Small Cards in a LINEAR Circular Sequence
        // This ensures cards always follow a predictable order (1 -> 2 -> 3 -> 4)
        const smallProjects = [];
        for (let i = 1; i < craftedProjects.length; i++) {
            const nextIdx = (currentCraftedIndex + i) % craftedProjects.length;
            smallProjects.push(craftedProjects[nextIdx]);
        }

        smallProjectsGrid.innerHTML = smallProjects.map(proj => `
            <div class="small-card">
                <div class="card-image-wrapper ${animationClass}">
                    <img src="${proj.image}" alt="${proj.title}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="small-overlay fade-up-content">
                    <h4 class="small-title">${proj.title}</h4>
                    <div class="small-loc">
                        <img src="assets/icons/project-location.svg" alt="Loc">
                        ${proj.location}
                    </div>
                    <a href="projects.html#${projectSlug(proj.title)}" class="btn-view-project-small">View Project &rarr;</a>
                </div>
            </div>
        `).join('');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentCraftedIndex = (currentCraftedIndex - 1 + craftedProjects.length) % craftedProjects.length;
            renderCraftedSlider('left');
        });
        nextBtn.addEventListener('click', () => {
            currentCraftedIndex = (currentCraftedIndex + 1) % craftedProjects.length;
            renderCraftedSlider('right');
        });
    }

    // Initial Render
    renderCraftedSlider();


    /* ============================================================
       SECTION 2: EXPLORE OUR DEVELOPMENTS MAP (LEAFLET.JS)
       ============================================================ */

    let isInitialLoad = true; // Flag to prevent auto-scroll on first load
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // 1. Parse Data from HTML Sidebar
        const sidebarItems = document.querySelectorAll('.project-item');
        const mapProjectData = Array.from(sidebarItems).map(item => ({
            id: item.dataset.projectId,
            name: item.dataset.title,
            location: item.dataset.location,
            coords: JSON.parse(item.dataset.coords),
            image: item.dataset.image,
            logo: "assets/logo/logo-aboutus.png",
            desc: item.dataset.desc
        }));

        // 2. Initialize Map
        const map = L.map('map', {
            center: [19.15, 72.87],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false // Disabled by default, enabled via Ctrl key
        });

        // 2.1 Ctrl + Scroll to Zoom functionality
        // Prevent default browser zoom and handle map zoom manually
        mapElement.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    map.zoomIn();
                } else {
                    map.zoomOut();
                }
            }
        }, { passive: false });

        // Ensure scrollWheelZoom is disabled to let our manual handler take over cleanly
        map.scrollWheelZoom.disable();

        // Ensure Map Completeness
        setTimeout(() => { map.invalidateSize(); }, 500);
        window.addEventListener('resize', () => { map.invalidateSize(); });

        // Add Zoom Control
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO' }).addTo(map);

        // Custom Icons (Hexagon Pins Only)
        const createMarkerIcon = (project, index, isActive = false) => {
            return L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="marker-container ${isActive ? 'active' : ''}">
                        <div class="hexagon-pin"></div>
                    </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            });
        };

        const markers = {};

        // 3. Create Markers & Popups
        mapProjectData.forEach((project, index) => {
            const marker = L.marker(project.coords, {
                icon: createMarkerIcon(project, index, false)
            }).addTo(map);

            const popupContent = `
                <div class="map-popup-card">
                    <img src="${project.image}" alt="${project.name}" class="popup-image">
                    <div class="popup-details">
                        <div class="popup-header">
                            <img src="${project.logo}" alt="Logo" class="popup-logo">
                            <h3>${project.name}</h3>
                        </div>
                        <p class="popup-desc">${project.desc}</p>
                        <a href="projects.html#${projectSlug(project.name)}" class="btn-popup">View Project &rarr;</a>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'premium-popup',
                offset: [0, -40],
                autoPan: true,
                autoPanPadding: [50, 50], // More padding to ensure centering
                closeButton: true
            });

            markers[project.id] = marker;

            // Hover interactions
            marker.on('mouseover', function (e) {
                this.openPopup();
                this.setIcon(createMarkerIcon(project, index, true));
                this.getElement().classList.add('hover-active');
            });

            marker.on('mouseout', function (e) {
                this.getElement().classList.remove('hover-active');

                // CRITICAL: Check if this project is CURRENTLY active in the sidebar
                const sidebarItem = document.querySelector(`.project-item[data-project-id="${project.id}"]`);
                const isActive = sidebarItem && sidebarItem.classList.contains('active');

                if (!isActive) {
                    this.closePopup();
                    this.setIcon(createMarkerIcon(project, index, false));
                }
            });

            marker.on('click', () => {
                focusOnMapProject(project);
                marker.openPopup(); // Ensure it stays open
            });
        });

        // 4. Sidebar Interaction Logic
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.projectId;
                const project = mapProjectData.find(p => p.id === projectId);
                if (project) {
                    focusOnMapProject(project);
                    markers[projectId].openPopup();
                }
            });
        });

        function focusOnMapProject(project) {
            const index = mapProjectData.findIndex(p => p.id === project.id);

            // 1. Update Sidebar Active State
            sidebarItems.forEach(item => {
                item.classList.toggle('active', item.dataset.projectId === project.id);
            });

            // 2. Update Marker Icons
            Object.keys(markers).forEach(id => {
                const p = mapProjectData.find(proj => proj.id === id);
                const pIdx = mapProjectData.findIndex(proj => proj.id === id);
                markers[id].setIcon(createMarkerIcon(p, pIdx, id === project.id));
            });

            // 3. Center Map on Project (Optimized for mobile to center the popup)
            const isMobile = window.innerWidth <= 992;
            const offsetLat = isMobile ? 0.02 : 0.02;
            map.flyTo([project.coords[0] + offsetLat, project.coords[1]], 14, {
                duration: 1.5,
                easeLinearity: 0.25
            });

            // 4. Scroll Page to Map Wrapper (SKIP on initial load)
            const mapWrapper = document.querySelector('.map-wrapper');
            if (mapWrapper && !isInitialLoad) {
                const yOffset = -100; // 100px gap from the top
                const y = mapWrapper.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }

            // After first load is handled, subsequent calls will scroll the page
            isInitialLoad = false;
        }

        // 5. SET DEFAULT VIEW TO SHOW ALL PROJECT CLUSTERS
        setTimeout(() => {
            if (mapProjectData.length > 0) {
                // Calculate bounds of all markers
                const bounds = L.latLngBounds(mapProjectData.map(p => p.coords));
                
                // Add padding so markers don't sit exactly on the edges of the map
                // For mobile, we might need a bit more padding due to the UI overlays
                const isMobile = window.innerWidth <= 992;
                const paddingOpts = isMobile ? [30, 30] : [50, 50];
                
                map.fitBounds(bounds, { 
                    padding: paddingOpts,
                    maxZoom: 13 // Prevent it from zooming in too far if clusters are close
                });
                
                // Reset flag so subsequent clicks will scroll correctly
                isInitialLoad = false;
            }
        }, 500); // Slight delay to ensure map container size is fully calculated
    }

    /* ============================================================
       SECTION 3: COUNTING ANIMATION
       ============================================================ */
    const countNumbers = document.querySelectorAll('.count-number');

    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);

            const currentValue = Math.floor(easeProgress * (target - start) + start);
            el.innerText = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = target;
            }
        };

        requestAnimationFrame(updateCount);
    };

    const countObserverOptions = {
        threshold: 0.5
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, countObserverOptions);

    countNumbers.forEach(num => {
        countObserver.observe(num);
    });
});

