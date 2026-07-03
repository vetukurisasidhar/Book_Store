/**
 * Formats a book cover image path into a safe, absolute URL.
 * Supports remote URLs (e.g. Cloudinary) and local backend upload routes.
 * Handles escaping and absolute path extraction.
 * 
 * @param {string} imagePath The raw image path stored in the database
 * @returns {string} The fully formatted URL
 */
export const getBookImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/150x220?text=No+Cover';
  }

  const pathStr = String(imagePath).trim();

  // If the path is already a remote HTTP/HTTPS URL, return it directly
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
    return pathStr;
  }

  // Strip any leading slashes or old directory prefixes
  let cleanPath = pathStr;
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace('uploads/', '');
  } else if (cleanPath.startsWith('/uploads/')) {
    cleanPath = cleanPath.replace('/uploads/', '');
  } else if (cleanPath.startsWith('Backend/uploads/')) {
    cleanPath = cleanPath.replace('Backend/uploads/', '');
  }

  // Split by slashes to get only the filename (for cases where absolute server paths got stored)
  const parts = cleanPath.split(/[/\\]/);
  const filename = parts[parts.length - 1];

  // Encode the filename to handle spaces and special characters safely
  return `${window.BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
};

/**
 * Gracefully handles image load errors by setting the source to a placeholder cover
 * and disabling the onerror listener to avoid infinite loading loops.
 * 
 * @param {Event} event The native browser error event
 * @param {string} placeholderDimensions Optional placeholder dimensions (e.g., '150x220')
 */
export const handleImageError = (event, placeholderDimensions = '150x220') => {
  event.target.onerror = null; // Prevent infinite loop if placeholder itself fails
  event.target.src = `https://via.placeholder.com/${placeholderDimensions}?text=No+Cover`;
  event.target.classList.add('img-loaded'); // Ensure it becomes visible
};
