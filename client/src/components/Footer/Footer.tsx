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
      title: 'Services',
      links: [
        { text: 'Digital Marketing Services', path: '/digital-marketing' },
        { text: 'Tailored Software Development Solutions', path: '/software-development' },
        { text: 'Professional Website Design & Development', path: '/website-development' },
        {
          text: 'AI & Machine Learning Solutions for Business Growth',
          path: '/ai-machine-learning',
        },
        { text: 'Advanced Cybersecurity Services & Risk Protection', path: '/cybersecurity' },
        { text: 'Scalable Cloud Infrastructure & IT Solutions', path: '/cloud-infrastructure' },
      ],
    },
    {
      title: 'Resources',
      links: [
        // { text: 'Services', path: '/services' },
        { text: 'Blog', path: '/blogs' },
        { text: 'Case Studies', path: '/case-studies' },
        { text: 'FAQs', path: '/faqs' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Customer Support', path: '/support' },
        { text: 'Help Desk', path: '/help-desk' },
      ],
    },
    // {
    //   title: 'Company',
    //   links: [
    //     { text: 'About', path: '/about' },
    //     { text: 'Careers', path: '/careers' },
    //     { text: 'Contact', path: '/contact' },
    //     { text: 'Training', path: '/training' },
    //     { text: 'Subscribe', path: '/subscribe' },
    //   ],
    // },
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
            <h1 className={styles.cta__title}>
              Ready to grow your business with digital innovation?
            </h1>
            <p className={styles.cta__subtitle}>
              Discover why thousands trust our tech solutions to succeed
            </p>
            <button className={styles.cta__ctaButton}>Book a free consultation now</button>
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
              Nimitech IT is a global technology solutions provider specializing in cybersecurity,
              artificial intelligence, machine learning, digital marketing, software development,
              and graphic design. We empower businesses with innovative, secure, and scalable IT
              solutions tailored to drive digital transformation and long-term success.
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
