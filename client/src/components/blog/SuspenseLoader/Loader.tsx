import React from 'react';
import style from './Loader.module.scss';

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = React.memo(({ fullScreen = true, className }) => {
  if (fullScreen) {
    return (
      <div className={`${style.loader} ${className || ''}`}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  return <div className={`${style.spinner} ${className || ''}`}></div>;
});

Loader.displayName = 'Loader';

export default Loader;
