import React from 'react';
import AuthFlow from '../../components/Auth/AuthFlow';
import styles from './AuthPage.module.scss';

const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage}>
      <AuthFlow />
    </div>
  );
};

export default AuthPage;
