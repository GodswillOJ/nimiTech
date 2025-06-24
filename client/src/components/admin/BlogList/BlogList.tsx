import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllBlogPostPaginatedQuery,
  useDeleteBlogPostMutation,
} from '../../../services/utilis/blogApiService';
import './BlogList.scss';
import Loader from '../../../components/blog/SuspenseLoader/Loader';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BlogListProps {}

const BlogList: React.FC<BlogListProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetAllBlogPostPaginatedQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const [deleteBlogPost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDelete = async (blogId: string) => {
    if (deleteConfirm === blogId) {
      try {
        await deleteBlogPost(blogId).unwrap();
        setDeleteConfirm(null);
        refetch();
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    } else {
      setDeleteConfirm(blogId);
      // Auto-cancel confirmation after 5 seconds
      setTimeout(() => {
        if (deleteConfirm === blogId) {
          setDeleteConfirm(null);
        }
      }, 5000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/api/placeholder/400/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="blog-list">
        <div className="blog-list__loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list">
        <div className="blog-list__error">
          <p>Failed to load blog posts</p>
          <button onClick={() => refetch()} className="btn btn--primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('Blogs Data:', blogsData);
  const blogs = blogsData?.posts || blogsData || [];
  const pagination = blogsData?.currentPage ? blogsData : null;

  return (
    <div className="blog-list">
      <div className="blog-list__header">
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/dashboard/create-blog" className="btn btn--primary">
          Create New Post
        </Link>
      </div>

      <div className="blog-list__controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn--secondary">
            Search
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="category-select"
        >
          <option value="all">All Categories</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="innovation">Innovation</option>
        </select>
      </div>

      {blogs.length === 0 ? (
        <div className="blog-list__empty">
          <p>No blog posts found</p>
          {searchTerm || selectedCategory !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className="btn btn--secondary"
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/admin/dashboard/create-blog" className="btn btn--primary">
              Create Your First Post
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="blog-list__grid">
            {blogs.map((blog: any) => (
              <div key={blog.id || blog._id} className="blog-card">
                <div className="blog-card__image">
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                    }}
                  />
                  <div className="blog-card__status">
                    <span className={`status-badge ${blog.status || 'published'}`}>
                      {blog.status || 'Published'}
                    </span>
                  </div>
                </div>

                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="category">{blog.category}</span>
                    <span className="date">{formatDate(blog.publishDate || blog.createdAt)}</span>
                  </div>

                  <h3 className="blog-card__title">{blog.title}</h3>

                  <p className="blog-card__excerpt">
                    {blog.excerpt || blog.description || 'No description available'}
                  </p>

                  <div className="blog-card__author">
                    <div className="author-info">
                      {blog.authorAvatar && (
                        <img
                          src={getImageUrl(blog.authorAvatar)}
                          alt={blog.author}
                          className="author-avatar"
                        />
                      )}
                      <span>{blog.author}</span>
                    </div>
                  </div>

                  <div className="blog-card__actions">
                    <Link
                      to={`/admin/dashboard/edit-blog/${blog.id || blog._id}`}
                      className="btn btn--secondary btn--small"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(blog.id || blog._id)}
                      className={`btn btn--small ${
                        deleteConfirm === (blog.id || blog._id)
                          ? 'btn--danger'
                          : 'btn--outline-danger'
                      }`}
                      disabled={isDeleting}
                    >
                      {deleteConfirm === (blog.id || blog._id) ? 'Confirm Delete' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="blog-list__pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn--secondary"
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}({pagination.totalPosts}{' '}
                total posts)
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= pagination.totalPages}
                className="btn btn--secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
