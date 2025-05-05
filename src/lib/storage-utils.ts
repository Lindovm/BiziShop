import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param file The file to upload
 * @param path The path in storage where the file should be stored
 * @returns Promise with the download URL
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a unique filename
    const filename = `${Date.now()}_${file.name}`;
    const fullPath = `${path}/${filename}`;
    
    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, fullPath);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
