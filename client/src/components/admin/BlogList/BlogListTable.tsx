import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllBlogPostPaginatedQuery,
  useGetAllBlogPostAdminPaginatedQuery,
  useDeleteBlogPostMutation,
} from '../../../services/utilis/blogApiService';
import { useToast } from '../../../hooks/useToast';
import { getImageUrl } from '../../../utils/envUtils';
import { formatDate } from '../../../utils/dateUtils';
import './BlogListTable.scss';
import Loader from '../../../components/blog/SuspenseLoader/Loader';

const BlogListTable = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetAllBlogPostAdminPaginatedQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const [deleteBlogPost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = async (blogId: string) => {
    if (deleteConfirm === blogId) {
      try {
        const result = await deleteBlogPost(blogId).unwrap();
        if (result.success) {
          toast.success('Post deleted successfully', 'The blog post has been permanently deleted.');
          setDeleteConfirm(null);
          refetch();
        }
      } catch (error: any) {
        console.error('Error deleting blog post:', error);
        toast.error('Delete failed', error?.data?.message || 'Failed to delete the blog post.');
      }
    } else {
      setDeleteConfirm(blogId);
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const handleEdit = (blog: any) => {
    navigate(`/dashboard/edit/${blog.id || blog._id}`, {
      state: { post: blog, isNew: false },
    });
  };

  const handleCreate = () => {
    navigate('/dashboard/create');
  };

  const getImageUrlForTable = (imagePath: string) => {
    if (!imagePath) return '/api/placeholder/400/300';
    if (imagePath.startsWith('http')) return imagePath;
    return getImageUrl(imagePath);
  };

  const getBlogStatus = (blog: any) => {
    // Handle both status field and isPublished boolean
    if (blog.status) {
      return blog.status;
    }
    // Convert isPublished boolean to status string
    return blog.isPublished ? 'published' : 'draft';
  };

  if (isLoading) {
    return (
      <div className="blog-list-table">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-table">
        <div className="blog-list-table__error">
          <p>Failed to load blog posts</p>
          <button onClick={() => refetch()} className="btn btn--primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const blogs = blogsData?.posts || blogsData || [];
  const pagination = blogsData?.currentPage ? blogsData : null;

  return (
    <div className="blog-list-table">
      <div className="blog-list-table__header">
        <h2>Manage Blog Posts</h2>
        <button onClick={handleCreate} className="btn btn--primary">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create New Post
        </button>
      </div>

      <div className="blog-list-table__controls">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
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
        <div className="blog-list-table__empty">
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            <h3>No blog posts found</h3>
            <p>
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating your first blog post.'}
            </p>
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
              <button onClick={handleCreate} className="btn btn--primary">
                Create Your First Post
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="blog-list-table__desktop">
            <div className="blog-table">
              <div className="blog-table__header">
                <div className="blog-table__row">
                  <div className="blog-table__cell blog-table__cell--image">Image</div>
                  <div className="blog-table__cell blog-table__cell--title">Title</div>
                  <div className="blog-table__cell blog-table__cell--status">Status</div>
                  <div className="blog-table__cell blog-table__cell--category">Category</div>
                  <div className="blog-table__cell blog-table__cell--author">Author</div>
                  <div className="blog-table__cell blog-table__cell--date">Created</div>
                  <div className="blog-table__cell blog-table__cell--actions">Actions</div>
                </div>
              </div>
              <div className="blog-table__body">
                {blogs.map((blog: any) => (
                  <div key={blog.id || blog._id} className="blog-table__row">
                    <div className="blog-table__cell blog-table__cell--image">
                      {blog.image || blog.featuredImage ? (
                        <img
                          src={getImageUrlForTable(blog.image || blog.featuredImage)}
                          alt={blog.title}
                          className="blog-table__thumbnail"
                        />
                      ) : (
                        <div className="blog-table__placeholder">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="blog-table__cell blog-table__cell--title">
                      <div className="blog-table__title">
                        <span className="title-text">
                          {blog.title}
                          {blog.isFeatured && (
                            <span className="featured-badge" title="Featured Post">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#fbbf24"
                                stroke="currentColor"
                                strokeWidth="1"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </span>
                          )}
                        </span>
                        {blog.excerpt && (
                          <div className="blog-table__excerpt">
                            {blog.excerpt.substring(0, 100)}...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="blog-table__cell blog-table__cell--status">
                      <span className={`status status--${getBlogStatus(blog)}`}>
                        {getBlogStatus(blog)}
                      </span>
                    </div>
                    <div className="blog-table__cell blog-table__cell--category">
                      <span className="blog-table__category">{blog.category}</span>
                    </div>
                    <div className="blog-table__cell blog-table__cell--author">
                      <div className="blog-table__author">
                        {(typeof blog.author === 'object'
                          ? blog.author?.avatar
                          : blog.authorAvatar) && (
                          <img
                            src={getImageUrlForTable(
                              typeof blog.author === 'object'
                                ? blog.author.avatar
                                : blog.authorAvatar
                            )}
                            alt={typeof blog.author === 'object' ? blog.author.name : blog.author}
                            className="blog-table__author-avatar"
                          />
                        )}
                        <span className="blog-table__author-name">
                          {typeof blog.author === 'object' ? blog.author.name : blog.author}
                        </span>
                      </div>
                    </div>
                    <div className="blog-table__cell blog-table__cell--date">
                      <span className="blog-table__date">
                        {formatDate(blog.createdAt || blog.publishDate || blog.date)}
                      </span>
                    </div>
                    <div className="blog-table__cell blog-table__cell--actions">
                      <div className="blog-table__actions">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="btn btn--icon btn--secondary"
                          title="Edit post"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(blog.id || blog._id)}
                          className={`btn btn--icon ${
                            deleteConfirm === (blog.id || blog._id)
                              ? 'btn--danger'
                              : 'btn--outline-danger'
                          }`}
                          disabled={isDeleting}
                          title={
                            deleteConfirm === (blog.id || blog._id)
                              ? 'Confirm deletion'
                              : 'Delete post'
                          }
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="blog-list-table__mobile">
            <div className="blog-cards">
              {blogs.map((blog: any) => (
                <div key={blog.id || blog._id} className="blog-card">
                  <div className="blog-card__image">
                    {blog.image || blog.featuredImage ? (
                      <img
                        src={getImageUrlForTable(blog.image || blog.featuredImage)}
                        alt={blog.title}
                      />
                    ) : (
                      <div className="blog-card__placeholder">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21,15 16,10 5,21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="blog-card__content">
                    <div className="blog-card__meta">
                      <span className={`status status--${getBlogStatus(blog)}`}>
                        {getBlogStatus(blog)}
                      </span>
                      <span className="blog-card__category">{blog.category}</span>
                    </div>

                    <h3 className="blog-card__title">{blog.title}</h3>

                    <p className="blog-card__excerpt">
                      {blog.excerpt || blog.description || 'No description available'}
                    </p>

                    <div className="blog-card__author">
                      <div className="author-info">
                        {(typeof blog.author === 'object'
                          ? blog.author?.avatar
                          : blog.authorAvatar) && (
                          <img
                            src={getImageUrlForTable(
                              typeof blog.author === 'object'
                                ? blog.author.avatar
                                : blog.authorAvatar
                            )}
                            alt={typeof blog.author === 'object' ? blog.author.name : blog.author}
                            className="author-avatar"
                          />
                        )}
                        <span>
                          {typeof blog.author === 'object' ? blog.author.name : blog.author}
                        </span>
                      </div>
                      <span className="blog-card__date">
                        {formatDate(blog.createdAt || blog.publishDate || blog.date)}
                      </span>
                    </div>

                    <div className="blog-card__actions">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="btn btn--secondary btn--small"
                      >
                        Edit
                      </button>

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
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="blog-list-table__pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn--secondary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                Previous
              </button>

              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
                <span className="pagination-total">({pagination.totalPosts} total posts)</span>
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= pagination.totalPages}
                className="btn btn--secondary"
              >
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogListTable;
