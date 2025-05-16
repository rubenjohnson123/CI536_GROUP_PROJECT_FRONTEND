import { io } from 'socket.io-client'; // Import Socket.IO client

document.addEventListener("DOMContentLoaded", () => {
    const socket = io('http://localhost:5000');  
    console.log("hi");

    const searchInput = document.getElementById('Search-User');
    const contactList = document.querySelector('.contact-list');
    const chatHeader = document.querySelector('.chat-header h2');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const sendAudio = document.getElementById('sendAudio'); 

    const currentUser = localStorage.getItem("username");
    let currentChatUser = null;
    let selectedContactElement = null;
    const savedContacts = new Set(); 

    if (!currentUser) {
        window.location.href = "http://localhost:5173/src/login_page/login.html";
        return;
    }

    document.getElementById("loggedInUser").textContent = `Logged in as ${currentUser}`;

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim().toLowerCase();
        contactList.innerHTML = '';

        if (!query) {
            
            savedContacts.forEach(username => {
                createContactListItem({ username });
            });
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/users?q=${query}`);
            const users = await res.json();
            console.log(users);

            const filteredUsers = users.filter(user => user.username !== currentUser);

            filteredUsers.forEach(user => {
                createContactListItem(user);
            });
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    });

    function createContactListItem(user) {
        const li = document.createElement('li');
        li.textContent = user.username;
        li.classList.add('contact');

        if (user.username === currentChatUser) {
            li.classList.add('selected');
            selectedContactElement = li;
        }

        li.addEventListener('click', () => {
            openChat(user.username);
            if (selectedContactElement) {
                selectedContactElement.classList.remove('selected');
            }
            li.classList.add('selected');
            selectedContactElement = li;

        
            savedContacts.add(user.username); // shoul dsva eit 
        });

        contactList.appendChild(li);
    }

    async function openChat(username) {
        currentChatUser = username;
        chatHeader.textContent = `Chat with ${username}`;
        messagesContainer.innerHTML = '';

        const savedMessages = JSON.parse(localStorage.getItem(`${currentUser}_${username}`)) || [];

        savedMessages.forEach(msg => {
            if (msg && msg.from && msg.content) { 
                const msgDiv = document.createElement('div');
                msgDiv.textContent = `${msg.from === currentUser ? 'You' : msg.from}: ${msg.content}`;
                msgDiv.classList.add(msg.from === currentUser ? 'msg-right' : 'msg-left');
                messagesContainer.appendChild(msgDiv);
            }
        });
    }

    sendBtn.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (!text || !currentChatUser) return;

        sendAudio.play();

        const message = {
            from: currentUser,
            to: currentChatUser,
            content: text,
        };

        saveMessageToLocalStorage(message);
       
        socket.emit('chat message', message, (response) => {
            console.log('Server Response:', response);
            messageInput.value = '';
        });
    });

    socket.on('chat message', (msg) => {
        const { from, to, text } = msg;

        if (
            currentUser &&
            currentChatUser &&
            (
                (from === currentChatUser && to === currentUser) ||
                (from === currentUser && to === currentChatUser)
            )
        ) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add(from === currentUser ? 'msg-right' : 'msg-left');
            msgDiv.textContent = `${from === currentUser ? 'You' : from}: ${text}`;
            messagesContainer.appendChild(msgDiv);

            
            if (msg && msg.from && msg.content) { 
                saveMessageToLocalStorage(msg);
            }
        }
    });

    function saveMessageToLocalStorage(message) {
        if (message && message.from && message.content) { 
            const chatKey = `${currentUser}_${currentChatUser}`;
            const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];

            savedMessages.push(message);

            
            localStorage.setItem(chatKey, JSON.stringify(savedMessages));
        }
    }
});
