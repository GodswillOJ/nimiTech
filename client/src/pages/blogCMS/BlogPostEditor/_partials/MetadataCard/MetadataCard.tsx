import { formatDate } from '../../utilis/blogPostHelpers';
import styles from './MetadataCard.module.scss';

interface MetadataCardProps {
  wordCount: number;
  readingTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MetadataCard = ({
  wordCount,
  readingTime,
  createdAt,
  updatedAt,
}: MetadataCardProps) => (
  <div className={styles.metadata}>
    <h3 className={styles.metadata__title}>Post Statistics</h3>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Word Count</span>
      <span className={styles.metadata__value}>{wordCount}</span>
    </div>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Reading Time</span>
      <span className={styles.metadata__value}>{readingTime}</span>
    </div>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Created</span>
      <span className={styles.metadata__value}>{formatDate(createdAt)}</span>
    </div>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Last Modified</span>
      <span className={styles.metadata__value}>{formatDate(updatedAt)}</span>
    </div>
  </div>
);
