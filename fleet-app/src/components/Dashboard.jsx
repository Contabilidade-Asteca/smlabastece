import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { vehicles, drivers, fuelings } from '../data/mockData.js';

/*
 * Dashboard component.  Presents a high-level overview of the fleet
 * including counts of vehicles and drivers, the total number of
 * fuelings, and the total cost.  A bar chart visualizes the fuel
 * consumption for each vehicle, and a table lists the most recent
 * fueling events.
 */
const Dashboard = () => {
  const totalVehicles = vehicles.length;
  const totalDrivers = drivers.length;
  const totalFuelings = fuelings.length;
  const totalCost = fuelings.reduce((sum, f) => sum + f.cost, 0);

  // Aggregated consumption per vehicle for the bar chart.
  const consumptionByVehicle = vehicles.map((v) => {
    const vehicleFuelings = fuelings.filter((f) => f.vehicleId === v.id);
    return {
      name: v.name,
      liters: vehicleFuelings.reduce((sum, f) => sum + f.liters, 0),
      cost: vehicleFuelings.reduce((sum, f) => sum + f.cost, 0),
    };
  });

  // Determine the five most recent fuelings for the table.
  const latestFuelings = [...fuelings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getVehicleName = (id) => vehicles.find((v) => v.id === id)?.name || '';
  const getDriverName = (id) => drivers.find((d) => d.id === id)?.name || '';

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Veículos</div>
          <div className="text-2xl font-semibold">{totalVehicles}</div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Motoristas</div>
          <div className="text-2xl font-semibold">{totalDrivers}</div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Total de Abastecimentos</div>
          <div className="text-2xl font-semibold">{totalFuelings}</div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Gasto Total (R$)</div>
          <div className="text-2xl font-semibold">R$ {totalCost.toFixed(2)}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Consumo por Veículo (Litros)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionByVehicle}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="liters" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Últimos Abastecimentos</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left text-sm font-medium">Data</th>
                <th className="p-2 text-left text-sm font-medium">Veículo</th>
                <th className="p-2 text-left text-sm font-medium">Motorista</th>
                <th className="p-2 text-left text-sm font-medium">Litros</th>
                <th className="p-2 text-left text-sm font-medium">Custo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latestFuelings.map((f) => (
                <tr key={f.id}>
                  <td className="p-2">{f.date}</td>
                  <td className="p-2">{getVehicleName(f.vehicleId)}</td>
                  <td className="p-2">{getDriverName(f.driverId)}</td>
                  <td className="p-2">{f.liters.toFixed(2)} L</td>
                  <td className="p-2">R$ {f.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;