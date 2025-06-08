// controllers/businessController.js

// Dummy in-memory data store
let businessPosts = [
  {
    id: 1,
    title: 'Boost Your Local Business with These 5 Tips',
    content: 'Learn how to attract more customers and grow your local business effectively...',
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
  },
];

// GET all business posts
const getAllBusinessPosts = (req, res) => {
  res.status(200).json(businessPosts);
};

// POST create a new business post
const createBusinessPost = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const newPost = {
    id: businessPosts.length + 1,
    title,
    content,
  };

  businessPosts.push(newPost);
  res.status(201).json(newPost);
};

module.exports = {
  getAllBusinessPosts,
  createBusinessPost,
};
