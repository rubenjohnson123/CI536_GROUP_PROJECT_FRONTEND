const chatbotIcon = document.getElementById('chatbot-icon');
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-message');
const chatLog = document.getElementById('chat-log');

chatbotIcon.addEventListener('click', () => {
  chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
});


sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  chatLog.innerHTML += `
    <div class="chat-bubble user">
      <strong>You:</strong> ${message} <span class="timestamp">${getTimeStamp()}</span>
    </div>`;
  userInput.value = '';
 

  userInput.focus();

  try {
    const res = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json(); 

    chatLog.innerHTML += `
      <div class="chat-bubble bot">
        <strong>Bot:</strong> ${data.response} <span class="timestamp">${getTimeStamp()}</span>
      </div>`;

    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    chatLog.innerHTML += `<div><strong>Bot:</strong> Error talking to server.</div>`;
  }
});

function getTimeStamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    chatWindow.style.display = 'none';
  }
});

