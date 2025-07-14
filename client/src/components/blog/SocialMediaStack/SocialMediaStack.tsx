import React, { useState, useEffect } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from '../../../assets/blog/icons/SocialIcons';
import styles from './SocialMediaStack.module.scss';

interface SocialIcon {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  className: string;
}

interface SocialMediaStackProps {
  icons?: SocialIcon[];
  autoShowDelay?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

const defaultIcons: SocialIcon[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61577287182430',
    className: 'facebook',
    icon: <FacebookIcon />,
  },
  {
    id: 'twitter',
    name: 'X (formerly Twitter)',
    url: 'https://x.com/Nimitechitinsta',
    className: 'twitter',
    icon: <XIcon />,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/nimitechit1/',
    className: 'instagram',
    icon: <InstagramIcon />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/nimi-tech-consultants-llc/?viewAsMember=true',
    className: 'linkedin',
    icon: <LinkedInIcon />,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/2529039651',
    className: 'whatsapp',
    icon: <WhatsAppIcon />,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@NimiTechITConsultantsLLC-IT',
    className: 'youtube',
    icon: <YouTubeIcon />,
  },
];

const SocialMediaStack: React.FC<SocialMediaStackProps> = ({
  icons = defaultIcons,
  autoShowDelay = 40000,
  position = 'top-right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, autoShowDelay);

    return () => clearTimeout(timer);
  }, [autoShowDelay]);

  const closeStack = () => {
    setIsVisible(false);
  };

  const handleIconClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className={`
          ${styles['social-stack']} 
          ${styles[`social-stack--${position}`]}
          ${isVisible ? styles['social-stack--active'] : ''}
          ${className}
        `}
      >
        <button
          className={styles['social-stack__close']}
          onClick={closeStack}
          aria-label="Close social media icons"
        >
          ×
        </button>

        {icons.map((icon, index) => (
          <a
            key={icon.id}
            href={icon.url}
            className={`${styles['social-stack__icon']} ${styles[`social-stack__icon--${icon.className}`]}`}
            title={icon.name}
            onClick={(e) => {
              e.preventDefault();
              handleIconClick(icon.url);
            }}
            style={{ transitionDelay: isVisible ? `${(index + 1) * 0.1}s` : '0s' }}
          >
            {icon.icon}
          </a>
        ))}
      </div>
    </>
  );
};

export default SocialMediaStack;
