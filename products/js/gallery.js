// gallery.js - Professional Dynamic Image Gallery
(function ($) {
    'use strict';

    class ProfessionalGallery {

        constructor() {

            this.categories = [
                { folder: 'Woven', filter: 'Woven', display: 'Woven' },
                { folder: 'Knit', filter: 'Knit', display: 'Knit' },
                { folder: 'Hand work', filter: 'hand_work', display: 'Hand Work' },
                { folder: 'Embo', filter: 'Embroidery', display: 'Embroidery' },
                { folder: 'Print', filter: 'Print', display: 'Print' },
                { folder: 'Accessories', filter: 'Accessories', display: 'Accessories' }
            ];

            this.basePath = 'products_gallery/';
            this.images = [];
            this.maxImagesPerCategory = 50;

            this.stats = {
                total: 0,
                byCategory: {}
            };
        }

        async init() {

            console.log('🚀 Initializing Professional Gallery...');

            this.showLoading();

            try {

                await this.scanAllImages();

                this.renderGallery();

                this.initFilters();

                this.initLightbox();

                this.initLazyLoading();

                this.updateStats();

                console.log(
                    `✅ Gallery loaded successfully! Found ${this.images.length} images.`
                );

            } catch (error) {

                console.error('❌ Gallery Error:', error);

                this.showError(error.message);

            } finally {

                this.hideLoading();

            }
        }

        showLoading() {
            $('#loading-indicator').show();
            $('#no-images').hide();
            $('#gallery-container').hide();
        }

        hideLoading() {
            $('#loading-indicator').hide();
            $('#gallery-container').show();
        }

        showError(message) {

            $('#no-images')
                .show()
                .html(`
                    <h3>Error Loading Gallery</h3>
                    <p>${message || 'Unable to load images.'}</p>
                    <button onclick="window.location.reload()">
                        Retry
                    </button>
                `);
        }

        async scanAllImages() {

            this.images = [];
            this.stats.byCategory = {};

            for (const category of this.categories) {
                await this.scanCategory(category);
            }

            this.stats.total = this.images.length;

            if (this.images.length === 0) {
                $('#no-images').show();
            } else {
                $('#no-images').hide();
            }
        }

        async scanCategory(category) {

            const categoryImages = [];

            let imageNumber = 1;

            this.stats.byCategory[category.filter] = 0;

            while (imageNumber <= this.maxImagesPerCategory) {

                const imagePath =
                    `${this.basePath}${category.folder}/${imageNumber}.jpg`;

                try {

                    const exists =
                        await this.checkImageExists(imagePath);

                    if (!exists) {
                        break;
                    }

                    categoryImages.push({
                        src: imagePath,
                        category: category.filter,
                        display: category.display,
                        folder: category.folder,
                        number: imageNumber
                    });

                    this.stats.byCategory[category.filter]++;

                    imageNumber++;

                } catch (error) {

                    console.error(
                        `Error checking ${imagePath}:`,
                        error
                    );

                    break;
                }
            }

            this.images.push(...categoryImages);

            console.log(
                `✓ ${category.display}: ${categoryImages.length} images`
            );
        }

        checkImageExists(url) {

            return new Promise((resolve) => {

                const img = new Image();

                const timeout = setTimeout(() => {
                    resolve(false);
                }, 3000);

                img.onload = () => {
                    clearTimeout(timeout);
                    resolve(true);
                };

                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve(false);
                };

                img.src = url;
            });
        }

        renderGallery() {

            const container = $('#gallery-container');

            container.empty();

            if (!this.images.length) {
                return;
            }

            let html = '';

            this.images.forEach((image, index) => {

                html += `
                    <div
                        class="gallery_product col-lg-4 col-md-4 col-sm-6 col-xs-12 filter ${image.category}"
                        style="animation-delay:${(index % 12) * 0.05}s;"
                    >

                        <a
                            href="${image.src}"
                            class="gallery-item"
                            data-index="${index}"
                            data-full-image="${image.src}"
                        >

                            <img
                                src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                                data-src="${image.src}"
                                class="lazy"
                                alt="${image.display} - Image ${image.number}"
                                loading="lazy"
                            >

                            <div class="image-overlay">

                                <span class="category-badge">
                                    ${image.display}
                                </span>

                                <span class="view-image">
                                    🔍 View Full Image
                                </span>

                            </div>

                        </a>

                    </div>
                `;
            });

            container.html(html);

            $('.gallery_product').css('opacity', '0');

            setTimeout(() => {

                $('.gallery_product').css({
                    opacity: '1',
                    transition: 'opacity 0.5s ease'
                });

            }, 100);
        }

        initLazyLoading() {

            const images = document.querySelectorAll('img.lazy');

            if ('IntersectionObserver' in window) {

                const observer = new IntersectionObserver(
                    (entries, obs) => {

                        entries.forEach(entry => {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            const img = entry.target;

                            const src =
                                img.getAttribute('data-src');

                            if (src) {

                                img.src = src;

                                img.removeAttribute('data-src');

                                img.classList.add('lazy-loaded');

                            }

                            obs.unobserve(img);
                        });

                    },
                    {
                        rootMargin: '200px 0px',
                        threshold: 0.01
                    }
                );

                images.forEach(img => {
                    observer.observe(img);
                });

            } else {

                images.forEach(img => {

                    const src =
                        img.getAttribute('data-src');

                    if (src) {

                        img.src = src;

                        img.removeAttribute('data-src');

                        img.classList.add('lazy-loaded');

                    }
                });
            }
        }

        initFilters() {

            $('.filter-button')
                .off('click.gallery')
                .on('click.gallery', function () {

                    const value =
                        $(this).attr('data-filter');

                    $('.filter-button')
                        .removeClass('active');

                    $(this).addClass('active');

                    if (value === 'all') {

                        $('.gallery_product')
                            .stop(true, true)
                            .fadeIn(300);

                    } else {

                        $('.gallery_product')
                            .stop(true, true)
                            .hide();

                        $(`.gallery_product.filter.${value}`)
                            .stop(true, true)
                            .fadeIn(300);
                    }
                });

            $('.filter-button[data-filter="all"]')
                .addClass('active');
        }

        initLightbox() {

            // Remove old handler
            $(document)
                .off('click.professionalGallery', '.gallery-item');

            // New image click handler
            $(document)
                .on(
                    'click.professionalGallery',
                    '.gallery-item',
                    (e) => {

                        e.preventDefault();

                        e.stopPropagation();

                        const link =
                            $(e.currentTarget);

                        const imageSrc =
                            link.attr('data-full-image') ||
                            link.attr('href');

                        const image =
                            link.find('img');

                        const alt =
                            image.attr('alt') ||
                            'Product Image';

                        this.openLightbox(
                            imageSrc,
                            alt
                        );
                    }
                );
        }

        openLightbox(src, alt) {

            // Remove existing popup
            $('.professional-lightbox').remove();

            const popup = `
                <div class="professional-lightbox">

                    <div class="lightbox-content">

                        <button
                            type="button"
                            class="lightbox-close"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <img
                            class="lightbox-image"
                            src="${src}"
                            alt="${alt}"
                        >

                    </div>

                </div>
            `;

            $('body').append(popup);

            // Prevent page scrolling
            $('body').addClass('lightbox-open');

            // Animate popup
            setTimeout(() => {

                $('.professional-lightbox')
                    .addClass('active');

            }, 10);

            // Close button
            $('.lightbox-close')
                .on('click', () => {

                    this.closeLightbox();

                });

            // Click outside image
            $('.professional-lightbox')
                .on('click', function (e) {

                    if (
                        e.target === this ||
                        $(e.target).hasClass('lightbox-content')
                    ) {

                        window.professionalGallery
                            .closeLightbox();

                    }
                });

            // ESC
            $(document)
                .off('keydown.professionalLightbox')
                .on(
                    'keydown.professionalLightbox',
                    (e) => {

                        if (e.key === 'Escape') {

                            this.closeLightbox();

                        }
                    }
                );
        }

        closeLightbox() {

            $('.professional-lightbox')
                .removeClass('active');

            $('body')
                .removeClass('lightbox-open');

            setTimeout(() => {

                $('.professional-lightbox')
                    .remove();

            }, 300);

            $(document)
                .off('keydown.professionalLightbox');
        }

        updateStats() {

            this.categories.forEach(category => {

                const count =
                    this.stats.byCategory[
                        category.filter
                    ] || 0;

                const button =
                    $(
                        `.filter-button[data-filter="${category.filter}"]`
                    );

                if (button.length) {

                    let text =
                        button.text()
                            .replace(/\s*\(\d+\)/, '')
                            .trim();

                    button.text(
                        `${text} (${count})`
                    );
                }
            });

            console.log('📊 Gallery Statistics');

            console.log(
                `Total Images: ${this.stats.total}`
            );
        }

        refresh() {
            this.init();
        }

        debug() {

            console.log('Gallery:', this.images);

            console.log('Stats:', this.stats);
        }
    }


    // DOM Ready
    $(document).ready(function () {

        console.log('📄 DOM Ready - Starting gallery...');

        window.professionalGallery =
            new ProfessionalGallery();

        setTimeout(() => {

            window.professionalGallery.init();

        }, 300);


        window.refreshGallery = function () {

            if (window.professionalGallery) {

                window.professionalGallery.refresh();

            }
        };


        window.debugGallery = function () {

            if (window.professionalGallery) {

                window.professionalGallery.debug();

            }
        };

    });

})(jQuery);
