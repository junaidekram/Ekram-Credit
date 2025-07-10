# Ekram Credit Management System

A comprehensive credit management web application with user authentication, token-based transactions, and real-time data synchronization.

## Features

- **User Authentication**: Login system for admin and individual users
- **Token Management**: 1 token = 1 cent conversion system
- **Real-time Dashboard**: Live updates of user tokens and amounts due
- **Transaction Flow**: Multi-step credit card processing simulation
- **Tier-based System**: Gold, Silver, Bronze tiers with Priority and Honors designations
- **Responsive Design**: Works on desktop and mobile devices
- **Persistent Data**: MongoDB Atlas cloud database for data persistence

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (cloud database)
- **Deployment**: Render (free tier)

## Local Development

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- MongoDB Atlas account (free)

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Set Up Database**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `ekram-credit`

3. **Get Your Connection String**
   - It should look like: `mongodb+srv://username:password@cluster.mongodb.net/ekram-credit?retryWrites=true&w=majority`

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

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekram-credit?retryWrites=true&w=majority
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:username` - Get specific user
- `PUT /api/users/:username` - Update user data
- `POST /api/users` - Create new user

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

6. **Set Environment Variables**
   - Go to the "Environment" tab
   - Add your MongoDB connection string:
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB Atlas connection string

7. **Deploy**
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
└── style.css             # Styling
```

## Data Persistence

The application now uses MongoDB Atlas for persistent data storage. This means:
- Data survives server restarts
- Data persists through Render's sleep/wake cycles
- No data loss when the server goes inactive
- Real-time synchronization across all users

## Support

For support or questions, please open an issue on GitHub or contact the development team.
