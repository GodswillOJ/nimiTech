import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
} from '../../../services/utilis/careerApiService';
import { useToast } from '../../../hooks/useToast';
import styles from './JobEditor.module.scss';

interface JobFormData {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'closed' | 'draft';
  applicationDeadline?: string;
}

const JobEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    type: '',
    location: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    salaryRange: {
      min: 0,
      max: 0,
      currency: '$',
    },
    status: 'draft',
    applicationDeadline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch job data if editing
  const {
    data: jobData,
    error: fetchError,
    isLoading,
  } = useGetJobByIdQuery(id!, {
    skip: !isEditing,
  });

  // Mutation hooks
  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();

  useEffect(() => {
    if (isEditing && jobData) {
      setFormData({
        title: jobData.title || '',
        department: jobData.department || '',
        type: jobData.type || '',
        location: jobData.location || '',
        description: jobData.description || '',
        requirements: jobData.requirements?.length > 0 ? jobData.requirements : [''],
        responsibilities: jobData.responsibilities?.length > 0 ? jobData.responsibilities : [''],
        benefits: jobData.benefits?.length > 0 ? jobData.benefits : [''],
        salaryRange: jobData.salaryRange?.min
          ? jobData.salaryRange
          : {
              min: 0,
              max: 0,
              currency: '$',
            },
        status: jobData.status || 'draft',
        applicationDeadline: jobData.applicationDeadline
          ? new Date(jobData.applicationDeadline).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isEditing, jobData]);

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalaryChange = (field: 'min' | 'max' | 'currency', value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: 'requirements' | 'responsibilities' | 'benefits',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'requirements' | 'responsibilities' | 'benefits',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showToast('error', 'Job title is required');
      return false;
    }
    if (!formData.department.trim()) {
      showToast('error', 'Department is required');
      return false;
    }
    if (!formData.type.trim()) {
      showToast('error', 'Job type is required');
      return false;
    }
    if (!formData.location.trim()) {
      showToast('error', 'Location is required');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('error', 'Job description is required');
      return false;
    }
    if (formData.requirements.filter((req) => req.trim()).length === 0) {
      showToast('error', 'At least one requirement is needed');
      return false;
    }
    if (formData.responsibilities.filter((resp) => resp.trim()).length === 0) {
      showToast('error', 'At least one responsibility is needed');
      return false;
    }
    if (formData.salaryRange.min <= 0 || formData.salaryRange.max <= 0) {
      showToast('error', 'Valid salary range is required');
      return false;
    }
    if (formData.salaryRange.min >= formData.salaryRange.max) {
      showToast('error', 'Maximum salary must be greater than minimum salary');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Filter out empty items from arrays
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim()),
        responsibilities: formData.responsibilities.filter((resp) => resp.trim()),
        benefits: formData.benefits.filter((benefit) => benefit.trim()),
        applicationDeadline: formData.applicationDeadline || undefined,
      };

      if (isEditing) {
        await updateJob({ id: id!, jobData: cleanedData }).unwrap();
        showToast('success', 'Job updated successfully!');
      } else {
        await createJob(cleanedData).unwrap();
        showToast('success', 'Job created successfully!');
      }

      navigate('/dashboard/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      showToast('error', 'Failed to save job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/jobs');
  };

  if (isEditing && isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (isEditing && fetchError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Job</h2>
        <p>There was an error loading the job details. Please try again.</p>
        <button onClick={() => navigate('/dashboard/jobs')} className={styles.backButton}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className={styles.jobEditor}>
      <div className={styles.header}>
        <h1>{isEditing ? 'Edit Job' : 'Create New Job'}</h1>
        <p>
          {isEditing
            ? 'Update job details and requirements'
            : 'Fill in the job details to create a new posting'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <div className={styles.section}>
          <h2>Basic Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Job Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Remote, New York, NY"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the role, team, and what the candidate will be doing..."
              rows={6}
              required
            />
          </div>
        </div>

        {/* Requirements */}
        <div className={styles.section}>
          <h2>Requirements</h2>
          {formData.requirements.map((requirement, index) => (
            <div key={index} className={styles.arrayItem}>
              <input
                type="text"
                value={requirement}
                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                placeholder="e.g., 3+ years of React experience"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className={styles.addButton}
          >
            Add Requirement
          </button>
        </div>

        {/* Responsibilities */}
        <div className={styles.section}>
          <h2>Responsibilities</h2>
          {formData.responsibilities.map((responsibility, index) => (
            <div key={index} className={styles.arrayItem}>
              <input
                type="text"
                value={responsibility}
                onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                placeholder="e.g., Design and implement user interfaces"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('responsibilities', index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('responsibilities')}
            className={styles.addButton}
          >
            Add Responsibility
          </button>
        </div>

        {/* Benefits */}
        <div className={styles.section}>
          <h2>Benefits (Optional)</h2>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className={styles.arrayItem}>
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                placeholder="e.g., Health insurance, 401k matching"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('benefits', index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('benefits')}
            className={styles.addButton}
          >
            Add Benefit
          </button>
        </div>

        {/* Salary and Status */}
        <div className={styles.section}>
          <h2>Salary & Status</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={formData.salaryRange.currency}
                onChange={(e) => handleSalaryChange('currency', e.target.value)}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="minSalary">Minimum Salary *</label>
              <input
                type="number"
                id="minSalary"
                value={formData.salaryRange.min}
                onChange={(e) => handleSalaryChange('min', parseInt(e.target.value) || 0)}
                placeholder="50000"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxSalary">Maximum Salary *</label>
              <input
                type="number"
                id="maxSalary"
                value={formData.salaryRange.max}
                onChange={(e) => handleSalaryChange('max', parseInt(e.target.value) || 0)}
                placeholder="80000"
                min="0"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deadline">Application Deadline (Optional)</label>
              <input
                type="date"
                id="deadline"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobEditor;
