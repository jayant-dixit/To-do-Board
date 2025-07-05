import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import TodoBoard from "../model/todoBoard.model.js";

const registerUser = async (req, res, next) => {
    try {
        const { name, username, password, boardName } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if( password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, username, password: hashedPassword });
        await user.save();

        const board = await TodoBoard.findOne({ boardName });
        board.users.push(user._id);
        await board.save();

        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,                                                
        });

        return res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,                                                
        });

        return res.status(200).json({ success: true, message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        return res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export { registerUser, loginUser, logoutUser };