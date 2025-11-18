# AuthHub - Database Setup with JSON Server

This project now uses **json-server** to store user signup details in a `db.json` file. All JavaScript code uses **async/await** functions with **POST** and **GET** requests.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js installed on your computer
- npm (comes with Node.js)

### Step 1: Install Dependencies

Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install `json-server` which acts as a REST API server.

### Step 2: Start the JSON Server

Run one of these commands:

```bash
npm start
```
or
```bash
npm run server
```

You should see output like:
```
\{^_^}/ hi!

Loading db.json
Done

Resources
http://localhost:3000/users

Home
http://localhost:3000
```

**Keep this terminal window open!** The server needs to be running for the app to work.

### Step 3: Open the Application

1. Open a **new terminal window** (keep the json-server running)
2. Start a local web server. You can use:
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server -p 8000`
   - VS Code Live Server extension

3. Open your browser and navigate to:
   - Landing Page: `http://localhost:8000/landing.html`
   - Signup Page: `http://localhost:8000/index.html`
   - Login Page: `http://localhost:8000/home.html`

## 📊 How It Works

### Database Structure (`db.json`)

The `db.json` file stores all user data:

```json
{
  "users": [
    {
      "id": 1,
      "username": "john123",
      "email": "john@example.com",
      "password": "password123",
      "createdAt": "2024-01-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "username": "jane456",
      "email": "jane@example.com",
      "password": "mypass456",
      "createdAt": "2024-01-02T14:30:00.000Z"
    }
  ]
}
```

### API Endpoints

JSON Server automatically creates these endpoints:

- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get a specific user by ID
- **POST** `/users` - Create a new user
- **PUT** `/users/:id` - Update a user
- **PATCH** `/users/:id` - Partially update a user
- **DELETE** `/users/:id` - Delete a user

### Code Implementation

#### 1. **Signup (POST Request)**

File: `signup.js`

```javascript
// Async function to create new user
async function createUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/users', {
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
        return false;
    }
}
```

**What it does:**
- Sends POST request to create new user
- Uses `async/await` for cleaner code
- Stores user data in `db.json`
- Returns true if successful

#### 2. **Check User Exists (GET Request)**

File: `signup.js`

```javascript
// Async function to check if user exists
async function checkUserExists(username, email) {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        
        return users.some(user => user.username === username || user.email === email);
    } catch (error) {
        console.error('Error checking user:', error);
        return true;
    }
}
```

**What it does:**
- Sends GET request to fetch all users
- Checks if username or email already exists
- Prevents duplicate accounts

#### 3. **Login (GET Request)**

File: `login.js`

```javascript
// Async function to authenticate user
async function authenticateUser(username, password) {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        
        // Find user with matching credentials
        const user = users.find(u => u.username === username && u.password === password);
        
        return user || null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}
```

**What it does:**
- Sends GET request to fetch all users
- Finds user with matching username and password
- Returns user object if found

#### 4. **Load User Data (GET by ID)**

File: `welcome.js`

```javascript
// Async function to get user by ID
async function getUserById(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('User not found');
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
```

**What it does:**
- Sends GET request to fetch specific user by ID
- Displays user information on dashboard
- Uses stored user ID from localStorage

## 🔍 Viewing Database Contents

### Method 1: Open `db.json` File
Simply open the `db.json` file in your text editor to see all users.

### Method 2: Use Browser
Navigate to `http://localhost:3000/users` to view all users in JSON format.

### Method 3: Use API Testing Tool
Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## 📝 Testing the Application

### Test Signup:
1. Make sure json-server is running
2. Go to signup page
3. Fill in the form:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Click "Sign Up"
5. Check `db.json` - you should see the new user!

### Test Login:
1. Go to login page
2. Enter the credentials you just created
3. Click "Login"
4. You should be redirected to the dashboard

### View All Users:
1. Open browser console (F12)
2. When you signup or login, check the console logs
3. Or visit `http://localhost:3000/users` directly

## 🛠️ Troubleshooting

### Error: "Cannot connect to server"
**Solution:** Make sure json-server is running in a terminal window
```bash
npm start
```

### Error: "Port 3000 already in use"
**Solution:** Change the port in package.json:
```json
"start": "json-server --watch db.json --port 3001"
```
Then update the API_URL in all JS files:
```javascript
const API_URL = 'http://localhost:3001';
```

### db.json is empty or lost data
**Solution:** The file should start with:
```json
{
  "users": []
}
```

### CORS errors
**Solution:** JSON Server handles CORS automatically. If issues persist, try:
```bash
json-server --watch db.json --port 3000 --no-cors
```

## 🎯 Key Features

✅ **Async/Await**: All database operations use modern async/await syntax  
✅ **POST Requests**: User signup data is saved via POST to db.json  
✅ **GET Requests**: Login and user data fetching via GET from db.json  
✅ **Real Database**: All user data persists in db.json file  
✅ **View All Users**: Open db.json to see all registered users  
✅ **REST API**: Full REST API powered by json-server  
✅ **Error Handling**: Proper try-catch blocks for all async operations  
✅ **Console Logging**: All operations logged to browser console  

## 📱 Application Flow

1. **Signup Page** → POST to `/users` → Saves to db.json
2. **Login Page** → GET from `/users` → Finds matching user
3. **Dashboard** → GET from `/users/:id` → Displays user info
4. **Logout** → Clears localStorage → Redirects to landing

## 🔐 Security Notes

⚠️ **Important**: This is a basic implementation for learning purposes.

For production use, you should:
- Hash passwords (use bcrypt)
- Implement JWT authentication
- Use HTTPS
- Add rate limiting
- Validate data on server side
- Use a real database (MongoDB, PostgreSQL, etc.)
- Never store passwords in plain text

## 📚 Additional Resources

- [json-server documentation](https://github.com/typicode/json-server)
- [Fetch API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Async/Await guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

## 🎉 You're All Set!

Your authentication system is now using a real database with async/await and REST API calls. Happy coding! 🚀
