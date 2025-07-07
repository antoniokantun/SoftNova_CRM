// Leads.tsx

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import type { Lead } from '../types/leads.types';
import { leadsService } from '../services/leads.service';
import LeadsTable from '../components/leads/LeadsTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = React.useRef<Toast>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsService.getLeads(1, 100);
      setLeads(data);
    } catch (error) {
      console.error('Error al cargar leads:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los leads',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: 'nuevo' | 'contactado' | 'descartado') => {
    try {
      await leadsService.updateLeadStatus(id, { estado: status });
      
      // Actualizar el lead en el estado local
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === id ? { ...lead, estado: status } : lead
        )
      );
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.nombre_completo.toLowerCase().includes(globalFilter.toLowerCase()) ||
    lead.correo.toLowerCase().includes(globalFilter.toLowerCase()) ||
    lead.estado.toLowerCase().includes(globalFilter.toLowerCase()) ||
    (lead.servicio && lead.servicio.toLowerCase().includes(globalFilter.toLowerCase()))
  );

  const headerContent = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <div className="mb-3 md:mb-0">
        <h1 className="text-3xl font-bold text-primary mb-2">Gestión de Leads</h1>
        <p className="text-color-secondary">
          Administra y da seguimiento a tus leads
        </p>
      </div>
      <div className="flex gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search mx-2" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar leads..."
            className="w-full md:w-20rem pl-5"
          />
        </span>
        <Button
          label="Actualizar"
          icon="pi pi-refresh"
          onClick={loadLeads}
          className="p-button-outlined"
        />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Cargando leads..." />;
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12">
          <Card>
            {headerContent}
          </Card>
        </div>
        
        <div className="col-12">
          <Card>
            <div className="mb-4">
              <div className="flex flex-wrap gap-3 align-items-center">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-info-circle text-primary"></i>
                  <span className="font-medium">Total de leads: {filteredLeads.length}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-circle-fill text-primary"></i>
                  <span>Nuevos: {filteredLeads.filter(l => l.estado === 'nuevo').length}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-check-circle text-green-500"></i>
                  <span>Contactados: {filteredLeads.filter(l => l.estado === 'contactado').length}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-times-circle text-red-500"></i>
                  <span>Descartados: {filteredLeads.filter(l => l.estado === 'descartado').length}</span>
                </div>
              </div>
            </div>
            
            <LeadsTable
              leads={filteredLeads}
              loading={loading}
              onStatusChange={handleStatusChange}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Leads;