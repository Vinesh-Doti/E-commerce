export const getImageUrl = (imagePath) => {
  const BACKEND_URL = 'https://e-commerce-backend-plor.onrender.com';
  if (!imagePath) return '';
  return imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}/images/${imagePath}`;
};

