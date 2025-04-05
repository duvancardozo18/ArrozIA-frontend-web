import React, { useState } from "react";
import "../../../css/SoilAnalysis.css";
import TableSoilAnalysisAction from "./TableSoilAnalysisAction";
import CreateSoilAnalysisModal from "./CreateSoilAnalysisModal";
import SuccessModal from "../modal/SuccessModal";

const ColumSoilAnalysis = ({ selectedLand, soilAnalyses, refreshSoilAnalyses }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    refreshSoilAnalyses();
  };

  const handleSaveSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    refreshSoilAnalyses();
  };

  return (
    <div className="soil-analysis-column">
      {selectedLand ? (
        <div>
          <div className="header-container">
            <h2 className="header-title">Análisis Edafológicos para {selectedLand.nombre}</h2>
            <button className="button add-button" onClick={handleOpenCreateModal} type="button">
              <span className="button__text">Agregar</span>
              <span className="button__icon">
                <svg
                  className="svg"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </span>
            </button>
          </div>
          <div className="soil-analysis-table-container">
            <TableSoilAnalysisAction
              analyses={soilAnalyses.analyses || []}
              selectedLand={selectedLand}
              onRefresh={refreshSoilAnalyses}
              onShowSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      ) : (
        <p>Seleccione un lote para ver los análisis edafológicos.</p>
      )}

      {isCreateModalOpen && (
        <CreateSoilAnalysisModal
          show={isCreateModalOpen}
          closeModal={handleCloseCreateModal}
          selectedLand={selectedLand}
          onSave={() => handleSaveSuccess("¡Análisis edafológico creado exitosamente!")}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
      )}
    </div>
  );
};

export default ColumSoilAnalysis;
