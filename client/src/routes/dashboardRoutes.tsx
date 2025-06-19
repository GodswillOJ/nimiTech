import { RouteObject } from 'react-router-dom';
import BlogEditorDashboard from '../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../pages/blog/_partials/BlogPost.data';
import { useState, useEffect } from 'react';
import { PostStatus } from '../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard.types';
import { Post } from '../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard.types';
import { IContent } from '../pages/blog/blog.types';

// Convert IBlogPost from mock data to Post format for the dashboard
const convertBlogPostsToPostFormat = (posts: any[] = blogPosts): Post[] => {
  return posts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    content: post.content || {
      subtitle: '',
      paragraphs: [{ type: 'text', content: post.description }],
      highlights: {
        title: post.content?.highlights?.title || '',
        benefits: post.content?.highlights?.benefits || [],
      },
    },
    excerpt: post.description,
    status: PostStatus.PUBLISHED, // Default status
    category: post.category,
    author: {
      name: post.author.name,
      avatar: post.author.avatar,
      date: post.author.date,
      bio: post.author.bio || '',
    },
    createdAt: new Date(post.author.date).toISOString(),
    updatedAt: new Date(post.author.date).toISOString(),
    publishDate: new Date(post.author.date).toISOString(),
    image: post.image,
    tags: post.content?.highlights?.benefits || [],
    slug: post.title.toLowerCase().replace(/\s+/g, '-'),
    readTime: post.readTime,
    youtubeUrl: post.youtubeUrl || '',
    contentImage: post.contentImage || '',
    contentImageTitle: post.contentImageTitle || '',
  }));
};

const BlogEditorDashboardWrapper = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(convertBlogPostsToPostFormat());

  // Store posts in localStorage when they change
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  // Load posts from localStorage on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        // Fallback to original data if parsing fails
        setPosts(convertBlogPostsToPostFormat());
      }
    }
  }, []);

  const handleCreatePost = () => {
    // Create a new empty post template
    const newPost = {
      id: '0', // Will be replaced with actual ID when saved
      title: '',
      excerpt: '',
      status: PostStatus.DRAFT,
      category: 'Uncategorized',
      author: {
        name: 'Anonymous',
        avatar: '',
        date: new Date().toISOString(),
        bio: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      slug: '',
      readTime: '0 min read',
      image: '',
      content: {
        subtitle: '',
        paragraphs: [
          {
            type: 'text',
            content: '',
          },
        ],
        highlights: {
          title: '',
          benefits: [],
        },
      },
      youtubeUrl: '',
      contentImage: '',
      contentImageTitle: '',
    };

    // Navigate to editor with the new post
    navigate('/blog-editor', { state: { post: newPost, isNew: true } });
  };

  const handleEditPost = (post: Post) => {
    // Navigate to editor with post for editing
    navigate('/blog-editor', { state: { post, isNew: false } });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleDeletePosts = (postIds: string[]) => {
    setPosts(posts.filter((post) => !postIds.includes(post.id)));
  };

  const handleUpdatePostStatus = (postId: string, status: PostStatus) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, status } : post)));
  };

  const handleDuplicatePost = (post: Post) => {
    const newId = Date.now().toString();
    const newPost = {
      ...post,
      id: newId,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${newId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: PostStatus.DRAFT,
    };
    setPosts([...posts, newPost]);
  };

  // Generate categories from existing posts
  const categories = Array.from(new Set(posts.map((post) => post.category))).map((category) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    name: category,
    slug: category.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <BlogEditorDashboard
      posts={posts}
      categories={categories}
      onCreatePost={handleCreatePost}
      onEditPost={handleEditPost}
      onDeletePost={handleDeletePost}
      onDeletePosts={handleDeletePosts}
      onUpdatePostStatus={handleUpdatePostStatus}
      onDuplicatePost={handleDuplicatePost}
    />
  );
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <BlogEditorDashboardWrapper />,
  },
];
