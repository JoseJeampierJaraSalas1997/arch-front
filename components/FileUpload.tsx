import React, { useState, useRef } from 'react';
import { frontendApi } from '../services/api';

interface FileUploadProps {
  frontendName: string;
  onSuccess: () => void;
}

export default function FileUpload({ frontendName, onSuccess }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage('Por favor selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      await frontendApi.uploadFiles(frontendName, files);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess();
    } catch (error) {
      console.error('Error al subir archivos:', error);
      setErrorMessage('Ocurrió un error al subir los archivos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Subir archivos para {frontendName}</h3>
      
      <div className="mb-4">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Archivos seleccionados: {files.length}</p>
          <ul className="mt-2 text-sm text-gray-600 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="truncate">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 text-sm text-red-600">{errorMessage}</div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {uploading ? 'Subiendo...' : 'Subir archivos'}
      </button>
    </div>
  );
}