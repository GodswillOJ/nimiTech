import React, { useState } from 'react';
import {
  useGetAllNewsletterSubscriptionsQuery,
  useGetNewsletterStatsQuery,
  useDeleteNewsletterSubscriptionMutation,
  useExportNewsletterSubscriptionsQuery,
} from '../../../services/utilis/newsletterApiService';
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

  const { data: statsData, isLoading: isLoadingStats } = useGetNewsletterStatsQuery({});

  const {
    data: exportData,
    isLoading: isExporting,
    refetch: triggerExport,
  } = useExportNewsletterSubscriptionsQuery(undefined, {
    skip: true, // Don't auto-fetch
  });

  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteNewsletterSubscriptionMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      await triggerExport();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleDelete = async (subscriptionId: string) => {
    if (deleteConfirm === subscriptionId) {
      try {
        await deleteSubscription(subscriptionId).unwrap();
        setDeleteConfirm(null);
        refetchSubscriptions();
      } catch (error) {
        console.error('Failed to delete subscription:', error);
        alert('Failed to delete subscription. Please try again.');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            onClick={() => {
              console.log('Testing API call...');
              refetchSubscriptions();
            }}
            className="btn btn--primary"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {!isLoadingStats && stats && (
        <div className="newsletter-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSubscriptions || 0}</div>
            <div className="stat-label">Total Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeSubscriptions || 0}</div>
            <div className="stat-label">Active Subscribers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisMonthSubscriptions || 0}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisWeekSubscriptions || 0}</div>
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
                  <span className="date">{formatDate(subscription.createdAt)}</span>
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
