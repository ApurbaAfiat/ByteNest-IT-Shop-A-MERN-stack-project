import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
import transporter from '../config/email.js';

// @desc     Auth user & get token
// @method   POST
// @endpoint /api/v1/users/login
// @access   Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('Invalid email address.');
    }

    if (user.isBlocked) {
      res.statusCode = 403;
      throw new Error('Your account has been blocked. Contact support.');
    }

    const match = await user.matchPassword(password);
    if (!match) {
      res.statusCode = 401;
      throw new Error('Invalid password.');
    }

    generateToken(req, res, user._id);

    res.status(200).json({
      message: 'Login successful.',
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Register user
// @method   POST
// @endpoint /api/v1/users
// @access   Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.statusCode = 409;
      throw new Error('User already exists.');
    }

    const user = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook
      phone: phone || ''
    });

    await user.save();
    generateToken(req, res, user._id);

    res.status(201).json({
      message: 'Registration successful.',
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Logout user / clear cookie
// @method   POST
// @endpoint /api/v1/users/logout
// @access   Private
const logoutUser = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });
  res.status(200).json({ message: 'Logout successful' });
};

// @desc     Get user profile
// @method   GET
// @endpoint /api/v1/users/profile
// @access   Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc     Update user profile
// @method   PUT
// @endpoint /api/v1/users/profile
// @access   Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found.');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated.',
      userId: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      isAdmin: updatedUser.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Change password
// @method   PUT
// @endpoint /api/v1/users/change-password
// @access   Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found.');
    }

    const match = await user.matchPassword(currentPassword);
    if (!match) {
      res.statusCode = 401;
      throw new Error('Current password is incorrect.');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc     Get user wishlist
// @method   GET
// @endpoint /api/v1/users/wishlist
// @access   Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found.');
    }
    res.status(200).json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc     Add product to wishlist
// @method   POST
// @endpoint /api/v1/users/wishlist
// @access   Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found.');
    }

    if (user.wishlist.includes(productId)) {
      res.statusCode = 400;
      throw new Error('Product already in wishlist.');
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: 'Added to wishlist.' });
  } catch (error) {
    next(error);
  }
};

// @desc     Remove product from wishlist
// @method   DELETE
// @endpoint /api/v1/users/wishlist/:productId
// @access   Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found.');
    }

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};

// @desc     Get all users (admin)
// @method   GET
// @endpoint /api/v1/users
// @access   Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc     Get user by ID (admin)
// @method   GET
// @endpoint /api/v1/users/:id
// @access   Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc     Update user (admin)
// @method   PUT
// @endpoint /api/v1/users/:id
// @access   Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = Boolean(req.body.isAdmin);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User updated',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isBlocked: updatedUser.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete user (admin)
// @method   DELETE
// @endpoint /api/v1/users/:id
// @access   Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }
    if (user.isAdmin) {
      res.statusCode = 400;
      throw new Error('Cannot delete admin user.');
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc     Block user (admin)
// @method   PUT
// @endpoint /api/v1/users/:id/block
// @access   Private/Admin
const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }
    user.isBlocked = true;
    await user.save();
    res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    next(error);
  }
};

// @desc     Unblock user (admin)
// @method   PUT
// @endpoint /api/v1/users/:id/unblock
// @access   Private/Admin
const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }
    user.isBlocked = false;
    await user.save();
    res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    next(error);
  }
};

// @desc     Send reset password email
// @method   POST
// @endpoint /api/v1/users/reset-password/request
// @access   Public
const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });
    const passwordResetLink = `${req.protocol}://${req.get('host')}/reset-password/${user._id}/${token}`;

    await transporter.sendMail({
      from: `"ByteNest" ${process.env.EMAIL_FROM}`,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Hi ${user.name},</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="${passwordResetLink}" target="_blank">${passwordResetLink}</a></p>
            <p>This link expires in 15 minutes.</p>
            <p>Thanks,<br>ByteNest Team</p>`
    });

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    next(error);
  }
};

// @desc     Reset password
// @method   POST
// @endpoint /api/v1/users/reset-password/reset/:id/:token
// @access   Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id: userId, token } = req.params;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Invalid or expired token');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }

    user.password = password; // Will be hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    next(error);
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  resetPasswordRequest,
  resetPassword
};
