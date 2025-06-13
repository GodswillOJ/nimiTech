export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  featuredImage?: string;
  tags?: string[];
  slug?: string;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}
