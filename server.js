const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9025708877k',
    database: 'loginapp'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});
// Handle user registration
app.post('/register',(req,res)=>{

    console.log("Received registration data:", req.body);
    const{username,email,password}=req.body;
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error occurred while registering user:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('User with this email or username already exists');
            }
            return res.status(500).send('Error occurred while registering user');
            
        }
        console.log('User registered successfully:');
        res.status(200).send('User registered successfully');
    });
});
// Handle user login
app.post("/login",(req,res)=>{
    console.log("Received login data:", req.body);
    const{email,password}=req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error occurred while logging in:', err);
            return res.status(500).send('Error occurred while logging in');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }
        console.log('User logged in successfully:');
        res.status(200).send('User logged in successfully');
    });
});
app.listen(3000,'0.0.0.0',() => {
    console.log('Server is running on port 3000');
});