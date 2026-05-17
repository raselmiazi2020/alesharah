// gallery.js - Professional Dynamic Image Gallery with Equal Dimensions
(function($) {
    'use strict';
    
    class ProfessionalGallery {
        constructor() {
            // Categories configuration
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
            this.isLoading = false;
            this.observer = null;
            
            // Stats
            this.stats = {
                total: 0,
                byCategory: {}
            };
        }
        
        // Initialize gallery
        async init() {
            console.log('🚀 Initializing Professional Gallery...');
            
            // Show loading
            this.showLoading();
            
            try {
                // Scan for images
                await this.scanAllImages();
                
                // Render gallery
                this.renderGallery();
                
                // Initialize functionality
                this.initFilters();
                this.initLightbox();
                this.initLazyLoading();
                
                // Update stats
                this.updateStats();
                
                console.log(`✅ Gallery loaded successfully! Found ${this.images.length} images.`);
            } catch (error) {
                console.error('❌ Error loading gallery:', error);
                this.showError(error.message);
            } finally {
                this.hideLoading();
            }
        }
        
        // Show loading indicator
        showLoading() {
            $('#loading-indicator').show();
            $('#no-images').hide();
            $('#gallery-container').hide();
        }
        
        // Hide loading indicator
        hideLoading() {
            $('#loading-indicator').hide();
            $('#gallery-container').show();
        }
        
        // Show error message
        showError(message) {
            $('#no-images').show().html(`
                <h3>Error Loading Gallery</h3>
                <p>${message || 'Unable to load images'}</p>
                <p>Please check:</p>
                <ul>
                    <li>Folder structure is correct</li>
                    <li>Images are in JPG format</li>
                    <li>Images are named 1.jpg, 2.jpg, etc.</li>
                </ul>
                <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
            `);
        }
        
        // Scan all categories for images
        async scanAllImages() {
            console.log('🔍 Scanning for images...');
            
            this.images = [];
            this.stats.byCategory = {};
            
            // Scan each category
            for (const category of this.categories) {
                console.log(`Scanning ${category.display}...`);
                await this.scanCategory(category);
            }
            
            // Update total count
            this.stats.total = this.images.length;
            
            if (this.images.length === 0) {
                console.warn('⚠️ No images found!');
                $('#no-images').show();
            } else {
                $('#no-images').hide();
            }
        }
        
        // Scan a single category
        async scanCategory(category) {
            const categoryImages = [];
            let imageNumber = 1;
            
            // Reset category stats
            this.stats.byCategory[category.filter] = 0;
            
            while (imageNumber <= this.maxImagesPerCategory) {
                const imagePath = `${this.basePath}${category.folder}/${imageNumber}.jpg`;
                
                try {
                    const exists = await this.checkImageExists(imagePath);
                    
                    if (exists) {
                        categoryImages.push({
                            src: imagePath,
                            category: category.filter,
                            display: category.display,
                            folder: category.folder,
                            number: imageNumber
                        });
                        
                        this.stats.byCategory[category.filter]++;
                        console.log(`   Found: ${imagePath}`);
                    } else {
                        // If first image doesn't exist, stop scanning this category
                        if (imageNumber === 1) {
                            console.log(`   No images in ${category.folder}`);
                            break;
                        } else {
                            // Otherwise, we've probably reached the end
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`Error checking ${imagePath}:`, error);
                    break;
                }
                
                imageNumber++;
            }
            
            // Add to main images array
            this.images = [...this.images, ...categoryImages];
            
            console.log(`   ✓ Found ${categoryImages.length} images in ${category.display}`);
        }
        
        // Check if image exists
        async checkImageExists(url) {
            return new Promise((resolve) => {
                const img = new Image();
                
                // Set timeout
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 2000);
                
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
        
        // Render gallery HTML
        renderGallery() {
            const container = $('#gallery-container');
            container.empty();
            
            if (this.images.length === 0) {
                return;
            }
            
            let html = '';
            
            this.images.forEach((image, index) => {
                // Create placeholder (transparent 1x1 pixel)
                const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                
                html += `
                    <div class="gallery_product col-lg-4 col-md-4 col-sm-6 col-xs-12 filter ${image.category}" 
                         style="animation-delay: ${(index % 12) * 0.05}s;">
                        <a href="${image.src}" class="gallery-item" data-index="${index}">
                            <img 
                                src="${placeholder}"
                                data-src="${image.src}"
                                class="lazy"
                                alt="${image.display} - Image ${image.number}"
                                loading="lazy"
                                data-category="${image.category}"
                                onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 350 350\"%3E%3Crect width=\"350\" height=\"350\" fill=\"%23f0f0f0\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\" font-family=\"Arial\" font-size=\"14\" fill=\"%23999\"%3E${image.display}%3C/text%3E%3C/svg%3E'"
                            />
                            <div class="image-overlay">
                                <span class="category-badge">${image.display}</span>
                            </div>
                        </a>
                    </div>
                `;
            });
            
            container.html(html);
            
            // Apply animation
            $('.gallery_product').css('opacity', '0');
            setTimeout(() => {
                $('.gallery_product').css({
                    'opacity': '1',
                    'transition': 'opacity 0.5s ease'
                });
            }, 100);
        }
        
        // Initialize lazy loading
        initLazyLoading() {
            // Check if IntersectionObserver is supported
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const dataSrc = img.getAttribute('data-src');
                            
                            if (dataSrc) {
                                // Load image
                                img.src = dataSrc;
                                img.classList.add('lazy-loaded');
                                img.removeAttribute('data-src');
                                
                                // Stop observing
                                this.observer.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px',
                    threshold: 0.1
                });
                
                // Observe all lazy images
                $('img.lazy').each((index, img) => {
                    this.observer.observe(img);
                });
            } else {
                // Fallback: Load all images immediately
                console.log('IntersectionObserver not supported, loading all images...');
                $('img.lazy').each(function() {
                    const dataSrc = $(this).attr('data-src');
                    if (dataSrc) {
                        $(this).attr('src', dataSrc).addClass('lazy-loaded');
                    }
                });
            }
        }
        
        // Initialize filter functionality
        initFilters() {
            $(".filter-button").off('click').on('click', function() {
                const value = $(this).attr('data-filter');
                
                // Update active button
                $(".filter-button").removeClass("active");
                $(this).addClass("active");
                
                if (value === "all") {
                    $('.gallery_product').fadeIn(400);
                } else {
                    $('.gallery_product').hide();
                    $(`.filter.${value}`).fadeIn(400);
                }
                
                console.log(`Filter applied: ${value}`);
            });
            
            // Set initial active state
            $('.filter-button[data-filter="all"]').addClass('active');
        }
        
        // Initialize lightbox
        initLightbox() {
            // Remove any existing handlers
            $(document).off('click', '.gallery-item');
            
            // Add new handler
            $(document).on('click', '.gallery-item', (e) => {
                e.preventDefault();
                
                const link = $(e.currentTarget);
                const imgSrc = link.attr('href');
                const imgAlt = link.find('img').attr('alt') || 'Product Image';
                
                // Create lightbox
                const lightboxHTML = `
                    <div class="lightbox-overlay">
                        <img src="${imgSrc}" alt="${imgAlt}">
                        <button class="close-lightbox">&times;</button>
                    </div>
                `;
                
                $('body').append(lightboxHTML);
                
                // Show lightbox
                setTimeout(() => {
                    $('.lightbox-overlay').addClass('active');
                }, 10);
                
                // Close button
                $('.close-lightbox').on('click', () => {
                    this.closeLightbox();
                });
                
                // Close on overlay click
                $('.lightbox-overlay').on('click', (e) => {
                    if (e.target === e.currentTarget) {
                        this.closeLightbox();
                    }
                });
                
                // Close on escape key
                $(document).on('keydown.lightbox', (e) => {
                    if (e.key === 'Escape') {
                        this.closeLightbox();
                    }
                });
            });
        }
        
        // Close lightbox
        closeLightbox() {
            $('.lightbox-overlay').removeClass('active');
            
            // Remove after animation
            setTimeout(() => {
                $('.lightbox-overlay').remove();
                $(document).off('keydown.lightbox');
            }, 300);
        }
        
        // Update statistics
        updateStats() {
            // Update filter button text with counts
            this.categories.forEach(category => {
                const count = this.stats.byCategory[category.filter] || 0;
                const button = $(`.filter-button[data-filter="${category.filter}"]`);
                
                if (button.length && count > 0) {
                    // Remove existing count if present
                    const originalText = button.text().replace(/\s*\(\d+\)/, '');
                    button.text(`${originalText} (${count})`);
                }
            });
            
            // Log stats
            console.log('📊 Gallery Statistics:');
            console.log(`   Total Images: ${this.stats.total}`);
            this.categories.forEach(category => {
                const count = this.stats.byCategory[category.filter] || 0;
                console.log(`   ${category.display}: ${count}`);
            });
        }
        
        // Public method to refresh gallery
        refresh() {
            console.log('🔄 Refreshing gallery...');
            this.init();
        }
        
        // Debug method
        debug() {
            console.group('🎯 Gallery Debug Info');
            console.log('Categories:', this.categories);
            console.log('Total Images:', this.images.length);
            console.log('Images:', this.images);
            console.log('Stats:', this.stats);
            console.groupEnd();
            
            // Test each category
            this.categories.forEach(category => {
                const testUrl = `${this.basePath}${category.folder}/1.jpg`;
                console.log(`Testing ${category.display}: ${testUrl}`);
                
                const img = new Image();
                img.onload = () => console.log(`   ✓ ${category.display}: OK`);
                img.onerror = () => console.log(`   ✗ ${category.display}: NOT FOUND`);
                img.src = testUrl;
            });
        }
    }
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('📄 DOM Ready - Starting gallery...');
        
        // Create gallery instance
        window.professionalGallery = new ProfessionalGallery();
        
        // Initialize with delay to ensure everything is loaded
        setTimeout(() => {
            window.professionalGallery.init();
        }, 500);
        
        // Expose methods globally for debugging
        window.refreshGallery = function() {
            if (window.professionalGallery) {
                window.professionalGallery.refresh();
            }
        };
        
        window.debugGallery = function() {
            if (window.professionalGallery) {
                window.professionalGallery.debug();
            }
        };
        
        // Test function
        window.testGallery = function() {
            const folders = ['Woven', 'Knit', 'Hand work', 'Embo', 'Print', 'Accessories'];
            console.log('🧪 Testing image paths:');
            
            folders.forEach(folder => {
                const path = `products_gallery/${folder}/1.jpg`;
                const img = new Image();
                img.onload = () => console.log(`✓ ${path} - EXISTS`);
                img.onerror = () => console.log(`✗ ${path} - NOT FOUND`);
                img.src = path;
            });
        };
    });
    
})(jQuery);