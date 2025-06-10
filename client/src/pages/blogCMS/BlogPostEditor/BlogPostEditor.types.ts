import { IBlogPost, IContent } from '../../blog/blog.types';

export interface PostEditorProps {
  post: IBlogPost;
  onSave: (data: IBlogPost) => void;
  onCancel: () => void;
  errors?: {
    title?: string;
    excerpt?: string;
    content?: string;
    metaDescription?: string;
  };
}

export interface FormData extends IBlogPost {
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string | string[];
  publishDate?: string;
  featuredImage?: string | null;
  category: string;
  author: {
    name: string;
    avatar: string;
    date: string;
  };
  content?: IContent;
  excerpt?: string;
  slug?: string;
  readTime: string;
  youtubeUrl?: string;
  highlights?: {
    title: string;
    description: string;
    benefits: string[];
  };
}

export interface FieldUpdate {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: string;
  category?: string;
  tags?: string | string[];
  slug?: string;
  publishDate?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string | null;
}
