import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Function to generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new farmer
// @route   POST /api/users/signup
export const signupUser = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown server error occurred' });
    }
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown server error occurred' });
    }
  }
};