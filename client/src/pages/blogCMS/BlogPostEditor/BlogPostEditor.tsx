import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SaveIcon } from '../../../assets/blogCMS/icons/SaveIcon';
import { Button } from '../../../components/blogCMS/Button/Button';
import { Input, Textarea, Select } from '../../../components/blogCMS/Input/Input';
import { ImageUploader } from './_partials/ImageUploader/ImageUploader';
import { PostSettings } from './_partials/PostSettings/PostSettings';
import { AuthorCard } from './_partials/AuthorCard/AuthorCard';
import { MetadataCard } from './_partials/MetadataCard/MetadataCard';
// import { SEOSettings } from './_partials/SEOSettings/SEOSettings';
import { FormData, FieldUpdate } from './BlogPostEditor.types';
import { PostStatus } from '../BlogEditorDashboard/BlogEditorDashboard.types';
import { IContent } from '../../blog/blog.types';
import styles from './BlogPostEditor.module.scss';

const BlogPostEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get post data from location state or use default empty post
  const defaultPost = {
    id: Date.now().toString(),
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

  const postFromState = location.state?.post || defaultPost;
  const isNewPost = location.state?.isNew || !location.state;

  const [formData, setFormData] = useState<FormData>(postFromState);
  const [featuredImage, setFeaturedImage] = useState<string | null>(postFromState?.image || null);
  const [paragraphs, setParagraphs] = useState<Array<{ type: string; content: string }>>(
    postFromState?.content?.paragraphs || [{ type: 'text', content: '' }]
  );
  const [highlights, setHighlights] = useState<string[]>(
    postFromState?.content?.highlights?.benefits || []
  );
  const [highlightTitle, setHighlightTitle] = useState<string>(
    postFromState?.content?.highlights?.title || ''
  );

  // Initialize from location state if editing an existing post
  useEffect(() => {
    if (location.state?.post) {
      setFormData(location.state.post);
      setFeaturedImage(location.state.post.image || null);

      if (location.state.post.content?.paragraphs) {
        setParagraphs(location.state.post.content.paragraphs);
      }
      if (location.state.post.content?.highlights) {
        setHighlights(location.state.post.content.highlights.benefits || []);
        setHighlightTitle(location.state.post.content.highlights.title || '');
      }
    }
  }, [location.state]);

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

    if (paragraphs.length === 0 || !paragraphs.some((p) => p.content.trim())) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

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
      paragraphs: paragraphs || [],
      highlights: {
        title: highlightTitle || '',
        benefits: highlights || [],
      },
    };

    // Prepare data to save
    const dataToSave = {
      ...formData,
      id: isNewPost ? Date.now().toString() : formData.id,
      image: featuredImage || '',
      tags: processedTags,
      slug,
      updatedAt: new Date().toISOString(),
      publishDate:
        formData.status === PostStatus.PUBLISHED ? new Date().toISOString() : formData.publishDate,
      content: contentData,
      youtubeUrl: formData.youtubeUrl || '',
      contentImage: formData.contentImage || '',
      contentImageTitle: formData.contentImageTitle || '',
    };

    // Get existing posts from localStorage
    const savedPostsJson = localStorage.getItem('blogPosts');
    let savedPosts = [];

    if (savedPostsJson) {
      try {
        savedPosts = JSON.parse(savedPostsJson);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
      }
    }

    // Update or add the post
    if (isNewPost) {
      savedPosts.push(dataToSave);
    } else {
      const index = savedPosts.findIndex((post: any) => post.id === dataToSave.id);
      if (index !== -1) {
        savedPosts[index] = dataToSave;
      } else {
        savedPosts.push(dataToSave);
      }
    }

    // Save back to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(savedPosts));

    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
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
            <Button variant="primary" onClick={handleSave} disabled={!formData?.title?.trim()}>
              <SaveIcon />
              Save Post
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
          </div>

          <ImageUploader
            image={featuredImage}
            onImageChange={(url) => {
              setFeaturedImage(url);
              handleInputChange('featuredImage', url || '');
            }}
          />
        </div>

        <aside className={styles.editor__sidebar}>
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
              label="Author Avatar URL"
              placeholder="Enter author avatar URL..."
              value={typeof formData?.author === 'string' ? '' : formData?.author?.avatar || ''}
              onChange={(e: any) => handleAuthorChange('avatar', e.target.value)}
            />
            <Input
              label="Author Bio"
              placeholder="Enter author bio..."
              value={typeof formData?.author === 'string' ? '' : formData?.author?.bio || ''}
              onChange={(e: any) => handleAuthorChange('bio', e.target.value)}
            />
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
