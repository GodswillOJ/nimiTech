import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SaveIcon } from '../../../assets/blogCMS/icons/SaveIcon';
import { Button } from '../../../components/blogCMS/Button/Button';
import { Input, Textarea, Select } from '../../../components/blogCMS/Input/Input';
import { ImageUploader } from './_partials/ImageUploader/ImageUploader';
import { PostSettings } from './_partials/PostSettings/PostSettings';
import { MetadataCard } from './_partials/MetadataCard/MetadataCard';
// import { SEOSettings } from './_partials/SEOSettings/SEOSettings';
import { FormData, FieldUpdate } from './BlogPostEditor.types';
import { PostStatus } from '../BlogEditorDashboard/BlogEditorDashboard.types';
import { IContent } from '../../blog/blog.types';
import { useToast } from '../../../hooks/useToast';
import {
  useAddEditBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUploadBlogImageMutation,
  useDeleteBlogPostMutation,
} from '../../../services/utilis/blogApiService';
import styles from './BlogPostEditor.module.scss';

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

  // Get default admin/author data (in a real app, this would come from auth context)
  const getDefaultAuthor = () => ({
    name: 'Admin User', // This should come from authenticated user data
    avatar: '',
    date: new Date().toISOString(),
    bio: 'Blog Administrator',
  });

  // Get post data from location state or use default empty post
  const defaultPost = {
    id: Date.now().toString(),
    title: '',
    excerpt: '',
    status: PostStatus.DRAFT,
    category: 'Uncategorized',
    author: getDefaultAuthor(),
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
      const result = await uploadBlogImage({ image: file, type: 'content' }).unwrap();

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
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error: any) {
      console.error('Content image upload error:', error);
      toast.error(
        'Upload failed',
        error?.data?.message || 'Failed to upload content image. Please try again.'
      );
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
      const result = await uploadBlogImage({ image: file, type: 'avatar' }).unwrap();

      if (result.success && result.imageUrl) {
        setAuthorAvatar(result.imageUrl);
        handleAuthorChange('avatar', result.imageUrl);
        toast.success('Avatar uploaded', 'Author avatar uploaded successfully');
      } else if (result.url) {
        setAuthorAvatar(result.url);
        handleAuthorChange('avatar', result.url);
        toast.success('Avatar uploaded', 'Author avatar uploaded successfully');
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(
        'Upload failed',
        error?.data?.message || 'Failed to upload avatar. Please try again.'
      );
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

  const handleInputChange = (field: keyof FieldUpdate, value: string): void => {
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

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    // if (!formData.excerpt?.trim()) {
    //   newErrors.excerpt = 'Excerpt/Description is required';
    // }

    // if (!formData.category?.trim()) {
    //   newErrors.category = 'Category is required';
    // }

    // if (!featuredImage) {
    //   newErrors.featuredImage = 'Featured image is required';
    // }

    if (paragraphs.length === 0 || !paragraphs.some((p) => p && p.content && p.content.trim())) {
      newErrors.content = 'At least one paragraph with content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Some fields are still missing');
      return;
    }

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

      // Validate required fields according to backend schema
      if (!formData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.excerpt?.trim()) {
        throw new Error('Excerpt/Description is required');
      }
      if (!formData.category?.trim()) {
        throw new Error('Category is required');
      }
      if (!featuredImage) {
        throw new Error('Featured image is required');
      }

      // Prepare blog post data - map to backend expected fields
      const blogPostData: any = {
        ...(id && { id }), // Include ID only if updating
        title: formData.title.trim(),
        description: formData.excerpt.trim(), // Backend expects 'description' not 'excerpt'
        content: contentData,
        category: formData.category?.trim() || 'Uncategorized',
        isPublished: formData.status === PostStatus.PUBLISHED, // Convert status to boolean
        tags: processedTags,
        slug: slug.trim(),
        youtubeUrl: formData.youtubeUrl?.trim() || '',
        contentImageTitle: formData.contentImageTitle?.trim() || '',
        readTime: readingTime,
        // Add author information
        author: {
          name:
            typeof formData.author === 'object'
              ? formData.author.name || 'Admin User'
              : formData.author || 'Admin User',
          bio:
            typeof formData.author === 'object'
              ? formData.author.bio || 'Blog Administrator'
              : 'Blog Administrator',
          avatar: authorAvatar || '',
          date: new Date().toLocaleDateString(),
        },
      };

      // Add image URLs only if they exist (they'll be included as strings, not files)
      if (featuredImage) {
        blogPostData.image = featuredImage;
      }
      if (contentImage) {
        blogPostData.contentImage = contentImage;
      }

      console.log('Saving blog post data:', blogPostData);
      console.log('Featured image URL:', featuredImage);
      console.log('Content image URL:', contentImage);
      console.log('Author avatar URL:', authorAvatar);

      // Save the blog post
      const result = await addEditBlogPost(blogPostData).unwrap();

      if (result.success) {
        toast.success(
          id ? 'Post updated successfully!' : 'Post created successfully!',
          `Your blog post "${formData.title}" has been ${id ? 'updated' : 'saved'}.`
        );

        // Navigate back to dashboard
        navigate('/dashboard/posts');
      } else {
        throw new Error(result.message || 'Failed to save post');
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        originalStatus: error?.originalStatus,
      });

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

    setIsLoading(true);

    try {
      const result = await deleteBlogPost(id).unwrap();

      if (result.success) {
        toast.success('Post deleted successfully', 'The blog post has been permanently deleted.');
        navigate('/dashboard/posts');
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post', error?.data?.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/posts');
  };

  return (
    <div className={styles.editor__container}>
      <header className={styles.editor__header}>
        <div className={styles.editor__header_content}>
          <h1 className={styles.editor__title}>{isNewPost ? 'Create New Post' : 'Edit Post'}</h1>
          <div className={styles.editor__actions}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            {id && (
              <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
                Delete Post
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!formData?.title?.trim() || isLoading}
            >
              <SaveIcon />
              {isLoading ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.editor__main}>
        <div className={styles.editor__content}>
          <div className={styles.editor__card}>
            <Input
              label="Title"
              className={styles.editor__title_input}
              type="text"
              placeholder="Enter post title..."
              value={formData?.title || ''}
              onChange={(e: any) => handleInputChange('title', e.target.value)}
              error={errors?.title}
            />

            <Textarea
              label="Excerpt"
              placeholder="Write a brief excerpt..."
              value={formData?.excerpt || ''}
              onChange={(e: any) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              error={errors?.excerpt}
            />

            <Input
              label="Category"
              placeholder="Enter post category..."
              value={formData?.category || ''}
              onChange={(e: any) => handleInputChange('category', e.target.value)}
              error={errors?.category}
            />

            <Input
              label="Subtitle"
              placeholder="Enter post subtitle..."
              value={formData?.content?.subtitle || ''}
              onChange={(e: any) => {
                setFormData((prev) => ({
                  ...prev,
                  content: {
                    ...prev.content,
                    subtitle: e.target.value,
                  },
                }));
              }}
            />

            <div className={styles.editor__content_section}>
              <h3>Content Paragraphs</h3>
              {paragraphs.map((paragraph, index) => (
                <div key={index} className={styles.editor__paragraph}>
                  <div className={styles.editor__paragraph_header}>
                    <Select
                      label={`Paragraph ${index + 1} Type`}
                      value={paragraph.type}
                      onChange={(e: any) => handleParagraphChange(index, 'type', e.target.value)}
                      options={[
                        { value: 'text', label: 'Text' },
                        { value: 'quote', label: 'Quote' },
                      ]}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => removeParagraph(index)}
                      disabled={paragraphs.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    label={paragraph.type === 'quote' ? 'Quote Content' : 'Paragraph Content'}
                    placeholder={
                      paragraph.type === 'quote' ? 'Enter quote...' : 'Enter paragraph content...'
                    }
                    value={paragraph.content}
                    onChange={(e: any) => handleParagraphChange(index, 'content', e.target.value)}
                    rows={4}
                    error={index === 0 ? errors?.content : undefined}
                  />
                </div>
              ))}
              <Button variant="secondary" onClick={addParagraph}>
                Add Paragraph
              </Button>
            </div>

            <div className={styles.editor__content_section}>
              <h3>Highlights</h3>
              <Input
                label="Highlights Title"
                placeholder="Enter highlights section title..."
                value={highlightTitle}
                onChange={(e: any) => setHighlightTitle(e.target.value)}
              />
              {highlights.map((highlight, index) => (
                <div key={index} className={styles.editor__highlight}>
                  <Input
                    label={`Highlight ${index + 1}`}
                    placeholder="Enter highlight point..."
                    value={highlight}
                    onChange={(e: any) => handleHighlightChange(index, e.target.value)}
                  />
                  <Button variant="secondary" onClick={() => removeHighlight(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="secondary" onClick={addHighlight}>
                Add Highlight
              </Button>
            </div>

            <Input
              label="YouTube URL"
              placeholder="Enter YouTube video URL..."
              value={formData?.youtubeUrl || ''}
              onChange={(e: any) => {
                setFormData((prev) => ({
                  ...prev,
                  youtubeUrl: e.target.value,
                }));
              }}
            />

            <Input
              label="Content Image Title"
              placeholder="Enter title for content image..."
              value={formData?.contentImageTitle || ''}
              onChange={(e: any) => {
                setFormData((prev) => ({
                  ...prev,
                  contentImageTitle: e.target.value,
                }));
              }}
            />

            <div className={styles.editor__content_section}>
              <h3>Content Image</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleContentImageUpload(file);
                }}
                style={{ marginBottom: '10px' }}
                disabled={isUploadingContentImage}
              />
              {isUploadingContentImage && <p>Uploading content image...</p>}
              {contentImage && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={contentImage}
                    alt="Content preview"
                    style={{ maxWidth: '200px', height: 'auto', borderRadius: '4px' }}
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
          </div>

          <ImageUploader
            image={featuredImage}
            onImageChange={(url) => {
              setFeaturedImage(url);
              handleInputChange('featuredImage', url || '');
            }}
            error={errors?.featuredImage}
          />
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
            />
            <Input
              label="Author Bio"
              placeholder="Enter author bio..."
              value={typeof formData?.author === 'string' ? '' : formData?.author?.bio || ''}
              onChange={(e: any) => handleAuthorChange('bio', e.target.value)}
            />

            <div className={styles.editor__content_section}>
              <h3>Author Avatar Image</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAuthorAvatarUpload(file);
                }}
                style={{ marginBottom: '10px' }}
                disabled={isUploadingAuthorAvatar}
              />
              {isUploadingAuthorAvatar && <p>Uploading avatar...</p>}
              {authorAvatar && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={authorAvatar}
                    alt="Author avatar preview"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
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

          <MetadataCard
            content={formData?.content?.toString()}
            createdAt={formData?.createdAt}
            updatedAt={formData?.updatedAt}
          />

          {/* <SEOSettings
            metaTitle={formData?.metaTitle}
            metaDescription={formData?.metaDescription}
            onFieldChange={handleInputChange}
            errors={errors}
          /> */}
        </aside>
      </main>
    </div>
  );
};

export default BlogPostEditor;
