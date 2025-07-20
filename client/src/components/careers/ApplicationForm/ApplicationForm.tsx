import React, { useState, useEffect } from 'react';
import { ApplicationFormData } from '../../../types/application.types';
import { Job } from '../../../types/job.types';
import {
  useSubmitApplicationMutation,
  useUploadResumeMutation,
  useUploadCoverLetterMutation,
  useDeleteResumeMutation,
  useDeleteCoverLetterMutation,
} from '../../../services/utilis/careerApiService';
import { useToast } from '../../../hooks/useToast';
import FileUpload from '../../ui/FileUpload/FileUpload';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';
import styles from './ApplicationForm.module.scss';
import ModalComp from '../../../components/blog/Modal/Modal';

interface ApplicationFormProps {
  job: Job;
  onSubmit?: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onSubmit, isLoading = false }) => {
  const [submitApplication, { isLoading: isSubmittingMutation }] = useSubmitApplicationMutation();
  const [uploadResume, { isLoading: isUploadingResume }] = useUploadResumeMutation();
  const [uploadCoverLetter, { isLoading: isUploadingCoverLetter }] = useUploadCoverLetterMutation();
  const [deleteResume] = useDeleteResumeMutation();
  const [deleteCoverLetter] = useDeleteCoverLetterMutation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    stateCountry: '',
    portfolio: '',
    startDate: '',
    message: '',
    workExperience: '',
    salaryExpectations: '',
    authorizedUS: '',
    sponsorship: '',
    contractOpen: '',
    resume: null,
    coverLetter: null,
    experience: '0-2 years',
    resumeUrl: '',
    coverLetterUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  // Use RTK Query loading state
  const isSubmitting =
    isSubmittingMutation || isUploadingResume || isUploadingCoverLetter || isLoading;

  // Helper function to check if all required fields are filled
  const isFormValid = (): any => {
    return (
      formData.firstName?.trim() !== '' &&
      formData.lastName?.trim() !== '' &&
      formData.email?.trim() !== '' &&
      formData.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.city?.trim() !== '' &&
      formData.stateCountry?.trim() !== '' &&
      formData.authorizedUS?.trim() !== '' &&
      formData.workExperience?.trim() !== '' &&
      formData.startDate?.trim() !== '' &&
      formData.salaryExpectations?.trim() !== '' &&
      formData.sponsorship?.trim() !== '' &&
      formData.contractOpen?.trim() !== '' &&
      (formData.resumeUrl || formData.resume) &&
      formData.experience &&
      disclaimerChecked &&
      (!formData.portfolio || (formData.portfolio && /^https?:\/\/.+/.test(formData.portfolio)))
    );
  };

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
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.stateCountry || !formData.stateCountry.trim()) {
      newErrors.stateCountry = 'State/Country is required';
    }
    if (!formData.authorizedUS || !formData.authorizedUS.trim()) {
      newErrors.authorizedUS = 'Please answer if you are authorized to work in the US';
    }
    if (!disclaimerChecked) {
      newErrors.disclaimer = 'You must agree to the disclaimer before submitting.';
    }
    if (!formData.workExperience.trim()) {
      newErrors.workExperience = 'Please describe your relevant work experience';
    }
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Earliest start date is required';
    }
    if (!formData.salaryExpectations.trim()) {
      newErrors.salaryExpectations = 'Salary expectations are required';
    }
    if (!formData.sponsorship.trim()) {
      newErrors.sponsorship = 'Please answer if you require sponsorship';
    }
    if (!formData.contractOpen.trim()) {
      newErrors.contractOpen = 'Please answer if you are open to contract/freelance roles';
    }
    // Check if resume is uploaded - either resumeUrl should exist (successful upload) or there should be an existing upload error
    if (!formData.resumeUrl) {
      newErrors.resume = 'Resume is required. Please upload your resume.';
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

  const handleFileUpload = async (file: File, type: 'resume' | 'coverLetter') => {
    try {
      console.log(`Uploading ${type}:`, file.name);
      let uploadResult: any;

      if (type === 'resume') {
        uploadResult = await uploadResume({ resume: file }).unwrap();
        console.log('Resume upload result:', uploadResult);
        setFormData((prev) => ({
          ...prev,
          resume: file,
          resumeUrl: uploadResult.resumeUrl || uploadResult.url,
        }));
        showToast('success', 'Resume uploaded successfully!');
      } else {
        uploadResult = await uploadCoverLetter({ coverLetter: file }).unwrap();
        console.log('Cover letter upload result:', uploadResult);
        setFormData((prev) => ({
          ...prev,
          coverLetter: file,
          coverLetterUrl: uploadResult.coverLetterUrl || uploadResult.url,
        }));
        showToast('success', 'Cover letter uploaded successfully!');
      }

      // Clear error when file is uploaded
      if (errors[type]) {
        setErrors((prev) => ({
          ...prev,
          [type]: '',
        }));
      }
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      const errorMessage = error?.data?.message || error?.message || `Failed to upload ${type}`;
      showToast('error', errorMessage);

      // Set error state for failed upload
      setErrors((prev) => ({
        ...prev,
        [type]: errorMessage,
      }));
    }
  };

  const handleFileRemove = async (type: 'resume' | 'coverLetter') => {
    try {
      const fileUrl = formData[`${type}Url` as keyof ApplicationFormData] as string;

      if (fileUrl) {
        // Extract filename from URL (e.g., "/api/careers/resume/filename.pdf" -> "filename.pdf")
        const filename = fileUrl.split('/').pop();

        if (filename) {
          // Delete file from server
          if (type === 'resume') {
            await deleteResume({ filename }).unwrap();
          } else {
            await deleteCoverLetter({ filename }).unwrap();
          }

          showToast(
            'success',
            `${type === 'resume' ? 'Resume' : 'Cover letter'} deleted successfully!`
          );
        }
      }

      // Clear file data from form
      setFormData((prev) => ({
        ...prev,
        [type]: null,
        [`${type}Url`]: '',
      }));
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      const errorMessage = error?.data?.message || error?.message || `Failed to delete ${type}`;
      showToast('error', errorMessage);

      // Still clear from form even if server deletion fails
      setFormData((prev) => ({
        ...prev,
        [type]: null,
        [`${type}Url`]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug logging
    console.log('Form submission attempt:', {
      resumeUrl: formData.resumeUrl,
      resume: formData.resume,
      isFormValid: isFormValid(),
      disclaimerChecked,
    });

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      // Files are already uploaded instantly when selected
      // Just submit the application data with the uploaded file URLs
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        stateCountry: formData.stateCountry,
        experience: formData.experience,
        workExperience: formData.workExperience,
        startDate: formData.startDate,
        salaryExpectations: formData.salaryExpectations,
        authorizedUS: formData.authorizedUS,
        sponsorship: formData.sponsorship,
        contractOpen: formData.contractOpen,
        message: formData.message || '',
        resumeUrl: formData.resumeUrl,
        ...(formData.coverLetterUrl && { coverLetterUrl: formData.coverLetterUrl }),
        ...(formData.portfolio && { portfolio: formData.portfolio }),
      };

      await submitApplication({
        jobId: job._id,
        applicationData,
      }).unwrap();

      setShowSuccessModal(true);
      showToast('success', 'Application submitted successfully!');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        stateCountry: '',
        portfolio: '',
        startDate: '',
        message: '',
        workExperience: '',
        salaryExpectations: '',
        authorizedUS: '',
        sponsorship: '',
        contractOpen: '',
        resume: null,
        coverLetter: null,
        experience: '0-2 years',
        resumeUrl: '',
        coverLetterUrl: '',
      });
      setDisclaimerChecked(false);

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to submit application';
      showToast(errorMessage, 'error');
    }
  };

  // const SuccessModal = () => (
  //   <div className={styles.modalOverlay}>
  //     <div className={styles.modal}>
  //       <div className={styles.modalContent}>
  //         <div className={styles.successIcon}>✓</div>
  //         <h2>Application Submitted!</h2>
  //         <p>
  //           Thank you for your interest in the <strong>{job.title}</strong> position at NimiTech.
  //         </p>
  //         <p>
  //           We have received your application and will review it carefully. You will hear back from
  //           us within 1-2 weeks.
  //         </p>
  //         <button onClick={() => setShowSuccessModal(false)} className={styles.modalButton}>
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <div
        className={`${styles.applicationForm} ${isSubmitting ? styles['applicationForm--loading'] : ''}`}
      >
        <div className={styles.applicationForm__header}>
          <h2 className={styles.applicationForm__title}>Application</h2>
          <p>
            <strong>{job.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.applicationForm__form}>
          <div className={styles.applicationForm__grid}>
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                First name <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.firstName ? styles['applicationForm__field--error'] : ''}`}
                placeholder="First name"
              />
              {errors.firstName && (
                <div className={styles.applicationForm__error}>{errors.firstName}</div>
              )}
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Last name <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.lastName ? styles['applicationForm__field--error'] : ''}`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <div className={styles.applicationForm__error}>{errors.lastName}</div>
              )}
            </div>

            {/* Contact Fields */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Email <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.email ? styles['applicationForm__field--error'] : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && <div className={styles.applicationForm__error}>{errors.email}</div>}
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Phone number <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.phone ? styles['applicationForm__field--error'] : ''}`}
                placeholder="Phone number"
              />
              {errors.phone && <div className={styles.applicationForm__error}>{errors.phone}</div>}
            </div>

            {/* Location Fields */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Where are you currently located? (City){' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.city ? styles['applicationForm__field--error'] : ''}`}
                placeholder="City"
              />
              {errors.city && <div className={styles.applicationForm__error}>{errors.city}</div>}
            </div>

            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                State/Country <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="text"
                name="stateCountry"
                value={formData.stateCountry}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.stateCountry ? styles['applicationForm__field--error'] : ''}`}
                placeholder="State/Country"
              />
              {errors.stateCountry && (
                <div className={styles.applicationForm__error}>{errors.stateCountry}</div>
              )}
            </div>

            {/* Portfolio */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>Portfolio/Website (Optional)</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.portfolio ? styles['applicationForm__field--error'] : ''}`}
                placeholder="https://your-portfolio.com"
              />
              {errors.portfolio && (
                <div className={styles.applicationForm__error}>{errors.portfolio}</div>
              )}
            </div>

            {/* Experience Level */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                How much experience do you have?{' '}
                <span className={styles.applicationForm__required}>*</span>
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

            {/* Work Experience Description */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                Briefly describe your relevant work experience for this role{' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <textarea
                name="workExperience"
                value={formData.workExperience}
                onChange={handleInputChange}
                className={styles.applicationForm__textarea}
                placeholder="Describe your relevant work experience"
                rows={3}
              />
              {errors.workExperience && (
                <div className={styles.applicationForm__error}>{errors.workExperience}</div>
              )}
            </div>

            {/* Preferred Start Date */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Earliest Possible Start Date{' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={styles.applicationForm__input}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && (
                <div className={styles.applicationForm__error}>{errors.startDate}</div>
              )}
            </div>

            {/* Salary Expectations */}
            <div className={styles['applicationForm__field--half']}>
              <label className={styles.applicationForm__label}>
                Salary Expectations <span className={styles.applicationForm__required}>*</span>
              </label>
              <input
                type="text"
                name="salaryExpectations"
                value={formData.salaryExpectations}
                onChange={handleInputChange}
                className={`${styles.applicationForm__input} ${errors.salaryExpectations ? styles['applicationForm__field--error'] : ''}`}
                placeholder="e.g. $80,000/year"
              />
              {errors.salaryExpectations && (
                <div className={styles.applicationForm__error}>{errors.salaryExpectations}</div>
              )}
            </div>

            {/* US Authorization */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                Are you legally authorized to work in the United States?{' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <div className={styles.applicationForm__radioGroup}>
                {['Yes', 'No'].map((option) => (
                  <label key={option} className={styles.applicationForm__radio}>
                    <input
                      type="radio"
                      name="authorizedUS"
                      value={option}
                      checked={formData.authorizedUS === option}
                      onChange={handleInputChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.authorizedUS && (
                <div className={styles.applicationForm__error}>{errors.authorizedUS}</div>
              )}
            </div>

            {/* Sponsorship */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                Do you require sponsorship now or in the future?{' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <div className={styles.applicationForm__radioGroup}>
                {['Yes', 'No'].map((option) => (
                  <label key={option} className={styles.applicationForm__radio}>
                    <input
                      type="radio"
                      name="sponsorship"
                      value={option}
                      checked={formData.sponsorship === option}
                      onChange={handleInputChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.sponsorship && (
                <div className={styles.applicationForm__error}>{errors.sponsorship}</div>
              )}
            </div>

            {/* Contract/Freelance Openness */}
            <div className={styles['applicationForm__field--full']}>
              <label className={styles.applicationForm__label}>
                Are you open to contract or freelance opportunities in addition to full-time roles?
                <span className={styles.applicationForm__required}>*</span>
              </label>
              <div className={styles.applicationForm__radioGroup}>
                {['Yes', 'No'].map((option) => (
                  <label key={option} className={styles.applicationForm__radio}>
                    <input
                      type="radio"
                      name="contractOpen"
                      value={option}
                      checked={formData.contractOpen === option}
                      onChange={handleInputChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.contractOpen && (
                <div className={styles.applicationForm__error}>{errors.contractOpen}</div>
              )}
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

          {/* Disclaimer */}
          <div
            className={`${styles['applicationForm__field--full']} ${styles.applicationForm__disclaimer}`}
          >
            <div className={styles.applicationForm__disclaimerHeader}>
              <input
                type="checkbox"
                id="disclaimer"
                checked={disclaimerChecked}
                onChange={() => setDisclaimerChecked(!disclaimerChecked)}
                className={styles.applicationForm__disclaimerCheckbox}
              />
              <label htmlFor="disclaimer" className={styles.applicationForm__disclaimerLabel}>
                I agree to the terms and conditions{' '}
                <span className={styles.applicationForm__required}>*</span>
              </label>
            </div>
            <div className={styles.applicationForm__disclaimerText}>
              <p>
                By submitting this application, I acknowledge and agree that NimiTech IT Consultants
                LLC may contact me via email, phone, or other communication methods regarding my job
                application, potential employment opportunities, or related follow‑up inquiries. I
                understand that my information will be used solely for recruitment purposes in
                accordance with applicable privacy laws.
              </p>
            </div>
            {errors.disclaimer && (
              <div className={styles.applicationForm__error}>{errors.disclaimer}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className={`${styles.applicationForm__submit} ${isSubmitting ? styles['applicationForm__submit--loading'] : ''} ${!isFormValid() ? styles['applicationForm__submit--disabled'] : ''}`}
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

      <ModalComp
        isOpen={showSuccessModal}
        title="Application Submitted!"
        content={`Thank you for your interest in the ${job.title} position at NimiTech. We have received your application and will review it carefully. You will hear back from us within 1-2 weeks.`}
        onClose={() => setShowSuccessModal(false)}
        type="success"
      />
    </>
  );
};

export default ApplicationForm;
