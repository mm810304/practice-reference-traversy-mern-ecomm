const asyncHandler = require('express-async-handler');
const { update } = require('../models/userModel');

const User = require('../models/userModel');
const { generateToken } = require('../utils/generateToken');

//@description: Authorize user & get token
//@route: POST /api/users/login
//@access: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@description: Get user profile
//@route GET /api/users/profile
//@access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

//@description: Update user profile
//@route PUT /api/users/profile
//@access PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.passsword) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log(updatedUser);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

//@description: Register a new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@description: Get all users
//@route GET /api/users
//@access PRIVATE/ADMIN
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//@description: Delete User
//@route DELETE /api/users/:ID
//@access PRIVATE/ADMIN
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ msg: 'User Deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(users);
});


//@description: Get user by ID
//@route GET /api/users/:id
//@access PRIVATE/ADMIN
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@description: Update user 
//@route PUT /api/users/:id
//@access PRIVATE/ADMIN
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});


exports.authUser = authUser;
exports.getUserProfile = getUserProfile;
exports.registerUser = registerUser;
exports.updateUserProfile = updateUserProfile;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
exports.updateUser = updateUser;