const User = require('../models/User');

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// Update name or mobile (not email)
exports.updateProfile = async (req, res) => {
  const { name, mobile } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, mobile },
    { new: true }
  ).select('-password');
  res.json(user);
};
