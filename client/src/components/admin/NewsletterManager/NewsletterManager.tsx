import React, { useState } from 'react';
import {
  useGetAllNewsletterSubscriptionsQuery,
  useGetNewsletterStatsQuery,
  useDeleteNewsletterSubscriptionMutation,
  useExportNewsletterSubscriptionsQuery,
} from '../../../services/utilis/newsletterApiService';
import { useToast } from '../../../hooks/useToast';
import { getApiBaseUrl } from '../../../utils/envUtils';
import { formatDate as formatDateUtil } from '../../../utils/dateUtils';
import './NewsletterManager.scss';

interface NewsletterManagerProps {
  className?: string;
}

const NewsletterManager: React.FC<NewsletterManagerProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'email' | 'lastActive'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const toast = useToast();

  const {
    data: subscriptionsData,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useGetAllNewsletterSubscriptionsQuery({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy,
    sortOrder,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetNewsletterStatsQuery({});

  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteNewsletterSubscriptionMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleRefreshData = async () => {
    try {
      // Refresh both subscriptions and stats
      await Promise.all([refetchSubscriptions(), refetchStats()]);
      toast.success(
        'Data refreshed successfully',
        'Both subscriptions and stats have been updated.'
      );
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Refresh failed', 'Please try again.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Use fetch with credentials (cookies) instead of Authorization header
      // since authentication is handled via HttpOnly cookies
      const response = await fetch(`${getApiBaseUrl()}/newsletter/export?format=csv`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Export failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Get the CSV content
      const csvContent = await response.text();

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      toast.success('Export completed', 'CSV file has been downloaded successfully.');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Export failed. Please try again.';
      toast.error('Export failed', errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (subscriptionId: string) => {
    if (deleteConfirm === subscriptionId) {
      try {
        await deleteSubscription(subscriptionId).unwrap();
        setDeleteConfirm(null);
        refetchSubscriptions();
        toast.success('Subscription deleted', 'The subscription has been successfully removed.');
      } catch (error) {
        toast.error('Delete failed', 'Failed to delete subscription. Please try again.');
      }
    } else {
      setDeleteConfirm(subscriptionId);
      setTimeout(() => {
        if (deleteConfirm === subscriptionId) {
          setDeleteConfirm(null);
        }
      }, 5000);
    }
  };

  const formatSubscriptionDate = (dateString: string) => {
    return formatDateUtil(new Date(dateString));
  };

  const subscriptions = subscriptionsData?.data?.subscriptions || [];
  const pagination = subscriptionsData?.data?.pagination;
  const stats = statsData?.data || {};

  return (
    <div className="newsletter-manager">
      <div className="newsletter-manager__header">
        <h2>Newsletter Management</h2>
        <div className="header-actions">
          <button onClick={handleExport} disabled={isExporting} className="btn btn--secondary">
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={handleRefreshData}
            className="btn btn--primary"
            disabled={isLoadingSubscriptions || isLoadingStats}
          >
            {isLoadingSubscriptions || isLoadingStats ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {!isLoadingStats && stats && (
        <div className="newsletter-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSubscriptions || '...'}</div>
            <div className="stat-label">Total Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeSubscriptions || '...'}</div>
            <div className="stat-label">Active Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisMonthSubscriptions || '...'}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisWeekSubscriptions || '...'}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="newsletter-manager__controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn--secondary">
            Search
          </button>
        </form>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as 'createdAt' | 'email' | 'lastActive');
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="email">Sort by Email</option>
            <option value="lastActive">Sort by Last Active</option>
          </select>

          <button
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setCurrentPage(1);
            }}
            className="btn btn--outline"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Subscriptions List */}
      {isLoadingSubscriptions ? (
        <div className="newsletter-manager__loading">
          <div className="spinner"></div>
          <p>Loading subscriptions...</p>
        </div>
      ) : subscriptionsError ? (
        <div className="newsletter-manager__error">
          <p>Failed to load subscriptions</p>
          <p style={{ fontSize: '0.8em', color: '#666' }}>
            Error: {JSON.stringify(subscriptionsError, null, 2)}
          </p>
          <button onClick={() => refetchSubscriptions()} className="btn btn--primary">
            Try Again
          </button>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="newsletter-manager__empty">
          <p>No newsletter subscriptions found</p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="btn btn--secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="subscriptions-table">
            <div className="table-header">
              <div className="header-cell">Email</div>
              <div className="header-cell">Name</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Subscribed</div>
              <div className="header-cell">Preferences</div>
              <div className="header-cell">Actions</div>
            </div>

            {subscriptions.map((subscription: any) => (
              <div key={subscription._id} className="table-row">
                <div className="table-cell">
                  <span className="email">{subscription.email}</span>
                </div>
                <div className="table-cell">
                  <span>
                    {subscription.firstName} {subscription.lastName}
                  </span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${subscription.isActive ? 'active' : 'inactive'}`}>
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="table-cell">
                  <span className="date">{formatSubscriptionDate(subscription.createdAt)}</span>
                </div>
                <div className="table-cell">
                  <div className="preferences">
                    {subscription.preferences?.topics?.length > 0 ? (
                      <span className="topics">{subscription.preferences.topics.join(', ')}</span>
                    ) : (
                      <span className="no-preferences">All topics</span>
                    )}
                  </div>
                </div>
                <div className="table-cell">
                  <button
                    onClick={() => handleDelete(subscription._id)}
                    className={`btn btn--small ${
                      deleteConfirm === subscription._id ? 'btn--danger' : 'btn--outline-danger'
                    }`}
                    disabled={isDeleting}
                  >
                    {deleteConfirm === subscription._id ? 'Confirm Delete' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="newsletter-manager__pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn--secondary"
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}(
                {pagination.totalSubscriptions} total subscribers)
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= pagination.totalPages}
                className="btn btn--secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsletterManager;
