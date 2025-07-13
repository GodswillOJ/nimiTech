import { FC } from 'react';
import styles from './Highlights.module.scss';

export interface HighlightProps {
  title?: string;
  benefits?: Array<string>;
}

export const Highlights: FC<HighlightProps> = ({ title, benefits }) => {
  if (!benefits?.length) return null;

  return (
    <div className={styles.highlights}>
      {title && <h3 className={styles.highlights__title}>{title}</h3>}
      <ul className={styles.highlights__list}>
        {benefits?.map((benefit, index) => (
          <li key={index} className={styles.highlights__item}>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};
