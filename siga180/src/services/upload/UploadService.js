// src/services/upload/UploadService.js
export const UploadService = {
  uploadMealPhoto: async (file, mealId) => {
    // TODO: Implementar com Supabase Storage
    console.log('Uploading photo for meal:', mealId);
    
    // Mock upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size
        });
      }, 1000);
    });
  },

  deletePhoto: async (photoUrl) => {
    // TODO: Implementar com Supabase Storage
    console.log('Deleting photo:', photoUrl);
    return Promise.resolve();
  }
};