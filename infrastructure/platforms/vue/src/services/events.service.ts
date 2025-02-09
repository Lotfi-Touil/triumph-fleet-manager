class NotificationEventService {
  private maintenanceSource: EventSource | null = null
  private lowStockSource: EventSource | null = null
  private callback: (() => void) | null = null

  startListening(callback: () => void) {
    this.stopListening()
    this.callback = callback

    this.maintenanceSource = new EventSource(
      'http://localhost:3000/api/maintenances/notifications/events',
    )
    this.maintenanceSource.onmessage = () => {
      this.callback?.()
    }
    this.maintenanceSource.onerror = (error) => {
      console.error('Maintenance SSE error:', error)
      this.reconnectMaintenanceSSE()
    }

    this.lowStockSource = new EventSource(
      'http://localhost:3001/api/spare-parts/notifications/events',
    )
    this.lowStockSource.onmessage = () => {
      this.callback?.()
    }
    this.lowStockSource.onerror = (error) => {
      console.error('Low stock SSE error:', error)
      this.reconnectLowStockSSE()
    }
  }

  private reconnectMaintenanceSSE() {
    if (this.maintenanceSource) {
      this.maintenanceSource.close()
      this.maintenanceSource = new EventSource(
        'http://localhost:3000/api/maintenances/notifications/events',
      )
      this.maintenanceSource.onmessage = () => {
        this.callback?.()
      }
    }
  }

  private reconnectLowStockSSE() {
    if (this.lowStockSource) {
      this.lowStockSource.close()
      this.lowStockSource = new EventSource(
        'http://localhost:3001/api/spare-parts/notifications/events',
      )
      this.lowStockSource.onmessage = () => {
        this.callback?.()
      }
    }
  }

  stopListening() {
    if (this.maintenanceSource) {
      this.maintenanceSource.close()
      this.maintenanceSource = null
    }
    if (this.lowStockSource) {
      this.lowStockSource.close()
      this.lowStockSource = null
    }
    this.callback = null
  }
}

export const notificationEventService = new NotificationEventService()
