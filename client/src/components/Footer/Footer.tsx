import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  YouTubeIcon,
  XIcon,
  InstagramIcon,
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
  const navigationData: NavigationItem[] = [
    {
      title: 'Product',
      links: [
        { text: 'Features', path: '/features' },
        { text: 'Pricing', path: '/pricing' },
        // { text: 'Integrations', path: '/integrations' },
        { text: 'Services', path: '/services' },
      ],
    },
    {
      title: 'Resources',
      links: [
        // { text: 'Services', path: '/services' },
        { text: 'Blog', path: '/blogs' },
        { text: 'Tutorials', path: '/tutorials' },
        { text: 'Support', path: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', path: '/about' },
        { text: 'Careers', path: '/careers' },
        { text: 'Contact', path: '/contact' },
        { text: 'Partners', path: '/partners' },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    { icon: <XIcon />, href: '#', label: 'twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'instagram' },
    { icon: <FacebookIcon />, href: '#', label: 'facebook' },
    { icon: <YouTubeIcon />, href: '#', label: 'youtube' },
  ];

  const footerLinks = [
    { text: 'Privacy Policy', path: '/privacy' },
    { text: 'Terms of Service', path: '/terms' },
    { text: 'Cookies Settings', path: '/cookies' },
  ];

  return (
    <div className={styles['footer-wrapper']}>
      <section className={styles.cta}>
        <div className={styles.cta__container}>
          <div className={styles.cta__content}>
            <h1 className={styles.cta__title}>Ready to transform your business success?</h1>
            <p className={styles.cta__subtitle}>
              Join thousands of professionals who are creating
              <br />
              beautiful milestones.
            </p>
            <button className={styles.cta__ctaButton}>Start for free</button>
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
              Nimitech delivers innovative, efficient, and scalable digital solution that empower
              clients to thrive in an ever-evolving digital landscape.
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
            <p className={styles.footer__copyright}>© 2025 NimiTech. All rights reserved.</p>
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
