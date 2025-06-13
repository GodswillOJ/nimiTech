import React, { useState, useMemo } from 'react';
import { BlogTableComp } from '../_partials/BlogTableComponent/BlogTableComp';
import styles from './BlogEditorDashboard.module.scss';
import { Post, PostCategory, PostStatus } from './BlogEditorDashboard.types';
import FilterComponent from '../../../components/blogCMS/FilterComponent/FiterComponent';
import { SearchBar } from '../../../components/blogCMS/SearchBar/SearchBar';
import { Button } from '../../../components/blogCMS/Button/Button';
import { PostPreview } from '../../../components/blogCMS/PostPreview/PostPreview';
import { BulkActions } from '../../../components/blogCMS/BulkActions/BulkActions';
import ConfirmDialog from '../../../components/blogCMS/ConfirmDialog/ConfirmDialog';

interface BlogEditorDashboardProps {
  posts: Post[];
  categories: PostCategory[];
  onCreatePost: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onDeletePosts: (postIds: string[]) => void;
  onUpdatePostStatus: (postId: string, status: PostStatus) => void;
  onDuplicatePost: (post: Post) => void;
}

const BlogEditorDashboard: React.FC<BlogEditorDashboardProps> = ({
  posts,
  categories,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onDeletePosts,
  onUpdatePostStatus,
  onDuplicatePost,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    postId?: string;
    postIds?: string[];
  }>({ show: false });

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === 'title') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();

      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });

    return filtered;
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const handleSelectPost = (postId: string, selected: boolean) => {
    setSelectedPosts((prev) => (selected ? [...prev, postId] : prev.filter((id) => id !== postId)));
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedPosts(selected ? filteredAndSortedPosts.map((post) => post.id) : []);
  };

  const handleDeleteSingle = (postId: string) => {
    setDeleteConfirm({ show: true, postId });
  };

  const handleDeleteMultiple = () => {
    setDeleteConfirm({ show: true, postIds: selectedPosts });
  };

  const confirmDelete = () => {
    if (deleteConfirm.postId) {
      onDeletePost(deleteConfirm.postId);
    } else if (deleteConfirm.postIds) {
      onDeletePosts(deleteConfirm.postIds);
      setSelectedPosts([]);
    }
    setDeleteConfirm({ show: false });
  };

  const handlePreview = (post: Post) => {
    setPreviewPost(post);
  };

  const handleClosePreview = () => {
    setPreviewPost(null);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboard__header}>
        <div className={styles.dashboard__header_content}>
          <div className={styles.dashboard__title_section}>
            <h1 className={styles.dashboard__title}>Blog Dashboard</h1>
            <p className={styles.dashboard__subtitle}>Manage your blog posts and content</p>
          </div>

          <div className={styles.dashboard__header_actions}>
            <Button onClick={onCreatePost} title="Create Post" />
          </div>
        </div>
      </header>

      <main className={styles.dashboard__main}>
        <div className={styles.dashboard__controls}>
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search posts..." />

          <FilterComponent
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            categories={categories}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onSortChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {selectedPosts.length > 0 && (
          <BulkActions
            selectedCount={selectedPosts.length}
            onDelete={handleDeleteMultiple}
            onUpdateStatus={(status) => {
              selectedPosts.forEach((postId) => onUpdatePostStatus(postId, status));
              setSelectedPosts([]);
            }}
            onClearSelection={() => setSelectedPosts([])}
          />
        )}

        <div className={styles.dashboard__content}>
          <BlogTableComp
            posts={filteredAndSortedPosts.map((post) => ({
              ...post,
              author: { id: '1', name: post.author },
              tags: post.tags ? post.tags.map((tag) => ({ id: tag, name: tag })) : [],
              slug: post.slug || '',
            }))}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAll}
            onEdit={(post) =>
              onEditPost({
                ...post,
                author: post.author.name,
                tags: post.tags.map((tag) => tag.name),
              })
            }
            onDelete={handleDeleteSingle}
            onPreview={(post) =>
              handlePreview({
                ...post,
                author: post.author.name,
                tags: post.tags.map((tag) => tag.name),
              })
            }
            onDuplicate={(post) =>
              onDuplicatePost({
                ...post,
                author: post.author.name,
                tags: post.tags.map((tag) => tag.name),
              })
            }
            onUpdateStatus={onUpdatePostStatus}
          />
        </div>

        <footer className={styles.dashboard__footer}>
          <div className={styles.dashboard__stats}>
            <span>
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </span>
            <span className={styles.dashboard__total}>Total: {posts.length} posts</span>
          </div>
        </footer>
      </main>

      {previewPost && (
        <PostPreview
          post={previewPost}
          onClose={handleClosePreview}
          onEdit={() => {
            onEditPost(previewPost);
            handleClosePreview();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title={deleteConfirm.postIds ? 'Delete Posts' : 'Delete Post'}
        message={
          deleteConfirm.postIds
            ? `Are you sure you want to delete ${deleteConfirm.postIds.length} selected posts? This action cannot be undone.`
            : 'Are you sure you want to delete this post? This action cannot be undone.'
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false })}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
export default BlogEditorDashboard;
