const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

if (!token) {
    window.location.href = 'src/login_page/login.html';
} else {
    console.log('User is authenticated');
}

document.getElementById("sellForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newItem = {
    seller: userId,
    title: document.getElementById("itemName").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    imageUrl: document.getElementById("itemImage").value,
    location: document.getElementById("location").value,
    category: document.getElementById("category").value
  };

  try {
    const res = await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (res.ok) {
      alert("Item submitted successfully!");
      window.location.href = "src/profi_page/profile.html";
    } else {
      alert("Failed to submit item.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred.");
  }
});
