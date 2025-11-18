// API Base URL
const API_URL = 'http://localhost:3000';

// Login Form Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('signUp-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Validation
            if (!username || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            // Authenticate user using async GET request
            const user = await authenticateUser(username, password);

            if (user) {
                // Store current logged-in user ID in localStorage
                localStorage.setItem('currentUserId', user.id);
                
                showMessage('Login successful! Redirecting...', 'success');

                // Redirect to welcome page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1500);
            } else {
                showMessage('Invalid username or password', 'error');
                
                // Shake animation for error
                loginForm.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 500);
            }
        });
    }
});

// Async function to authenticate user
async function authenticateUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/users`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        
        // Find user with matching username and password
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log('User authenticated:', user);
            return user;
        }
        
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        showMessage('Error connecting to server. Please make sure json-server is running.', 'error');
        return null;
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;

    document.body.appendChild(messageDiv);

    // Remove message after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
