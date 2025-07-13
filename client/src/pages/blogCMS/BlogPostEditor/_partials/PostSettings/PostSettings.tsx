import { Input, Select } from '../../../../../components/blogCMS/Input/Input';
import { FormData, FieldUpdate } from '../../BlogPostEditor.types';
import styles from './PostSettings.module.scss';

interface PostSettingsProps {
  formData: FormData;
  onFieldChange: (field: keyof FieldUpdate, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const categories = [
  { value: 'Tutorial', label: 'Tutorial' },
  { value: 'Design', label: 'Design' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Business', label: 'Business' },
];

const statuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
];

export const PostSettings = ({ formData, onFieldChange, errors }: PostSettingsProps) => (
  <div className={styles.settings}>
    <h3 className={styles.settings__title}>Post Settings</h3>

    <Select
      label="Status"
      value={formData?.status || 'draft'}
      onChange={(e: any) => onFieldChange('status', e.target.value)}
      options={statuses}
    />

    <Select
      label="Category"
      value={formData?.category || ''}
      onChange={(e: any) => onFieldChange('category', e.target.value)}
      options={categories}
    />

    <Input
      label="Tags"
      placeholder="react, javascript, tutorial"
      value={Array.isArray(formData?.tags) ? formData.tags.join(', ') : formData?.tags || ''}
      onChange={(e: any) => onFieldChange('tags', e.target.value)}
      error={errors?.tags}
    />

    {/* Featured Post Toggle */}
    <div className={styles.settings__checkbox}>
      <label className={styles.settings__checkbox_label}>
        <input
          type="checkbox"
          checked={formData?.isFeatured || false}
          onChange={(e) => onFieldChange('isFeatured', e.target.checked)}
          className={styles.settings__checkbox_input}
        />
        <span className={styles.settings__checkbox_text}>Feature this post</span>
      </label>
      <p className={styles.settings__checkbox_description}>
        Featured posts appear prominently on the blog homepage
      </p>
    </div>

    {formData?.status === 'scheduled' && (
      <Input
        label="Publish Date"
        type="datetime-local"
        value={formData?.publishDate || ''}
        onChange={(e: any) => onFieldChange('publishDate', e.target.value)}
        error={errors?.publishDate}
      />
    )}
  </div>
);
