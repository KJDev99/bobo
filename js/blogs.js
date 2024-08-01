// Fetch blog posts based on categoryId and page number
async function fetchBlogPosts(categoryId, page = 1) {
    try {
        const response = await fetch(`http://192.168.0.163:8000/api/blog/v1/blogs/${categoryId}/?page=${page}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

// Populate blog posts in the container
function populateBlogPosts(posts) {
    const container = document.querySelector('.col-lg-8 .row');
    container.innerHTML = ''; // Clear previous data

    posts.forEach(post => {
        const col = document.createElement('div');
        col.className = 'col-lg-6 col-md-6';
        col.innerHTML = `
            <div class="single-amenities">
                <div class="amenities-thumb">
                    <img class="img-fluid w-100 blog_img" src="${post.images.length > 0 ? post.images[0].image : 'img/default-image.webp'}" alt=""/>
                </div>
                <div class="amenities-details">
                    <h5><a href="#">${post.title}</a></h5>
                    <div class="amenities-meta mb-10 d-flex justify-content-between">
                        <a href="#" class="d-flex align-items-center"><i class="fa-regular fa-calendar"></i> <p class="ml-10">${new Date(post.created_at).toLocaleDateString()}</p></a>
                        <a href="#" class="d-flex align-items-center"><i class="fa-solid fa-eye ml-10"></i><p class="ml-10">${post.comment.length}</p></a>
                    </div>
                    <p class="blog_decr">${post.description}</p>
                    <div class="d-flex justify-content-between mt-20">
                        <div><a href="./blog.html" class="blog-post-btn">Read More <span class="ti-arrow-right"></span></a></div>
                        <div class="category"><a href="#"><span class="ti-folder mr-1"></span>${post.category[0].name}</a></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Populate pagination controls
function populatePagination(pagination) {
    const paginationContainer = document.querySelector('.blog-pagination .pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination buttons

    // Previous button
    if (pagination.previous) {
        const prevButton = createPaginationButton('Previous', 'ti-arrow-left', () => fetchAndRender(pagination.previous));
        paginationContainer.appendChild(prevButton);
    }

    // Page numbers
    for (let i = 1; i <= pagination.total_pages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${pagination.current_page === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a href="#" class="page-link">${i}</a>`;
        pageItem.addEventListener('click', () => fetchAndRender(i));
        paginationContainer.appendChild(pageItem);
    }

    // Next button
    if (pagination.next) {
        const nextButton = createPaginationButton('Next', 'ti-arrow-right', () => fetchAndRender(pagination.next));
        paginationContainer.appendChild(nextButton);
    }
}

// Create a pagination button
function createPaginationButton(label, iconClass, onClick) {
    const button = document.createElement('li');
    button.className = 'page-item';
    button.innerHTML = `<a href="#" class="page-link" aria-label="${label}"><span aria-hidden="true"><span class="${iconClass}"></span></span></a>`;
    button.addEventListener('click', onClick);
    return button;
}

// Fetch and render blog posts and pagination
async function fetchAndRender(page = 1) {
    const categoryId = localStorage.getItem('selectedCategoryId');
    if (!categoryId) return;

    const data = await fetchBlogPosts(categoryId, page);

    if (data) {
        populateBlogPosts(data.results);
        populatePagination({
            current_page: page,
            total_pages: Math.ceil(data.count / 12),
            previous: data.previous,
            next: data.next
        });
    }
}

// Fetch and populate popular posts
async function fetchAndPopulatePopularPosts() {
    const categoryId = localStorage.getItem('selectedCategoryId');
    if (!categoryId) return;

    try {
        const response = await fetch(`http://192.168.0.163:8000/api/blog/v1/popular/${categoryId}/`);
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Unexpected data format:', data);
            return;
        }

        const container = document.getElementById('popularPostsList');
        container.innerHTML = ''; // Clear previous data

        data.slice(0, 4).forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'single-post-list';
            postElement.innerHTML = `
                <div class="thumb">
                    <img class="img-fluid popular_img" src="${post.images.length > 0 ? post.images[0].image : 'img/default-image.webp'}" alt="img"/>
                </div>
                <div class="details mt-20">
                    <a href="blog.html">
                        <h6>${post.title}</h6>
                    </a>
                    <p>${new Date(post.created_at).toLocaleDateString()}</p>
                </div>
            `;
            container.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching popular posts:', error);
    }
}

// Fetch carousel data
async function fetchCarouselData(id) {
    try {
        const response = await fetch(`http://192.168.0.163:8000/api/blog/v1/carousel/${id}/`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching carousel data:', error);
        return [];
    }
}

// Populate the carousel with new items
function populateCarousel(carouselItems) {
    const carouselContainer = document.querySelector('.home-banner-owl');
    carouselContainer.innerHTML = ''; // Clear existing items

    carouselItems.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'banner-img';
        slide.innerHTML = `
            <img class="img-fluid slider_imgs" src="${item.images.length > 0 && item.images[0].image}" alt=""/>
            <div class="text-wrapper">
                <div class="d-flex">
                    <h1>${item.title}</h1>
                </div>
            </div>
        `;
        carouselContainer.appendChild(slide);
    });

    // Reinitialize the carousel (assuming you're using OwlCarousel)
    if (typeof $('.home-banner-owl').owlCarousel === 'function') {
        $('.home-banner-owl').owlCarousel('destroy');
        $('.home-banner-owl').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            smartSpeed: 450
        });
    }
}

// Update the carousel
async function updateCarousel() {
    const id = localStorage.getItem('selectedCategoryId');
    if (id) {
        const carouselData = await fetchCarouselData(id);
        populateCarousel(carouselData);
    }
}

// Fetch and update menu data
async function fetchMenuData() {
    const apiUrl = "http://192.168.0.163:8000/api/blog/v1/categories/";
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error("Error fetching menu data:", error);
        return [];
    }
}

// Update the menu in the header
async function updateMenu() {
    const categories = await fetchMenuData();
    
    const menuLeft = document.getElementById("menuLeft");
    const menuRight = document.getElementById("menuRight");

    // Determine the midpoint for dividing categories
    const midpoint = Math.ceil(categories.length / 2);

    // Split categories into two arrays for left and right menus
    const leftCategories = categories.slice(0, midpoint);
    const rightCategories = categories.slice(midpoint);

    // Update left side menu
    menuLeft.innerHTML = leftCategories.map(category => `
        <a href="#" class="menu-item" data-id="${category.id}">${category.name}</a>
    `).join('');

    // Update right side menu
    menuRight.innerHTML = rightCategories.map(category => `
        <li class="nav-item">
            <a class="nav-link" href="#" data-id="${category.id}">${category.name}</a>
        </li>
    `).join('');

    // Add click event listeners to menu items
    document.querySelectorAll(".menu-item, .nav-link").forEach(item => {
        item.addEventListener("click", handleMenuClick);
    });

    // Set the initial selected state
    updateSelectedState();
}

// Handle menu item click
function handleMenuClick(event) {
    event.preventDefault();
    const id = event.currentTarget.getAttribute("data-id");
    localStorage.setItem("selectedCategoryId", id);
    updateSelectedState();
    fetchAndRender(); // Fetch and render posts for the new category
    fetchAndPopulatePopularPosts(); // Fetch and populate popular posts for the new category
    updateCarousel(); // Update carousel for the new category
}

// Update selected state based on localStorage
function updateSelectedState() {
    const selectedId = localStorage.getItem("selectedCategoryId");

    document.querySelectorAll(".menu-item, .nav-link").forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("data-id") === selectedId) {
            item.classList.add("active");
        }
    });
}

// Initialize the menu and content
function initializeContent() {
    updateMenu();
    fetchAndRender(); // Fetch and render posts for the initial category
    fetchAndPopulatePopularPosts(); // Fetch and populate popular posts for the initial category
    updateCarousel(); // Initialize carousel for the initial category
}

// Set up event listeners and initialize content
document.addEventListener('DOMContentLoaded', initializeContent);
window.addEventListener('storage', (event) => {
    if (event.key === 'selectedCategoryId') {
        updateMenu();
        fetchAndRender(); // Fetch and render posts when the category changes
        fetchAndPopulatePopularPosts(); // Fetch and populate popular posts when the category changes
        updateCarousel(); // Update carousel when the category changes
    }
});
