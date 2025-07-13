import { useNavigate } from 'react-router-dom';
import notFoundImage from '../../assets/blog/svgComponents/notFound.svg';
import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__container}>
        <div className={styles.notFound__image}>
          <img
            src={notFoundImage}
            alt="Page not found illustration"
            width="100%"
            height="auto"
            loading="lazy"
          />
        </div>
        <div className={styles.notFound__content}>
          <h2 className={styles.notFound__subtitle}>Page Not Found</h2>
          <p className={styles.notFound__text}>
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>
          <div className={styles.notFound__actions}>
            <button
              onClick={() => navigate(-1)}
              className={`${styles.notFound__button} ${styles.notFound__button_back}`}
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${styles.notFound__button} ${styles.notFound__button_home}`}
            >
              Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
