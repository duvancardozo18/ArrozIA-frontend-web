import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import '../../../css/Rentabilidad.scss';

const Rentabilidad = ({ selectedCropId, onExport }) => {
  const [machineryCosts, setMachineryCosts] = useState([]);
  const [laborCosts, setLaborCosts] = useState([]);
  const [inputCosts, setInputCosts] = useState([]);
  const [additionalCosts, setAdditionalCosts] = useState(0);
  const [financialExpenses, setFinancialExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener costos de maquinaria reales
    const fetchMachineryCosts = async () => {
      try {
        const response = await axiosInstance.get(`/financial/machinery-costs`);
        setMachineryCosts(response.data);
      } catch (error) {
        console.error('Error fetching machinery costs:', error);
      }
    };

    // Obtener costos de labores culturales reales
    const fetchLaborCosts = async () => {
      try {
        const response = await axiosInstance.get(`/financial/real-labor-costs`);
        setLaborCosts(response.data);
      } catch (error) {
        console.error('Error fetching labor costs:', error);
      }
    };

    // Obtener costos de insumos agrícolas reales
    const fetchInputCosts = async () => {
      try {
        const response = await axiosInstance.get(`/financial/agricultural-input-costs`);
        setInputCosts(response.data);
      } catch (error) {
        console.error('Error fetching input costs:', error);
      }
    };

    // Obtener costos adicionales reales
    const fetchAdditionalCosts = async () => {
      try {
        const response = await axiosInstance.get(`/financial/additional-costs`);
        setAdditionalCosts(response.data.total_additional_costs || 0);
      } catch (error) {
        console.error('Error fetching additional costs:', error);
      }
    };

    // Obtener gastos financieros reales
    const fetchFinancialExpenses = async () => {
      try {
        const response = await axiosInstance.get(`/financial/financial-expenses`);
        setFinancialExpenses(response.data.total_financial_expenses || 0);
      } catch (error) {
        console.error('Error fetching financial expenses:', error);
      }
    };

    fetchMachineryCosts();
    fetchLaborCosts();
    fetchInputCosts();
    fetchAdditionalCosts();
    fetchFinancialExpenses();
    setLoading(false);
  }, [selectedCropId]);

  // Calcular valores totales
  const totalMachineryCosts = machineryCosts.reduce((sum, item) => sum + item.costo_total, 0);
  const totalLaborCosts = laborCosts.reduce((sum, item) => sum + item.costo_total, 0);
  const totalInputCosts = inputCosts.reduce((sum, item) => sum + item.costo_total, 0);
  const totalExpenses = totalMachineryCosts + totalLaborCosts + totalInputCosts + additionalCosts + financialExpenses;
  const totalIncome = 0; // Asigna un valor o agrega una lógica si tienes datos de ingresos
  const utility = totalIncome - totalExpenses;

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rentabilidad-container">
      <button onClick={onExport} className="export-button">Exportar</button>

      <div className="general-info-card">
        <h4>Información General</h4>

        <div className="expenses-section">
          <h5>Egresos</h5>
          <table className="expense-table">
            <thead>
              <tr className="table-header">
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Valor</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {[...inputCosts, ...machineryCosts, ...laborCosts].map((expense, index) => (
                <tr key={index} className="table-row">
                  <td>{expense.nombre}</td>
                  <td>{expense.total_horas || expense.total_cantidad} {expense.unit}</td>
                  <td>${expense.costo_total.toLocaleString()}</td>
                  <td><button onClick={() => alert(`Detalles de ${expense.nombre}`)}>Ver</button></td>
                </tr>
              ))}
              <tr className="table-row">
                <td>Costos adicionales</td>
                <td>-</td>
                <td>${additionalCosts.toLocaleString()}</td>
                <td>-</td>
              </tr>
              <tr className="table-row">
                <td>Gastos financieros</td>
                <td>-</td>
                <td>${financialExpenses.toLocaleString()}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
          <p className="total-value">Valor total: ${totalExpenses.toLocaleString()}</p>
        </div>

        <div className="income-section">
          <h5>Ingresos</h5>
          <table className="income-table">
            <thead>
              <tr className="table-header">
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {/* Muestra los ingresos aquí si tienes datos */}
            </tbody>
          </table>
          <p className="utility-value">Utilidad: ${utility.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Rentabilidad;
