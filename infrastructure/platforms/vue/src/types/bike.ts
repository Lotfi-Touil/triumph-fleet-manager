export interface Bike {
  id: string
  name: string
  registrationNumber: string
  maintenanceInterval: {
    kilometers: number
    monthInterval: number
  }
} 