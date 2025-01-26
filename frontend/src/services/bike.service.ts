import axios from './axios'

export interface Bike {
  id: string
  name: string
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
    await axios.post(`/bikes/create`, {
      name: data.name,
      maintenanceKilometers: data.maintenanceInterval.kilometers,
      maintenanceMonths: data.maintenanceInterval.monthInterval
    })
  }

  async update(data: Bike): Promise<void> {
    await axios.put(`/bikes/update/${data.id}`, {
      name: data.name,
      maintenanceKilometers: data.maintenanceInterval.kilometers,
      maintenanceMonths: data.maintenanceInterval.monthInterval
    })
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/bikes/delete/${id}`)
  }
}

export const bikeService = new BikeService() 