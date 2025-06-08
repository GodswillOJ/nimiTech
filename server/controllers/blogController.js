// server/controllers/blogController.js

const getAllBlogs = (req, res) => {
  res.status(200).json({ message: 'All blogs fetched successfully' });
};

module.exports = {
  getAllBlogs,
};
