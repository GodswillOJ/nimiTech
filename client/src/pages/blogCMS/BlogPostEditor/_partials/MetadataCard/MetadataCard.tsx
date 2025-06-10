import { formatDate, getReadingTime, getWordCount } from '../../utilis/blogPostHelpers';
import styles from './MetadataCard.module.scss';

interface MetadataCardProps {
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MetadataCard = ({ content, createdAt, updatedAt }: MetadataCardProps) => (
  <div className={styles.metadata}>
    <h3 className={styles.metadata__title}>Post Statistics</h3>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Word Count</span>
      <span className={styles.metadata__value}>{getWordCount(content)}</span>
    </div>

    <div className={styles.metadata__item}>
      <span className={styles.metadata__label}>Reading Time</span>
      <span className={styles.metadata__value}>{getReadingTime(content)}</span>
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
