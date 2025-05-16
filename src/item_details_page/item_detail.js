const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const container = document.getElementById("item-container");

const userId = localStorage.getItem("userId");

const API_URL = import.meta.env.VITE_API_URL;

if (!itemId) {
  container.innerHTML = "<p>No item ID provided.</p>";
} else {
  fetch(`${API_URL}/api/items/${itemId}`)
    .then(res => {
      if (!res.ok) throw new Error("Item not found");
      return res.json();
    })
    .then(async item => {
      const imgSrc = item.imageUrl && item.imageUrl.trim() !== ""
        ? item.imageUrl
        : "https://placehold.co/400x300?text=No+Image";

      const seller = await getSeller(userId);

      container.innerHTML = `
        <div class="item-detail-image">
          <img src="${imgSrc}" alt="${item.title}" />
        </div>
        <div class="item-detail-info">
          <h2>${item.title}</h2>
          <p class="item-price">£${item.price}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Seller:</strong> ${seller.username}</p>
        </div>
      `;
    })
    .catch(err => {
      container.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

async function getSeller(userId) {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`);
    if (!response.ok) throw new Error("Seller not found");
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error("Error fetching seller:", error);
    return { username: "Unknown Seller" };
  }
};
