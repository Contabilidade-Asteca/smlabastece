// Mock data used by the sample application.  In a real application this
// data might come from a REST API, a database, or local storage.  For
// demonstration purposes we include a few vehicles, drivers, and
// historical fueling records.

export const vehicles = [
  { id: 1, name: 'Caminhão 1', plate: 'ABC-1234' },
  { id: 2, name: 'Caminhão 2', plate: 'DEF-5678' },
];

export const drivers = [
  { id: 1, name: 'José', license: '1234567890' },
  { id: 2, name: 'Maria', license: '0987654321' },
];

export const fuelings = [
  { id: 1, vehicleId: 1, driverId: 1, date: '2025-10-15', liters: 50, cost: 500 },
  { id: 2, vehicleId: 2, driverId: 2, date: '2025-10-20', liters: 60, cost: 600 },
  { id: 3, vehicleId: 1, driverId: 1, date: '2025-10-25', liters: 55, cost: 550 },
];