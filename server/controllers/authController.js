// Dummy authentication handlers

const registerUser = (req, res) => {
  res.status(201).json({ message: 'User registered' });
};

const loginUser = (req, res) => {
  res.status(200).json({ message: 'User logged in' });
};

module.exports = {
  registerUser,
  loginUser,
};
