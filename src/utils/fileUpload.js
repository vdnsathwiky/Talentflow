export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  if (file.size > maxSize) {
    throw new Error('File too large (max 10MB)');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF, DOC, and DOCX files are allowed');
  }

  return true;
};

export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const handleFileUpload = async (file) => {
  try {
    // Validate file
    validateFile(file);

    // Read file as base64
    const data = await readFileAsBase64(file);

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      data: data,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};