const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema and Model globally
const userSchema = new mongoose.Schema({
    name: String
},
{
    timestamps: true // 👈 This adds createdAt and updatedAt fields automatically
}
);
const User = mongoose.model('users', userSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to My API');
});

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Error retrieving user');
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = new User({ name: req.body.name });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send('Error saving user');
    }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Error updating user');
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send('User not found');
        res.send('User deleted');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
