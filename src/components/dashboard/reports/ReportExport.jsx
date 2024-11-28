import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "../../../config/AxiosInstance"; // Importamos axiosInstance
import logoBase64 from "../../../assets/images/logoBase64"; // Importa el logo como Base64
import siembraBase64 from "../../../assets/images/siembraBase64"; // Icono de siembra en Base64
import cosechaBase64 from "../../../assets/images/cosechaBase64"; // Icono de cosecha en Base64

export const generatePDF = async (
  cropDetails,
  inputs,
  culturalWorks,
  totalInputCost,
  totalWorkValue,
  totalRent,
  machineryAndLaborCosts,
  agriculturalInputCosts,
  production,
  income,
  costDetails
) => {
  const doc = new jsPDF();

  // Obtener nombre de la variedad a través del endpoint /get-variety/{variety_id}
  let varietyName = cropDetails.varietyName; // Asumimos que varietyName está disponible en cropDetails
  if (!varietyName && cropDetails.varietyId) {
    try {
      const response = await axiosInstance.get(`/get-variety/${cropDetails.varietyId}`);
      varietyName = response.data.nombre || "Variedad desconocida"; // Si no encontramos el nombre, mostramos un mensaje predeterminado
    } catch (error) {
      console.error("Error al obtener el nombre de la variedad:", error);
      varietyName = "Variedad desconocida"; // Si hay un error, mostramos un mensaje predeterminado
    }
  }

  // Asegúrate de que los datos que usas para el PDF estén disponibles
  console.log('Generando PDF con los siguientes datos: ', {
    cropDetails,
    inputs,
    culturalWorks,
    totalInputCost,
    totalWorkValue,
    totalRent,
    machineryAndLaborCosts,
    agriculturalInputCosts,
    production,
    income,
    costDetails
  });

  // Agregar el logo y título
  doc.addImage(logoBase64, "PNG", 10, 10, 30, 30);
  doc.setFontSize(22);
  doc.setTextColor(34, 139, 34);
  doc.text("ARROZ IA", 50, 25);
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("REPORTE - FINANANCIERO", 80, 35);

  // Fecha de generación
  const currentDate = new Date().toLocaleString();
  doc.setFontSize(12);
  doc.text(`GENERADO: ${currentDate}`, 80, 45);

  // Datos generales del cultivo
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Cultivo: ${cropDetails.cropName}`, 10, 60);
  doc.text(`Variedad: ${varietyName}`, 10, 70); // Usamos el nombre de la variedad obtenido del endpoint
  doc.text(`Fecha de Siembra: ${cropDetails.plantingDate}`, 10, 80);
  doc.text(`Fecha de Cosecha Estimada: ${cropDetails.estimatedHarvestDate}`, 10, 90);
  doc.text(`Lote: ${cropDetails.plotId}`, 10, 100);
  

// Costos Totales
doc.setFontSize(16);
doc.text("Costos Totales", 10, 110); // Título de la tabla de Costos Totales
autoTable(doc, {
  startY: 120, // Espacio para la tabla de Costos Totales
  head: [['Concepto', 'Valor']], // Encabezados de la tabla
  body: [
    ['Total Insumos Agrícolas', `$${totalInputCost.toLocaleString()}`], // Muestra el total de insumos agrícolas
    ['Total Labores Culturales', `$${totalWorkValue.toLocaleString()}`], // Muestra el total de labores culturales
  ],
  theme: "grid", // Estilo de la tabla
  styles: { halign: "right" }, // Alineación de los datos
});

// Verificar si hay suficiente espacio en la página antes de agregar la siguiente tabla
let nextTableStartY = doc.autoTable.previous.finalY + 30; // Ajustamos el espacio antes de la siguiente tabla
if (nextTableStartY > doc.internal.pageSize.height - 40) {
  doc.addPage();  // Si la tabla no cabe, saltamos a la siguiente página
  nextTableStartY = 20; // Resetear la posición Y después del salto de página
}

// Tabla de Costos de Insumos
doc.setFontSize(16);
doc.text("Insumos utilizados", 10, nextTableStartY); // Título de la tabla de Costos de Insumos
autoTable(doc, {
  startY: nextTableStartY + 10, // Espacio entre el título y la tabla
  head: [['Insumo', 'Cantidad', 'Costo Unitario', 'Costo Total']],
  body: inputs.map((input) => [
    input.tipo_insumo?.nombre,   
    input.cantidad || 0,
    input.valor_unitario?.toLocaleString() || "0",
    input.valor_total?.toLocaleString() || "0",
  ]),
});

// Total de Costos de Insumos
doc.setFontSize(14);
doc.text(`Total Costos de Insumos: ${totalInputCost.toLocaleString()}`, 50, doc.autoTable.previous.finalY + 10);

// Verificar espacio para la siguiente tabla de Costos de Labores Culturales
nextTableStartY = doc.autoTable.previous.finalY + 30;
if (nextTableStartY > doc.internal.pageSize.height - 40) {
  doc.addPage();  // Si la tabla no cabe, saltamos a la siguiente página
  nextTableStartY = 20; // Resetear la posición Y después del salto de página
}

// Tabla de Costos de Labores Culturales
doc.setFontSize(16);
doc.text("Costos de Labores Culturales", 10, nextTableStartY); // Espacio ajustado entre el título y la tabla
autoTable(doc, {
  startY: nextTableStartY + 10, // Espacio entre el título y la tabla
  head: [['Actividad', 'Fecha de Inicio', 'Fecha de Culminación', 'Operario', 'Maquinaria']],
  body: culturalWorks.map((work) => [
    work.actividad,
    work.fecha_inicio,
    work.fecha_culminacion,
    work.operario,
    work.maquinaria,
  ]),
});

// Total de Costos de Labores Culturales
doc.setFontSize(14);
doc.text(`Total Costos de Labores Culturales: ${totalWorkValue.toLocaleString()}`, 10, doc.autoTable.previous.finalY + 10);

  // Guardar el documento PDF
  doc.save(`reporte_financiero_${cropDetails.cropName}.pdf`);
};



export const generateXLS = (cropDetails, inputs = [], culturalWorks = [], totalInputCost = 0, totalWorkValue = 0) => {
  const workbook = XLSX.utils.book_new();

  // General Information
  const generalSheet = XLSX.utils.json_to_sheet([
    { Campo: "Cultivo", Valor: cropDetails.cropName || "No disponible" },
    { Campo: "Finca", Valor: cropDetails.farm?.cropName || "No disponible" },
    { Campo: "Lote", Valor: cropDetails.plotId || "No disponible" },
    { Campo: "Área Cultivada", Valor: `${cropDetails.cultivatedArea || "No disponible"} ${cropDetails.areaUnit || ""}` },
    { Campo: "Fecha de Siembra", Valor: cropDetails.plantingDate ? new Date(cropDetails.plantingDate).toLocaleDateString() : "No disponible" },
    { Campo: "Fecha de Cosecha", Valor: cropDetails.estimatedHarvestDate ? new Date(cropDetails.estimatedHarvestDate).toLocaleDateString() : "No disponible" },
  ]);
  XLSX.utils.book_append_sheet(workbook, generalSheet, "Información General");

  // Inputs Sheet
  const inputsSheet = XLSX.utils.json_to_sheet(
    inputs.map((input) => ({
      Concepto: input.concepto || "No disponible",
      "Valor Unitario": input.valor_unitario || 0,
      Cantidad: input.cantidad || 0,
      Descripción: input.descripcion || "No disponible",
      "Valor Total": input.valor_total || 0,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, inputsSheet, "Insumos");

  // Cultural Works Sheet
  const worksSheet = XLSX.utils.json_to_sheet(
    culturalWorks.map((work) => ({
      "Fecha Inicio": work.fecha_inicio ? new Date(work.fecha_inicio).toLocaleDateString() : "No disponible",
      "Fecha Fin": work.fecha_culminacion ? new Date(work.fecha_culminacion).toLocaleDateString() : "No disponible",
      Actividad: work.actividad || "No disponible",
      Maquinaria: work.maquinaria || "No aplica",
      Operario: work.operario || "No disponible",
      Descripción: work.descripcion || "No disponible",
      Valor: work.valor || 0,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, worksSheet, "Labores Culturales");

  // Save XLSX
  XLSX.writeFile(workbook, `Reporte_Financiero_${cropDetails.cropName || "No disponible"}.xlsx`);
};
