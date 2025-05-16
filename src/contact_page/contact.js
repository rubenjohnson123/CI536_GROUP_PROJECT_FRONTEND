// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.getElementById("contact-form");
//   form.addEventListener("submit", function (event) {
//     alert("Your message has been sent!");
//   });

//   document.getElementById("logo").addEventListener("click", () => {
//     window.location.href = "http://localhost:5173/src/index.html";

//   });

// });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      firstname: document.getElementById('firstname').value,
      surname: document.getElementById('surname').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      info: document.querySelector('input[name="information"]:checked')?.value || 'no'
    };

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      alert(result.message);
    } catch (err) {
      alert('Error sending message.');
      console.error(err);
    }
  });


  document.getElementById("logo").addEventListener("click", () => {
    window.location.href = "http://localhost:5173/src/index.html";

  });



});
