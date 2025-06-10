import { Input, Textarea } from '../../../../../components/blogCMS/Input/Input';
import { FieldUpdate } from '../../BlogPostEditor.types';
import styles from './SEOSettings.module.scss';

interface SEOSettingsProps {
  metaTitle?: string;
  metaDescription?: string;
  onFieldChange: (field: keyof FieldUpdate, value: string) => void;
  errors?: Record<string, string>;
}

export const SEOSettings = ({
  metaTitle,
  metaDescription,
  onFieldChange,
  errors,
}: SEOSettingsProps) => (
  <div className={styles.seo}>
    <h3 className={styles.seo__title}>SEO Settings</h3>

    <Input
      label="Meta Title"
      placeholder="SEO optimized title"
      value={metaTitle || ''}
      onChange={(e: any) => onFieldChange('metaTitle', e.target.value)}
      maxLength={60}
      helperText={`${(metaTitle || '').length}/60 characters`}
      error={errors?.metaTitle}
    />

    <Textarea
      label="Meta Description"
      placeholder="Brief description for search engines"
      value={metaDescription || ''}
      onChange={(e: any) => onFieldChange('metaDescription', e.target.value)}
      rows={3}
      maxLength={160}
      error={errors?.metaDescription}
      helperText={`${(metaDescription || '').length}/160 characters`}
    />
  </div>
);
