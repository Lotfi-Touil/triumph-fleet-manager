import type { Driver } from './driver';

export interface Incident {
  id: string;
  driverId: string;
  driver?: Driver;
  type: string;
  description: string;
  date: Date;
  location: string;
  severity: string;
  status: string;
}

export const INCIDENT_TYPES = [
  'Accident',
  'Infraction',
  'Panne',
  'Autre'
] as const;

export const INCIDENT_SEVERITIES = [
  'Faible',
  'Moyen',
  'Élevé',
  'Critique'
] as const;

export const INCIDENT_STATUSES = [
  'En cours',
  'Résolu',
  'En attente',
  'Archivé'
] as const;

export type CreateIncidentDTO = Omit<Incident, 'id'>;
export type UpdateIncidentDTO = Partial<Incident>; 