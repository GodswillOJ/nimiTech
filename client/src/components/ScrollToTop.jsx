import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a scrollTo parameter
    const urlParams = new URLSearchParams(search);
    const scrollTo = urlParams.get('scrollTo');

    // Always scroll to top first
    window.scrollTo(0, 0);

    // If there's a scrollTo parameter, scroll to the specified element after a delay
    if (scrollTo === 'faq') {
      const timer = setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, search, navigate]);

  return null;
};

export default ScrollToTop;
