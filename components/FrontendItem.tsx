import { useState } from 'react';
import { Frontend } from '../types/frontend';

interface FrontendItemProps {
  frontend: Frontend;
  onEdit: () => void;
  onDelete: () => void;
  onUpload: () => void;
}

export default function FrontendItem({ frontend, onEdit, onDelete, onUpload }: FrontendItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{frontend.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Ruta: {frontend.path}</p>
          {frontend.isActive && (
            <p className="text-sm text-gray-700 mt-2">{frontend.isActive}</p>
          )}
          {frontend.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              Creado: {new Date(frontend.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onUpload}
            className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Subir archivos
          </button>
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Editar
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">¿Estás seguro de eliminar este frontend?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                onDelete();
              }}
              className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}