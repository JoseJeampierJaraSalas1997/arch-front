import { useState, useEffect } from 'react';
import '../../src/app/globals.css';
import Head from 'next/head';
import FrontendItem from '../../components/FrontendItem';
import FrontendForm from '../../components/FrontendForm';
import FileUpload from '../../components/FileUpload';
import { frontendApi } from '../../services/api';
import { Frontend } from '../../types/frontend';

export default function FrontendsPage() {
  const [frontends, setFrontends] = useState<Frontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFrontend, setEditingFrontend] = useState<Frontend | null>(null);
  const [uploadingForFrontend, setUploadingForFrontend] = useState<string | null>(null);

  const fetchFrontends = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await frontendApi.getAll();
      setFrontends(data);
    } catch (err) {
      console.error('Error fetching frontends:', err);
      setError('Error al cargar los frontends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrontends();
  }, []);

  const handleAddFrontend = async (frontend: Frontend) => {
    try {
      await frontendApi.add(frontend);
      await fetchFrontends();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding frontend:', err);
      setError('Error al añadir el frontend');
    }
  };

  const handleUpdateFrontend = async (frontend: Frontend) => {
    if (!frontend.name) return;
    
    try {
      await frontendApi.update(frontend.name, frontend);
      await fetchFrontends();
      setEditingFrontend(null);
    } catch (err) {
      console.error('Error updating frontend:', err);
      setError('Error al actualizar el frontend');
    }
  };

  const handleDeleteFrontend = async (name: string) => {
    try {
      await frontendApi.delete(name);
      await fetchFrontends();
    } catch (err) {
      console.error('Error deleting frontend:', err);
      setError('Error al eliminar el frontend');
    }
  };

  const handleUploadSuccess = async () => {
    setUploadingForFrontend(null);
    await fetchFrontends();
  };

  return (
    <>
      <Head>
        <title>Gestión de Frontends</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Frontends</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Añadir Frontend
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando frontends...</p>
          </div>
        ) : (
          <>
            {showAddForm && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Añadir nuevo frontend</h2>
                <FrontendForm
                  onSubmit={handleAddFrontend}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            {editingFrontend && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Editar frontend</h2>
                <FrontendForm
                  initialData={editingFrontend}
                  onSubmit={handleUpdateFrontend}
                  onCancel={() => setEditingFrontend(null)}
                />
              </div>
            )}

            {uploadingForFrontend && (
              <FileUpload
                frontendName={uploadingForFrontend}
                onSuccess={handleUploadSuccess}
              />
            )}

            {frontends.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No hay frontends disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frontends.map((frontend) => (
                  <FrontendItem
                    key={frontend.name}
                    frontend={frontend}
                    onEdit={() => setEditingFrontend(frontend)}
                    onDelete={() => handleDeleteFrontend(frontend.name)}
                    onUpload={() => setUploadingForFrontend(frontend.name)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}