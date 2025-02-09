import axios from './axios'

export interface Bike {
  id: string
  name: string
  registrationNumber: string
  maintenanceInterval: {
    kilometers: number
    monthInterval: number
  }
}

class BikeService {
  async getAll(): Promise<Bike[]> {
    const response = await axios.get(`/bikes/list`)
    return response.data
  }

  async create(data: Omit<Bike, 'id'>): Promise<void> {
    console.log('Creating bike with data:', data);
    const payload = {
      name: data.name,
      registrationNumber: data.registrationNumber,
      maintenanceInterval: {
        kilometers: data.maintenanceInterval.kilometers,
        monthInterval: data.maintenanceInterval.monthInterval
      }
    };
    console.log('Sending payload:', payload);
    await axios.post(`/bikes/create`, payload);
  }

  async update(data: Bike): Promise<void> {
    await axios.put(`/bikes/update/${data.id}`, {
      name: data.name,
      registrationNumber: data.registrationNumber,
      maintenanceInterval: {
        kilometers: data.maintenanceInterval.kilometers,
        monthInterval: data.maintenanceInterval.monthInterval
      }
    })
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/bikes/delete/${id}`)
  }
}

export const bikeService = new BikeService()