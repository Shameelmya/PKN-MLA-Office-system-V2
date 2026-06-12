import imageCompression from 'browser-image-compression';

// Replace this with the URL the user deployed
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxx-4DqUgj-AfOhN1alKAy3FplLiDbUJnGFR-DXiHjhFRpNk65cKEiyCcSn4O_35W9uKw/exec";

export const MAX_FILE_SIZE_MB = 2;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Get only the base64 part
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const uploadToGoogleDrive = async (file: File): Promise<{ url: string, id: string, name: string }> => {
  let fileToUpload = file;

  // Compress images larger than 500KB
  if (file.type.startsWith('image/') && file.size > 500 * 1024) {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    try {
      fileToUpload = await imageCompression(file, options);
    } catch (e) {
      console.error("Image compression failed, proceeding with original", e);
    }
  }

  if (fileToUpload.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB. Current size: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
  }

  const base64 = await convertBase64(fileToUpload);

  const payload = {
    action: "upload",
    filename: fileToUpload.name,
    mimeType: fileToUpload.type,
    base64: base64
  };

  // We use text/plain so we don't trigger CORS preflight OPTIONS request
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    }
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Upload failed");
  }

  return {
    url: data.url,
    id: data.id,
    name: data.name
  };
};

export const deleteFromGoogleDrive = async (fileId: string): Promise<boolean> => {
  const payload = {
    action: "delete",
    fileId: fileId
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      }
    });

    const data = await response.json();
    return data.success;
  } catch (e) {
    console.error("Delete failed", e);
    return false;
  }
};
