import React, { useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDataContext } from '../context/DataContext.jsx';

const Dashboard = () => {
  const { vehicles, drivers, fuelings } = useDataContext();

  const totalVehicles = vehicles.length;
  const totalDrivers = drivers.length;
  const totalFuelings = fuelings.length;

  const { totalCost, totalLiters, averageCostPerLiter } = useMemo(() => {
    const accumulated = fuelings.reduce(
      (acc, fueling) => {
        acc.totalCost += Number(fueling.cost) || 0;
        acc.totalLiters += Number(fueling.liters) || 0;
        return acc;
      },
      { totalCost: 0, totalLiters: 0 },
    );

    return {
      totalCost: accumulated.totalCost,
      totalLiters: accumulated.totalLiters,
      averageCostPerLiter:
        accumulated.totalLiters > 0
          ? accumulated.totalCost / accumulated.totalLiters
          : 0,
    };
  }, [fuelings]);

  const consumptionByVehicle = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const vehicleFuelings = fuelings.filter((fueling) => fueling.vehicleId === vehicle.id);
        return {
          name: vehicle.name,
          liters: vehicleFuelings.reduce((sum, fueling) => sum + Number(fueling.liters || 0), 0),
          cost: vehicleFuelings.reduce((sum, fueling) => sum + Number(fueling.cost || 0), 0),
        };
      }),
    [vehicles, fuelings],
  );

  const latestFuelings = useMemo(
    () =>
      [...fuelings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [fuelings],
  );

  const summaryByDriver = useMemo(() => {
    return drivers
      .map((driver) => {
        const driverFuelings = fuelings.filter((fueling) => fueling.driverId === driver.id);
        const driverLiters = driverFuelings.reduce(
          (sum, fueling) => sum + Number(fueling.liters || 0),
          0,
        );
        const driverCost = driverFuelings.reduce(
          (sum, fueling) => sum + Number(fueling.cost || 0),
          0,
        );
        return {
          id: driver.id,
          name: driver.name,
          totalLiters: driverLiters,
          totalCost: driverCost,
        };
      })
      .filter((driver) => driver.totalLiters > 0)
      .sort((a, b) => b.totalCost - a.totalCost);
  }, [drivers, fuelings]);

  const getVehicleName = useCallback(
    (id) => vehicles.find((vehicle) => vehicle.id === id)?.name || '',
    [vehicles],
  );
  const getDriverName = useCallback(
    (id) => drivers.find((driver) => driver.id === id)?.name || '',
    [drivers],
  );

  const exportToCsv = useCallback(() => {
    if (!fuelings.length) {
      return;
    }

    const headers = ['Data', 'Veículo', 'Motorista', 'Litros', 'Custo'];
    const rows = fuelings
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((fueling) => [
        fueling.date,
        getVehicleName(fueling.vehicleId),
        getDriverName(fueling.driverId),
        Number(fueling.liters).toFixed(2).replace('.', ','),
        Number(fueling.cost).toFixed(2).replace('.', ','),
      ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(';'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'abastecimentos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [fuelings, getVehicleName, getDriverName]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          type="button"
          onClick={exportToCsv}
          className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={!fuelings.length}
        >
          Exportar abastecimentos (CSV)
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Litros Totais</div>
          <div className="text-2xl font-semibold">{totalLiters.toFixed(2)} L</div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="text-gray-500 text-sm">Custo Médio por Litro</div>
          <div className="text-2xl font-semibold">
            R$ {averageCostPerLiter.toFixed(2)}
          </div>
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
                <Tooltip formatter={(value) => `${value.toFixed(2)} L`} />
                <Bar dataKey="liters" fill="#2563eb" />
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
              {latestFuelings.map((fueling) => (
                <tr key={fueling.id}>
                  <td className="p-2">{fueling.date}</td>
                  <td className="p-2">{getVehicleName(fueling.vehicleId)}</td>
                  <td className="p-2">{getDriverName(fueling.driverId)}</td>
                  <td className="p-2">{Number(fueling.liters).toFixed(2)} L</td>
                  <td className="p-2">R$ {Number(fueling.cost).toFixed(2)}</td>
                </tr>
              ))}
              {!latestFuelings.length && (
                <tr>
                  <td className="p-2 text-center text-sm text-gray-500" colSpan={5}>
                    Nenhum abastecimento registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Resumo por Motorista</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left text-sm font-medium">Motorista</th>
              <th className="p-2 text-left text-sm font-medium">Litros Totais</th>
              <th className="p-2 text-left text-sm font-medium">Gasto Total (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {summaryByDriver.map((driver) => (
              <tr key={driver.id}>
                <td className="p-2">{driver.name}</td>
                <td className="p-2">{driver.totalLiters.toFixed(2)} L</td>
                <td className="p-2">R$ {driver.totalCost.toFixed(2)}</td>
              </tr>
            ))}
            {!summaryByDriver.length && (
              <tr>
                <td className="p-2 text-center text-sm text-gray-500" colSpan={3}>
                  Sem dados suficientes para gerar o resumo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
