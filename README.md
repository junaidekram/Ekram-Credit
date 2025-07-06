# Ekram Credit Management System

A comprehensive credit management web application with user authentication, token-based transactions, and real-time data synchronization.

## Features

- **User Authentication**: Login system for admin and individual users
- **Token Management**: 1 token = 1 cent conversion system
- **Real-time Dashboard**: Live updates of user tokens and amounts due
- **Transaction Flow**: Multi-step credit card processing simulation
- **Tier-based System**: Gold, Silver, Bronze tiers with Priority and Honors designations
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: JSON file storage (can be upgraded to MongoDB/PostgreSQL)
- **Deployment**: Render (free tier)

## Local Development

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/junaidekram/Ekram-Credit.git
   cd Ekram-Credit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:username` - Get specific user
- `PUT /api/users/:username` - Update user data

### Transactions
- `POST /api/transactions` - Process new transaction

### Health Check
- `GET /health` - Server health status

## Deployment on Render

### Step 1: Prepare Your Repository
Ensure your GitHub repository contains:
- `package.json` with dependencies
- `server.js` (main server file)
- All frontend files (HTML, CSS, JS)

### Step 2: Deploy on Render

1. **Sign up** at [render.com](https://render.com)
2. **Connect your GitHub account**
3. **Create a new Web Service**
4. **Select your repository**: `junaidekram/Ekram-Credit`
5. **Configure the service**:
   - **Name**: `ekram-credit-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - You'll get a URL like: `https://ekram-credit-app.onrender.com`

### Step 3: Set Persistent Storage

1. **Go to your Render service dashboard**
2. **Click on "Environment" tab**
3. **Add a new environment variable**:
   - **Key**: `PERSISTENT_STORAGE_PATH`
   - **Value**: `/tmp/data`
4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - You'll get a URL like: `https://ekram-credit-app.onrender.com`

## User Management

### Default Users
The system comes with pre-configured users:

**Admin Users:**
- Username: `admin` (any password)

**Regular Users:**
- Nazish Ekram (Gold Tier)
- Sahir Hoda (Gold Tier)
- Tashfeen Ekram (Gold Honors)
- Saudah Mirza (Gold Honors)
- Yasmeen Ekram (Gold Priority)
- Jawaid Ekram (Gold Priority)
- Abdurrahman Hoda (Silver Honors)
- Abdullah Hoda (Silver Tier)
- Afiya Hoda (Silver Tier)
- Sahrish Ekram (Gold Tier)
- Ramim Bhuiya (Gold Tier)
- Mariya Ekram (Bronza Priority)

## Token System

- **1 Token = 1 Cent**
- Users can pay with tokens first
- Remaining amount goes to "Amount Due"
- Tokens are automatically deducted during transactions

## File Structure

```
Ekram-Credit/
├── server.js              # Express server
├── package.json           # Dependencies
├── README.md             # This file
├── index.html            # Login page
├── dashboard.html        # Admin dashboard
├── user-dashboard.html   # User dashboard
├── amount.html           # Amount entry page
├── script.js             # Frontend JavaScript
├── style.css             # Styling
├── user_data.json        # User data (legacy)
└── data/                 # Backend data storage
    └── users.json        # User data (active)
```

## Support

For support or questions, please open an issue on GitHub or contact the development team.
