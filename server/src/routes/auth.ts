import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { auth, adminAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('workingGroup').isIn(['Smart Click', 'F.E.']),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, workingGroup } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Check if this is the first user
      const userCount = await User.countDocuments();
      const isFirstUser = userCount === 0;

      // Create new user
      const user = new User({
        email,
        password,
        name,
        workingGroup,
        role: isFirstUser ? 'admin' : 'user',
        isApproved: isFirstUser, // Auto-approve first user (admin)
      });

      await user.save();

      res.status(201).json({
        message: isFirstUser 
          ? 'Admin account created successfully.' 
          : 'Registration successful. Waiting for admin approval.',
        isAdmin: isFirstUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if user is approved
      if (!user.isApproved) {
        throw new AppError('Account pending approval', 403);
      }

      // Generate token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          workingGroup: user.workingGroup,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get pending approvals (admin only)
router.get('/pending-approvals', auth, adminAuth, async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }).select('-password');
    res.json(pendingUsers);
  } catch (error) {
    next(error);
  }
});

// Approve user (admin only)
router.post('/approve/:userId', auth, adminAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 