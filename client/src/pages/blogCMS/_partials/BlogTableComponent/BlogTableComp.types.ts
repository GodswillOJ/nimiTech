export interface Author {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: Author;
  category: string;
  tags: Tag[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  featuredImage?: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  viewCount?: number;
}

export interface BlogTableFilters {
  status?: PostStatus[];
  author?: string[];
  category?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface BlogTableSort {
  field: keyof Post;
  direction: 'asc' | 'desc';
}
