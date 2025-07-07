import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import type { Lead } from '../../types/leads.types';
import { formatDate, truncateText } from '../../utils/helpers';
import { LEAD_STATES } from '../../utils/constants';
import LeadStatusBadge from './LeadStatusBadge';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onStatusChange: (id: number, status: 'nuevo' | 'contactado' | 'descartado') => Promise<void>;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading, onStatusChange }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const toast = useRef<Toast>(null);

  const statusOptions = [
    { label: 'Nuevo', value: 'nuevo' },
    { label: 'Contactado', value: 'contactado' },
    { label: 'Descartado', value: 'descartado' }
  ];

  const handleStatusChange = async (lead: Lead, newStatus: 'nuevo' | 'contactado' | 'descartado') => {
    if (lead.estado === newStatus) return;

    setUpdatingStatus(lead.id);
    try {
      await onStatusChange(lead.id, newStatus);
      toast.current?.show({
        severity: 'success',
        summary: 'Estado actualizado',
        detail: `El lead ahora está marcado como ${LEAD_STATES[newStatus].toLowerCase()}`,
        life: 3000
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado del lead',
        life: 3000
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDialog(true);
  };

  const nameTemplate = (rowData: Lead) => (
    <div className="flex align-items-center">
      <div className="flex flex-column">
        <span className="font-medium">{rowData.nombre_completo}</span>
        <small className="text-color-secondary">{rowData.correo}</small>
      </div>
    </div>
  );

  const serviceTemplate = (rowData: Lead) => (
    <span className="font-medium">{rowData.servicio || 'Sin servicio'}</span>
  );

  const phoneTemplate = (rowData: Lead) => (
    <span>{rowData.telefono || 'No proporcionado'}</span>
  );

  const messageTemplate = (rowData: Lead) => (
    <span>{rowData.mensaje ? truncateText(rowData.mensaje, 50) : 'Sin mensaje'}</span>
  );

  const statusTemplate = (rowData: Lead) => (
    <div className="flex align-items-center">
      <LeadStatusBadge status={rowData.estado} />
    </div>
  );

  const dateTemplate = (rowData: Lead) => (
    <span className="text-sm">{formatDate(rowData.fecha_envio)}</span>
  );

  const actionsTemplate = (rowData: Lead) => (
    <div className="flex align-items-center gap-2">
      <Dropdown
        value={rowData.estado}
        options={statusOptions}
        onChange={(e) => handleStatusChange(rowData, e.value)}
        disabled={updatingStatus === rowData.id}
        className="w-auto"
        placeholder="Cambiar estado"
      />
      <Button
        icon="pi pi-eye"
        className="p-button-text p-button-rounded"
        onClick={() => viewLead(rowData)}
        tooltip="Ver detalles"
      />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setShowDialog(false)}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      
      <DataTable
        value={leads}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        className="p-datatable-customers"
        emptyMessage="No se encontraron leads"
        globalFilterFields={['nombre_completo', 'correo', 'servicio', 'estado']}
        responsiveLayout="scroll"
      >
        <Column
          field="nombre_completo"
          header="Cliente"
          body={nameTemplate}
          sortable
          style={{ minWidth: '250px' }}
        />
        <Column
          field="servicio"
          header="Servicio"
          body={serviceTemplate}
          sortable
          style={{ minWidth: '150px' }}
        />
        <Column
          field="telefono"
          header="Teléfono"
          body={phoneTemplate}
          style={{ minWidth: '120px' }}
        />
        <Column
          field="mensaje"
          header="Mensaje"
          body={messageTemplate}
          style={{ minWidth: '200px' }}
        />
        <Column
          field="estado"
          header="Estado"
          body={statusTemplate}
          sortable
          style={{ minWidth: '120px' }}
        />
        <Column
          field="fecha_envio"
          header="Fecha"
          body={dateTemplate}
          sortable
          style={{ minWidth: '150px' }}
        />
        <Column
          header="Acciones"
          body={actionsTemplate}
          style={{ minWidth: '200px' }}
        />
      </DataTable>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Detalles del Lead"
        footer={dialogFooter}
        className="p-fluid"
        style={{ width: '450px' }}
        modal
      >
        {selectedLead && (
          <div className="flex flex-column gap-3">
            <div className="field">
              <label className="font-medium">Nombre completo:</label>
              <p className="mt-1">{selectedLead.nombre_completo}</p>
            </div>
            <div className="field">
              <label className="font-medium">Correo electrónico:</label>
              <p className="mt-1">{selectedLead.correo}</p>
            </div>
            <div className="field">
              <label className="font-medium">Teléfono:</label>
              <p className="mt-1">{selectedLead.telefono || 'No proporcionado'}</p>
            </div>
            <div className="field">
              <label className="font-medium">Servicio:</label>
              <p className="mt-1">{selectedLead.servicio || 'Sin servicio'}</p>
            </div>
            <div className="field">
              <label className="font-medium">Estado:</label>
              <div className="mt-1">
                <LeadStatusBadge status={selectedLead.estado} />
              </div>
            </div>
            <div className="field">
              <label className="font-medium">Fecha de envío:</label>
              <p className="mt-1">{formatDate(selectedLead.fecha_envio)}</p>
            </div>
            {selectedLead.mensaje && (
              <div className="field">
                <label className="font-medium">Mensaje:</label>
                <p className="mt-1 line-height-3">{selectedLead.mensaje}</p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
};

export default LeadsTable;