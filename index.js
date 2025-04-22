const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle login requests
app.post('/api/credentials', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    // Save credentials in a local file
    const credentials = { username, password };
    const filePath = path.join(__dirname, 'credentials.json');
    
    fs.appendFile(filePath, JSON.stringify(credentials) + '\n', (err) => {
        if (err) {
            console.error('Error saving credentials:', err);
            return res.status(500).send('Internal server error');
        }

        console.log('Credentials saved:', credentials);
        res.status(200).send('Credentials saved successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
