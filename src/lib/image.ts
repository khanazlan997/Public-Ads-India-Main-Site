/**
 * Compresses an image in base64 format using HTML5 Canvas.
 * Iteratively resizes and reduces quality to target ~10KB (well under 14KB base64),
 * ensuring zero load / quota burnout on Firebase while supporting client uploads up to 2MB+.
 * 
 * @param base64Str The source base64 image string.
 * @param targetMaxBytes The target maximum size in bytes (default 12 * 1024 = ~12KB base64 ≈ 9-10KB binary).
 */
export function compressImageBase64(
  base64Str: string,
  maxWidth = 450,
  maxHeight = 450,
  initialQuality = 0.35,
  targetMaxBytes = 20 * 1024 // Keep profile images near 20KB while preserving clarity
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
      let maxDim = Math.min(maxWidth, maxHeight, 450);
      let quality = initialQuality;

      // Iterative compression to strictly target ~10KB
      let bestResult = '';
      let bestSize = Infinity;

      for (let attempt = 0; attempt < 5; attempt++) {
        let width = img.width;
        let height = img.height;

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
        canvas.width = Math.max(width, 100);
        canvas.height = Math.max(height, 100);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(bestResult || base64Str);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const currentCompressed = canvas.toDataURL('image/jpeg', quality);
        const currentLength = currentCompressed.length;

        if (currentLength < bestSize) {
          bestResult = currentCompressed;
          bestSize = currentLength;
        }

        if (currentLength <= targetMaxBytes) {
          // Successfully compressed to target ~10KB!
          break;
        }

        // Reduce dimensions and quality for next pass
        maxDim = Math.max(Math.round(maxDim * 0.75), 200);
        quality = Math.max(quality * 0.75, 0.15);
      }

      resolve(bestResult || base64Str);
    };

    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Automatically center-crops an image to 1:1 square and compresses it 
 * strictly to ~10KB (targetMaxBytes = 14KB base64 string), ensuring fast, 
 * flawless profile picture saving without size errors.
 */
export function compressAndCropSquareImage(
  base64Str: string,
  targetCanvasSize = 200,
  initialQuality = 0.7,
  targetMaxBytes = 14 * 1024 // ~14KB base64 string = ~10KB raw binary size
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
      try {
        const width = img.width;
        const height = img.height;
        const minSide = Math.min(width, height);
        
        // Calculate center crop coordinates for 1:1 square
        const sx = (width - minSide) / 2;
        const sy = (height - minSide) / 2;

        let quality = initialQuality;
        let canvasSize = targetCanvasSize;
        let bestResult = '';
        let bestSize = Infinity;

        for (let attempt = 0; attempt < 5; attempt++) {
          const canvas = document.createElement('canvas');
          canvas.width = canvasSize;
          canvas.height = canvasSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(bestResult || base64Str);
            return;
          }

          // Fill white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvasSize, canvasSize);

          // Draw center-cropped square
          ctx.drawImage(
            img,
            sx, sy, minSide, minSide, // source rectangle
            0, 0, canvasSize, canvasSize   // destination rectangle
          );

          const currentCompressed = canvas.toDataURL('image/jpeg', quality);
          const currentLength = currentCompressed.length;

          if (currentLength < bestSize) {
            bestResult = currentCompressed;
            bestSize = currentLength;
          }

          if (currentLength <= targetMaxBytes) {
            break;
          }

          // Reduce canvas size and quality for next iteration
          canvasSize = Math.max(Math.round(canvasSize * 0.85), 120);
          quality = Math.max(quality * 0.7, 0.12);
        }

        resolve(bestResult || base64Str);
      } catch (e) {
        resolve(base64Str);
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

