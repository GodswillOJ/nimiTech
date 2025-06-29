const Blog = require("../models/Blog");
const mockData = require("../data/mockData.json");

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("Cleared existing blogs");

    // Convert mock data to match MongoDB schema
    const convertMockData = (post, isFeatured = false) => ({
      title: post.title,
      description: post.description,
      category: post.category,
      readTime: post.readTime,
      author: {
        name: post.author.name,
        avatar: post.author.avatar,
        date: post.author.date,
        bio: post.author.bio || "",
      },
      image: post.image,
      content: post.content
        ? {
            subtitle: post.content.subtitle || "",
            paragraphs: post.content.paragraphs || [],
            highlights: post.content.highlights || { title: "", benefits: [] },
          }
        : undefined,
      youtubeUrl: post.youtubeUrl || "",
      contentImage: post.contentImage || "",
      contentImageTitle: post.contentImageTitle || "",
      isFeatured: isFeatured,
      isPublished: true,
      views: Math.floor(Math.random() * 1000), // Random views for demo
      likes: Math.floor(Math.random() * 100), // Random likes for demo
      tags: [post.category], // Use category as initial tag
    });

    // Insert featured post
    const featuredBlog = new Blog(convertMockData(mockData.featuredPost, true));
    await featuredBlog.save();
    console.log("Inserted featured post");

    // Insert regular blog posts
    const blogs = mockData.blogPosts.map(post => convertMockData(post));
    await Blog.insertMany(blogs);
    console.log(`Inserted ${blogs.length} blog posts`);

    console.log("Database seeding completed successfully!");
    console.log(`Total blogs in database: ${await Blog.countDocuments()}`);
    console.log(`Featured blogs: ${await Blog.countDocuments({ isFeatured: true })}`);
    console.log(`Published blogs: ${await Blog.countDocuments({ isPublished: true })}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

module.exports = { seedDatabase };
