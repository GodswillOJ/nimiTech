import { RouteObject } from 'react-router-dom';
import BlogEditorDashboard from '../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard';
import { useNavigate } from 'react-router-dom';

const BlogEditorDashboardWrapper = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/blog-editor');
  };

  const handleEditPost = (post: any) => {
    // Navigate to editor with post ID for editing
    navigate(`/blog-editor/${post.id}`);
  };

  return (
    <BlogEditorDashboard
      posts={[]}
      categories={[]}
      onCreatePost={handleCreatePost}
      onEditPost={handleEditPost}
      onDeletePost={() => {}}
      onDeletePosts={() => {}}
      onUpdatePostStatus={() => {}}
      onDuplicatePost={() => {}}
    />
  );
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <BlogEditorDashboardWrapper />,
  },
];
