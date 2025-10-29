import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext.jsx';

const DriverList = () => {
  const { drivers, fuelings, addDriver, updateDriver, deleteDriver } = useDataContext();
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName('');
    setLicense('');
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !license.trim()) {
      setError('Informe o nome e a CNH do motorista.');
      return;
    }

    const payload = { name: name.trim(), license: license.trim() };

    if (editingId) {
      updateDriver(editingId, payload);
      setMessage('Motorista atualizado com sucesso.');
    } else {
      addDriver(payload);
      setMessage('Motorista cadastrado com sucesso.');
    }

    resetForm();
  };

  const handleEdit = (driver) => {
    setName(driver.name);
    setLicense(driver.license);
    setEditingId(driver.id);
    setMessage(null);
    setError(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja remover este motorista? Os abastecimentos associados serão excluídos.')) {
      deleteDriver(id);
      setMessage('Motorista removido.');
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const getLastFueling = (driverId) => {
    const last = fuelings
      .filter((fueling) => fueling.driverId === driverId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return last?.date || 'N/A';
  };

  const getAverageLiters = (driverId) => {
    const relevant = fuelings.filter((fueling) => fueling.driverId === driverId);
    if (!relevant.length) return 'N/A';
    const total = relevant.reduce((sum, fueling) => sum + Number(fueling.liters || 0), 0);
    return `${(total / relevant.length).toFixed(2)} L`;
  };

  const getTotalCost = (driverId) => {
    const relevant = fuelings.filter((fueling) => fueling.driverId === driverId);
    if (!relevant.length) return 'R$ 0,00';
    const total = relevant.reduce((sum, fueling) => sum + Number(fueling.cost || 0), 0);
    return `R$ ${total.toFixed(2)}`;
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Motoristas</h1>
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
            placeholder="Nome do motorista"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">CNH</label>
          <input
            type="text"
            value={license}
            onChange={(event) => setLicense(event.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Número da CNH"
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
              <th className="p-2 text-left text-sm font-medium">CNH</th>
              <th className="p-2 text-left text-sm font-medium">Último Abastecimento</th>
              <th className="p-2 text-left text-sm font-medium">Média de Litros</th>
              <th className="p-2 text-left text-sm font-medium">Gasto Total</th>
              <th className="p-2 text-left text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="p-2">{driver.name}</td>
                <td className="p-2">{driver.license}</td>
                <td className="p-2">{getLastFueling(driver.id)}</td>
                <td className="p-2">{getAverageLiters(driver.id)}</td>
                <td className="p-2">{getTotalCost(driver.id)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(driver)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(driver.id)}
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

export default DriverList;
