import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
<<<<<<< HEAD
  XIcon,
  YouTubeIcon,
=======
  LinkedInIcon,
  WhatsAppIcon,
>>>>>>> 660114ea5283dcf4aebf2e0b2c4a9f87afc5cd91
} from '../../assets/blog/icons/SocialIcons';
import styles from './Footer.module.scss';

import logoIcon from '../../assets/NimiTechLogo1.png';
import logoText from '../../assets/NimiTechLogo2.png';

interface NavigationItem {
  title: string;
  links: NavigationLink[];
}

interface NavigationLink {
  text: string;
  path: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const navigationData: NavigationItem[] = [
    {
      title: 'Resources',
      links: [
        { text: 'Services', path: '/our-services' },
        { text: 'Blog', path: '/blogs' },
        { text: 'Case Studies', path: '/case-studies' },
        { text: 'FAQs', path: '/faqs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', path: '/about' },
        { text: 'Careers', path: '/careers' },
        { text: 'Contact', path: '/contact-us' },
        { text: 'Training', path: 'https://www.nimitutor.com/' },
        { text: 'Subscribe', path: '/subscribe' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Customer Support', path: '/support' },
        { text: 'Help Desk', path: '/help-desk' },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    { icon: <XIcon />, href: 'https://x.com/nimi_techIT', label: 'twitter' },
<<<<<<< HEAD
    { icon: <InstagramIcon />, href: 'https://instagram.com/nimi.techit/', label: 'instagram' },
=======
    { icon: <InstagramIcon />, href: 'https://www.instagram.com/nimi.techit/', label: 'instagram' },
>>>>>>> 660114ea5283dcf4aebf2e0b2c4a9f87afc5cd91
    {
      icon: <FacebookIcon />,
      href: 'https://www.facebook.com/profile.php?id=61577287182430',
      label: 'facebook',
    },
    {
      icon: <YouTubeIcon />,
      href: 'https://www.youtube.com/@NimiTechITConsultantsLLC-IT',
      label: 'youtube',
    },
<<<<<<< HEAD
=======
    {
      icon: <LinkedInIcon />,
      href: 'https://www.linkedin.com/company/nimi-tech-consultants-llc/?viewAsMember=true',
      label: 'linkedin',
    },
    { icon: <WhatsAppIcon />, href: '#', label: 'whatsapp' },
>>>>>>> 660114ea5283dcf4aebf2e0b2c4a9f87afc5cd91
  ];

  const footerLinks = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms of Service', path: '/terms' },
    { text: 'Cookies Settings', path: '/cookies' },
  ];

  const handleBookConsultation = () => {
    navigate('/contact-us');
  };

  return (
    <div className={styles['footer-wrapper']}>
      <section className={styles.cta}>
        <div className={styles.cta__container}>
          <div className={styles.cta__content}>
            <h1 className={styles.cta__title}>
              Ready to grow your business with digital innovation?
            </h1>
            <p className={styles.cta__subtitle}>
              Discover why thousands trust our tech solutions to succeed
            </p>
            <button className={styles.cta__ctaButton} onClick={handleBookConsultation}>
              Book a free consultation now
            </button>
          </div>
        </div>
      </section>

      {/* Primary Footer */}
      <section className={styles['main-content']}>
        <div className={styles['main-content__container']}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <div className={styles.brand__logo}>
              <img className={styles.brand__icon} src={logoIcon} />
              <img className={styles.brand__name} src={logoText} />
            </div>
            <p className={styles.brand__description}>
              {/* Nimitech IT is a global technology solutions provider specializing in cybersecurity,
              artificial intelligence, machine learning, digital marketing, software development,
              and graphic design. We empower businesses with innovative, secure, and scalable IT
              solutions tailored to drive digital transformation and long-term success. */}
            </p>
            <div className={styles.brand__social}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={styles.brand__socialLink}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            {navigationData.map((section, index) => (
              <div key={index} className={styles.navigation__column}>
                <h3 className={styles.navigation__title}>{section.title}</h3>
                <ul className={styles.navigation__list}>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className={styles.navigation__item}>
                      <Link to={link.path} className={styles.navigation__link}>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </section>

      {/* secondary footer */}
      <footer className={styles.footer}>
        <div className={styles.footer__container}>
          <div className={styles.footer__content}>
            <p className={styles.footer__copyright}>© 2025 NIMITECH. All rights reserved.</p>
            <div className={styles.footer__links}>
              {footerLinks.map((link, index) => (
                <div key={index}>
                  <Link to={link.path} className={styles.footer__link}>
                    {link.text}
                  </Link>
                  {/* {index < footerLinks.length - 1 && (
                    <span className={styles.footer__separator}>•</span>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
