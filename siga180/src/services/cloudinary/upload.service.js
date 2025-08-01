class CloudinaryService {
  constructor() {
    this.cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    this.apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
  }

  async uploadImage(file, options = {}) {
    const {
      folder = 'meal-photos',
      transformation = 'c_limit,w_1000,q_auto:good',
      onProgress
    } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    try {
      const response = await fetch(`${this.apiUrl}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      return {
        url: data.secure_url,
        publicId: data.public_id,
        thumbnailUrl: data.secure_url.replace('/upload/', `/upload/${transformation}/`),
        format: data.format,
        width: data.width,
        height: data.height,
        size: data.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  async uploadMealPhoto(file, metadata) {
    const result = await this.uploadImage(file, {
      folder: `meals/${metadata.athleteId}`,
      transformation: 'c_limit,w_800,q_auto:good'
    });

    // Save reference in Supabase
    const { error } = await supabase
      .from('meal_photos')
      .insert({
        meal_id: metadata.mealId,
        athlete_id: metadata.athleteId,
        url: result.url,
        thumbnail_url: result.thumbnailUrl,
        cloudinary_id: result.publicId,
        metadata: result
      });

    if (error) throw error;

    return result;
  }

  async deleteImage(publicId) {
    // This needs to be done server-side for security
    // Call your backend API to delete from Cloudinary
  }

  // Generate optimized URL
  getOptimizedUrl(url, options = {}) {
    const {
      width = 400,
      height = 400,
      crop = 'fill',
      quality = 'auto',
      format = 'auto'
    } = options;

    const transformation = `c_${crop},w_${width},h_${height},q_${quality},f_${format}`;
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
}

export default new CloudinaryService();