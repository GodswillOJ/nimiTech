import { IAuthor } from '../../../../blog/blog.types';
import styles from './AuthorCard.module.scss';

interface AuthorCardProps {
  author?: IAuthor | {
    name: string;
    avatar: string;
    date: string;
    bio?: string;
  };
}

export const AuthorCard = ({ author }: AuthorCardProps) => (
  <div className={styles.author}>
    <h3 className={styles.author__title}>Author</h3>
    <div className={styles.author__content}>
      <div className={styles.author__avatar}>{author?.name?.charAt(0) || 'A'}</div>
      <div className={styles.author__info}>
        <div className={styles.author__name}>{author?.name || 'Anonymous'}</div>
        {author?.bio && <div className={styles.author__bio}>{author.bio}</div>}
      </div>
    </div>
  </div>
);
