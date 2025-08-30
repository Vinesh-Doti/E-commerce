// frontend/src/utils/getImageUrl.js

const BACKEND_URL = 'https://e-commerce-backend-plor.onrender.com';

export const getImageUrl = (imagePath) => {
  // If imagePath already starts with http(s), return as-is
  if (!imagePath) return '';
  return imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}/images/${imagePath}`;
};
