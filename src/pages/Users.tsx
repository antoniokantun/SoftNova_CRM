// Users.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/users.types';
import { usersService } from '../services/users.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getInitials } from '../utils/helpers';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
  });
  const [errors, setErrors] = useState<Partial<CreateUserRequest>>({});
  const toast = useRef<Toast>(null);

  const roleOptions = [
    { label: 'Usuario', value: 'usuario' },
    { label: 'Administrador', value: 'administrador' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los usuarios',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'usuario'
    });
    setErrors({});
    setSelectedUser(null);
    setIsEditing(false);
    setShowDialog(true);
  };

  const openEditDialog = (user: User) => {
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol
    });
    setErrors({});
    setSelectedUser(user);
    setIsEditing(true);
    setShowDialog(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserRequest> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEditing && selectedUser) {
        const updateData: UpdateUserRequest = {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }

        const updatedUser = await usersService.updateUser(selectedUser.id, updateData);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        
        toast.current?.show({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'El usuario ha sido actualizado correctamente',
          life: 3000
        });
      } else {
        const newUser = await usersService.createUser(formData);
        setUsers([...users, newUser]);
        
        toast.current?.show({
          severity: 'success',
          summary: 'Usuario creado',
          detail: 'El usuario ha sido creado correctamente',
          life: 3000
        });
      }
      
      setShowDialog(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.mensaje || 'Error al procesar la solicitud',
        life: 3000
      });
    }
  };

  const handleDelete = (user: User) => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await usersService.deleteUser(user.id);
          setUsers(users.filter(u => u.id !== user.id));
          
          toast.current?.show({
            severity: 'success',
            summary: 'Usuario eliminado',
            detail: 'El usuario ha sido eliminado correctamente',
            life: 3000
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el usuario',
            life: 3000
          });
        }
      }
    });
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const nameTemplate = (rowData: User) => (
    <div className="flex align-items-center">
      <div className="flex align-items-center justify-content-center w-3rem h-3rem border-circle mr-3" 
           style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <span className="font-bold">{getInitials(rowData.nombre)}</span>
      </div>
      <div className="flex flex-column">
        <span className="font-medium">{rowData.nombre}</span>
        <small className="text-color-secondary">{rowData.email}</small>
      </div>
    </div>
  );

  const roleTemplate = (rowData: User) => (
    <span className={`px-2 py-1 border-round text-sm ${
      rowData.rol === 'administrador' 
        ? 'bg-primary text-white' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {rowData.rol === 'administrador' ? 'Administrador' : 'Usuario'}
    </span>
  );

  const actionsTemplate = (rowData: User) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-info"
        onClick={() => openEditDialog(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        onClick={() => handleDelete(rowData)}
        tooltip="Eliminar"
      />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setShowDialog(false)}
      />
      <Button
        label={isEditing ? 'Actualizar' : 'Crear'}
        icon="pi pi-check"
        onClick={handleSubmit}
      />
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="grid">
        <div className="col-12">
          <Card>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <div className="mb-3 md:mb-0">
                <h1 className="text-3xl font-bold text-primary mb-2">Gestión de Usuarios</h1>
                <p className="text-color-secondary">
                  Administra los usuarios del sistema
                </p>
              </div>
              <Button
                label="Nuevo Usuario"
                icon="pi pi-plus"
                onClick={openCreateDialog}
              />
            </div>
          </Card>
        </div>
        
        <div className="col-12">
          <Card>
            <DataTable
              value={users}
              loading={loading}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-customers"
              emptyMessage="No se encontraron usuarios"
              responsiveLayout="scroll"
            >
              <Column
                field="nombre"
                header="Usuario"
                body={nameTemplate}
                sortable
                style={{ minWidth: '250px' }}
              />
              <Column
                field="rol"
                header="Rol"
                body={roleTemplate}
                sortable
                style={{ minWidth: '120px' }}
              />
              <Column
                header="Acciones"
                body={actionsTemplate}
                style={{ minWidth: '120px' }}
              />
            </DataTable>
          </Card>
        </div>
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        footer={dialogFooter}
        className="p-fluid"
        style={{ width: '450px' }}
        modal
      >
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nombre" className="font-medium">
              Nombre completo *
            </label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={errors.nombre ? 'p-invalid' : ''}
              placeholder="Ingrese el nombre completo"
            />
            {errors.nombre && (
              <small className="p-error">{errors.nombre}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="email" className="font-medium">
              Email *
            </label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'p-invalid' : ''}
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && (
              <small className="p-error">{errors.email}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="password" className="font-medium">
              Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
            </label>
            <InputText
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'p-invalid' : ''}
              placeholder={isEditing ? 'Nueva contraseña' : 'Contraseña'}
            />
            {errors.password && (
              <small className="p-error">{errors.password}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="rol" className="font-medium">
              Rol *
            </label>
            <Dropdown
              id="rol"
              value={formData.rol}
              options={roleOptions}
              onChange={(e) => handleInputChange('rol', e.value)}
              className={errors.rol ? 'p-invalid' : ''}
              placeholder="Seleccione un rol"
            />
            {errors.rol && (
              <small className="p-error">{errors.rol}</small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Users;