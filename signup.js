// API Base URL
const API_URL = 'http://localhost:3000';

// Signup Form Validation and Data Storage
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Get submit button
            const submitBtn = signupForm.querySelector('.signUp-btn');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            try {
                // Get form values
                const username = document.getElementById('username').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                // Validation
                if (!validateSignup(username, email, password, confirmPassword)) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    return false;
                }

                // Check if user already exists using async GET request
                const userExists = await checkUserExists(username, email);
                
                if (userExists) {
                    showMessage('Username or email already exists!', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    return false;
                }

                // Create user object
                const newUser = {
                    username: username,
                    email: email,
                    password: password, 
                    createdAt: new Date().toISOString()
                };

                // Save user to database using async POST request
                const success = await createUser(newUser);
                
                if (success) {
                    showMessage('Account created successfully! Redirecting to login...', 'success');

                    // Clear form
                    signupForm.reset();

                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 2000);
                } else {
                    showMessage('Error creating account. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('An unexpected error occurred. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }

            return false;
        });
    }
});

// Async function to check if user exists
async function checkUserExists(username, email) {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        return users.some(user => user.username === username || user.email === email);
    } catch (error) {
        console.error('Error checking user:', error);
        showMessage('Error connecting to server. Please make sure json-server is running.', 'error');
        return true; // Prevent signup if server is not available
    }
}

// Async function to create new user
async function createUser(userData) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const newUser = await response.json();
            console.log('User created:', newUser);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error creating user:', error);
        showMessage('Error connecting to server. Please make sure json-server is running.', 'error');
        return false;
    }
}

function validateSignup(username, email, password, confirmPassword) {
    // Username validation
    if (username.length < 3) {
        showMessage('Username must be at least 3 characters long', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    // Password validation
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return false;
    }

    // Check if password contains at least one number
    if (!/\d/.test(password)) {
        showMessage('Password must contain at least one number', 'error');
        return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
    }

    return true;
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
`;
document.head.appendChild(style);
