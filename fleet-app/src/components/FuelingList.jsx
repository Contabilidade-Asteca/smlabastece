import React, { useEffect, useMemo, useState } from 'react';
import { useDataContext } from '../context/DataContext.jsx';

const FuelingList = () => {
  const {
    vehicles,
    drivers,
    fuelings,
    addFueling,
    updateFueling,
    deleteFueling,
  } = useDataContext();

  const vehicleOptions = useMemo(() => vehicles.map((vehicle) => ({ id: vehicle.id, name: vehicle.name })), [vehicles]);
  const driverOptions = useMemo(() => drivers.map((driver) => ({ id: driver.id, name: driver.name })), [drivers]);

  const [vehicleId, setVehicleId] = useState(vehicleOptions[0]?.id || '');
  const [driverId, setDriverId] = useState(driverOptions[0]?.id || '');
  const [date, setDate] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicleOptions.find((option) => option.id === vehicleId)) {
      setVehicleId(vehicleOptions[0]?.id || '');
    }
  }, [vehicleOptions, vehicleId]);

  useEffect(() => {
    if (!driverOptions.find((option) => option.id === driverId)) {
      setDriverId(driverOptions[0]?.id || '');
    }
  }, [driverOptions, driverId]);

  const resetForm = () => {
    setVehicleId(vehicleOptions[0]?.id || '');
    setDriverId(driverOptions[0]?.id || '');
    setDate('');
    setLiters('');
    setCost('');
    setEditingId(null);
  };

  const formDisabled = !vehicleOptions.length || !driverOptions.length;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (formDisabled) {
      setError('Cadastre ao menos um veículo e um motorista antes de registrar abastecimentos.');
      return;
    }

    if (!vehicleId || !driverId || !date || !liters || !cost) {
      setError('Preencha todos os campos do formulário.');
      return;
    }

    const payload = {
      vehicleId,
      driverId,
      date,
      liters: parseFloat(liters),
      cost: parseFloat(cost),
    };

    if (Number.isNaN(payload.liters) || Number.isNaN(payload.cost)) {
      setError('Informe valores válidos para litros e custo.');
      return;
    }

    if (editingId) {
      updateFueling(editingId, payload);
      setMessage('Abastecimento atualizado com sucesso.');
    } else {
      addFueling(payload);
      setMessage('Abastecimento cadastrado com sucesso.');
    }

    resetForm();
  };

  const handleEdit = (fueling) => {
    setVehicleId(fueling.vehicleId);
    setDriverId(fueling.driverId);
    setDate(fueling.date);
    setLiters(String(fueling.liters));
    setCost(String(fueling.cost));
    setEditingId(fueling.id);
    setError(null);
    setMessage(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja remover este abastecimento?')) {
      deleteFueling(id);
      setMessage('Abastecimento removido.');
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const getVehicleName = (id) => vehicles.find((vehicle) => vehicle.id === id)?.name || '';
  const getDriverName = (id) => drivers.find((driver) => driver.id === id)?.name || '';

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Abastecimentos</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-2 items-end"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Veículo</label>
          <select
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            className="border rounded px-2 py-1 w-full"
            disabled={formDisabled}
          >
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
            {!vehicleOptions.length && <option value="">Cadastre um veículo</option>}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Motorista</label>
          <select
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            className="border rounded px-2 py-1 w-full"
            disabled={formDisabled}
          >
            {driverOptions.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
            {!driverOptions.length && <option value="">Cadastre um motorista</option>}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="border rounded px-2 py-1 w-full"
            disabled={formDisabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Litros</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={liters}
            onChange={(event) => setLiters(event.target.value)}
            className="border rounded px-2 py-1 w-full"
            disabled={formDisabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Custo (R$)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="border rounded px-2 py-1 w-full"
            disabled={formDisabled}
          />
        </div>
        <div className="flex gap-2 md:col-span-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={formDisabled}
          >
            {editingId ? 'Salvar alterações' : 'Adicionar Abastecimento'}
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
              <th className="p-2 text-left text-sm font-medium">Veículo</th>
              <th className="p-2 text-left text-sm font-medium">Motorista</th>
              <th className="p-2 text-left text-sm font-medium">Data</th>
              <th className="p-2 text-left text-sm font-medium">Litros</th>
              <th className="p-2 text-left text-sm font-medium">Custo</th>
              <th className="p-2 text-left text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...fuelings]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((fueling) => (
                <tr key={fueling.id}>
                  <td className="p-2">{getVehicleName(fueling.vehicleId)}</td>
                  <td className="p-2">{getDriverName(fueling.driverId)}</td>
                  <td className="p-2">{fueling.date}</td>
                  <td className="p-2">{Number(fueling.liters).toFixed(2)} L</td>
                  <td className="p-2">R$ {Number(fueling.cost).toFixed(2)}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(fueling)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(fueling.id)}
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

export default FuelingList;
