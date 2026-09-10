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
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.45
): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str || '');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = base64Str;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const maxDim = 600;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
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

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
