import User from '../models/usersModel.js';
import { CustomError } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(new CustomError('Failed to retrieve users', 404));
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new CustomError('User not found', 404);
      }
      res.status(200).json(user);
    } catch (error) {
      next(new CustomError(error.message || 'Failed to retrieve user', 404));
    }
  };

  // Create a new user
export const createUser = async (req, res, next) => {
    try {
      const { username, password, exp, matchesPlayed } = req.body;
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        password: hashedPassword, // Store the hashed password
        exp,
        matchesPlayed,
      });

      await newUser.save();
      res.status(201).json(newUser); // Password excluded automatically
    } catch (error) {
      next(new CustomError(error.message || 'Failed to create user', 400));
    }
  };

  // Update user by ID
export const updateUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
  
      // Hash the new password if provided
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedUser) {
        throw new CustomError('User not found', 404);
      }
  
      res.status(200).json(updatedUser); // Password excluded automatically
    } catch (error) {
      next(new CustomError(error.message || 'Failed to update user', 400));
    }
  };

  // Delete user by ID
export const deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
  
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new CustomError('User not found', 404);
      }
  
      res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(new CustomError(error.message || 'Failed to delete user', 400));
    }
  };

  export const loginUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        throw new CustomError('Invalid username or password', 401);
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      const token = jwt.sign(
        { id: user._id,
            username: user.username,
            exp: user.exp,
            matchesPlayed: user.matchesPlayed,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
      
      if (!isMatch) {
        throw new CustomError('Invalid username or password', 401);
      }
  
      req.session.user = {
        id: user._id,
    username: user.username,
    exp: user.exp,
    matchesPlayed: user.matchesPlayed,
      };
      res
        .status(200)
        .json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
      next(error);
    }
  };
  
  // User Logout
  export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // assuming you're using `connect.sid` as the session cookie name
      res.status(200).json({ message: 'Logout successful' });
    });
  };