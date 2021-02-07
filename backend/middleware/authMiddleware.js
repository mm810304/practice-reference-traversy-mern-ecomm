const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded', decoded);
      console.log(req.headers.authorization);    
     
      req.user = await User.findById(decoded.id).select('-password');
      console.log(req.user);

    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized. Token failed');
    }
  } 

  if (!token) {
    res.status(401);
      throw new Error('Not authorized.  No token');
  }

  next();
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin')   
  }
}

exports.protect = protect;
exports.isAdmin = isAdmin;