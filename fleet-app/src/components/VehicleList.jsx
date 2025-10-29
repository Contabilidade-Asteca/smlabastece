import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext.jsx';

const VehicleList = () => {
  const { vehicles, fuelings, addVehicle, updateVehicle, deleteVehicle } = useDataContext();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName('');
    setPlate('');
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !plate.trim()) {
      setError('Informe o nome e a placa do veículo.');
      return;
    }

    const payload = { name: name.trim(), plate: plate.trim().toUpperCase() };

    if (editingId) {
      updateVehicle(editingId, payload);
      setMessage('Veículo atualizado com sucesso.');
    } else {
      addVehicle(payload);
      setMessage('Veículo cadastrado com sucesso.');
    }

    resetForm();
  };

  const handleEdit = (vehicle) => {
    setName(vehicle.name);
    setPlate(vehicle.plate);
    setEditingId(vehicle.id);
    setMessage(null);
    setError(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja remover este veículo? Todos os abastecimentos associados serão excluídos.')) {
      deleteVehicle(id);
      setMessage('Veículo removido.');
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const getLastFueling = (vehicleId) => {
    const last = fuelings
      .filter((fueling) => fueling.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return last?.date || 'N/A';
  };

  const getAverageLiters = (vehicleId) => {
    const relevant = fuelings.filter((fueling) => fueling.vehicleId === vehicleId);
    if (!relevant.length) return 'N/A';
    const total = relevant.reduce((sum, fueling) => sum + Number(fueling.liters || 0), 0);
    return `${(total / relevant.length).toFixed(2)} L`;
  };

  const getTotalCost = (vehicleId) => {
    const relevant = fuelings.filter((fueling) => fueling.vehicleId === vehicleId);
    if (!relevant.length) return 'R$ 0,00';
    const total = relevant.reduce((sum, fueling) => sum + Number(fueling.cost || 0), 0);
    return `R$ ${total.toFixed(2)}`;
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Veículos</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-end"
      >
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Nome do veículo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Placa</label>
          <input
            type="text"
            value={plate}
            onChange={(event) => setPlate(event.target.value)}
            className="border rounded px-2 py-1 uppercase"
            placeholder="ABC-1234"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            {editingId ? 'Salvar alterações' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-sm font-medium">Nome</th>
              <th className="p-2 text-left text-sm font-medium">Placa</th>
              <th className="p-2 text-left text-sm font-medium">Último Abastecimento</th>
              <th className="p-2 text-left text-sm font-medium">Média de Litros</th>
              <th className="p-2 text-left text-sm font-medium">Gasto Total</th>
              <th className="p-2 text-left text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="p-2">{vehicle.name}</td>
                <td className="p-2">{vehicle.plate}</td>
                <td className="p-2">{getLastFueling(vehicle.id)}</td>
                <td className="p-2">{getAverageLiters(vehicle.id)}</td>
                <td className="p-2">{getTotalCost(vehicle.id)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(vehicle)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
