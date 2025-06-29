// Newsletter utility functions

export const NEWSLETTER_STORAGE_KEYS = {
  SUBSCRIBED: 'newsletter_subscribed',
  EMAIL: 'newsletter_email',
  LAST_SHOWN: 'newsletter_last_shown',
  DISMISSED_COUNT: 'newsletter_dismissed_count',
};

/**
 * Check if the user should see the newsletter modal
 * Returns false if:
 * - User has already subscribed
 * - User has dismissed the modal too many times recently
 * - Modal was shown too recently
 */
export const shouldShowNewsletterModal = (): boolean => {
  try {
    // Check if user has already subscribed
    const hasSubscribed = localStorage.getItem(NEWSLETTER_STORAGE_KEYS.SUBSCRIBED) === 'true';
    if (hasSubscribed) {
      return false;
    }

    // Check if modal was shown too recently (don't show again for 24 hours)
    const lastShown = localStorage.getItem(NEWSLETTER_STORAGE_KEYS.LAST_SHOWN);
    if (lastShown) {
      const lastShownTime = new Date(lastShown).getTime();
      const now = new Date().getTime();
      const hoursElapsed = (now - lastShownTime) / (1000 * 60 * 60);

      if (hoursElapsed < 24) {
        return false;
      }
    }

    // Check if user has dismissed too many times (max 3 times in 7 days)
    const dismissedData = localStorage.getItem(NEWSLETTER_STORAGE_KEYS.DISMISSED_COUNT);
    if (dismissedData) {
      const { count, lastDismissed } = JSON.parse(dismissedData);
      const lastDismissedTime = new Date(lastDismissed).getTime();
      const now = new Date().getTime();
      const daysElapsed = (now - lastDismissedTime) / (1000 * 60 * 60 * 24);

      // Reset count after 7 days
      if (daysElapsed >= 7) {
        localStorage.removeItem(NEWSLETTER_STORAGE_KEYS.DISMISSED_COUNT);
      } else if (count >= 3) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking newsletter modal status:', error);
    return true; // Default to showing modal if there's an error
  }
};

/**
 * Mark that the newsletter modal was shown
 */
export const markNewsletterModalShown = (): void => {
  try {
    localStorage.setItem(NEWSLETTER_STORAGE_KEYS.LAST_SHOWN, new Date().toISOString());
  } catch (error) {
    console.error('Error marking newsletter modal as shown:', error);
  }
};

/**
 * Mark that the newsletter modal was dismissed
 */
export const markNewsletterModalDismissed = (): void => {
  try {
    const existingData = localStorage.getItem(NEWSLETTER_STORAGE_KEYS.DISMISSED_COUNT);
    const dismissData = { count: 1, lastDismissed: new Date().toISOString() };

    if (existingData) {
      const { count } = JSON.parse(existingData);
      dismissData.count = count + 1;
    }

    localStorage.setItem(NEWSLETTER_STORAGE_KEYS.DISMISSED_COUNT, JSON.stringify(dismissData));
  } catch (error) {
    console.error('Error marking newsletter modal as dismissed:', error);
  }
};

/**
 * Mark user as subscribed to prevent future modal popups
 */
export const markUserSubscribed = (email: string): void => {
  try {
    localStorage.setItem(NEWSLETTER_STORAGE_KEYS.SUBSCRIBED, 'true');
    localStorage.setItem(NEWSLETTER_STORAGE_KEYS.EMAIL, email.toLowerCase());
    // Clear dismiss data since user subscribed
    localStorage.removeItem(NEWSLETTER_STORAGE_KEYS.DISMISSED_COUNT);
    localStorage.removeItem(NEWSLETTER_STORAGE_KEYS.LAST_SHOWN);
  } catch (error) {
    console.error('Error marking user as subscribed:', error);
  }
};

/**
 * Check if user has subscribed to newsletter
 */
export const isUserSubscribed = (): boolean => {
  try {
    return localStorage.getItem(NEWSLETTER_STORAGE_KEYS.SUBSCRIBED) === 'true';
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

/**
 * Get subscribed email if available
 */
export const getSubscribedEmail = (): string | null => {
  try {
    return localStorage.getItem(NEWSLETTER_STORAGE_KEYS.EMAIL);
  } catch (error) {
    console.error('Error getting subscribed email:', error);
    return null;
  }
};

/**
 * Clear all newsletter-related localStorage data (for testing/debugging)
 */
export const clearNewsletterData = (): void => {
  try {
    Object.values(NEWSLETTER_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing newsletter data:', error);
  }
};
