import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  vehicles as defaultVehicles,
  drivers as defaultDrivers,
  fuelings as defaultFuelings,
} from '../data/mockData.js';

const STORAGE_KEY = 'fleet-app-data-v1';

const DataContext = createContext(null);

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeVehicles = (items) =>
  items.map((item) => ({
    ...item,
    id: String(item.id),
  }));

const normalizeDrivers = (items) =>
  items.map((item) => ({
    ...item,
    id: String(item.id),
  }));

const normalizeFuelings = (items) =>
  items.map((item) => ({
    ...item,
    id: String(item.id),
    vehicleId: String(item.vehicleId),
    driverId: String(item.driverId),
    liters: Number(item.liters),
    cost: Number(item.cost),
  }));

const defaultState = {
  vehicles: normalizeVehicles(defaultVehicles),
  drivers: normalizeDrivers(defaultDrivers),
  fuelings: normalizeFuelings(defaultFuelings),
};

const loadInitialState = () => {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }
    const parsed = JSON.parse(stored);
    return {
      vehicles: Array.isArray(parsed.vehicles)
        ? normalizeVehicles(parsed.vehicles)
        : defaultState.vehicles,
      drivers: Array.isArray(parsed.drivers)
        ? normalizeDrivers(parsed.drivers)
        : defaultState.drivers,
      fuelings: Array.isArray(parsed.fuelings)
        ? normalizeFuelings(parsed.fuelings)
        : defaultState.fuelings,
    };
  } catch (error) {
    console.warn('Não foi possível carregar os dados salvos. Usando dados padrão.', error);
    return defaultState;
  }
};

export const DataProvider = ({ children }) => {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addVehicle = useCallback((vehicle) => {
    setState((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, { id: generateId(), ...vehicle }],
    }));
  }, []);

  const updateVehicle = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle,
      ),
      fuelings: prev.fuelings.map((fueling) =>
        fueling.vehicleId === id ? { ...fueling, vehicleId: id } : fueling,
      ),
    }));
  }, []);

  const deleteVehicle = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((vehicle) => vehicle.id !== id),
      fuelings: prev.fuelings.filter((fueling) => fueling.vehicleId !== id),
    }));
  }, []);

  const addDriver = useCallback((driver) => {
    setState((prev) => ({
      ...prev,
      drivers: [...prev.drivers, { id: generateId(), ...driver }],
    }));
  }, []);

  const updateDriver = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      drivers: prev.drivers.map((driver) =>
        driver.id === id ? { ...driver, ...updates } : driver,
      ),
      fuelings: prev.fuelings.map((fueling) =>
        fueling.driverId === id ? { ...fueling, driverId: id } : fueling,
      ),
    }));
  }, []);

  const deleteDriver = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      drivers: prev.drivers.filter((driver) => driver.id !== id),
      fuelings: prev.fuelings.filter((fueling) => fueling.driverId !== id),
    }));
  }, []);

  const addFueling = useCallback((fueling) => {
    setState((prev) => ({
      ...prev,
      fuelings: [
        ...prev.fuelings,
        {
          id: generateId(),
          vehicleId: String(fueling.vehicleId),
          driverId: String(fueling.driverId),
          date: fueling.date,
          liters: Number(fueling.liters),
          cost: Number(fueling.cost),
        },
      ],
    }));
  }, []);

  const updateFueling = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      fuelings: prev.fuelings.map((fueling) =>
        fueling.id === id
          ? {
              ...fueling,
              ...updates,
              vehicleId:
                updates.vehicleId !== undefined
                  ? String(updates.vehicleId)
                  : fueling.vehicleId,
              driverId:
                updates.driverId !== undefined
                  ? String(updates.driverId)
                  : fueling.driverId,
              liters:
                updates.liters !== undefined
                  ? Number(updates.liters)
                  : fueling.liters,
              cost:
                updates.cost !== undefined ? Number(updates.cost) : fueling.cost,
            }
          : fueling,
      ),
    }));
  }, []);

  const deleteFueling = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      fuelings: prev.fuelings.filter((fueling) => fueling.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => setState(defaultState), []);

  const value = useMemo(
    () => ({
      vehicles: state.vehicles,
      drivers: state.drivers,
      fuelings: state.fuelings,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addDriver,
      updateDriver,
      deleteDriver,
      addFueling,
      updateFueling,
      deleteFueling,
      resetData,
    }),
    [
      state,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addDriver,
      updateDriver,
      deleteDriver,
      addFueling,
      updateFueling,
      deleteFueling,
      resetData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext deve ser usado dentro de um DataProvider');
  }
  return context;
};

