const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ekram-credit';
let db;

// MongoDB connection options
const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority',
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

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

// Initialize database with default users
async function initializeDatabase() {
    try {
        const collection = db.collection('users');
        const count = await collection.countDocuments();
        
        if (count === 0) {
            console.log('Initializing database with default users');
            const usersArray = Object.entries(defaultUsers).map(([name, data]) => ({
                name,
                ...data
            }));
            await collection.insertMany(usersArray);
            console.log('Default users added to database');
        } else {
            console.log('Database already has users');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// API Routes

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const collection = db.collection('users');
        const users = await collection.find({}).toArray();
        
        // Convert back to the expected format
        const usersObject = {};
        users.forEach(user => {
            const { name, ...userData } = user;
            usersObject[name] = userData;
        });
        
        res.json(usersObject);
    } catch (error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// GET specific user
app.get('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const collection = db.collection('users');
        const user = await collection.findOne({ name: username });
        
        if (user) {
            const { name, ...userData } = user;
            res.json(userData);
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
        
        const collection = db.collection('users');
        const user = await collection.findOne({ name: username });
        
        if (user) {
            const updateData = {};
            if (tokens !== undefined) updateData.tokens = tokens;
            if (amountDue !== undefined) updateData.amountDue = amountDue;
            
            await collection.updateOne(
                { name: username },
                { $set: updateData }
            );
            
            const updatedUser = await collection.findOne({ name: username });
            const { name, ...userData } = updatedUser;
            res.json(userData);
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
        
        const collection = db.collection('users');
        
        // Check if user already exists
        const existingUser = await collection.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        // Add new user
        const newUser = {
            name,
            ...userData
        };
        
        await collection.insertOne(newUser);
        
        res.status(201).json({
            success: true,
            user: userData,
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
        
        const collection = db.collection('users');
        const user = await collection.findOne({ name: username });
        
        if (user) {
            // Update user's tokens and amount due
            const newTokens = Math.max(0, user.tokens - tokensUsed);
            const newAmountDue = (user.amountDue || 0) + remainingAmount;
            
            await collection.updateOne(
                { name: username },
                { 
                    $set: { 
                        tokens: newTokens,
                        amountDue: newAmountDue
                    }
                }
            );
            
            const updatedUser = await collection.findOne({ name: username });
            const { name, ...userData } = updatedUser;
            
            res.json({
                success: true,
                user: userData,
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
        
        const collection = db.collection('users');
        const user = await collection.findOne({ name: username });
        
        if (user) {
            // For demo purposes, accept any password
            // In production, you'd verify against stored passwords
            const { name, ...userData } = user;
            res.json({
                success: true,
                user: userData,
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

// Connect to MongoDB and start server
async function startServer() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Validate connection string
        if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/ekram-credit') {
            console.log('No MongoDB URI provided, using file storage...');
            await startWithFileStorage();
            return;
        }
        
        // Try different connection approaches
        let client;
        
        // First attempt: with TLS options
        try {
            client = new MongoClient(MONGODB_URI, mongoOptions);
            await client.connect();
            console.log('Connected to MongoDB successfully with TLS options');
        } catch (error) {
            console.log('First connection attempt failed, trying without TLS options...');
            
            // Second attempt: without TLS options
            try {
                client = new MongoClient(MONGODB_URI, {
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    maxPoolSize: 10,
                    retryWrites: true,
                    w: 'majority'
                });
                await client.connect();
                console.log('Connected to MongoDB successfully without TLS options');
            } catch (secondError) {
                console.log('Second connection attempt failed, trying minimal options...');
                
                // Third attempt: minimal options
                client = new MongoClient(MONGODB_URI);
                await client.connect();
                console.log('Connected to MongoDB successfully with minimal options');
            }
        }
        
        db = client.db();
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`API docs: http://localhost:${PORT}/api/users`);
        });
    } catch (error) {
        console.error('All MongoDB connection attempts failed:', error.message);
        console.log('Falling back to file-based storage...');
        await startWithFileStorage();
    }
}

// Fallback file storage function
async function startWithFileStorage() {
    const fs = require('fs').promises;
    const dataPath = path.join(__dirname, 'data', 'users.json');
    
    // Ensure data directory exists
    try {
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
    } catch (err) {
        console.log('Data directory already exists');
    }
    
    // Initialize file storage
    try {
        await fs.access(dataPath);
        console.log('Data file exists');
    } catch (error) {
        console.log('Creating data file with default users');
        await fs.writeFile(dataPath, JSON.stringify(defaultUsers, null, 2));
    }
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (file storage mode)`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`API docs: http://localhost:${PORT}/api/users`);
    });
}

startServer().catch(console.error);
