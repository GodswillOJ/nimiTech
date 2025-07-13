const cacheMiddleware = (req, res, next) => {
  // Helper function to set conditional caching
  res.cacheControl = (options = {}) => {
    const {
      maxAge = 300,
      staleWhileRevalidate = 3600,
      isPublic = true,
      immutable = false,
      noCache = false,
      noStore = false
    } = options;

    if (noStore) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return;
    }

    if (noCache) {
      res.set('Cache-Control', 'no-cache, must-revalidate');
      return;
    }

    let cacheControl = isPublic ? 'public' : 'private';
    cacheControl += `, max-age=${maxAge}`;
    
    if (staleWhileRevalidate) {
      cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;
    }
    
    if (immutable) {
      cacheControl += ', immutable';
    }

    res.set({
      'Cache-Control': cacheControl,
      'Vary': 'Accept-Encoding'
    });
  };

  // Helper function to handle ETags
  res.setETag = (data) => {
    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)}"`;
    res.set('ETag', etag);
    
    // Check if client has current version
    const clientETag = req.headers['if-none-match'];
    if (clientETag === etag) {
      res.status(304).end();
      return true;
    }
    return false;
  };

  next();
};

module.exports = cacheMiddleware;
