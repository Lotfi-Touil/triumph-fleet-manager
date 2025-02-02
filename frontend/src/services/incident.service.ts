import axios from './axios';
import type { Incident } from '../types/incident';

export const incidentService = {
  async getAllIncidents(): Promise<Incident[]> {
    const response = await axios.get('/incidents');
    return response.data;
  },

  async getIncident(id: string): Promise<Incident> {
    const response = await axios.get(`/incidents/${id}`);
    return response.data;
  },

  async getIncidentsByDriver(driverId: string): Promise<Incident[]> {
    const response = await axios.get(`/incidents/driver/${driverId}`);
    return response.data;
  },

  async createIncident(incident: Omit<Incident, 'id'>): Promise<Incident> {
    const response = await axios.post('/incidents', incident);
    return response.data;
  },

  async updateIncident(id: string, incident: Partial<Incident>): Promise<Incident> {
    const response = await axios.put(`/incidents/${id}`, incident);
    return response.data;
  },

  async deleteIncident(id: string): Promise<void> {
    await axios.delete(`/incidents/${id}`);
  },
}; 