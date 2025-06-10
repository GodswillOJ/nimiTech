import { useState } from 'react';
import { SaveIcon } from '../../../assets/blogCMS/icons/SaveIcon';
import { Button } from '../../../components/blogCMS/Button/Button';
import { Input, Textarea } from '../../../components/blogCMS/Input/Input';
import { ImageUploader } from './_partials/ImageUploader/ImageUploader';
import { PostSettings } from './_partials/PostSettings/PostSettings';
import { AuthorCard } from './_partials/AuthorCard/AuthorCard';
import { MetadataCard } from './_partials/MetadataCard/MetadataCard';
// import { SEOSettings } from './_partials/SEOSettings/SEOSettings';
import { PostEditorProps, FormData, FieldUpdate } from './BlogPostEditor.types';
import styles from './BlogPostEditor.module.scss';

const BlogPostEditor = ({ post, onSave, onCancel, errors = {} }: PostEditorProps) => {
  const [formData, setFormData] = useState<FormData>(post);
  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.image || null);

  const handleInputChange = (field: keyof FieldUpdate, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      featuredImage,
      tags:
        typeof formData.tags === 'string'
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : formData.tags || [],
    };

    onSave(dataToSave);
  };

  return (
    <div className={styles.editor__container}>
      <header className={styles.editor__header}>
        <div className={styles.editor__header_content}>
          <h1 className={styles.editor__title}>{post?.id ? 'Edit Post' : 'Create New Post'}</h1>
          <div className={styles.editor__actions}>
            <Button variant="secondary" onClick={onCancel}>
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

            <Textarea
              label="Content"
              className={styles.editor__content_input}
              placeholder="Start writing your post content..."
              value={formData?.content?.toString() || ''}
              onChange={(e: any) => handleInputChange('content', e.target.value)}
              rows={10}
              error={errors?.content}
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

          <AuthorCard author={formData?.author} />

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
