import React, { useState } from 'react';
import { vehicles as initialVehicles, fuelings } from '../data/mockData.js';

/*
 * Vehicle management page.  Provides a form to add new vehicles and
 * displays a table with summary statistics for each vehicle.  The
 * statistics include the date of the last fueling, the average
 * amount of fuel added per fueling, and the total cost of fuel for
 * that vehicle.
 */
const VehicleList = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !plate) return;
    const newVehicle = { id: Date.now(), name, plate };
    setVehicles([...vehicles, newVehicle]);
    setName('');
    setPlate('');
  };

  const getLastFueling = (vehicleId) => {
    const last = fuelings
      .filter((f) => f.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return last?.date || 'N/A';
  };

  const getAverageLiters = (vehicleId) => {
    const relevant = fuelings.filter((f) => f.vehicleId === vehicleId);
    if (!relevant.length) return 'N/A';
    const total = relevant.reduce((sum, f) => sum + f.liters, 0);
    return (total / relevant.length).toFixed(2) + ' L';
  };

  const getTotalCost = (vehicleId) => {
    const relevant = fuelings.filter((f) => f.vehicleId === vehicleId);
    if (!relevant.length) return 'R$ 0,00';
    const total = relevant.reduce((sum, f) => sum + f.cost, 0);
    return 'R$ ' + total.toFixed(2);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Veículos</h1>
      <form
        onSubmit={handleAdd}
        className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-end"
      >
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Nome do veículo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Placa</label>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="ABC-1234"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Adicionar
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-sm font-medium">Nome</th>
              <th className="p-2 text-left text-sm font-medium">Placa</th>
              <th className="p-2 text-left text-sm font-medium">Último Abastecimento</th>
              <th className="p-2 text-left text-sm font-medium">Média de Litros</th>
              <th className="p-2 text-left text-sm font-medium">Gasto Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="p-2">{v.name}</td>
                <td className="p-2">{v.plate}</td>
                <td className="p-2">{getLastFueling(v.id)}</td>
                <td className="p-2">{getAverageLiters(v.id)}</td>
                <td className="p-2">{getTotalCost(v.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;