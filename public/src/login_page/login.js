import './login.css';

const API_URL = import.meta.env.VITE_API_URL;

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("savedItems", data.savedItems);
        window.location.href = "/index.html";
    } else {
        alert("Login failed: " + data.error);
    }
});

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/index.html"; // Redirect to login page
    } else {
        alert(data.error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("register-form");
    const showSignup = document.getElementById("switch-link-login");
    const showLogin = document.getElementById("switch-link-register");

    showSignup.addEventListener("click", () => {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
      });
    
    showLogin.addEventListener("click", () => {
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    document.getElementById("logo").addEventListener("click", () => {
        window.location.href = "/index.html";
    });
});
  
