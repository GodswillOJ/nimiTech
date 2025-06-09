import { IHighlights } from '../../components/blog/Highlights/Highlights.types';

export interface IAuthor {
  name: string;
  avatar: string;
  date: string;
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
}

export interface IFeaturedPost extends IBlogPost {}
