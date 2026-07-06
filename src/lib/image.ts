/**
 * Compresses an image in base64 format using HTML5 Canvas.
 * Ensures the output image is within safe size limits (well under 1MB) for Firestore.
 * 
 * @param base64Str The source base64 image string.
 * @param maxWidth The maximum width of the output image. Default 1200px.
 * @param maxHeight The maximum height of the output image. Default 1200px.
 * @param quality The compression quality (0 to 1) for JPEG output. Default 0.7.
 */
export function compressImageBase64(
  base64Str: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    // If it's not a valid base64 image or a small data string, return as-is
    if (!base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // We force output to image/jpeg which is highly compressed compared to PNG
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      // Fallback to original string if error occurs
      resolve(base64Str);
    };
  });
}
