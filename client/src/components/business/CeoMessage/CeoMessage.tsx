import React from 'react';
import { motion } from 'framer-motion';
import { businessImages } from '../../../assets/images.js';
import { ceoMessage } from '../business_post/buisnessData.jsx';
import styles from './CeoMessage.module.scss';

const CeoMessage: React.FC = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  // Animation variants for individual elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className={styles.ceoSection}>
      {/* Floating Particles */}
      <div className={styles.particlesContainer}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.2,
            }}
            style={{
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className={styles.ceoContainer}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* CEO Image with hover effect */}
        <motion.div
          className={styles.ceoImageContainer}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <img src={businessImages.CEO_image} alt="CEO Busay Bright" className={styles.ceoImage} />
          <div className={styles.imageOverlay} />
        </motion.div>

        {/* CEO Title with reveal effect */}
        <motion.div className={styles.titleContainer} variants={itemVariants}>
          <motion.h2
            className={styles.ceoTitle}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            A Message from Our CEO
          </motion.h2>
          <div className={styles.titleUnderline} />
        </motion.div>

        {/* CEO Message Content */}
        <motion.div
          className={styles.messageContent}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {ceoMessage.map((text, index) => (
            <motion.p
              key={index}
              className={`${styles.messageText} ${index === 2 ? styles.signature : ''}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {index === 2 ? (
                <span className={styles.signatureText}>
                  {text.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex === 0 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              ) : (
                text
              )}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CeoMessage;
