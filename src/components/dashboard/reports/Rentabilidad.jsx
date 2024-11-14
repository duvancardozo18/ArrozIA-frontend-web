import React from 'react';
import '../../../css/ReportSummary.scss';
import CultivoInsumosTable from '../../dashboard/reports/CropInputsTable';
import CulturalWorkTable from '../../dashboard/reports/CulturalWorkTable';


const ReportSummary = () => {
  return (
    <div className=''>
    <div className="report-summary">
      <div className="dates">
        <div className="date-item">
          <span className="icon">🌱</span>
          <div>
            <h3>Fecha de siembra</h3>
            <p>20 de febrero 2024</p>
          </div>
        </div>
        <div className="date-item">
          <span className="icon">🌾</span>
          <div>
            <h3>Fecha de Cosecha</h3>
            <p>19 de junio 2024</p>
          </div>
        </div>
      </div>

      <div className="production">
        <h3>Producción</h3>
        <p>75 toneladas</p>
        <h3>Ingresos</h3>
        <p>$124.200.000</p>
      </div>

      <div className="utility">
        <h3>Utilidad</h3>
        <p>$</p>
      </div>

      <div className="total-costs">
        <h3>Costos totales</h3>
        <table>
          <tbody>
            <tr>
              <td>Arriendo</td>
              <td>$14.000.000</td>
            </tr>
            <tr>
              <td>Preparación del Terreno</td>
              <td>$5.700.000</td>
            </tr>
            <tr>
              <td>Instalación de Riego</td>
              <td>$5.600.000</td>
            </tr>
            <tr>
              <td>Servicio de agua</td>
              <td>$9.000.000</td>
            </tr>
            <tr>
              <td>Insumos</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Labores Culturales</td>
              <td>$17.775.000</td>
            </tr>
            <tr>
              <td>Cuota de Fomento</td>
              <td>$1.240.000</td>
            </tr>
            <tr className="total-row">
              <td>VALOR TOTAL</td>
              <td>$153.315.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <CultivoInsumosTable />
     <CulturalWorkTable />
    </div>
  );
};

export default ReportSummary;
