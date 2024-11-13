// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import grassIcon from "../../../assets/icons/grass.svg";
// import psychiatryIcon from "../../../assets/icons/psychiatry.svg";
// import pottedIcon from "../../../assets/icons/potted.svg";
// import agricultureIcon from "../../../assets/icons/agriculture.svg";
// import compostIcon from "../../../assets/icons/compost.svg";

// const ProgressContainer = styled.div`
//   background-color: #9e9998;
//   border-radius: 25px;
//   display: flex;
//   width: 100%;
//   margin: 50px 0 20px 0; /* Añade un margen superior para separar del encabezado */
//   position: relative;
// `;

// const GeneralProgressBar = styled.div`
//   background-color: #28a745;
//   height: 60px;
//   width: ${(props) => props.progress}%;
//   transition: width 0.3s ease;
//   border-radius: 25px 0 0 25px;
// `;

// const StageSection = styled.div`
//   flex: ${(props) => props.percentage};
//   text-align: center;
//   color: white;
//   font-size: 12px;
//   padding: 5px;
//   font-weight: bold;
//   border-right: 1px solid #e0e0e0;
//   position: relative;

//   &:last-child {
//     border-right: none;
//   }
// `;

// const Indicator = styled.div`
//   position: absolute;
//   top: -35px;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 25px;
//   height: 25px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const StageLabel = styled.div`
//   font-weight: bold;
//   margin-bottom: 5px;
//   color: #fff;
// `;

// const DateLabel = styled.div`
//   font-size: 10px;
//   color: #fff;
// `;

// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Ajusta el tamaño de las columnas */
//   gap: 20px; /* Espacio entre las tarjetas */
//   margin-top: 20px;
// `;

// const CardContainer = styled.div`
//   background: #aba6a6;
//   border-radius: 10px;
//   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const ActionButton = styled.button`
//   background-color: #28a745; /* Cambia el color para el botón de asignar tarea */
//   color: white;
//   padding: 8px 15px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   margin-top: 10px;

//   &:hover {
//     opacity: 0.9;
//   }
// `;

// const calculateProgressPercentage = (startDate, endDate, totalDuration) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const stageDuration = end - start;
//   return (stageDuration / totalDuration) * 100;
// };

// const VegetativeCard = ({ stages, onEditStage }) => {
//   const [generalProgress, setGeneralProgress] = useState(0);

//   useEffect(() => {
//     if (stages.length > 0) {
//       const startDate = new Date(stages[0].startDate);
//       const endDate = new Date(stages[stages.length - 1].endDate);
//       const now = new Date();

//       const totalDuration = endDate - startDate;
//       const elapsedDuration = now - startDate;
//       const progress = (elapsedDuration / totalDuration) * 100;

//       setGeneralProgress(progress > 100 ? 100 : progress < 0 ? 0 : progress);
//     }
//   }, [stages]);

//   const totalDuration = stages.reduce((total, stage) => {
//     const startDate = new Date(stage.startDate);
//     const endDate = new Date(stage.endDate);
//     return total + (endDate - startDate);
//   }, 0);

//   const icons = [grassIcon, psychiatryIcon, pottedIcon, agricultureIcon, compostIcon];

//   return (
//     <>
//       <ProgressContainer>
//         <GeneralProgressBar progress={generalProgress} />
//         {stages.map((stage, index) => {
//           const percentage = calculateProgressPercentage(
//             stage.startDate,
//             stage.endDate,
//             totalDuration
//           );

//           return (
//             <StageSection key={index} percentage={percentage}>
//               <Indicator>
//                 <img src={icons[index % icons.length]} alt={`Icono de ${stage.stage}`} style={{ width: '30px', height: '30px' }} />
//               </Indicator>
//               <StageLabel>{stage.stage}</StageLabel>
//               <DateLabel>
//                 {stage.startDate} - {stage.endDate}
//               </DateLabel>
//             </StageSection>
//           );
//         })}
//       </ProgressContainer>

//       <GridContainer>
//         {stages.map((stage, index) => (
//           <CardContainer key={index}>
//             <StageLabel>{stage.stage}</StageLabel>
//             <DateLabel>Inicio: {stage.startDate}</DateLabel>
//             <DateLabel>Fin: {stage.endDate}</DateLabel>
//             <DateLabel>Labores Culturales: {stage.labores || 'No asignadas'}</DateLabel>
//             {/* Botón para asignar tarea */}
//             <ActionButton onClick={() => alert(`Asignar tarea a la etapa ${stage.stage}`)}>
//               Asignar Tarea
//             </ActionButton>
//           </CardContainer>
//         ))}
//       </GridContainer>
//     </>
//   );
// };

// export default VegetativeCard;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import grassIcon from "../../../assets/icons/grass.svg";
import psychiatryIcon from "../../../assets/icons/psychiatry.svg";
import pottedIcon from "../../../assets/icons/potted.svg";
import agricultureIcon from "../../../assets/icons/agriculture.svg";
import compostIcon from "../../../assets/icons/compost.svg";
import AssignTaskModal from './AssingTaskModal'; // Asegúrate de importar el modal de asignación de tareas

const ProgressContainer = styled.div`
  background-color: #9e9998;
  border-radius: 25px;
  display: flex;
  width: 100%;
  margin: 50px 0 20px 0;
  position: relative;
`;

const GeneralProgressBar = styled.div`
  background-color: #28a745;
  height: 60px;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 25px 0 0 25px;
`;

const StageSection = styled.div`
  flex: ${(props) => props.percentage};
  text-align: center;
  color: white;
  font-size: 12px;
  padding: 5px;
  font-weight: bold;
  border-right: 1px solid #e0e0e0;
  position: relative;

  &:last-child {
    border-right: none;
  }
`;

const Indicator = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StageLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
`;

const DateLabel = styled.div`
  font-size: 10px;
  color: #fff;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CardContainer = styled.div`
  background: #aba6a6;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionButton = styled.button`
  background-color: #14B814;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const calculateProgressPercentage = (startDate, endDate, totalDuration) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const stageDuration = end - start;
  return (stageDuration / totalDuration) * 100;
};

const VegetativeCard = ({ stages, onEditStage }) => {
  const [generalProgress, setGeneralProgress] = useState(0);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    if (stages.length > 0) {
      const startDate = new Date(stages[0].startDate);
      const endDate = new Date(stages[stages.length - 1].endDate);
      const now = new Date();

      const totalDuration = endDate - startDate;
      const elapsedDuration = now - startDate;
      const progress = (elapsedDuration / totalDuration) * 100;

      setGeneralProgress(progress > 100 ? 100 : progress < 0 ? 0 : progress);
    }
  }, [stages]);

  const totalDuration = stages.reduce((total, stage) => {
    const startDate = new Date(stage.startDate);
    const endDate = new Date(stage.endDate);
    return total + (endDate - startDate);
  }, 0);

  const icons = [grassIcon, psychiatryIcon, pottedIcon, agricultureIcon, compostIcon];

  const handleOpenAssignTaskModal = (stage) => {
    setSelectedStage(stage);
    setShowAssignTaskModal(true);
  };

  const handleCloseAssignTaskModal = () => {
    setShowAssignTaskModal(false);
    setSelectedStage(null);
  };

  return (
    <>
      <ProgressContainer>
        <GeneralProgressBar progress={generalProgress} />
        {stages.map((stage, index) => {
          const percentage = calculateProgressPercentage(
            stage.startDate,
            stage.endDate,
            totalDuration
          );

          return (
            <StageSection key={index} percentage={percentage}>
              <Indicator>
                <img src={icons[index % icons.length]} alt={`Icono de ${stage.stage}`} style={{ width: '30px', height: '30px' }} />
              </Indicator>
              <StageLabel>{stage.stage}</StageLabel>
              <DateLabel>
                {stage.startDate} - {stage.endDate}
              </DateLabel>
            </StageSection>
          );
        })}
      </ProgressContainer>

      <GridContainer>
        {stages.map((stage, index) => (
          <CardContainer key={index}>
            <StageLabel>{stage.stage}</StageLabel>
            <DateLabel>Inicio: {stage.startDate}</DateLabel>
            <DateLabel>Fin: {stage.endDate}</DateLabel>
            <DateLabel>Labores Culturales: {stage.labores || 'No asignadas'}</DateLabel>
            {/* Botón para asignar tarea */}
            <ActionButton onClick={() => handleOpenAssignTaskModal(stage)}>
              Asignar Tarea
            </ActionButton>
          </CardContainer>
        ))}
      </GridContainer>

      {/* Modal para asignar tarea */}
      {showAssignTaskModal && (
        <AssignTaskModal 
          show={showAssignTaskModal} 
          closeModal={handleCloseAssignTaskModal} 
          onSave={(taskData) => {
            console.log("Datos de tarea asignada:", taskData);
            // Aquí puedes actualizar el estado o realizar acciones adicionales
            handleCloseAssignTaskModal();
          }}
          cropId={selectedStage?.id} // Aquí puedes pasar el ID del cultivo o etapa si es necesario
        />
      )}
    </>
  );
};

export default VegetativeCard;

