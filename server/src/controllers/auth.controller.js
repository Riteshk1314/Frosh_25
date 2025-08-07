
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/users.model.js'); // Fixed path to match your structure
const nodemailer = require('nodemailer');

// Email transporter configuration
// const transporter = nodemailer.createTransporter({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD // Changed to match your .env file
//   }
// });

// Utility function to generate tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.SECRET, // Using your existing SECRET from .env
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.SECRET, // Using same secret for simplicity
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};


// LOGIN CONTROLLER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    console.log('Login attempt for email:', email); // Debugging line to check login attempts
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    console.log('User found:', user); // Debugging line to check user retrieval

    // Check password (assuming you have a password field and hash passwords)
    // Note: Your schema doesn't include password field, you may need to add it
    console.log(password, user.password); // Debugging line to check password comparison

    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    console.log('Password is valid'); // Debugging line to check password validation
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Update user with new tokens
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();
    console.log('User tokens updated:', user); // Debugging line to check token update
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          phoneNumber: user.phoneNumber
        },
        accessToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// LOGOUT CONTROLLER
const logout = async (req, res) => {
  try {
    const { userId } = req.user;

    // Clear tokens from database
    await User.findByIdAndUpdate(userId, {
      accessToken: null,
      refreshToken: null
    });

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// REFRESH TOKEN CONTROLLER
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id, user.role);

    // Update user with new tokens
    user.accessToken = tokens.accessToken;
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set new refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// FORGOT PASSWORD CONTROLLER
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token to user (you'll need to add these fields to your schema)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This link will expire in 10 minutes.</p>
    `;

    // Send email
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not send password reset email'
    });
  }
};

// RESET PASSWORD CONTROLLER
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export all functions individually
module.exports = {
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  generateTokens
};  