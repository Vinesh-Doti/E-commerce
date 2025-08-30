// src/utils/getImageUrl.js
const BASE = 'https://e-commerce-backend-plor.onrender.com';

export default function getImageUrl(image) {
  if (!image) return ''; // no image

  // If it's already an absolute URL (http/https)
  if (/^https?:\/\//i.test(image)) {
    // Replace any localhost URL with live backend
    return image.replace(/^https?:\/\/localhost:4000/i, BASE);
  }

  // Otherwise treat it as a filename or relative path and build the full URL
  // remove leading slashes if any
  const filename = image.replace(/^\/+/, '');
  return `${BASE}/images/${filename}`;
}
