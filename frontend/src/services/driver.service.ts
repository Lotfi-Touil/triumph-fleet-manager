import axios from './axios';
import type { Driver } from '@/types/driver';

export const driverService = {
  async getAllDrivers(): Promise<Driver[]> {
    const response = await axios.get(`/drivers`);
    return response.data;
  },

  async getDriver(id: string): Promise<Driver> {
    const response = await axios.get(`/drivers/${id}`);
    return response.data;
  },

  async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    const response = await axios.post(`/drivers`, driver);
    return response.data;
  },

  async updateDriver(id: string, driver: Partial<Driver>): Promise<Driver> {
    const response = await axios.put(`/drivers/${id}`, driver);
    return response.data;
  },

  async deleteDriver(id: string): Promise<void> {
    await axios.delete(`/drivers/${id}`);
  }
};