async function fetchCategories() {
  try {
    const response = await fetch(
      "http://192.168.0.163:8000/api/blog/v1/categories/"
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("API ni chaqirishda xato:", error);
  }
}
function populateModal(categories) {
  const modalContent = document.querySelector(".custom-modal-content");
  modalContent.innerHTML = ""; // Oldingi ma'lumotlarni tozalash

  categories.forEach((category) => {
    const link = document.createElement("a");
    link.href = `blogs.html`; // Fayl nomini moslashtiring
    link.innerHTML = category.name.replace(/\s+/g, "&nbsp;"); // Bo'shliqlarni &nbsp; bilan almashtirish
    link.addEventListener("click", () => {
      localStorage.setItem("selectedCategoryId", category.id);
    });
    modalContent.appendChild(link);
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  const categories = await fetchCategories();
  if (categories) {
    populateModal(categories);
  }
});
