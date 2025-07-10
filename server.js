const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
let supabase;

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

// Generate unique random card number
async function generateUniqueCardNumber() {
    let cardNumber;
    let isUnique = false;
    
    while (!isUnique) {
        // Generate 4 groups of 4 digits
        const group1 = Math.floor(Math.random() * 9000) + 1000;
        const group2 = Math.floor(Math.random() * 9000) + 1000;
        const group3 = Math.floor(Math.random() * 9000) + 1000;
        const group4 = Math.floor(Math.random() * 9000) + 1000;
        
        cardNumber = `${group1}-${group2}-${group3}-${group4}`;
        
        // Check if this card number already exists
        const { data: existingCard, error } = await supabase
            .from('users')
            .select('cardNumber')
            .eq('cardNumber', cardNumber)
            .single();
        
        if (error || !existingCard) {
            isUnique = true;
        }
    }
    
    return cardNumber;
}

// Generate random security code
function generateSecurityCode() {
    return Math.floor(Math.random() * 900) + 100; // 3-digit code
}

// Generate random password
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Initialize database with default users
async function initializeDatabase() {
    try {
        // Check if users table exists and has data
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('name')
            .limit(1);

        if (checkError) {
            console.log('Creating users table...');
            // Create the users table
            const { error: createError } = await supabase.rpc('create_users_table');
            if (createError) {
                console.log('Table creation failed, using SQL...');
                // Fallback: create table manually
                await supabase.rpc('exec_sql', {
                    sql: `
                        CREATE TABLE IF NOT EXISTS users (
                            id SERIAL PRIMARY KEY,
                            name TEXT UNIQUE NOT NULL,
                            tier TEXT,
                            tokens INTEGER DEFAULT 0,
                            cardNumber TEXT,
                            securityCode TEXT,
                            amountDue INTEGER DEFAULT 0,
                            password TEXT,
                            created_at TIMESTAMP DEFAULT NOW()
                        );
                    `
                });
            }
        }

        // Check if we need to insert default users
        const { data: userCount, error: countError } = await supabase
            .from('users')
            .select('name', { count: 'exact' });

        if (!countError && userCount.length === 0) {
            console.log('Inserting default users...');
            const usersArray = Object.entries(defaultUsers).map(([name, data]) => ({
                name,
                ...data
            }));

            const { error: insertError } = await supabase
                .from('users')
                .insert(usersArray);

            if (insertError) {
                console.error('Error inserting default users:', insertError);
            } else {
                console.log('Default users inserted successfully');
            }
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
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Failed to load users' });
        }

        // Convert to expected format
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
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('name', username)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error('Error reading user:', error);
        res.status(500).json({ error: 'Failed to load user' });
    }
});

// PUT update user
app.put('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { tokens, amountDue, tier, password, name } = req.body;

        const updateData = {};
        if (tokens !== undefined) updateData.tokens = tokens;
        if (amountDue !== undefined) updateData.amountDue = amountDue;
        if (tier !== undefined) updateData.tier = tier;
        if (password !== undefined) updateData.password = password;
        if (name !== undefined) updateData.name = name;

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('name', username)
            .select()
            .single();

        if (error || !updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name: userName, ...userData } = updatedUser;
        res.json(userData);
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

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('name')
            .eq('name', name)
            .single();

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Generate unique card number and security code
        const cardNumber = await generateUniqueCardNumber();
        const securityCode = generateSecurityCode().toString();

        // Add new user with generated card number and custom password
        const newUser = {
            name,
            tier: userData.tier || 'Normal',
            tokens: userData.tokens || 1000,
            cardNumber,
            securityCode,
            amountDue: userData.amountDue || 0,
            password: userData.password || generateRandomPassword()
        };

        const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user:', insertError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        res.status(201).json({
            success: true,
            user: {
                ...newUser,
                cardNumber,
                securityCode
            },
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

        // Get current user data
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('name', username)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate new values
        const newTokens = Math.max(0, user.tokens - tokensUsed);
        const newAmountDue = (user.amountDue || 0) + remainingAmount;

        // Update user
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                tokens: newTokens,
                amountDue: newAmountDue
            })
            .eq('name', username)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating user:', updateError);
            return res.status(500).json({ error: 'Failed to process transaction' });
        }

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
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ error: 'Failed to process transaction' });
    }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('name', username)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { name, ...userData } = user;
        res.json({
            success: true,
            user: userData,
            userType: username === 'admin' ? 'admin' : 'user'
        });
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

// Initialize Supabase and start server
async function startServer() {
    try {
        console.log('Initializing Supabase connection...');

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.log('Supabase credentials not provided, using file storage...');
            await startWithFileStorage();
            return;
        }

        // Initialize Supabase client
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized');

        // Test connection
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('Supabase connection test failed, using file storage...');
            await startWithFileStorage();
            return;
        }

        console.log('Connected to Supabase successfully');
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`API docs: http://localhost:${PORT}/api/users`);
        });
    } catch (error) {
        console.error('Failed to initialize Supabase:', error.message);
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
