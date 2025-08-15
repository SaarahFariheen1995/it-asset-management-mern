const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please add all fields (name, email, password)');
	}

	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		password: password,
	});

	if (user) {
		res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user.id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

const loginUser = asyncHandler(async (req, res) => { 
	const { email, password } = req.body;
	
	const user = await User.findOne({ email });

	const isMatch = await bcrypt.compare(password, user.password);
	
	if (isMatch) {
		res.json({
			id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user.id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});


const getAllUsers = asyncHandler(async (req, res) => {

	const users = await User.find({}).select('-password');
	res.status(200).json(users);
});

const getProfile = asyncHandler(async (req, res) => { 
	const user = await User.findById(req.user.id).select('-password');
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}
	res.status(200).json({
		name: user.name,
		email: user.email,
		university: user.university,
		address: user.address,
	});
});

const updateUserProfile = asyncHandler(async (req, res) => { 
	const user = await User.findById(req.user.id);
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}

	const { name, email, university, address, password } = req.body;

	user.name = name || user.name;
	user.email = email || user.email;
	user.university = university || user.university;
	user.address = address || user.address;

	if (password) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
	}

	const updatedUser = await user.save();

	res.json({
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		university: updatedUser.university,
		address: updatedUser.address,
		token: generateToken(updatedUser.id),
	});
});

module.exports = { registerUser, loginUser, updateUserProfile, getProfile, getAllUsers };