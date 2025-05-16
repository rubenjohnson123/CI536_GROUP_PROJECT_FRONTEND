import './main.css';
import './chatbot.js';

const API_URL = import.meta.env.VITE_API_URL;

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    fetchItems();

    const token = localStorage.getItem("token");

    const navButton = document.getElementById("login-logout-button");
    
    const openButton = document.getElementById("open-menu-button");
    const closeButton = document.getElementById("close-menu-button");
    const hiddenMenu = document.getElementById("off-screen-menu");
    const searchNav = document.getElementById("search-nav");
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-term");
    const navLogo = document.getElementById("nav-logo");
    const itemBoxContainer = document.getElementById("item-box-container");
    const categoryHeading = document.getElementById("category-heading");
    const sellItemLink = document.getElementById("sell-item-link");
    const categoryLinks = document.querySelectorAll(".category-links");

    if (!navButton) return;

    if (token) {
        navButton.textContent = `Logout`;
        navButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            console.log("Logged out");
            location.reload();
        });
    } else {
        navButton.textContent = `Login`;
        navButton.addEventListener("click", () => {
            window.location.href = "./src/login_page/login.html";
        });
    }

    navLogo.addEventListener("click", () => {
        window.location.href = "./src/index.html";
    });

    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            document.getElementById("search-button").click();
        }   
    });

    searchButton.addEventListener("click", function () {
        const loader = document.querySelector(".loader");

        loader.classList.remove("loader-hidden");
        itemBoxContainer.classList.add("hidden");
        categoryHeading.classList.add("hidden");

        const searchQuery = document.getElementById("search-term").value.toLowerCase();

        setTimeout(() => {
            const items = document.querySelectorAll(".item-card-price");

            items.forEach(item => {
                const title = item.querySelector(".item-title").textContent.toLowerCase() + item.querySelector(".item-description").textContent.toLowerCase();
                item.style.display = title.includes(searchQuery) ? "block" : "none";
            });
            
            loader.classList.add("loader-hidden");
        }, 100);
    });

    closeButton.addEventListener("click", () => {
        hiddenMenu.classList.add("hidden");
        searchNav.classList.remove("hidden");
    });

    openButton.addEventListener("click", () => {
        hiddenMenu.classList.remove("hidden");
        searchNav.classList.add("hidden");
    });

    categoryLinks.forEach(a => {
        a.addEventListener("click", () => {
            const loader = document.querySelector(".loader");

            loader.classList.remove("loader-hidden");
            itemBoxContainer.classList.add("hidden");
            categoryHeading.textContent = a.textContent;

            setTimeout(() => {
                const items = document.querySelectorAll(".item-card-price");

                items.forEach(item => {
                    const category = item.dataset.category;
                    item.style.display = category.includes(a.textContent.toLowerCase()) ? "block" : "none";
                });

                loader.classList.add("loader-hidden");
            }, 100);
        })
    })
});

async function fetchItems() {
    try {
        const response = await fetch(`${API_URL}/api/items`);
        const items = await response.json();
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        displayItems(items);
        loadSavedItems();
        checkSavedItems(items);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

function displayItems(items) {
    const foodAndGroceriesContainer = document.getElementById("food-and-groceries-container");
    foodAndGroceriesContainer.innerHTML = ""; 
    let foodAndGroceriesCount = 0;
    const fashionAndClothingContainer = document.getElementById("fashion-and-clothing-container");
    fashionAndClothingContainer.innerHTML = ""; 
    let fashionAndClothingCount = 0;
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = ""; 
    let booksCount = 0;
    const gamingContainer = document.getElementById("gaming-container")
    gamingContainer.innerHTML = "";
    let gamingCount = 0;

    const itemsContainer = document.getElementById("item-container");
    itemsContainer.innerHTML= "";

    items.forEach(item => {
        
        const itemImageCard = document.createElement("div");
        itemImageCard.classList.add("item-card");
        itemImageCard.dataset.category = item.category.toLowerCase(); 

        const itemPriceCard = document.createElement("div");
        itemPriceCard.classList.add("item-card-price")
        itemPriceCard.dataset.category = item.category.toLowerCase(); 
        
        itemImageCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
            <button class="button save-button" data-id=${item._id}>Save</button>
        `;

        itemPriceCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="item-image">
            <p class="item-title"><a href="#">${item.title}</a></p>
            <p class="item-description"><a>${item.description}</a></p>
            <span class="item-price">${"£"+parseFloat(item.price).toFixed(2)}</span>
            <button class="button save-button" data-id=${item._id}>Save</button>
        `;
        
        if (item.category.toLowerCase() == "food & groceries" && foodAndGroceriesCount < 4) {
            foodAndGroceriesContainer.appendChild(itemImageCard);
            foodAndGroceriesCount++;
        }
        if (item.category.toLowerCase() == "fashion & clothing" && fashionAndClothingCount < 4) {
            fashionAndClothingContainer.appendChild(itemImageCard);
            fashionAndClothingCount++;
        }
        if (item.category.toLowerCase() == "books" && booksCount < 4) {
            booksContainer.appendChild(itemImageCard);
            booksCount++;
        }
        if (item.category.toLowerCase() == "gaming" && gamingCount < 4) {
            gamingContainer.appendChild(itemImageCard);
            gamingCount++;
        }

        itemsContainer.append(itemPriceCard);

        itemPriceCard.addEventListener('click', () => {
            window.location.href = ('./src/item_details_page/item_detail.html?id='  + encodeURIComponent(item._id));
        });
        itemImageCard.addEventListener('click', () => {
            window.location.href = ('./src/item_details_page/item_detail.html?id='  + encodeURIComponent(item._id));
        });
    });
}

function loadSavedItems() {
    const saveButtons = document.querySelectorAll(".save-button");
    saveButtons.forEach(button => {
        button.addEventListener("click", async function (e) {
            e.stopPropagation();
            const itemId = this.dataset.id;
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!token) {
                alert("Please log in to save items.");
                return;
            }

            if (this.classList.contains("save-button-active")) {
                // If the item is already saved, attempt to remove it
                await removeSavedItem(itemId, token, userId, this);
            } else {
                // If the item is not saved, attempt to save it
                await saveItem(itemId, token, userId, this);
            }
        });
    });
}

async function saveItem(itemId, token, userId) {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}/save`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Item saved successfully");
            checkSavedItems();
        } else {
            alert(data.error || "Something went wrong.");
        }
    } catch (err) {
        console.error("Error saving item:", err);
        alert("Failed to save item.");
    }
}

async function removeSavedItem(itemId, token, userId) {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}/remove`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Item removed from saved list");
            checkSavedItems();
        } else {
            alert(data.error || "Something went wrong.");
        }
    } catch (err) {
        console.error("Error removing item:", err);
        alert("Failed to remove item.");
    }
}

async function checkSavedItems() {
    const saveButtons = document.querySelectorAll(".save-button");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/users/${userId}/get`);
        const savedItems = await response.json();

        saveButtons.forEach(button => {
            const isSaved = savedItems.some(item => item._id.toString() === button.dataset.id);
            if (isSaved) {
                button.classList.add("save-button-active");
                button.textContent = "Saved";
            } else {
                button.classList.remove("save-button-active");
                button.textContent = "Save";
            }
        });
    } catch (err) {
        console.error("Error accessing saved items:", err);
    }
}

/*
document.getElementById("add-item-btn").addEventListener("click", function () {
    document.getElementById("add-item-form-container").classList.toggle("hidden");
});

document.getElementById("add-item-form").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const newItem = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        imageUrl: document.getElementById("imageUrl").value,
        location: document.getElementById("location").value,
        category: document.getElementById("category").value
    };

    try {
        const response = await fetch("http://localhost:5000/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            alert("Item added successfully!");
            fetchItems(); 
            document.getElementById("add-item-form").reset();
            document.getElementById("add-item-form-container").classList.add("hidden");
        } else {
            alert("Error adding item.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
*/


