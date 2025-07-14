import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from '../../assets/blog/icons/SocialIcons';
import styles from './Footer.module.scss';

import logoIcon from '../../assets/NimiTechLogo1.png';
import logoText from '../../assets/NimiTechLogo2.png';

interface NavigationItem {
  title: string;
  links?: NavigationLink[];
  socialLinks?: SocialLink[];
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

  const socialLinks: SocialLink[] = [
    { icon: <XIcon />, href: 'https://x.com/Nimitechitinsta', label: 'twitter' },
    { icon: <InstagramIcon />, href: 'https://www.instagram.com/nimitechit1/', label: 'instagram' },
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
    {
      icon: <LinkedInIcon />,
      href: 'https://www.linkedin.com/company/nimi-tech-consultants-llc/?viewAsMember=true',
      label: 'linkedin',
    },
    { icon: <WhatsAppIcon />, href: 'https://wa.me/2529039651', label: 'whatsapp' },
  ];

  const navigationData: NavigationItem[] = [
    {
      title: 'Resources',
      links: [
        { text: 'Services', path: '/our-services' },
        { text: 'Blog', path: '/blogs' },
        // { text: 'Case Studies', path: '/case-studies' },
        { text: 'FAQs', path: '/#faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', path: '/about' },
        // { text: 'Careers', path: '/careers' },
        { text: 'Contact', path: '/contact-us' },
        { text: 'Training', path: 'https://nimitutor.com' },
        { text: 'Subscribe', path: '/subscribe' },
      ],
    },
    {
      title: 'Support',
      links: [
        // { text: 'Customer Support', path: '/support' },
        { text: 'Help Desk', path: '/contact-us' },
      ],
    },
    {
      title: 'Connect with us:',
      socialLinks: socialLinks,
    },
  ];

  const footerLinks = [
    { text: 'Privacy Policy', path: '/privacy-policy' },
    { text: 'Terms of Service', path: '/terms' },
    { text: 'Cookies Settings', path: '/cookies' },
  ];

  const handleBookConsultation = () => {
    navigate('/contact-us');
  };

  const handleSubscribeClick = () => {
    const event = new CustomEvent('openNewsletterModal');
    window.dispatchEvent(event);
  };

  const handleFAQClick = () => {
    if (window.location.pathname === '/') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/?scrollTo=faq', { replace: true });
    }
  };

  const handleLinkClick = (link: NavigationLink) => {
    if (link.path === '/subscribe') {
      handleSubscribeClick();
    } else if (link.path === '/#faq') {
      handleFAQClick();
    } else if (link.path.startsWith('http')) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.path);
    }
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
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            {navigationData.map((section, index) => (
              <div key={index} className={styles.navigation__column}>
                <h3 className={styles.navigation__title}>{section.title}</h3>

                {/* Render regular links */}
                {section.links && (
                  <ul className={styles.navigation__list}>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className={styles.navigation__item}>
                        <button
                          onClick={() => handleLinkClick(link)}
                          className={styles.navigation__link}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0,
                            font: 'inherit',
                          }}
                        >
                          {link.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Render social links */}
                {section.socialLinks && (
                  <div className={styles.navigation__socialGrid}>
                    {section.socialLinks.map((social, socialIndex) => (
                      <a
                        key={socialIndex}
                        href={social.href}
                        className={styles.navigation__socialLink}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
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
