import React, { useState } from 'react';
import { Frontend } from '../types/frontend';

interface FrontendFormProps {
  initialData?: Frontend;
  onSubmit: (data: Frontend) => Promise<void>;
  onCancel: () => void;
}

export default function FrontendForm({ initialData, onSubmit, onCancel }: FrontendFormProps) {
  const [formData, setFormData] = useState<Frontend>(
    initialData || {
      name: '',
      path: '',
      isActive: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!initialData}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
          Ruta *
        </label>
        <input
          type="text"
          id="path"
          name="path"
          value={formData.path}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
          Estado de activación
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive || false}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">
            {formData.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>



      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Enviando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}