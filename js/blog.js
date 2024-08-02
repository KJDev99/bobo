async function fetchMenuData() {
  const apiUrl = "http://192.168.0.186:8000/api/blog/v1/categories/";
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
  menuLeft.innerHTML = leftCategories
    .map(
      (category) => `
          <a href="./blogs.html" class="menu-item" data-id="${category.id}">${category.name}</a>
      `
    )
    .join("");

  // Update right side menu
  menuRight.innerHTML = rightCategories
    .map(
      (category) => `
          <li class="nav-item">
              <a class="nav-link" href="./blogs.html" data-id="${category.id}">${category.name}</a>
          </li>
      `
    )
    .join("");

  // Add click event listeners to menu items
  document.querySelectorAll(".menu-item, .nav-link").forEach((item) => {
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
  window.location.href = "./blogs.html";
}

// Update selected state based on localStorage
function updateSelectedState() {
  const selectedId = localStorage.getItem("selectedCategoryId");

  document.querySelectorAll(".menu-item, .nav-link").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-id") === selectedId) {
      item.classList.add("active");
    }
  });
}

async function fetchAndPopulatePopularPosts() {
  const categoryId = localStorage.getItem("selectedCategoryId");
  if (!categoryId) return;

  try {
    const response = await fetch(
      `http://192.168.0.186:8000/api/blog/v1/popular/${categoryId}/`
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return;
    }

    const container = document.getElementById("popularPostsList");
    container.innerHTML = ""; // Clear previous data

    data.slice(0, 4).forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "single-post-list";
      postElement.innerHTML = `
                  <div class="thumb">
                      <img class="img-fluid popular_img" src="${
                        post.images.length > 0
                          ? post.images[0].image
                          : "img/default-image.webp"
                      }" alt="img"/>
                  </div>
                  <div class="details mt-20">
                      <div class="d-flex justify-content-between">
                      <h6>${post.title}</h6>
                        <a href="#" class="post-title" data-post-id="${
                          post.id
                        }">
                        Read More
                        </a>
                      </div>
                      <p>${new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
              `;
      container.appendChild(postElement);
    });

    // Add click event listener to post titles
    document.querySelectorAll(".post-title").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const postId =
          event.target.getAttribute("data-post-id") ||
          event.target.parentElement.getAttribute("data-post-id");
        localStorage.setItem("blogId", postId);
        window.location.href = "./blog.html";
      });
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
  }
}

async function fetchBlogData() {
  const blogId = localStorage.getItem("blogId");
  if (!blogId) {
    console.error("No blogId found in localStorage");
    return;
  }

  const apiUrl = `http://192.168.0.186:8000/api/blog/v1/blog/${blogId}/`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Update the page with fetched data
    updatePage(data);
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
}

function updatePage(data) {
  const titleElement = document.getElementById("blog-title");
  const dateElement = document.getElementById("blog-date");
  const descriptionElement = document.getElementById("blog-description");
  const slidesContainer = document.querySelector(".carousel__slides");
  const thumbnailsContainer = document.querySelector(".carousel__thumbnails");

  // Update title and date
  titleElement.textContent = data.title;
  titleElement.href = `#`;
  dateElement.innerHTML = `<span class="ti-calendar"></span>${new Date(
    data.created_at
  ).toLocaleDateString()}`;
  descriptionElement.textContent = data.description;

  // Update carousel images
  slidesContainer.innerHTML = data.images
    .map(
      (image, index) => `
      <li class="carousel__slide">
        <figure>
          <div>
            <img src="${image.image}" alt="Slide ${index + 1}" />
          </div>
        </figure>
      </li>
    `
    )
    .join("");

  thumbnailsContainer.innerHTML = data.images
    .map(
      (image, index) => `
      <li>
        <label for="slide-${index + 1}">
          <img src="${image.image}" alt="Thumbnail ${index + 1}" />
        </label>
      </li>
    `
    )
    .join("");

  // Create radio buttons for carousel
  data.images.forEach((_, index) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "slides";
    radio.id = `slide-${index + 1}`;
    if (index === 0) radio.checked = true;
    document.querySelector(".carousel").appendChild(radio);
  });

  // Add event listeners for thumbnails
  document
    .querySelectorAll(".carousel__thumbnails label")
    .forEach((label, index) => {
      label.addEventListener("click", () => {
        document.getElementById(`slide-${index + 1}`).checked = true;
      });
    });
}

// Initialize content
document.addEventListener("DOMContentLoaded", fetchBlogData);

document.addEventListener("DOMContentLoaded", function () {
    const blogId = localStorage.getItem("blogId");
    
    // Fetch comments from API
    fetch(`http://192.168.0.186:8000/api/blog/v1/blog/${blogId}/`)
      .then((response) => response.json())
      .then((data) => {
        const comments = data.comment; // Array of comments
        
        // Reverse the array
        const reversedComments = comments.slice().reverse(); 
  
        const swiperWrapper = document.querySelector(".swiper-wrapper");
  
        reversedComments.forEach((comment) => {
          const slide = document.createElement("div");
          slide.className = "swiper-slide";
          slide.innerHTML = `
            <div>
                <h4>${comment.full_name}</h4>
                <q>${comment.comment}</q>
            </div>
          `;
          swiperWrapper.appendChild(slide);
        });
  
        // Initialize Swiper
        var swiper = new Swiper(".swiper", {
          slidesPerView: 1,
          spaceBetween: 10,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          loop: true,
        });
  
        // Pause autoplay on hover
        var swiperElement = document.querySelector(".swiper");
        swiperElement.addEventListener("mouseenter", function () {
          swiper.autoplay.stop();
        });
        swiperElement.addEventListener("mouseleave", function () {
          swiper.autoplay.start();
        });
      });
  });
  

document.querySelector(".submit-btn").addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const comment = document.getElementById("comment").value;
  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackMessage = document.getElementById("feedback-message");

  let isValid = true;

  // Reset input styles
  document.getElementById("name").classList.remove("error");
  document.getElementById("phone").classList.remove("error");
  document.getElementById("comment").classList.remove("error");

  // Validate inputs
  if (!name) {
    document.getElementById("name").classList.add("error");
    showFeedback("Malumot xato yoki bosh", "error");
    isValid = false;
  }

  if (!/^\+\d{12}$/.test(phone)) {
    document.getElementById("phone").classList.add("error");
    showFeedback("Telefon raqam noto'g'ri", "error");
    isValid = false;
  }

  if (!comment) {
    document.getElementById("comment").classList.add("error");
    showFeedback("Ma'lumot to'ldiring", "error");
    isValid = false;
  }

  if (isValid) {
    // Replace with actual blogId from localStorage
    const blogId = localStorage.getItem("blogId");

    const data = {
      full_name: name,
      phone: phone,
      comment: comment,
      blog: blogId,
    };

    fetch("http://192.168.0.186:8000/api/blog/v1/comment/post/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        showFeedback("Muvofaqyatli qo'shildi", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        showFeedback("Xatolik yuz berdi", "error");
      });
  }
});

function showFeedback(message, type) {
  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackMessage = document.getElementById("feedback-message");

  feedbackMessage.textContent = message;
  feedbackMessage.className = `feedback-message ${type} show`;

  setTimeout(() => {
    feedbackMessage.classList.remove("show");
  }, 3000);
}

// Initialize the menu
function initializeContent() {
  updateMenu();
  fetchAndPopulatePopularPosts();
}

// Set up event listeners and initialize content
document.addEventListener("DOMContentLoaded", initializeContent);
window.addEventListener("storage", (event) => {
  if (event.key === "selectedCategoryId") {
    updateMenu();
    fetchAndPopulatePopularPosts();
  }
});
