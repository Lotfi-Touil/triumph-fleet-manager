import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Driver } from '@/types/driver';
import { driverService } from '@/services/driver.service';
import { useNotificationStore } from './notifications';

export const useDriverStore = defineStore('driver', () => {
  const drivers = ref<Driver[]>([]);
  const loading = ref(false);
  const notificationStore = useNotificationStore();

  async function fetchDrivers() {
    try {
      loading.value = true;
      drivers.value = await driverService.getAllDrivers();
    } catch (error) {
      notificationStore.showError('Erreur lors du chargement des conducteurs');
      console.error('Error fetching drivers:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createDriver(driver: Omit<Driver, 'id'>) {
    try {
      loading.value = true;
      const newDriver = await driverService.createDriver(driver);
      drivers.value.push(newDriver);
      notificationStore.showSuccess('Conducteur créé avec succès');
    } catch (error) {
      notificationStore.showError('Erreur lors de la création du conducteur');
      console.error('Error creating driver:', error);
    } finally {
      loading.value = false;
    }
  }

  async function updateDriver(id: string, driver: Partial<Driver>) {
    try {
      loading.value = true;
      const updatedDriver = await driverService.updateDriver(id, driver);
      const index = drivers.value.findIndex(d => d.id === id);
      if (index !== -1) {
        drivers.value[index] = updatedDriver;
      }
      notificationStore.showSuccess('Conducteur mis à jour avec succès');
    } catch (error) {
      notificationStore.showError('Erreur lors de la mise à jour du conducteur');
      console.error('Error updating driver:', error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteDriver(id: string) {
    try {
      loading.value = true;
      await driverService.deleteDriver(id);
      drivers.value = drivers.value.filter(d => d.id !== id);
      notificationStore.showSuccess('Conducteur supprimé avec succès');
    } catch (error) {
      notificationStore.showError('Erreur lors de la suppression du conducteur');
      console.error('Error deleting driver:', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    drivers,
    loading,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver
  };
}); 