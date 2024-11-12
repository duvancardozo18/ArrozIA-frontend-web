// CropCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';
import SpaIcon from '@mui/icons-material/Spa';

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 8px;
  cursor: pointer;
  border-radius: 12px;
  background-color: #ffffff;
  transition: all 0.3s ease;

  /* Aplica una sombra 3D envolvente si el card está seleccionado */
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? '0px 4px 8px rgba(0, 128, 0, 0.2), 0px 8px 16px rgba(0, 128, 0, 0.2), 0px 12px 24px rgba(0, 128, 0, 0.15)'
      : '0px 2px 10px rgba(0, 0, 0, 0.1)'};
  transform: ${({ isSelected }) => (isSelected ? 'scale(1.05)' : 'scale(1)')};

  &:hover {
    transform: ${({ isSelected }) => (isSelected ? 'scale(1.08)' : 'scale(1.03)')};
  }
`;

const IconContainer = styled.div`
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const CropCard = ({ cropName, isSelected, onClick }) => {
  return (
    <StyledCard onClick={onClick} isSelected={isSelected}>
      <IconContainer>
        <SpaIcon style={{ color: 'white', fontSize: 24 }} />
      </IconContainer>
      <CardContent>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          {cropName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default CropCard;
