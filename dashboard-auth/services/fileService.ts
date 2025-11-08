import apiClient from "./apiClient";

export const uploadFile = async (file: File): Promise<{ url: string; fileId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};