import React from 'react';
import style from './Loader.module.scss';

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = true, className }) => {
  if (fullScreen) {
    return (
      <div className={`${style.loader} ${className || ''}`}>
        <div className={style.spinner}></div>
      </div>
    );
  }

  return <div className={`${style.spinner} ${className || ''}`}></div>;
};

export default Loader;
