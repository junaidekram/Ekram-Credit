const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// Data file path - use persistent storage
const dataPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/data/users.json'  // Render persistent storage
    : path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    try {
        const dataDir = process.env.NODE_ENV === 'production' 
            ? '/tmp/data' 
            : path.join(__dirname, 'data');
        await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
        console.log('Data directory already exists');
    }
}

// Initialize default user data
const defaultUsers = {
    "Nazish Ekram": {
        tier: "Gold",
        tokens: 5000,
        cardNumber: "1100-3451-6671-2293",
        securityCode: "847",
        amountDue: 0,
        password: "K9#mP$vL2@nQ8"
    },
    "Sahir Hoda": {
        tier: "Gold",
        tokens: 5000,
        cardNumber: "4410-6700-1120-2244",
        securityCode: "392",
        amountDue: 0,
        password: "X7$hR#jN5&kM9"
    },
    "Tashfeen Ekram": {
        tier: "Gold Honors",
        tokens: 7500,
        cardNumber: "7422-1399-4949-7777",
        securityCode: "156",
        amountDue: 0,
        password: "B4@wE%tY6!pL3"
    },
    "Saudah Mirza": {
        tier: "Gold Honors",
        tokens: 7500,
        cardNumber: "4422-3199-2949-7777",
        securityCode: "734",
        amountDue: 0,
        password: "F8#qA$mC7^dK1"
    },
    "Yasmeen Ekram": {
        tier: "Gold Priority",
        tokens: 5000,
        cardNumber: "2241-8284-7211-2170",
        securityCode: "581",
        amountDue: 0,
        password: "Z2&sI@bV9#gH5"
    },
    "Jawaid Ekram": {
        tier: "Gold Priority",
        tokens: 5000,
        cardNumber: "7111-8112-1212-7482",
        securityCode: "267",
        amountDue: 0,
        password: "U6!oP%jX4$rT8"
    },
    "Abdurrahman Hoda": {
        tier: "Silver Honors",
        tokens: 3000,
        cardNumber: "6757-7767-1677-2267",
        securityCode: "943",
        amountDue: 0,
        password: "L3^cW#nE7@yB2"
    },
    "Abdullah Hoda": {
        tier: "Silver",
        tokens: 2500,
        cardNumber: "8494-3783-4224-6142",
        securityCode: "425",
        amountDue: 0,
        password: "D9$fM&hQ5!kR6"
    },
    "Afiya Hoda": {
        tier: "Silver",
        tokens: 2500,
        cardNumber: "9491-9611-0102-4300",
        securityCode: "678",
        amountDue: 0,
        password: "G1#tN@vJ8%lS4"
    },
    "Sahrish Ekram": {
        tier: "Gold",
        tokens: 5000,
        cardNumber: "0780-2949-0771-6789",
        securityCode: "319",
        amountDue: 0,
        password: "H7&aO!bK3^cP9"
    },
    "Ramim Bhuiya": {
        tier: "Gold",
        tokens: 5000,
        cardNumber: "1111-2359-0070-7579",
        securityCode: "852",
        amountDue: 0,
        password: "I4@eL$fM6#gQ2"
    },
    "Mariya Ekram": {
        tier: "Bronza Priority",
        tokens: 1000,
        cardNumber: "6422-5510-6218-1285",
        securityCode: "147",
        amountDue: 0,
        password: "J8!hN%iR5&kS7"
    }
};

// Initialize data file if it doesn't exist
async function initializeData() {
    try {
        await fs.access(dataPath);
        console.log('Data file exists');
    } catch (error) {
        console.log('Creating data file with default users');
        await fs.writeFile(dataPath, JSON.stringify(defaultUsers, null, 2));
    }
}

// API Routes

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// GET specific user
app.get('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
        
        if (data[username]) {
            res.json(data[username]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error reading user:', error);
        res.status(500).json({ error: 'Failed to load user' });
    }
});

// PUT update user
app.put('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { tokens, amountDue } = req.body;
        
        const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
        
        if (data[username]) {
            data[username] = { 
                ...data[username], 
                tokens: tokens || data[username].tokens,
                amountDue: amountDue !== undefined ? amountDue : data[username].amountDue
            };
            
            await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
            res.json(data[username]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// POST new user
app.post('/api/users', async (req, res) => {
    try {
        const { name, userData } = req.body;
        
        if (!name || !userData) {
            return res.status(400).json({ error: 'Name and user data are required' });
        }
        
        const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
        
        // Check if user already exists
        if (data[name]) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        // Add new user
        data[name] = userData;
        
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
        
        res.status(201).json({
            success: true,
            user: data[name],
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// POST new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { username, amount, tokensUsed, remainingAmount } = req.body;
        
        const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
        
        if (data[username]) {
            // Update user's tokens and amount due
            data[username].tokens = Math.max(0, data[username].tokens - tokensUsed);
            data[username].amountDue = (data[username].amountDue || 0) + remainingAmount;
            
            await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
            
            res.json({
                success: true,
                user: data[username],
                transaction: {
                    amount,
                    tokensUsed,
                    remainingAmount
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ error: 'Failed to process transaction' });
    }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Simple authentication - you can enhance this
        const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
        
        if (data[username]) {
            // For demo purposes, accept any password
            // In production, you'd verify against stored passwords
            res.json({
                success: true,
                user: data[username],
                userType: username === 'admin' ? 'admin' : 'user'
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
    await ensureDataDirectory();
    await initializeData();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`API docs: http://localhost:${PORT}/api/users`);
    });
}

startServer().catch(console.error);
