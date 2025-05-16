// Removed import of CSS because it's inline in HTML or should be linked separately

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "http://localhost:5173/src/login_page/login.html";
} else {
  console.log("User is authenticated");
}

document.addEventListener("DOMContentLoaded", () => {
  fetchSavedItems();

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const contact = localStorage.getItem("contact");
  const collectionPoint = localStorage.getItem("collectionPoint");

  if (token) {
    document.getElementById("username").textContent = username || "";
    document.getElementById("email").textContent = email || "";
    document.getElementById("contact").textContent = contact || "N/A";
    document.getElementById("collectionPoint").textContent = collectionPoint || "N/A";
  }

  document.getElementById("logo").addEventListener("click", () => {
    window.location.href = "http://localhost:5173/src/index.html";
  });

  // Optional: Add Edit Profile button toggle (basic)
  const editBtn = document.getElementById("editProfileButton");
  const editForm = document.getElementById("edit-profile");
  const profileInfo = document.getElementById("profile-info");

  editBtn.addEventListener("click", () => {
    editForm.classList.toggle("hidden");
    profileInfo.classList.toggle("hidden");

    // Pre-fill inputs with current values
    document.getElementById("newFullName").value = username || "";
    document.getElementById("newEmail").value = email || "";
    document.getElementById("newCollectionPoint").value = collectionPoint || "";
  });

  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Grab new values
    const newName = document.getElementById("newFullName").value;
    const newEmail = document.getElementById("newEmail").value;
    const newCollectionPoint = document.getElementById("newCollectionPoint").value;

    // Update display
    document.getElementById("username").textContent = newName;
    document.getElementById("email").textContent = newEmail;
    document.getElementById("collectionPoint").textContent = newCollectionPoint;

    // Save changes to localStorage (you can extend this to API call)
    localStorage.setItem("username", newName);
    localStorage.setItem("email", newEmail);
    localStorage.setItem("collectionPoint", newCollectionPoint);

    // Hide form and show profile info
    editForm.classList.add("hidden");
    profileInfo.classList.remove("hidden");
  });
});

async function fetchSavedItems() {
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/get`);
    const items = await response.json();

    // If items is an object with an array property, adjust accordingly
    // Here assuming items is an array
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    displayItems(items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

function displayItems(items) {
  const itemsContainer = document.getElementById("saved-item-container");
  itemsContainer.innerHTML = "";

  if (!items || items.length === 0) {
    itemsContainer.innerHTML = "<p>No saved items yet.</p>";
    return;
  }

  items.forEach((item) => {
    const itemPriceCard = document.createElement("div");
    itemPriceCard.classList.add("item-card-price");
    itemPriceCard.dataset.category = item.category.toLowerCase();

    itemPriceCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="item-image" />
            <p class="item-title"><a href="#">${item.title}</a></p>
            <p class="item-description">${item.description}</p>
            <span class="item-price">£${parseFloat(item.price).toFixed(2)}</span>
        `;

    itemsContainer.append(itemPriceCard);
  });
}
