const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user'); 
const Session = require('./models/session');
const port = 8080;

require('dotenv').config();

const mongourl = process.env.MONGO_URL;
const secretKey = process.env.SECRET_KEY;


// const mongourl='mongodb://127.0.0.1:27017/modelens'; // Your secret key for JWT

app.use(cors()); // Enable CORS for all routes
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongourl);
}

const verifyToken = async (req, res, next) => {
    console.log('Verify Token Middleware Called'); // Log middleware execution
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        const session = await Session.findOne({ userId: decoded.id, token: token.split(' ')[1] });
        if (!session) {
            return res.status(401).json({ message: 'Token expired or invalid' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};

const basicAuth = (req, res, next) => {
    const auth = { login: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, secretKey);
        await Session.create({ userId: user._id, username: user.username, token });
        console.log('Logged in user token:', token);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.post('/signup', async (req, res) => {
    const { firstname, lastname, username, password, email, number } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            firstname,
            lastname,
            username,
            email,
            number,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, secretKey);
        console.log('Registered user token:', token);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.post('/logout', verifyToken, async (req, res) => {
    try {
        console.log('Logout route hit'); // Confirm route hit
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token received:', token); // Log received token

        // Find session and delete it
        const session = await Session.findOneAndDelete({ userId: req.user.id, token });
        console.log('Session delete result:', session); // Log result of deletion

        if (session) {
            // Find user based on userId
            const user = await User.findById(req.user.id).select('username');
            if (user) {
                res.json({ message: 'Logged out successfully', username: user.username });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/admin', basicAuth, async(req,res)=>{
    try{
        const users=await User.find().select('-password');
        res.render('admin.ejs',{users});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/admin/delete/:id',basicAuth,async (req,res)=>{
    try{
        const userId=req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } 
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/admin/logout', (req, res) => {
    res.setHeader('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('You have been logged out. Please login again.');
});



app.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
