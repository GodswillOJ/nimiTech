import React, { useState, useEffect } from 'react';
import {
  useAddEditBlogPostMutation,
  useGetBlogPostByIdQuery,
} from '../../../services/utilis/blogApiService';
import { formatDate } from '../../../utils/dateUtils';
import ImageUpload from '../ImageUpload/ImageUpload';
import './BlogEditor.scss';
import Loader from '../SuspenseLoader/Loader';

interface BlogEditorProps {
  blogId?: string; // If provided, we're editing an existing blog
  onSave?: (blog: any) => void;
  onCancel?: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    readTime: '',
    author: {
      name: '',
      avatar: null as File | null,
      date: formatDate(new Date()),
      bio: '',
    },
    featuredImage: null as File | null,
    content: {
      subtitle: '',
      paragraphs: [{ type: 'text', content: '' }],
      highlights: {
        title: '',
        benefits: [''],
      },
    },
    youtubeUrl: '',
    contentImage: null as File | null,
    contentImageTitle: '',
    isFeatured: false,
    isPublished: true,
    tags: [''],
  });

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    featuredImage: '',
    contentImage: '',
    authorAvatar: '',
  });

  // Fetch existing blog if editing
  const { data: existingBlog, isLoading: isLoadingBlog } = useGetBlogPostByIdQuery(blogId!, {
    skip: !blogId,
  });

  // Mutations
  const [saveBlog, { isLoading: isSaving }] = useAddEditBlogPostMutation();

  // Load existing blog data when editing
  useEffect(() => {
    if (existingBlog?.success && existingBlog.data) {
      const blog = existingBlog.data;
      setFormData({
        title: blog.title || '',
        description: blog.description || '',
        category: blog.category || '',
        readTime: blog.readTime || '',
        author: {
          name: blog.author?.name || '',
          avatar: null, // Files will be handled separately
          date: blog.author?.date || formatDate(new Date()),
          bio: blog.author?.bio || '',
        },
        featuredImage: null,
        content: {
          subtitle: blog.content?.subtitle || '',
          paragraphs: blog.content?.paragraphs || [{ type: 'text', content: '' }],
          highlights: {
            title: blog.content?.highlights?.title || '',
            benefits: blog.content?.highlights?.benefits || [''],
          },
        },
        youtubeUrl: blog.youtubeUrl || '',
        contentImage: null,
        contentImageTitle: blog.contentImageTitle || '',
        isFeatured: blog.isFeatured || false,
        isPublished: blog.isPublished !== false, // Default to true
        tags: blog.tags || [''],
      });

      // Set image previews for existing images
      setImagePreviews({
        featuredImage: blog.image || '',
        contentImage: blog.contentImage || '',
        authorAvatar: blog.author?.avatar || '',
      });
    }
  }, [existingBlog]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData((prev) => {
      const parentValue = prev[parentField as keyof typeof prev];
      if (typeof parentValue === 'object' && parentValue !== null) {
        return {
          ...prev,
          [parentField]: {
            ...parentValue,
            [field]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleArrayChange = (field: string, index: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev])
        ? (prev[field as keyof typeof prev] as any[]).map((item: any, i: number) =>
            i === index ? value : item
          )
        : prev[field as keyof typeof prev],
    }));
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev])
        ? [...(prev[field as keyof typeof prev] as any[]), defaultValue]
        : prev[field as keyof typeof prev],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev])
        ? (prev[field as keyof typeof prev] as any[]).filter((_: any, i: number) => i !== index)
        : prev[field as keyof typeof prev],
    }));
  };

  const handleFileUpload = (field: string, file: File) => {
    if (field === 'featuredImage') {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      setImagePreviews((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
    } else if (field === 'contentImage') {
      setFormData((prev) => ({ ...prev, contentImage: file }));
      setImagePreviews((prev) => ({ ...prev, contentImage: URL.createObjectURL(file) }));
    } else if (field === 'authorAvatar') {
      setFormData((prev) => ({
        ...prev,
        author: { ...prev.author, avatar: file },
      }));
      setImagePreviews((prev) => ({ ...prev, authorAvatar: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const blogData = {
        ...formData,
        ...(blogId && { id: blogId }),
      };

      const result = await saveBlog(blogData).unwrap();

      if (result.success) {
        onSave?.(result.data);
      }
    } catch (error: any) {
      console.error('Failed to save blog:', error);
      alert(error?.data?.message || 'Failed to save blog post');
    }
  };

  if (isLoadingBlog) {
    return (
      <div className="blog-editor-loading">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="blog-editor">
      <h2>{blogId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>

      {/* Basic Information */}
      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => handleInputChange('readTime', e.target.value)}
              placeholder="e.g., 5 min read"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <div className="file-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('featuredImage', file);
              }}
              id="featuredImage"
            />
            <label htmlFor="featuredImage" className="file-upload-label">
              Choose Featured Image
            </label>
          </div>
          {imagePreviews.featuredImage && (
            <img
              src={imagePreviews.featuredImage}
              alt="Featured"
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            />
            Featured Post
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => handleInputChange('isPublished', e.target.checked)}
            />
            Published
          </label>
        </div>
      </div>

      {/* Author Information */}
      <div className="form-section">
        <h3>Author Information</h3>

        <div className="form-group">
          <label>Author Name</label>
          <input
            type="text"
            value={formData.author.name}
            onChange={(e) => handleNestedInputChange('author', 'name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Author Avatar</label>
          <div className="file-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('authorAvatar', file);
              }}
              id="authorAvatar"
            />
            <label htmlFor="authorAvatar" className="file-upload-label">
              Choose Author Avatar
            </label>
          </div>
          {imagePreviews.authorAvatar && (
            <img
              src={imagePreviews.authorAvatar}
              alt="Author Avatar"
              style={{ maxWidth: '100px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Author Bio</label>
          <textarea
            value={formData.author.bio}
            onChange={(e) => handleNestedInputChange('author', 'bio', e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="form-section">
        <h3>Content</h3>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={formData.content.subtitle}
            onChange={(e) => handleNestedInputChange('content', 'subtitle', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content Paragraphs</label>
          {formData.content.paragraphs.map((paragraph, index) => (
            <div key={index} className="paragraph-item">
              <select
                value={paragraph.type}
                onChange={(e) =>
                  handleArrayChange('content.paragraphs', index, {
                    ...paragraph,
                    type: e.target.value,
                  })
                }
              >
                <option value="text">Text</option>
                <option value="quote">Quote</option>
              </select>
              <textarea
                value={paragraph.content}
                onChange={(e) =>
                  handleArrayChange('content.paragraphs', index, {
                    ...paragraph,
                    content: e.target.value,
                  })
                }
                placeholder={
                  paragraph.type === 'quote' ? 'Enter quote...' : 'Enter paragraph content...'
                }
              />
              <button type="button" onClick={() => removeArrayItem('content.paragraphs', index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('content.paragraphs', { type: 'text', content: '' })}
          >
            Add Paragraph
          </button>
        </div>

        <div className="form-group">
          <label>Content Image</label>
          <div className="file-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('contentImage', file);
              }}
              id="contentImage"
            />
            <label htmlFor="contentImage" className="file-upload-label">
              Choose Content Image
            </label>
          </div>
          {imagePreviews.contentImage && (
            <img
              src={imagePreviews.contentImage}
              alt="Content"
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
          <input
            type="text"
            placeholder="Content Image Title"
            value={formData.contentImageTitle}
            onChange={(e) => handleInputChange('contentImageTitle', e.target.value)}
            style={{ marginTop: '10px' }}
          />
        </div>

        <div className="form-group">
          <label>YouTube URL (optional)</label>
          <input
            type="url"
            value={formData.youtubeUrl}
            onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
          />
        </div>
      </div>

      {/* Highlights */}
      <div className="form-section">
        <h3>Highlights</h3>

        <div className="form-group">
          <label>Highlights Title</label>
          <input
            type="text"
            value={formData.content.highlights.title}
            onChange={(e) =>
              handleNestedInputChange('content', 'highlights', {
                ...formData.content.highlights,
                title: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Benefits</label>
          {formData.content.highlights.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <input
                type="text"
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...formData.content.highlights.benefits];
                  newBenefits[index] = e.target.value;
                  handleNestedInputChange('content', 'highlights', {
                    ...formData.content.highlights,
                    benefits: newBenefits,
                  });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newBenefits = formData.content.highlights.benefits.filter(
                    (_, i) => i !== index
                  );
                  handleNestedInputChange('content', 'highlights', {
                    ...formData.content.highlights,
                    benefits: newBenefits,
                  });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newBenefits = [...formData.content.highlights.benefits, ''];
              handleNestedInputChange('content', 'highlights', {
                ...formData.content.highlights,
                benefits: newBenefits,
              });
            }}
          >
            Add Benefit
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="form-section">
        <h3>Tags</h3>
        {formData.tags.map((tag, index) => (
          <div key={index} className="tag-item">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleArrayChange('tags', index, e.target.value)}
            />
            <button type="button" onClick={() => removeArrayItem('tags', index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('tags', '')}>
          Add Tag
        </button>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : blogId ? 'Update' : 'Create'} Blog Post
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BlogEditor;
