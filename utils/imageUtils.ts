
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URI prefix e.g. "data:image/jpeg;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}

export function cropAndDownloadImage(imageUrl: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            const targetSize = 600;
            canvas.width = targetSize;
            canvas.height = targetSize;

            const sourceSize = Math.min(img.width, img.height);
            const sourceX = (img.width - sourceSize) / 2;
            const sourceY = (img.height - sourceSize) / 2;
            
            ctx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceSize,
                sourceSize,
                0,
                0,
                targetSize,
                targetSize
            );

            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            
            const link = document.createElement('a');
            const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
            link.download = `${baseName}_dv_cropped.jpg`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = imageUrl;
    });
}
