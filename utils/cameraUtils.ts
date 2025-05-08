import { Platform } from 'react-native';

/**
 * Captures a frame from the camera and returns it as a base64-encoded string
 * @param cameraRef - Reference to the camera component
 * @returns Base64-encoded JPEG image or null if capture fails
 */
export const captureFrame = async (cameraRef: React.RefObject<any>): Promise<string | null> => {
  if (!cameraRef?.current) {
    console.warn('Camera reference is not available');
    return null;
  }

  try {
    // Take a picture
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.5, // Lower quality for faster processing
      skipProcessing: true,
    });

    // Return the base64 string (without the data:image/jpeg;base64, prefix)
    return photo.base64;
  } catch (error) {
    console.error('Error capturing frame:', error);
    return null;
  }
};

/**
 * Converts a file to a base64 string (for web platform)
 * @param file - File to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};