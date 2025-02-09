import axios from 'axios'
import type { SparePartNotification } from './maintenance.service'

const sparePartsAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

class SparePartsService {
  async getLowStockNotifications(): Promise<SparePartNotification[]> {
    const response = await sparePartsAxios.get<SparePartNotification[]>('/spare-parts/notifications/low-stock')
    return response.data
  }

  async acknowledgeNotification(id: string): Promise<void> {
    await sparePartsAxios.put(`/spare-parts/notifications/${id}/acknowledge`)
  }
}

export const sparePartsService = new SparePartsService()