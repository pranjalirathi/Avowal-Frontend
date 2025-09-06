export const formatTimeAgo = (timestamp) => {
    const utcTimestamp = typeof timestamp === 'string' && !timestamp.endsWith('Z') 
      ? `${timestamp}Z` 
      : timestamp;
      
    const createdAt = new Date(utcTimestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
  
    if (diffInSeconds < 5) {
      return "just now";
    }
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } 
    else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } 
    else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } 
    else if (diffInSeconds < 172800) {
      return "Yesterday";
    } 
    else {
      return createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };
