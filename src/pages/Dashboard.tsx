import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../types/leads.types';
import { leadsService } from '../services/leads.service';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LeadStatusBadge from '../components/leads/LeadStatusBadge';

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    nuevos: 0,
    contactados: 0,
    descartados: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await leadsService.getLeads(1, 100); // Obtener más leads para estadísticas
      setLeads(data);
      
      const newStats = {
        total: data.length,
        nuevos: data.filter(lead => lead.estado === 'nuevo').length,
        contactados: data.filter(lead => lead.estado === 'contactado').length,
        descartados: data.filter(lead => lead.estado === 'descartado').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    return {
      labels: ['Nuevos', 'Contactados', 'Descartados'],
      datasets: [
        {
          data: [stats.nuevos, stats.contactados, stats.descartados],
          borderWidth: 2
        }
      ]
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-color)',
          font: {
            size: 14
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const recentLeads = leads.slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="text-3xl font-bold text-primary mb-4">Dashboard</h1>
        <p className="text-color-secondary mb-5">
          Resumen de la actividad de leads en tu CRM
        </p>
      </div>

      {/* Estadísticas */}
      <div className="col-12 lg:col-3 md:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-color-secondary">Total Leads</div>
            </div>
            <div className="flex align-items-center justify-content-center w-3rem h-3rem border-circle" 
                 style={{ backgroundColor: 'var(--primary-color)20' }}>
              <i className="pi pi-users text-xl" style={{ color: 'var(--primary-color)' }}></i>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-3 md:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.nuevos}</div>
              <div className="text-color-secondary">Nuevos</div>
            </div>
            <div className="flex align-items-center justify-content-center w-3rem h-3rem border-circle" 
                 style={{ backgroundColor: 'var(--primary-color)20' }}>
              <i className="pi pi-circle-fill text-xl" style={{ color: 'var(--primary-color)' }}></i>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-3 md:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-2xl font-bold text-green-500">{stats.contactados}</div>
              <div className="text-color-secondary">Contactados</div>
            </div>
            <div className="flex align-items-center justify-content-center w-3rem h-3rem border-circle" 
                 style={{ backgroundColor: 'var(--green-500)20' }}>
              <i className="pi pi-check-circle text-xl text-green-500"></i>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-3 md:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-2xl font-bold text-red-500">{stats.descartados}</div>
              <div className="text-color-secondary">Descartados</div>
            </div>
            <div className="flex align-items-center justify-content-center w-3rem h-3rem border-circle" 
                 style={{ backgroundColor: 'var(--red-500)20' }}>
              <i className="pi pi-times-circle text-xl text-red-500"></i>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico */}
      <div className="col-12 lg:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center mb-4">
            <h3 className="text-xl font-bold">Distribución de Estados</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Chart type="doughnut" data={getChartData()} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Leads recientes */}
      <div className="col-12 lg:col-6">
        <Card>
          <div className="flex justify-content-between align-items-center mb-4">
            <h3 className="text-xl font-bold">Leads Recientes</h3>
            <Button
              label="Ver todos"
              icon="pi pi-external-link"
              className="p-button-text"
              onClick={() => navigate(ROUTES.LEADS)}
            />
          </div>
          
          {recentLeads.length === 0 ? (
            <div className="text-center py-4">
              <i className="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
              <p className="text-color-secondary">No hay leads recientes</p>
            </div>
          ) : (
            <div className="flex flex-column gap-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex align-items-center justify-content-between p-3 border-1 border-round border-300">
                  <div className="flex flex-column">
                    <span className="font-medium">{lead.nombre_completo}</span>
                    <small className="text-color-secondary">{lead.correo}</small>
                  </div>
                  <div className="flex align-items-center gap-2">
                    <LeadStatusBadge status={lead.estado} size="small" />
                    <small className="text-color-secondary">
                      {new Date(lead.fecha_envio).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="col-12">
        <Card>
          <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              label="Gestionar Leads"
              icon="pi pi-users"
              onClick={() => navigate(ROUTES.LEADS)}
              className="p-button-outlined"
            />
            <Button
              label="Usuarios"
              icon="pi pi-user-plus"
              onClick={() => navigate(ROUTES.USERS)}
              className="p-button-outlined"
            />
            <Button
              label="Actualizar"
              icon="pi pi-refresh"
              onClick={loadDashboardData}
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;