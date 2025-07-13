export interface Post {
  id: string;
  title: string;
  content: any;
  excerpt?: string;
  status: PostStatus;
  category: string;
  author:
    | {
        name: string;
        avatar: string;
        date: string;
        bio?: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
  publishDate?: string;
  image?: string;
  tags?: string[];
  slug?: string;
  readTime?: string;
  youtubeUrl?: string;
  contentImage?: string;
  contentImageTitle?: string;
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
