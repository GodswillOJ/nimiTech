import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SaveIcon } from '../../../assets/blogCMS/icons/SaveIcon';
import { Button } from '../../../components/blogCMS/Button/Button';
import { Input, Textarea, Select } from '../../../components/blogCMS/Input/Input';
import { ImageUploader } from './_partials/ImageUploader/ImageUploader';
import { PostSettings } from './_partials/PostSettings/PostSettings';
import { MetadataCard } from './_partials/MetadataCard/MetadataCard';
import { BlogPreviewModal } from '../../../components/blog/BlogPreviewModal/BlogPreviewModal';
import { FormData, FieldUpdate } from './BlogPostEditor.types';
import { IContent } from '../../blog/blog.types';
import { useToast } from '../../../hooks/useToast';
import { getImageUrl } from '../../../utils/envUtils';
import { formatDate } from '../../../utils/dateUtils';
import {
  useAddEditBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUploadBlogImageMutation,
  useDeleteBlogPostMutation,
} from '../../../services/utilis/blogApiService';
import { useGetAdminProfileQuery } from '../../../services/utilis/adminApiService';
import styles from './BlogPostEditor.module.scss';
import Loader from '../../../components/blog/SuspenseLoader/Loader';

const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
};

const BlogPostEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const toast = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const [addEditBlogPost] = useAddEditBlogPostMutation();
  const [uploadBlogImage] = useUploadBlogImageMutation();
  const [deleteBlogPost] = useDeleteBlogPostMutation();
  const { data: existingPost, isLoading: isLoadingPost } = useGetBlogPostByIdQuery(id || '', {
    skip: !id,
  });
  const { data: adminProfile } = useGetAdminProfileQuery({});

  // Get default admin/author data from actual admin profile
  const defaultAuthor = useMemo(() => {
    const profile = adminProfile?.data?.admin;
    return {
      name: profile ? `${profile.firstName} ${profile.lastName}` : 'Admin User',
      avatar: profile?.avatar || '',
      date: new Date().toISOString(),
      bio: profile?.bio || 'Blog Administrator',
    };
  }, [adminProfile]);

  // Get post data from location state or use default empty post
  const defaultPost = {
    id: Date.now().toString(),
    title: '',
    excerpt: '',
    status: PostStatus.DRAFT,
    category: 'Uncategorized',
    author: defaultAuthor,
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
    isFeatured: false,
  };

  const postFromState = location.state?.post || defaultPost;
  const isNewPost = location.state?.isNew || !location.state;

  const [formData, setFormData] = useState<FormData>(postFromState);
  const [featuredImage, setFeaturedImage] = useState<string | null>(postFromState?.image || null);
  const [contentImage, setContentImage] = useState<string | null>(
    postFromState?.contentImage || null
  );
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(
    typeof postFromState?.author === 'object' ? postFromState.author.avatar || null : null
  );
  const [paragraphs, setParagraphs] = useState<Array<{ type: string; content: string }>>(
    postFromState?.content?.paragraphs || [{ type: 'text', content: '' }]
  );
  const [highlights, setHighlights] = useState<string[]>(
    postFromState?.content?.highlights?.benefits || []
  );
  const [highlightTitle, setHighlightTitle] = useState<string>(
    postFromState?.content?.highlights?.title || ''
  );
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const [isUploadingAuthorAvatar, setIsUploadingAuthorAvatar] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Calculate word count and reading time
  const calculateWordCountAndReadingTime = () => {
    try {
      // Collect all text content with proper null/undefined checks
      const allTextParts = [];

      // Add basic text fields
      if (formData?.title?.trim()) allTextParts.push(formData.title);
      if (formData?.excerpt?.trim()) allTextParts.push(formData.excerpt);
      if (formData?.content?.subtitle?.trim()) allTextParts.push(formData.content.subtitle);
      if (highlightTitle?.trim()) allTextParts.push(highlightTitle);

      // Add all paragraph content (both text and quote types)
      if (Array.isArray(paragraphs)) {
        paragraphs.forEach((paragraph) => {
          if (paragraph && typeof paragraph === 'object' && paragraph.content?.trim()) {
            allTextParts.push(paragraph.content.trim());
          }
        });
      }

      // Add all highlight benefits
      if (Array.isArray(highlights)) {
        highlights.forEach((highlight) => {
          if (highlight && typeof highlight === 'string' && highlight.trim()) {
            allTextParts.push(highlight.trim());
          }
        });
      }

      // Join all text and count words
      const allText = allTextParts.join(' ').trim();

      if (!allText) {
        return { wordCount: 0, readingTime: '1 min read' };
      }

      // More robust word counting - handle various punctuation and spaces
      const words = allText
        .replace(/[^\w\s'"-]/g, ' ') // Replace most punctuation with spaces, keep contractions
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .split(' ')
        .filter((word) => word.length > 0);

      const wordCount = words.length;

      // Average reading speed is 200-250 words per minute, we'll use 225
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));
      const readingTime =
        readingTimeMinutes === 1 ? '1 min read' : `${readingTimeMinutes} min read`;

      return { wordCount, readingTime };
    } catch (error) {
      console.error('Error calculating word count:', error);
      return { wordCount: 0, readingTime: '1 min read' };
    }
  };

  // Content image upload handler
  const handleContentImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large', 'Image size must be less than 8MB');
      return;
    }

    setIsUploadingContentImage(true);

    try {
      console.log('Uploading content image:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadBlogImage({ image: file, type: 'contentImage' }).unwrap();

      // Check multiple possible response formats
      if (result.success && result.imageUrl) {
        setContentImage(result.imageUrl);
        setFormData((prev) => ({
          ...prev,
          contentImage: result.imageUrl,
        }));
        toast.success('Content image uploaded', 'Content image uploaded successfully');
      } else if (result.url) {
        // Handle different response format
        setContentImage(result.url);
        setFormData((prev) => ({
          ...prev,
          contentImage: result.url,
        }));
        toast.success('Content image uploaded', 'Content image uploaded successfully');
      } else if (result.data?.imagePath) {
        // Handle response with data.imagePath
        setContentImage(result.data.imagePath);
        setFormData((prev) => ({
          ...prev,
          contentImage: result.data.imagePath,
        }));
        toast.success('Content image uploaded', 'Content image uploaded successfully');
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Upload failed - no valid URL returned');
      }
    } catch (error: any) {
      console.error('Content image upload error:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      let errorMessage = 'Failed to upload content image. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Upload failed', errorMessage);
    } finally {
      setIsUploadingContentImage(false);
    }
  };

  // Author avatar upload handler
  const handleAuthorAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large', 'Image size must be less than 8MB');
      return;
    }

    setIsUploadingAuthorAvatar(true);

    try {
      console.log('Uploading author avatar:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadBlogImage({ image: file, type: 'authorAvatar' }).unwrap();

      console.log('Avatar upload result:', result);

      // Check multiple possible response formats
      if (result.success && result.imageUrl) {
        setAuthorAvatar(result.imageUrl);
        handleAuthorChange('avatar', result.imageUrl);
        toast.success('Avatar uploaded', 'Author avatar uploaded successfully');
      } else if (result.url) {
        setAuthorAvatar(result.url);
        handleAuthorChange('avatar', result.url);
        toast.success('Avatar uploaded', 'Author avatar uploaded successfully');
      } else if (result.data?.imagePath) {
        setAuthorAvatar(result.data.imagePath);
        handleAuthorChange('avatar', result.data.imagePath);
        toast.success('Avatar uploaded', 'Author avatar uploaded successfully');
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Upload failed - no valid URL returned');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      let errorMessage = 'Failed to upload avatar. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Upload failed', errorMessage);
    } finally {
      setIsUploadingAuthorAvatar(false);
    }
  };

  // Initialize from existing post if editing
  useEffect(() => {
    if (existingPost && !isLoadingPost) {
      const post = existingPost.data || existingPost;
      setFormData(post);
      setFeaturedImage(post.image || null);
      setContentImage(post.contentImage || null);
      setAuthorAvatar(typeof post.author === 'object' ? post.author.avatar || null : null);

      if (post.content?.paragraphs) {
        setParagraphs(post.content.paragraphs);
      }
      if (post.content?.highlights) {
        setHighlights(post.content.highlights.benefits || []);
        setHighlightTitle(post.content.highlights.title || '');
      }
    } else if (location.state?.post) {
      const post = location.state.post;
      setFormData(post);
      setFeaturedImage(post.image || null);
      setContentImage(post.contentImage || null);
      setAuthorAvatar(typeof post.author === 'object' ? post.author.avatar || null : null);

      if (post.content?.paragraphs) {
        setParagraphs(post.content.paragraphs);
      }
      if (post.content?.highlights) {
        setHighlights(post.content.highlights.benefits || []);
        setHighlightTitle(post.content.highlights.title || '');
      }
    }
  }, [existingPost, isLoadingPost, location.state]);

  const handleInputChange = (field: keyof FieldUpdate, value: string | boolean): void => {
    // Special handling for featured posts
    if (field === 'isFeatured' && value === true) {
      const confirmed = window.confirm(
        'Featuring this post will automatically unfeature any currently featured post. Do you want to continue?'
      );
      if (!confirmed) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAuthorChange = (field: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
  };

  const handleParagraphChange = (index: number, field: string, value: string): void => {
    const newParagraphs = [...paragraphs];
    if (field === 'type') {
      newParagraphs[index] = { ...newParagraphs[index], type: value };
    } else {
      newParagraphs[index] = { ...newParagraphs[index], content: value };
    }
    setParagraphs(newParagraphs);
  };

  const addParagraph = (): void => {
    setParagraphs([...paragraphs, { type: 'text', content: '' }]);
  };

  const removeParagraph = (index: number): void => {
    if (paragraphs.length > 1) {
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  const handleHighlightChange = (index: number, value: string): void => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const addHighlight = (): void => {
    setHighlights([...highlights, '']);
  };

  const removeHighlight = (index: number): void => {
    if (highlights.length > 0) {
      const newHighlights = [...highlights];
      newHighlights.splice(index, 1);
      setHighlights(newHighlights);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Only validate title and author name as required
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    // Check author name
    const authorName =
      typeof formData.author === 'object' ? formData.author?.name : formData.author;
    if (!authorName?.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Some fields are still missing');
      return;
    }

    // Show preview modal instead of saving directly
    setShowPreviewModal(true);
  };

  const handleFinalSave = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Process tags if they're a string
      const processedTags =
        typeof formData.tags === 'string'
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : formData.tags || [];

      // Generate slug if not provided
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');

      // Prepare content structure
      const contentData: IContent = {
        subtitle: formData.content?.subtitle || '',
        paragraphs: paragraphs.filter((p) => p && p.content && p.content.trim()) || [
          { type: 'text', content: '' },
        ],
        highlights: {
          title: highlightTitle || '',
          benefits: highlights.filter((h) => h && h.trim()) || [],
        },
      };

      // Calculate reading time based on content
      const { readingTime } = calculateWordCountAndReadingTime();

      // Validate required fields - only title and author name
      if (!formData.title?.trim()) {
        throw new Error('Title is required');
      }

      const authorName =
        typeof formData.author === 'object' ? formData.author?.name : formData.author;
      if (!authorName?.trim()) {
        throw new Error('Author name is required');
      }

      // Prepare blog post data - map to backend expected fields
      const blogPostData: any = {
        ...(id && { id }), // Include ID only if updating
        title: formData.title.trim(),
        description: formData.excerpt?.trim() || '', // Can be empty now
        content: {
          subtitle: formData.content?.subtitle || '',
          paragraphs: paragraphs.filter((p) => p && p.content && p.content.trim()) || [],
          highlights:
            highlightTitle || highlights.some((h) => h.trim())
              ? {
                  title: highlightTitle || '',
                  benefits: highlights.filter((h) => h && h.trim()) || [],
                }
              : undefined,
        },
        category: formData.category?.trim() || '', // Can be empty now
        isPublished: formData.status === PostStatus.PUBLISHED,
        isFeatured: formData.isFeatured || false,
        tags: processedTags,
        slug: slug.trim(),
        youtubeUrl: formData.youtubeUrl?.trim() || '',
        contentImageTitle: formData.contentImageTitle?.trim() || '',
        readTime: readingTime,
        author: {
          name:
            typeof formData.author === 'object'
              ? formData.author.name || 'Admin User'
              : formData.author || 'Admin User',
          bio: typeof formData.author === 'object' ? formData.author.bio || '' : '',
          avatar: authorAvatar || '',
          date: formatDate(new Date()),
        },
      };

      // Add images only if they exist
      if (featuredImage) {
        blogPostData.featuredImage = featuredImage;
      }
      if (contentImage) {
        blogPostData.contentImage = contentImage;
      }
      if (authorAvatar) {
        blogPostData.authorAvatar = authorAvatar;
      }

      console.log('Saving blog post data:', blogPostData);

      // Save the blog post
      const result = await addEditBlogPost(blogPostData).unwrap();

      if (result.success) {
        toast.success(
          id ? 'Post updated successfully!' : 'Post created successfully!',
          `Your blog post "${formData.title}" has been ${id ? 'updated' : 'saved'}.`
        );

        setShowPreviewModal(false);
        // Navigate back to dashboard
        navigate('/dashboard/posts');
      } else {
        throw new Error(result.message || 'Failed to save post');
      }
    } catch (error: any) {
      console.error('Error saving post:', error);

      let errorMessage = 'Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors) {
        errorMessage = Array.isArray(error.data.errors)
          ? error.data.errors.join(', ')
          : error.data.errors;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Failed to save post', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${formData.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteBlogPost(id).unwrap();
      if (result.success) {
        toast.success('Post deleted successfully');
        navigate('/dashboard/posts');
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post', error?.data?.message || 'Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/posts');
  };

  if (isLoadingPost) {
    return <Loader />;
  }

  return (
    <div className={styles.editor__container}>
      <header className={styles.editor__header}>
        <div className={styles.editor__header_content}>
          <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
          <div className={styles.editor__actions}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            {id && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isLoading}
                className={styles.editor__delete_button}
              >
                Delete Post
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              className={styles.editor__save_button}
            >
              <SaveIcon />
              {isLoading ? 'Saving...' : id ? 'Update Post' : 'Save Post'}
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.editor__main}>
        <div className={styles.editor__content}>
          <div className={styles.editor__form}>
            <Input
              label="Post Title"
              placeholder="Enter your post title..."
              value={formData?.title || ''}
              onChange={(e: any) => handleInputChange('title', e.target.value)}
              error={errors?.title}
              required
            />

            <Textarea
              label="Post Excerpt/Description"
              placeholder="Brief description of your post..."
              value={formData?.excerpt || ''}
              onChange={(e: any) => handleInputChange('excerpt', e.target.value)}
              error={errors?.excerpt}
              rows={3}
            />

            {/* <Input
              label="Content Subtitle"
              placeholder="Enter content subtitle..."
              value={formData?.content?.subtitle || ''}
              onChange={(e: any) =>
                setFormData((prev) => ({
                  ...prev,
                  content: {
                    ...prev.content,
                    subtitle: e.target.value,
                  },
                }))
              }
            /> */}

            <Input
              label="YouTube Video URL"
              placeholder="Enter YouTube video URL..."
              value={formData?.youtubeUrl || ''}
              onChange={(e: any) => handleInputChange('youtubeUrl', e.target.value)}
            />
          </div>

          <div className={styles.editor__content_section}>
            <h3>Content Image</h3>
            <div className={styles.editor__file_upload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleContentImageUpload(file);
                  }
                }}
                className={styles.editor__file_input}
                disabled={isUploadingContentImage}
              />
              {isUploadingContentImage && <p>Uploading content image...</p>}
              {contentImage && (
                <div className={styles.editor__image_preview}>
                  <img
                    src={contentImage.startsWith('http') ? contentImage : getImageUrl(contentImage)}
                    alt="Content"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setContentImage(null);
                      setFormData((prev) => ({ ...prev, contentImage: '' }));
                      toast.info('Content image removed');
                    }}
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <Input
              label="Content Image Title"
              placeholder="Enter content image title..."
              value={formData?.contentImageTitle || ''}
              onChange={(e: any) => handleInputChange('contentImageTitle', e.target.value)}
            />
          </div>

          <div className={styles.editor__content_section}>
            <h3>Blog Content Paragraphs</h3>
            {paragraphs.map((paragraph, index) => (
              <div key={index} className={styles.editor__paragraph}>
                <Select
                  label={`Paragraph ${index + 1} Type`}
                  value={paragraph?.type || 'text'}
                  onChange={(e: any) => handleParagraphChange(index, 'type', e.target.value)}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'quote', label: 'Quote' },
                  ]}
                />
                <Textarea
                  label={`${paragraph?.type === 'quote' ? 'Quote' : 'Paragraph'} Content`}
                  placeholder={`Enter your ${paragraph?.type === 'quote' ? 'quote' : 'paragraph'} content...`}
                  value={paragraph?.content || ''}
                  onChange={(e: any) => handleParagraphChange(index, 'content', e.target.value)}
                  rows={4}
                />
                {paragraphs.length > 1 && (
                  <Button
                    variant="danger"
                    onClick={() => removeParagraph(index)}
                    className={styles.editor__remove_button}
                  >
                    Remove Paragraph
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={addParagraph}
              className={styles.editor__add_button}
            >
              Add Paragraph
            </Button>
          </div>

          <div className={styles.editor__content_section}>
            <h3>Highlights Section</h3>
            <Input
              label="Highlights Title"
              placeholder="Enter highlights title..."
              value={highlightTitle}
              onChange={(e: any) => setHighlightTitle(e.target.value)}
            />
            {highlights.map((highlight, index) => (
              <div key={index} className={styles.editor__highlight}>
                <Input
                  label={`Highlight ${index + 1}`}
                  placeholder="Enter highlight benefit..."
                  value={highlight}
                  onChange={(e: any) => handleHighlightChange(index, e.target.value)}
                />
                <Button
                  variant="danger"
                  onClick={() => removeHighlight(index)}
                  className={styles.editor__remove_button}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={addHighlight}
              className={styles.editor__add_button}
            >
              Add Highlight
            </Button>
          </div>

          <div className={styles.editor__image_upload}>
            <h3>Featured Image</h3>
            <ImageUploader
              image={featuredImage}
              onImageChange={(url) => {
                setFeaturedImage(url);
                handleInputChange('featuredImage', url || '');
              }}
              error={errors?.featuredImage}
            />
          </div>
        </div>

        <aside className={styles.editor__sidebar}>
          <div className={styles.editor__word_count}>
            <h3>Content Statistics</h3>
            <div className={styles.editor__stats}>
              <div className={styles.editor__stat}>
                <span className={styles.editor__stat_label}>Word Count:</span>
                <span className={styles.editor__stat_value}>
                  {calculateWordCountAndReadingTime().wordCount}
                </span>
              </div>
              <div className={styles.editor__stat}>
                <span className={styles.editor__stat_label}>Reading Time:</span>
                <span className={styles.editor__stat_value}>
                  {calculateWordCountAndReadingTime().readingTime}
                </span>
              </div>
            </div>
          </div>

          <PostSettings formData={formData} onFieldChange={handleInputChange} errors={errors} />

          <div className={styles.editor__author_section}>
            <h3>Author Information</h3>
            <Input
              label="Author Name"
              placeholder="Enter author name..."
              value={
                typeof formData?.author === 'string'
                  ? formData.author
                  : formData?.author?.name || ''
              }
              onChange={(e: any) => handleAuthorChange('name', e.target.value)}
              error={errors?.authorName}
              required
            />
            <Input
              label="Author Bio"
              placeholder="Enter author bio..."
              value={typeof formData?.author === 'string' ? '' : formData?.author?.bio || ''}
              onChange={(e: any) => handleAuthorChange('bio', e.target.value)}
            />

            <div className={styles.editor__content_section}>
              <h3>Author Avatar Image</h3>
              <div className={styles.editor__file_upload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAuthorAvatarUpload(file);
                    }
                  }}
                  className={styles.editor__file_input}
                  disabled={isUploadingAuthorAvatar}
                />
                {isUploadingAuthorAvatar && <p>Uploading author avatar...</p>}
                {authorAvatar && (
                  <div className={styles.editor__image_preview}>
                    <img
                      src={
                        authorAvatar.startsWith('http') ? authorAvatar : getImageUrl(authorAvatar)
                      }
                      alt="Author Avatar"
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAuthorAvatar(null);
                        handleAuthorChange('avatar', '');
                        toast.info('Avatar removed');
                      }}
                      style={{
                        marginLeft: '10px',
                        padding: '5px 10px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <MetadataCard
            wordCount={calculateWordCountAndReadingTime().wordCount}
            readingTime={calculateWordCountAndReadingTime().readingTime}
            createdAt={formData?.createdAt}
            updatedAt={formData?.updatedAt}
          />
        </aside>
      </main>

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSubmit={handleFinalSave}
        formData={{
          title: formData.title,
          excerpt: formData.excerpt,
          category: formData.category,
          author: formData.author,
          content: {
            subtitle: formData.content?.subtitle || '',
            paragraphs: paragraphs.filter((p) => p && p.content && p.content.trim()),
            highlights: {
              title: highlightTitle,
              benefits: highlights.filter((h) => h && h.trim()),
            },
          },
          youtubeUrl: formData.youtubeUrl,
          tags: formData.tags,
          isFeatured: formData.isFeatured,
        }}
        featuredImage={featuredImage}
        contentImage={contentImage}
        authorAvatar={authorAvatar}
        readingTime={calculateWordCountAndReadingTime().readingTime}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BlogPostEditor;
