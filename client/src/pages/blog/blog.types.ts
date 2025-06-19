import { IHighlights } from '../../components/blog/Highlights/Highlights.types';

export interface IAuthor {
  name: string;
  avatar: string;
  date: string;
  bio?: string;
}

export interface IContent {
  subtitle?: string;
  paragraphs?: Array<{
    type: string;
    content: string;
  }>;
  highlights?: IHighlights;
}

export interface IBlogPost {
  id: number;
  title: string;
  description: string;
  category: string;
  readTime: string;
  author: IAuthor;
  image: string;
  content?: IContent;
  youtubeUrl?: string;
  contentImage?: string;
  contentImageTitle?: string;
}

export interface IFeaturedPost extends IBlogPost {}
