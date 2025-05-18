import axios from 'axios';
import { Frontend } from '../types/frontend';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const frontendApi = {
  getAll: async (): Promise<Frontend[]> => {
    const response = await axios.get(`${API_URL}/frontends`);
    return response.data;
  },

  add: async (frontend: Frontend): Promise<Frontend> => {
    const response = await axios.post(`${API_URL}/frontends`, frontend);
    return response.data;
  },

  update: async (name: string, update: Partial<Frontend>): Promise<Frontend> => {
    const response = await axios.put(`${API_URL}/frontends/${name}`, update);
    return response.data;
  },

  delete: async (name: string): Promise<void> => {
    await axios.delete(`${API_URL}/frontends/${name}`);
  },

  uploadFiles: async (name: string, files: File[]): Promise<{ message: string }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await axios.post(
      `${API_URL}/frontends/${name}/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
};