// API Base URL
const API_URL = 'http://localhost:3000';

// Welcome Page JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (!currentUserId) {
        // Redirect to login if not logged in
        window.location.href = 'home.html';
        return;
    }

    // Fetch and display user information using async GET request
    const currentUser = await getUserById(currentUserId);
    
    if (currentUser) {
        displayUserInfo(currentUser);
    } else {
        showMessage('Error loading user data', 'error');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
        return;
    }
    
    // Update time
    updateTime();
    setInterval(updateTime, 1000);

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Add animation to cards
    animateCards();
});

// Async function to get user by ID
async function getUserById(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }
        
        const user = await response.json();
        console.log('User data loaded:', user);
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        showMessage('Error connecting to server. Please make sure json-server is running.', 'error');
        return null;
    }
}

function displayUserInfo(user) {
    // Display username in multiple places
    const usernameDisplays = [
        document.getElementById('username-display'),
        document.getElementById('user-name')
    ];
    
    usernameDisplays.forEach(element => {
        if (element) {
            element.textContent = user.username;
        }
    });

    // Display account information
    const infoUsername = document.getElementById('info-username');
    const infoEmail = document.getElementById('info-email');
    const infoDate = document.getElementById('info-date');

    if (infoUsername) {
        infoUsername.textContent = user.username;
    }

    if (infoEmail) {
        infoEmail.textContent = user.email;
    }

    if (infoDate && user.createdAt) {
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        infoDate.textContent = formattedDate;
    }
}

function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function handleLogout() {
    // Show confirmation
    const confirmed = confirm('Are you sure you want to logout?');
    
    if (confirmed) {
        // Remove current user ID from localStorage
        localStorage.removeItem('currentUserId');
        
        // Show logout message
        showMessage('Logging out...', 'success');
        
        // Redirect to landing page after a short delay
        setTimeout(() => {
            window.location.href = 'landing.html';
        }, 1000);
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
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;

    document.body.appendChild(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function animateCards() {
    // Add click handlers to dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Add click handlers to action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            if (action.includes('Delete Account')) {
                const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
                if (confirmed) {
                    showMessage('Account deletion feature coming soon!', 'error');
                }
            } else {
                showMessage(`${action} feature coming soon!`, 'success');
            }
        });
    });

    // Add click handlers to card buttons
    const cardBtns = document.querySelectorAll('.card-btn');
    cardBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.textContent.trim();
            showMessage(`${action} feature coming soon!`, 'success');
        });
    });
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
`;
document.head.appendChild(style);
