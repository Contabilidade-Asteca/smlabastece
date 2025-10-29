import React, { useState } from 'react';
import { drivers as initialDrivers, fuelings } from '../data/mockData.js';

/*
 * Driver management page.  Similar to the vehicle page, this view
 * allows you to add new drivers and see a summary table of each
 * driver's recent fueling activity.  It reports the date of the last
 * fueling, the average amount of fuel handled, and the total cost
 * accrued by the driver.
 */
const DriverList = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !license) return;
    const newDriver = { id: Date.now(), name, license };
    setDrivers([...drivers, newDriver]);
    setName('');
    setLicense('');
  };

  const getLastFueling = (driverId) => {
    const last = fuelings
      .filter((f) => f.driverId === driverId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return last?.date || 'N/A';
  };

  const getAverageLiters = (driverId) => {
    const relevant = fuelings.filter((f) => f.driverId === driverId);
    if (!relevant.length) return 'N/A';
    const total = relevant.reduce((sum, f) => sum + f.liters, 0);
    return (total / relevant.length).toFixed(2) + ' L';
  };

  const getTotalCost = (driverId) => {
    const relevant = fuelings.filter((f) => f.driverId === driverId);
    if (!relevant.length) return 'R$ 0,00';
    const total = relevant.reduce((sum, f) => sum + f.cost, 0);
    return 'R$ ' + total.toFixed(2);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Motoristas</h1>
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
            placeholder="Nome do motorista"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">CNH</label>
          <input
            type="text"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Número da CNH"
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
              <th className="p-2 text-left text-sm font-medium">CNH</th>
              <th className="p-2 text-left text-sm font-medium">Último Abastecimento</th>
              <th className="p-2 text-left text-sm font-medium">Média de Litros</th>
              <th className="p-2 text-left text-sm font-medium">Gasto Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((d) => (
              <tr key={d.id}>
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.license}</td>
                <td className="p-2">{getLastFueling(d.id)}</td>
                <td className="p-2">{getAverageLiters(d.id)}</td>
                <td className="p-2">{getTotalCost(d.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverList;