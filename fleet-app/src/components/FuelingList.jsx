import React, { useState } from 'react';
import { vehicles, drivers, fuelings as initialFuelings } from '../data/mockData.js';

/*
 * Fueling management page.  Provides a form to record new fuelings and
 * displays all existing records in a table.  Selecting a vehicle and
 * driver is handled via dropdown menus populated from the mock data.
 */
const FuelingList = () => {
  const [fuelings, setFuelings] = useState(initialFuelings);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');
  const [date, setDate] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!vehicleId || !driverId || !date || !liters || !cost) return;
    const newFuel = {
      id: Date.now(),
      vehicleId: Number(vehicleId),
      driverId: Number(driverId),
      date,
      liters: Number(liters),
      cost: Number(cost),
    };
    setFuelings([...fuelings, newFuel]);
    setDate('');
    setLiters('');
    setCost('');
  };

  const getVehicleName = (id) => vehicles.find((v) => v.id === id)?.name || '';
  const getDriverName = (id) => drivers.find((d) => d.id === id)?.name || '';

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Abastecimentos</h1>
      <form
        onSubmit={handleAdd}
        className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
      >
        <div>
          <label className="block text-sm font-medium">Veículo</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Motorista</label>
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Litros</label>
          <input
            type="number"
            step="0.01"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Custo (R$)</label>
          <input
            type="number"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md md:col-span-5"
        >
          Adicionar Abastecimento
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-sm font-medium">Veículo</th>
              <th className="p-2 text-left text-sm font-medium">Motorista</th>
              <th className="p-2 text-left text-sm font-medium">Data</th>
              <th className="p-2 text-left text-sm font-medium">Litros</th>
              <th className="p-2 text-left text-sm font-medium">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fuelings
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((f) => (
                <tr key={f.id}>
                  <td className="p-2">{getVehicleName(f.vehicleId)}</td>
                  <td className="p-2">{getDriverName(f.driverId)}</td>
                  <td className="p-2">{f.date}</td>
                  <td className="p-2">{f.liters.toFixed(2)} L</td>
                  <td className="p-2">R$ {f.cost.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelingList;