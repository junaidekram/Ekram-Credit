document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page, dashboard, or amount page
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const amountForm = document.getElementById('amountForm');
    const backBtn = document.getElementById('backBtn');
    const editModeBtn = document.getElementById('editModeBtn');
    const editNotice = document.getElementById('editNotice');
    
    // Login functionality
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Check admin credentials first
            if (username === "Ekram Credit" && password === "quality!") {
                // Store authentication status
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('userType', 'admin');
                // Redirect to admin dashboard
                window.location.href = 'dashboard.html';
                return;
            }
            
            // Check user credentials
            const userCredentials = {
                "Nazish Ekram": "K9#mP$vL2@nQ8",
                "Sahir Hoda": "X7$hR#jN5&kM9",
                "Tashfeen Ekram": "B4@wE%tY6!pL3",
                "Saudah Mirza": "F8#qA$mC7^dK1",
                "Yasmeen Ekram": "Z2&sI@bV9#gH5",
                "Jawaid Ekram": "U6!oP%jX4$rT8",
                "Abdurrahman Hoda": "L3^cW#nE7@yB2",
                "Abdullah Hoda": "D9$fM&hQ5!kR6",
                "Afiya Hoda": "G1#tN@vJ8%lS4",
                "Sahrish Ekram": "H7&aO!bK3^cP9",
                "Ramim Bhuiya": "I4@eL$fM6#gQ2",
                "Mariya Ekram": "J8!hN%iR5&kS7"
            };
            
            if (userCredentials[username] && userCredentials[username] === password) {
                // Store user authentication
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('userType', 'user');
                sessionStorage.setItem('currentUser', username);
                // Redirect to user dashboard
                window.location.href = 'user-dashboard.html';
                return;
            }
            
            // Invalid credentials
            errorMessage.textContent = 'Invalid username or password. Please try again.';
            errorMessage.style.display = 'block';
            document.getElementById('password').value = '';
        });
    }
    
    // Dashboard functionality (Admin)
    if (logoutBtn && !document.getElementById('userDashboard')) {
        // Check if user is authenticated
        if (!sessionStorage.getItem('authenticated')) {
            window.location.href = 'index.html';
            return;
        }
        
        // Check if user is admin
        if (sessionStorage.getItem('userType') !== 'admin') {
            window.location.href = 'user-dashboard.html';
            return;
        }
        
        // Logout functionality
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('authenticated');
            sessionStorage.removeItem('userType');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
        
        // Edit mode functionality
        if (editModeBtn) {
            let editMode = false;
            
            editModeBtn.addEventListener('click', function() {
                editMode = !editMode;
                
                if (editMode) {
                    editModeBtn.textContent = 'Exit Edit Mode';
                    editModeBtn.classList.add('active');
                    editNotice.style.display = 'block';
                    enableEditMode();
                } else {
                    editModeBtn.textContent = 'Edit Mode';
                    editModeBtn.classList.remove('active');
                    editNotice.style.display = 'none';
                    disableEditMode();
                }
            });
        }
        
        // Apply tier-based styling to table rows
        applyTierStyling();
        
        // Load dashboard data from backend
        loadDashboardDataFromBackend();
        
        // Add click functionality to user rows (only when not in edit mode)
        const userRows = document.querySelectorAll('.user-row');
        userRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't navigate if clicking on editable cells
                if (e.target.classList.contains('token-amount') || e.target.classList.contains('amount-due')) {
                    return;
                }
                
                const username = this.getAttribute('data-username');
                // Store selected user in session storage
                sessionStorage.setItem('selectedUser', username);
                // Navigate to amount entry page
                window.location.href = 'amount.html';
            });
        });

        // Add User Modal Event Listeners
        const addUserBtn = document.getElementById('addUserBtn');
        const addUserModal = document.getElementById('addUserModal');
        const closeBtn = document.querySelector('.close');
        const addUserForm = document.getElementById('addUserForm');

        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                addUserModal.style.display = 'block';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                addUserModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === addUserModal) {
                addUserModal.style.display = 'none';
            }
        });

        // Handle form submission
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addNewUser();
            });
        }
    }
    
    // User Dashboard functionality
    if (document.getElementById('welcomeMessage') && document.getElementById('userLogoutBtn')) {
        // Check if user is authenticated
        if (!sessionStorage.getItem('authenticated')) {
            window.location.href = 'index.html';
            return;
        }
        
        // Check if user is a regular user
        if (sessionStorage.getItem('userType') !== 'user') {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Load user data from backend
        loadUserDashboardFromBackend();
        
        // User logout functionality
        const userLogoutBtn = document.getElementById('userLogoutBtn');
        if (userLogoutBtn) {
            userLogoutBtn.addEventListener('click', function() {
                sessionStorage.removeItem('authenticated');
                sessionStorage.removeItem('userType');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }
    
    // Amount entry page functionality
    if (amountForm) {
        // Check if user is authenticated
        if (!sessionStorage.getItem('authenticated')) {
            window.location.href = 'index.html';
            return;
        }
        
        // Display selected user
        const selectedUser = sessionStorage.getItem('selectedUser');
        const userDisplay = document.getElementById('selectedUser');
        if (userDisplay && selectedUser) {
            userDisplay.textContent = `User: ${selectedUser}`;
        }
        

        
        // Amount form submission
        amountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = document.getElementById('amount').value;
            const amountMessage = document.getElementById('amount-message');
            
            if (amount && parseFloat(amount) > 0) {
                const dollarAmount = parseFloat(amount);
                
                // Start transaction flow
                startTransactionFlow(dollarAmount, selectedUser);
            } else {
                amountMessage.textContent = 'Please enter a valid amount greater than $0.00';
                amountMessage.className = 'amount-message error';
            }
        });
    }
    
    // Auto-redirect if user is already authenticated and on login page
    if (loginForm && sessionStorage.getItem('authenticated')) {
        const userType = sessionStorage.getItem('userType');
        if (userType === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }
});

// Function to load user dashboard data from backend
async function loadUserDashboardFromBackend() {
    const currentUser = sessionStorage.getItem('currentUser');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentUser}`;
    }
    
    try {
        const response = await fetch(`/api/users/${encodeURIComponent(currentUser)}`);
        if (response.ok) {
            const userData = await response.json();
            updateUserDashboardDisplay(userData);
        } else {
            console.error('Failed to load user data from backend');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Function to load user dashboard data (legacy)
function loadUserDashboard() {
    const currentUser = sessionStorage.getItem('currentUser');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentUser}`;
    }
    
    // User data mapping
    const userData = {
        "Nazish Ekram": {
            tier: "Gold",
            tokens: 5000,
            cardNumber: "1100-3451-6671-2293",
            securityCode: "847",
            amountDue: 0
        },
        "Sahir Hoda": {
            tier: "Gold",
            tokens: 5000,
            cardNumber: "4410-6700-1120-2244",
            securityCode: "392",
            amountDue: 0
        },
        "Tashfeen Ekram": {
            tier: "Gold Honors",
            tokens: 7500,
            cardNumber: "7244-1122-4321-6767",
            securityCode: "156",
            amountDue: 0
        },
        "Saudah Mirza": {
            tier: "Gold Honors",
            tokens: 7500,
            cardNumber: "4422-3199-2949-7777",
            securityCode: "734",
            amountDue: 0
        },
        "Yasmeen Ekram": {
            tier: "Gold Priority",
            tokens: 5000,
            cardNumber: "2241-8284-7211-2170",
            securityCode: "581",
            amountDue: 0
        },
        "Jawaid Ekram": {
            tier: "Gold Priority",
            tokens: 5000,
            cardNumber: "7111-8112-1212-7482",
            securityCode: "267",
            amountDue: 0
        },
        "Abdurrahman Hoda": {
            tier: "Silver Honors",
            tokens: 3000,
            cardNumber: "6757-7767-1677-2267",
            securityCode: "943",
            amountDue: 0
        },
        "Abdullah Hoda": {
            tier: "Silver",
            tokens: 2500,
            cardNumber: "8494-3783-4224-6142",
            securityCode: "425",
            amountDue: 0
        },
        "Afiya Hoda": {
            tier: "Silver",
            tokens: 2500,
            cardNumber: "9491-9611-0102-4300",
            securityCode: "678",
            amountDue: 0
        },
        "Sahrish Ekram": {
            tier: "Gold",
            tokens: 5000,
            cardNumber: "0780-2949-0771-6789",
            securityCode: "319",
            amountDue: 0
        },
        "Ramim Bhuiya": {
            tier: "Gold",
            tokens: 5000,
            cardNumber: "1111-2359-0070-7579",
            securityCode: "852",
            amountDue: 0
        },
        "Mariya Ekram": {
            tier: "Bronza Priority",
            tokens: 1000,
            cardNumber: "6422-5510-6218-1285",
            securityCode: "147",
            amountDue: 0
        }
    };
    
    // Get stored data for the user
    const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData') || '{}');
    const userAmounts = JSON.parse(sessionStorage.getItem('userAmounts') || '{}');
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens') || '{}');
    
    const user = userData[currentUser];
    if (user) {
        // Update with stored data if available
        if (userTokens[currentUser] !== undefined) {
            user.tokens = userTokens[currentUser];
        }
        if (userAmounts[currentUser] !== undefined) {
            user.amountDue = userAmounts[currentUser];
        }
        
        // Update display elements
        updateUserDashboardDisplay(user);
    }
}

// Function to update user dashboard display
function updateUserDashboardDisplay(user) {
    const tierElement = document.getElementById('userTier');
    const tokensElement = document.getElementById('userTokens');
    const cardNumberElement = document.getElementById('userCardNumber');
    const securityCodeElement = document.getElementById('userSecurityCode');
    const amountDueElement = document.getElementById('userAmountDue');
    
    if (tierElement) tierElement.textContent = user.tier;
    if (tokensElement) tokensElement.textContent = user.tokens;
    if (cardNumberElement) cardNumberElement.textContent = user.cardNumber;
    if (securityCodeElement) securityCodeElement.textContent = user.securityCode;
    
    if (amountDueElement) {
        if (user.amountDue > 0) {
            amountDueElement.textContent = `$${user.amountDue.toFixed(2)}`;
            amountDueElement.className = 'amount-due has-amount';
        } else {
            amountDueElement.textContent = '$0.00';
            amountDueElement.className = 'amount-due no-amount';
        }
    }
}

// Function to start transaction flow
async function startTransactionFlow(dollarAmount, selectedUser) {
    const transactionFlow = document.getElementById('transactionFlow');
    const amountContainer = document.querySelector('.amount-container');
    
    // Hide amount entry and show transaction flow
    amountContainer.style.display = 'none';
    transactionFlow.style.display = 'flex';
    
    // Start the transaction sequence
    showTransactionScreen('enterCardScreen');
    
    // Sequence timing
    setTimeout(() => {
        showTransactionScreen('processingScreen');
    }, 5000); // 5 seconds for "Enter Credit Card"
    
    setTimeout(async () => {
        showTransactionScreen('removeCardScreen');
        
        // Process token conversion in background
        const transactionResult = await processTokenConversion(dollarAmount, selectedUser);
        
        setTimeout(() => {
            showTransactionScreen('completeScreen');
            // Display transaction summary
            const transactionSummary = document.getElementById('transactionSummary');
            if (transactionResult.remainingAmount > 0) {
                transactionSummary.textContent = `Processed $${(transactionResult.tokensUsed / 100).toFixed(2)} with tokens. Amount due: $${transactionResult.remainingAmount.toFixed(2)}`;
            } else {
                transactionSummary.textContent = `Amount $${dollarAmount.toFixed(2)} fully processed with tokens.`;
            }
        }, 2000); // 2 more seconds for "Remove Card"
        
        // Return to dashboard after completion
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 5000); // 3 more seconds for "Transaction Complete"
    }, 10000); // 5 more seconds for "Processing"
}

// Function to show specific transaction screen
function showTransactionScreen(screenId) {
    // Hide all screens
    const screens = ['enterCardScreen', 'processingScreen', 'removeCardScreen', 'completeScreen'];
    screens.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) screen.style.display = 'none';
    });
    
    // Show the specified screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.style.display = 'block';
}

// Function to initialize dashboard data from HTML table
function initializeDashboardData() {
    const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData') || '{}');
    const userAmounts = JSON.parse(sessionStorage.getItem('userAmounts') || '{}');
    const userTokens = JSON.parse(sessionStorage.getItem('userTokens') || '{}');
    
    const rows = document.querySelectorAll('.user-row');
    rows.forEach(row => {
        const username = row.getAttribute('data-username');
        const tokenCell = row.querySelector('.token-amount');
        const amountDueCell = row.querySelector('.amount-due');
        
        if (tokenCell && amountDueCell) {
            const currentTokens = parseInt(tokenCell.textContent) || 0;
            const currentAmountDue = parseFloat(amountDueCell.textContent.replace('$', '')) || 0;
            
            // Initialize user data if not exists
            if (!dashboardData[username]) {
                dashboardData[username] = {
                    tokens: currentTokens,
                    amountDue: currentAmountDue
                };
            }
            
            // Update from session storage if exists
            if (userTokens[username] !== undefined) {
                dashboardData[username].tokens = userTokens[username];
                tokenCell.textContent = userTokens[username];
            }
            
            if (userAmounts[username] !== undefined) {
                dashboardData[username].amountDue = userAmounts[username];
                if (userAmounts[username] > 0) {
                    amountDueCell.textContent = `$${userAmounts[username].toFixed(2)}`;
                    amountDueCell.classList.add('has-amount');
                    amountDueCell.classList.remove('no-amount');
                } else {
                    amountDueCell.textContent = '$0.00';
                    amountDueCell.classList.add('no-amount');
                    amountDueCell.classList.remove('has-amount');
                }
            }
        }
    });
    
    // Store the initialized data
    sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    sessionStorage.setItem('userAmounts', JSON.stringify(userAmounts));
    sessionStorage.setItem('userTokens', JSON.stringify(userTokens));
}

// Function to process token conversion (background processing)
async function processTokenConversion(dollarAmount, selectedUser) {
    const tokensNeeded = Math.ceil(dollarAmount * 100); // 1 token per cent
    
    try {
        // Get current user data from backend
        const response = await fetch(`/api/users/${encodeURIComponent(selectedUser)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        const currentTokens = userData.tokens || 0;
        
        let remainingAmount = 0;
        let tokensUsed = 0;
        
        if (tokensNeeded <= currentTokens) {
            // User has enough tokens
            tokensUsed = tokensNeeded;
            remainingAmount = 0;
        } else {
            // User doesn't have enough tokens
            tokensUsed = currentTokens;
            remainingAmount = dollarAmount - (currentTokens / 100);
        }
        
        // Update user data via backend API
        const updateResponse = await fetch(`/api/users/${encodeURIComponent(selectedUser)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tokens: Math.max(0, currentTokens - tokensUsed),
                amountDue: (userData.amountDue || 0) + remainingAmount
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error('Failed to update user data');
        }
        
        // Update the dashboard display immediately
        updateDashboardDisplay(selectedUser, Math.max(0, currentTokens - tokensUsed), (userData.amountDue || 0) + remainingAmount);
        
        return {
            tokensUsed: tokensUsed,
            remainingAmount: remainingAmount
        };
    } catch (error) {
        console.error('Error processing transaction:', error);
        throw error;
    }
}

// Function to enable edit mode
function enableEditMode() {
    const tokenCells = document.querySelectorAll('.token-amount');
    const amountDueCells = document.querySelectorAll('.amount-due');
    
    tokenCells.forEach(cell => {
        cell.contentEditable = true;
        cell.setAttribute('data-original', cell.textContent);
        cell.addEventListener('blur', handleTokenEdit);
        cell.addEventListener('keydown', handleKeyDown);
    });
    
    amountDueCells.forEach(cell => {
        cell.contentEditable = true;
        cell.setAttribute('data-original', cell.textContent);
        cell.addEventListener('blur', handleAmountDueEdit);
        cell.addEventListener('keydown', handleKeyDown);
    });
}

// Function to disable edit mode
function disableEditMode() {
    const tokenCells = document.querySelectorAll('.token-amount');
    const amountDueCells = document.querySelectorAll('.amount-due');
    
    tokenCells.forEach(cell => {
        cell.contentEditable = false;
        cell.removeEventListener('blur', handleTokenEdit);
        cell.removeEventListener('keydown', handleKeyDown);
    });
    
    amountDueCells.forEach(cell => {
        cell.contentEditable = false;
        cell.removeEventListener('blur', handleAmountDueEdit);
        cell.removeEventListener('keydown', handleKeyDown);
    });
}

// Handle token cell editing
async function handleTokenEdit(e) {
    const cell = e.target;
    const username = cell.closest('tr').getAttribute('data-username');
    const newValue = parseInt(cell.textContent) || 0;
    
    try {
        // Update via backend API
        const response = await fetch(`/api/users/${encodeURIComponent(username)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tokens: Math.max(0, newValue)
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        
        // Update display
        cell.textContent = Math.max(0, newValue);
    } catch (error) {
        console.error('Error updating token:', error);
        // Revert the cell content on error
        cell.textContent = cell.getAttribute('data-original') || '0';
    }
}

// Handle amount due cell editing
async function handleAmountDueEdit(e) {
    const cell = e.target;
    const username = cell.closest('tr').getAttribute('data-username');
    const newValue = parseFloat(cell.textContent.replace('$', '')) || 0;
    
    try {
        // Update via backend API
        const response = await fetch(`/api/users/${encodeURIComponent(username)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amountDue: Math.max(0, newValue)
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        
        // Update display
        if (newValue > 0) {
            cell.textContent = `$${newValue.toFixed(2)}`;
            cell.classList.add('has-amount');
            cell.classList.remove('no-amount');
        } else {
            cell.textContent = '$0.00';
            cell.classList.add('no-amount');
            cell.classList.remove('has-amount');
        }
    } catch (error) {
        console.error('Error updating amount due:', error);
        // Revert the cell content on error
        const originalValue = cell.getAttribute('data-original') || '$0.00';
        cell.textContent = originalValue;
    }
}

// Handle key events in editable cells
function handleKeyDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
}

// Function to load dashboard data from backend
async function loadDashboardDataFromBackend() {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            const userData = await response.json();
            updateDashboardWithBackendData(userData);
        } else {
            console.error('Failed to load dashboard data from backend');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Function to load dashboard data from server (legacy)
async function loadDashboardDataFromServer() {
    try {
        const response = await fetch('http://localhost:5001/api/users');
        if (response.ok) {
            const userData = await response.json();
            updateDashboardWithServerData(userData);
        } else {
            console.error('Failed to load dashboard data from server');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Function to update dashboard with backend data
function updateDashboardWithBackendData(userData) {
    const rows = document.querySelectorAll('.user-row');
    rows.forEach(row => {
        const username = row.getAttribute('data-username');
        const tokenCell = row.querySelector('.token-amount');
        const amountDueCell = row.querySelector('.amount-due');
        
        if (tokenCell && amountDueCell && userData[username]) {
            const user = userData[username];
            
            // Update tokens
            tokenCell.textContent = user.tokens;
            
            // Update amount due
            if (user.amountDue > 0) {
                amountDueCell.textContent = `$${user.amountDue.toFixed(2)}`;
                amountDueCell.classList.add('has-amount');
                amountDueCell.classList.remove('no-amount');
            } else {
                amountDueCell.textContent = '$0.00';
                amountDueCell.classList.add('no-amount');
                amountDueCell.classList.remove('has-amount');
            }
        }
    });

    // Re-apply tier styling after data update
    applyTierStyling();
}

// Function to apply tier styling to all rows
function applyTierStyling() {
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const tierCell = row.querySelector('td:nth-child(2)');
        if (tierCell) {
            const tierText = tierCell.textContent.trim();
            
            // Remove existing tier classes
            row.classList.remove('gold-tier', 'silver-tier', 'bronze-tier', 'normal-tier', 'sapphire-tier', 'obsidian-tier', 'priority', 'honors');
            
            // Add base tier class
            if (tierText.includes('Gold')) {
                row.classList.add('gold-tier');
            } else if (tierText.includes('Silver')) {
                row.classList.add('silver-tier');
            } else if (tierText.includes('Bronza')) {
                row.classList.add('bronze-tier');
            } else if (tierText.includes('Normal')) {
                row.classList.add('normal-tier');
            } else if (tierText.includes('Sapphire')) {
                row.classList.add('sapphire-tier');
            } else if (tierText.includes('Obsidian')) {
                row.classList.add('obsidian-tier');
            }
            
            // Add special designation classes
            if (tierText.includes('Priority')) {
                row.classList.add('priority');
            }
            if (tierText.includes('Honors')) {
                row.classList.add('honors');
            }
        }
    });
}

// Function to update dashboard with server data (legacy)
function updateDashboardWithServerData(userData) {
    const rows = document.querySelectorAll('.user-row');
    rows.forEach(row => {
        const username = row.getAttribute('data-username');
        const tokenCell = row.querySelector('.token-amount');
        const amountDueCell = row.querySelector('.amount-due');
        
        if (tokenCell && amountDueCell && userData[username]) {
            const user = userData[username];
            
            // Update tokens
            tokenCell.textContent = user.tokens;
            
            // Update amount due
            if (user.amountDue > 0) {
                amountDueCell.textContent = `$${user.amountDue.toFixed(2)}`;
                amountDueCell.style.color = '#e74c3c';
                amountDueCell.style.fontWeight = 'bold';
            } else {
                amountDueCell.textContent = '$0.00';
                amountDueCell.style.color = '#27ae60';
                amountDueCell.style.fontWeight = 'normal';
            }
        }
    });
}

// Function to update dashboard display for a specific user
function updateDashboardDisplay(username, newTokens, newAmountDue) {
    const userRow = document.querySelector(`[data-username="${username}"]`);
    if (userRow) {
        const tokenCell = userRow.querySelector('.token-amount');
        const amountDueCell = userRow.querySelector('.amount-due');
        
        if (tokenCell) {
            tokenCell.textContent = newTokens;
        }
        
        if (amountDueCell) {
            if (newAmountDue > 0) {
                amountDueCell.textContent = `$${newAmountDue.toFixed(2)}`;
                amountDueCell.classList.add('has-amount');
                amountDueCell.classList.remove('no-amount');
            } else {
                amountDueCell.textContent = '$0.00';
                amountDueCell.classList.add('no-amount');
                amountDueCell.classList.remove('has-amount');
            }
        }
    }
}

// Global function for cancel button
function goBack() {
    window.location.href = 'dashboard.html';
}

// Add New User Function
async function addNewUser() {
    const name = document.getElementById('newUserName').value.trim();
    const cardNumber = document.getElementById('newUserCardNumber').value.trim();
    const tier = document.getElementById('newUserTier').value;
    const designation = document.getElementById('newUserDesignation').value;
    const tokens = parseInt(document.getElementById('newUserTokens').value);

    if (!name || !cardNumber || !tier) {
        alert('Please fill in all required fields.');
        return;
    }

    // Generate a random security code
    const securityCode = Math.floor(100 + Math.random() * 900).toString();

    // Create the new user object
    const newUser = {
        tier: designation ? `${tier} ${designation}` : tier,
        tokens: tokens,
        cardNumber: cardNumber,
        securityCode: securityCode,
        amountDue: 0
    };

    try {
        // Add to backend
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                userData: newUser
            })
        });

        if (response.ok) {
            // Close modal and refresh dashboard
            closeAddUserModal();
            loadDashboardDataFromBackend();
            alert('User added successfully!');
        } else {
            alert('Error adding user. Please try again.');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user. Please try again.');
    }
}

// Close Add User Modal Function
function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        document.getElementById('addUserForm').reset();
    }
}
