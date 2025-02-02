import { defineStore } from 'pinia'
import axios from 'axios'
import type { SparePart } from '../services/breakdown.service'

const sparePartsAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface State {
  spareParts: SparePart[]
  loading: boolean
  error: string | null
}

export const useSparePartsStore = defineStore('spareParts', {
  state: (): State => ({
    spareParts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSpareParts() {
      try {
        this.loading = true
        const response = await sparePartsAxios.get<SparePart[]>('/spare-parts')
        this.spareParts = response.data
        this.error = null
      } catch (error) {
        this.error = 'Erreur lors du chargement des pièces détachées'
        console.error('Error fetching spare parts:', error)
      } finally {
        this.loading = false
      }
    },

    async getSparePartById(id: string): Promise<SparePart | null> {
      try {
        const response = await sparePartsAxios.get<SparePart>(`/spare-parts/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching spare part:', error)
        return null
      }
    },

    async updateSparePartQuantity(id: string, quantity: number) {
      try {
        const sparePart = await this.getSparePartById(id)
        if (!sparePart) return

        const newQuantity = sparePart.quantity - quantity
        if (newQuantity < 0) {
          throw new Error('Stock insuffisant')
        }

        await sparePartsAxios.put(`/spare-parts/${id}`, {
          ...sparePart,
          quantity: newQuantity,
        })
      } catch (error) {
        console.error('Error updating spare part quantity:', error)
        throw error
      }
    },
  },
})
