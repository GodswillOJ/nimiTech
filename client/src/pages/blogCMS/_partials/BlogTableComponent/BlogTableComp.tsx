import React from 'react';
import { EditIcon } from '../../../../assets/blogCMS/icons/EditIcon';
import { TrashIcon } from '../../../../assets/blogCMS/icons/TrashIcon';
import { Button } from '../../../../components/blogCMS/Button/Button';
import { Checkbox } from '../../../../components/blogCMS/Checkbox/Checkbox';
import styles from './BlogTableComp.module.scss';
import { Post, PostStatus } from './BlogTableComp.types';
import { PreviewIcon } from '../../../../assets/blogCMS/icons/PreviewIcon';
import { DuplicateIcon } from '../../../../assets/blogCMS/icons/DuplicateIcon';
import AuthorAvatar from '../../../../components/blogCMS/AuthorAvatar/AuthorAvatar';
import { TagList } from '../../../../components/blogCMS/Taglist/TagList';
import { StatusBadge } from '../../../../components/blogCMS/StatusBadge/StatusBadge';

interface IBlogTableComp {
  posts: Post[];
  selectedPosts: string[];
  onSelectPost: (postId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onPreview: (post: Post) => void;
  onDuplicate: (post: Post) => void;
  onUpdateStatus: (postId: string, status: PostStatus) => void;
}

export const BlogTableComp: React.FC<IBlogTableComp> = ({
  posts,
  selectedPosts,
  onSelectPost,
  onSelectAll,
  onEdit,
  onDelete,
  onPreview,
  onDuplicate,
  onUpdateStatus,
}) => {
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length;
  const someSelected = selectedPosts.length > 0 && selectedPosts.length < posts.length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (posts.length === 0) {
    return (
      <div className={styles.table__container}>
        <div className={styles.empty__state}>
          <div className={styles.empty__icon}>📝</div>
          <h3 className={styles.empty__title}>No posts found</h3>
          <p className={styles.empty__description}>Create your first blog post to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.table__container}>
      <div className={styles.table__wrapper}>
        <table className={styles.table}>
          <thead className={styles.table__head}>
            <tr>
              <th className={styles.table__header}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(checked: boolean) => onSelectAll(checked)}
                  aria-label="Select all posts"
                />
              </th>
              <th className={styles.table__header}>Post</th>
              <th className={styles.table__header}>Author</th>
              <th className={styles.table__header}>Category</th>
              <th className={styles.table__header}>Status</th>
              <th className={styles.table__header}>Date</th>
              <th className={styles.table__header}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.table__body}>
            {posts.map((post) => (
              <tr key={post.id} className={styles.table__row}>
                <td className={styles.table__cell}>
                  <Checkbox
                    checked={selectedPosts.includes(post.id)}
                    onChange={(checked: boolean) => onSelectPost(post.id, checked)}
                    aria-label={`Select ${post.title}`}
                  />
                </td>

                <td className={styles.table__cell}>
                  <div className={styles.post__info}>
                    <h3 className={styles.post__title}>{post.title}</h3>
                    {post.excerpt && <p className={styles.post__excerpt}>{post.excerpt}</p>}
                    <TagList tags={post.tags} maxVisible={3} />
                  </div>
                </td>

                <td className={styles.table__cell}>
                  <AuthorAvatar author={post.author} size="small" />
                </td>

                <td className={styles.table__cell}>
                  <span className={styles.category}>{post.category}</span>
                </td>

                <td className={styles.table__cell}>
                  <StatusBadge
                    status={post.status}
                    onClick={(status: PostStatus) => onUpdateStatus(post.id, status)}
                    interactive
                  />
                </td>

                <td className={styles.table__cell}>
                  <div className={styles.date__info}>
                    <span className={styles.date__label}>Updated</span>
                    <span className={styles.date__value}>{formatDate(post.updatedAt)}</span>
                  </div>
                </td>

                <td className={styles.table__cell}>
                  <div className={styles.actions}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onEdit(post)}
                      aria-label={`Edit ${post.title}`}
                      className={styles.action__button}
                    >
                      <EditIcon />
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onPreview(post)}
                      aria-label={`Preview ${post.title}`}
                      className={styles.action__button}
                    >
                      <PreviewIcon />
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDuplicate(post)}
                      aria-label={`Duplicate ${post.title}`}
                      className={styles.action__button}
                    >
                      <DuplicateIcon />
                    </Button>

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete(post.id)}
                      aria-label={`Delete ${post.title}`}
                      className={`${styles.action__button} ${styles.delete__button}`}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
