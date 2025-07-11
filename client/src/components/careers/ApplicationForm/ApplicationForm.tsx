import React, { useState, useEffect } from 'react';
import { ApplicationFormData } from '../../../types/application.types';
import { Job } from '../../../types/job.types';
import { useSubmitApplicationMutation } from '../../../services/utilis/careerApiService';
import FileUpload from '../../ui/FileUpload/FileUpload';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';
import styles from './ApplicationForm.module.scss';

interface ApplicationFormProps {
  job: Job;
  onSubmit?: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onSubmit, isLoading = false }) => {
  // RTK Query mutation hook
  const [submitApplication, { isLoading: isSubmittingMutation }] = useSubmitApplicationMutation();

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    portfolio: '',
    startDate: '',
    message: '',
    resume: null,
    coverLetter: null,
    experience: '0-2 years',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use RTK Query loading state
  const isSubmitting = isSubmittingMutation || isLoading;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }

    if (formData.portfolio && !/^https?:\/\/.+/.test(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid URL (including http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileUpload = (file: File, type: 'resume' | 'coverLetter') => {
    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));

    // Clear error when file is uploaded
    if (errors[type]) {
      setErrors((prev) => ({
        ...prev,
        [type]: '',
      }));
    }
  };

  const handleFileRemove = (type: 'resume' | 'coverLetter') => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        message: formData.message || '',
        resume: formData.resume!,
        ...(formData.coverLetter && { coverLetter: formData.coverLetter }),
      };

      await submitApplication({
        jobId: job._id,
        applicationData,
      }).unwrap();

      setShowSuccessModal(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        portfolio: '',
        startDate: '',
        message: '',
        resume: null,
        coverLetter: null,
        experience: '0-2 years',
      });

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(error?.data?.message || error?.message || 'Failed to submit application');
    }
  };

  const SuccessModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.successIcon}>✓</div>
          <h2>Application Submitted!</h2>
          <p>
            Thank you for your interest in the <strong>{job.title}</strong> position at NimiTech.
          </p>
          <p>
            We have received your application and will review it carefully. You will hear back from
            us within 1-2 weeks.
          </p>
          <button onClick={() => setShowSuccessModal(false)} className={styles.modalButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`${styles.applicationForm} ${isSubmitting ? styles['applicationForm--loading'] : ''}`}
      >
        <div className={styles.applicationForm__header}>
          <h2 className={styles.applicationForm__title}>Application</h2>
          <p>
            Apply for <strong>{job.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.applicationForm__form}>
          <div className={styles.applicationForm__grid}>
            {/* Name Fields */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>First name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${
                  errors.firstName ? styles['applicationForm__field--error'] : ''
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <div className={styles.applicationForm__error}>{errors.firstName}</div>
              )}
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Last name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${
                  errors.lastName ? styles['applicationForm__field--error'] : ''
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <div className={styles.applicationForm__error}>{errors.lastName}</div>
              )}
            </div>

            {/* Contact Fields */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${
                  errors.email ? styles['applicationForm__field--error'] : ''
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <div className={styles.applicationForm__error}>{errors.email}</div>}
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Phone number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${
                  errors.phone ? styles['applicationForm__field--error'] : ''
                }`}
                placeholder="Phone number"
              />
              {errors.phone && <div className={styles.applicationForm__error}>{errors.phone}</div>}
            </div>

            {/* Optional Fields */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={styles.applicationForm__input}
                placeholder="City"
              />
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Portfolio/Website</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${
                  errors.portfolio ? styles['applicationForm__field--error'] : ''
                }`}
                placeholder="https://your-portfolio.com"
              />
              {errors.portfolio && (
                <div className={styles.applicationForm__error}>{errors.portfolio}</div>
              )}
            </div>

            {/* Experience Level */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                How much experience do you have? *
              </label>
              <div className={styles.applicationForm__radioGroup}>
                {['0-2 years', '3-5 years', '+5 years'].map((option) => (
                  <label key={option} className={styles.applicationForm__radio}>
                    <input
                      type="radio"
                      name="experience"
                      value={option}
                      checked={formData.experience === option}
                      onChange={handleInputChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.experience && (
                <div className={styles.applicationForm__error}>{errors.experience}</div>
              )}
            </div>

            {/* Preferred Start Date */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Preferred Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={styles.applicationForm__input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* File Uploads */}
            <div className={styles['applicationForm__field--full']}>
              <FileUpload
                accept=".pdf,.doc,.docx"
                maxSize={5 * 1024 * 1024} // 5MB
                onUpload={(file) => handleFileUpload(file, 'resume')}
                label="Resume"
                required
                error={errors.resume}
                uploaded={!!formData.resume}
                fileName={formData.resume?.name}
                fileSize={formData.resume?.size}
                onRemove={() => handleFileRemove('resume')}
              />
            </div>

            <div className={styles['applicationForm__field--full']}>
              <FileUpload
                accept=".pdf,.doc,.docx"
                maxSize={5 * 1024 * 1024} // 5MB
                onUpload={(file) => handleFileUpload(file, 'coverLetter')}
                label="Cover Letter (Optional)"
                uploaded={!!formData.coverLetter}
                fileName={formData.coverLetter?.name}
                fileSize={formData.coverLetter?.size}
                onRemove={() => handleFileRemove('coverLetter')}
              />
            </div>

            {/* Message */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                What would you like us to know about you?
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={styles.applicationForm__textarea}
                placeholder="Your message"
                rows={4}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.applicationForm__submit} ${
              isSubmitting ? styles['applicationForm__submit--loading'] : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                Submitting...
              </>
            ) : (
              'Apply'
            )}
          </button>
        </form>
      </div>

      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default ApplicationForm;
