import React, { useState, useEffect } from 'react';
import { X, Edit, Save, User, Mail, Calendar, Shield, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface UserPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  token: string | null;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  membership: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserPanel: React.FC<UserPanelProps> = ({ isOpen, onClose, user, token }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { updateUser } = useAuth(); // Para actualizar el contexto

  // Cargar perfil completo del usuario
  useEffect(() => {
    if (isOpen && token) {
      fetchUserProfile();
    }
  }, [isOpen, token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setEditForm({
          name: data.user.name,
          email: data.user.email
        });
      } else {
        throw new Error('Error al cargar el perfil');
      }
    } catch (error) {
      setError('Error al cargar el perfil del usuario');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edición - restaurar valores originales
      if (userProfile) {
        setEditForm({
          name: userProfile.name,
          email: userProfile.email
        });
      }
      setError('');
      setSuccess('');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        setUserProfile(data.user);
        setIsEditing(false);
        setSuccess('Perfil actualizado correctamente');
        
        // Actualizar también el contexto de autenticación
        updateUser(data.user);
      } else {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Panel de Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded">
              {success}
            </div>
          )}

          {userProfile && !loading && (
            <div className="space-y-4">
              {/* Información del usuario */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Información Personal</h3>
                
                <div className="space-y-3">
                  {/* Nombre */}
                  <div className="flex items-center space-x-3">
                    <User size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300">Nombre</label>
                      {isEditing ? (
                        <Input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <Mail size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Estado de membresía */}
                  <div className="flex items-center space-x-3">
                    <Crown size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300">Membresía</label>
                      <p className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        userProfile.membership 
                          ? 'bg-green-900/50 text-green-300 border border-green-700' 
                          : 'bg-slate-600 text-slate-300 border border-slate-500'
                      }`}>
                        {userProfile.membership ? 'Activa' : 'Inactiva'}
                      </p>
                    </div>
                  </div>

                  {/* Tipo de usuario */}
                  <div className="flex items-center space-x-3">
                    <Shield size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300">Tipo de Usuario</label>
                      <p className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        userProfile.isAdmin 
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-700' 
                          : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                      }`}>
                        {userProfile.isAdmin ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de fechas */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Información de Cuenta</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Fecha de Registro</label>
                      <p className="text-white text-sm">{formatDate(userProfile.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Última Actualización</label>
                      <p className="text-white text-sm">{formatDate(userProfile.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Save size={16} className="mr-2" />
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      onClick={handleEditToggle}
                      disabled={loading}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEditToggle}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white"
                  >
                    <Edit size={16} className="mr-2" />
                    Editar Información
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;