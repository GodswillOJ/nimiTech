import React, { useState } from 'react';
import FaqImage from '../../assets/blog/images/faqImage.jpg';
import styles from './Faqs.module.scss';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isExpanded?: boolean;
}

const Faq: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: 'What services does Nimitech offer?',
      answer:
        'Nimitech provides a full suite of IT solutions including: Managed IT Support, Cybersecurity Services, Web and Software Development, Cloud Solutions, Digital Marketing and SEO, and IT Consulting and Strategy.',
      isExpanded: false,
    },
    {
      id: 2,
      question: 'What industries do you serve?',
      answer:
        'We serve businesses of all sizes across various sectors including healthcare, finance, retail, education, nonprofits, and government agencies.',
      isExpanded: false,
    },
    {
      id: 3,
      question: 'How do your managed IT services work?',
      answer:
        'Our managed IT services provide proactive monitoring, remote support, system updates, data backups, and security patches. We act as your outsourced IT department, ensuring your systems run smoothly with minimal downtime.',
      isExpanded: false,
    },
    {
      id: 4,
      question: 'Can you customize solutions for my business?',
      answer:
        'Absolutely! We tailor every solution to fit your unique business needs, goals, and budget. We begin with a consultation to assess your current setup and recommend customized solutions.',
      isExpanded: false,
    },
    {
      id: 5,
      question: 'How do you protect client data and ensure cybersecurity?',
      answer:
        'We follow industry best practices and compliance standards like HIPAA, NIST, and GDPR. Our cybersecurity services include firewalls, endpoint protection, penetration testing, security audits, and user training.',
      isExpanded: false,
    },
    {
      id: 6,
      question: 'What is your pricing model?',
      answer:
        'Pricing depends on the scope and scale of your project or service needs. We offer flexible plans including monthly retainers, hourly support, and project-based pricing. Contact us for a free quote.',
      isExpanded: false,
    },
    {
      id: 7,
      question: 'How long does a typical web or software project take?',
      answer:
        'Timelines vary by project complexity. A basic website may take 2–4 weeks, while custom software can range from a few months to longer. We provide a detailed timeline after our initial discovery phase.',
      isExpanded: false,
    },
    {
      id: 8,
      question: 'What happens if I need support after the project is completed?',
      answer:
        'We offer ongoing support and maintenance packages to ensure your systems remain up to date and fully functional. You can also contact our support team at any time.',
      isExpanded: false,
    },
    {
      id: 9,
      question: 'Do you offer training for teams on new systems or platforms?',
      answer:
        'Yes, we provide staff training, onboarding resources, and user guides to ensure a smooth transition and proper adoption of any new technology we implement.',
      isExpanded: false,
    },
    {
      id: 10,
      question: 'How do I get started with Nimitech?',
      answer:
        "Simply contact us through our website or call us directly. We'll schedule a consultation to discuss your needs, goals, and how we can help.",
      isExpanded: false,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq)));
  };

  const getCurrentPageFAQs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return faqs.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MinusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12H19M12 5L19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={styles.faq}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>FAQs</h1>
            <div className={styles.titleUnderline}></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* FAQ Image */}
          <div className={styles.imageSection}>
            <img src={FaqImage} alt="FAQ Illustration" className={styles.faqImage} />
          </div>

          {/* FAQ Content */}
          <div className={styles.content}>
            <div className={styles.list}>
              {getCurrentPageFAQs().map((faq) => (
                <div
                  key={faq.id}
                  className={`${styles.item} ${faq.isExpanded ? styles.itemExpanded : ''}`}
                >
                  <button
                    className={styles.question}
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={faq.isExpanded}
                  >
                    <span className={styles.questionText}>{faq.question}</span>
                    <span className={styles.toggleIcon}>
                      {faq.isExpanded ? <MinusIcon /> : <PlusIcon />}
                    </span>
                  </button>
                  <div className={`${styles.answer} ${faq.isExpanded ? styles.answerVisible : ''}`}>
                    <div className={styles.answerContent}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  <span className={styles.paginationText}>Show others</span>
                  <span className={styles.paginationCounter}>
                    {currentPage}/{totalPages}
                  </span>
                </div>
                <div className={styles.paginationControls}>
                  <button
                    className={`${styles.paginationBtn} ${styles.paginationBtnPrev} ${
                      currentPage === 1 ? styles.paginationBtnDisabled : ''
                    }`}
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowRightIcon />
                  </button>
                  <button
                    className={`${styles.paginationBtn} ${styles.paginationBtnNext} ${
                      currentPage === totalPages ? styles.paginationBtnDisabled : ''
                    }`}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Decoration */}
        <div className={styles.footer}>
          <div className={styles.footerDecoration}>
            <div className={styles.wave}></div>
            <div className={styles.footerShapes}>
              <div className={`${styles.shape} ${styles.shapeCircle}`}></div>
              <div className={`${styles.shape} ${styles.shapeTriangle}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
