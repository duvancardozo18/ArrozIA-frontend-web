// CropCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';
import SpaIcon from '@mui/icons-material/Spa';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 16px;
  cursor: pointer;
  border-radius: 12px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? '0 8px 16px rgba(0, 128, 0, 0.5), 0 12px 24px rgba(0, 128, 0, 0.3)'
      : '0px 2px 10px rgba(0, 0, 0, 0.1)'};
  border: ${({ isSelected }) => (isSelected ? '2px solid #008000' : '2px solid transparent')};
  width: 140px;
  height: 190px;
  flex-shrink: 0; /* Evitar que las tarjetas se encojan */

  &:hover {
    transform: ${({ isSelected }) => (isSelected ? 'scale(1.08)' : 'scale(1.03)')};
    background-color: #f5f5f5;
  }

  /* Ajustes responsivos */
  @media (max-width: 768px) {
    width: 160px;
    height: 200px;
  }

  @media (max-width: 480px) {
    width: 140px;
    height: 180px;
  }
`;

const IconContainer = styled.div`
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 120px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;

const CropCard = ({ cropName, isSelected, onClick }) => {
  return (
    <StyledCard onClick={onClick} isSelected={isSelected}>
      <IconContainer>
        <SpaIcon style={{ color: 'white', fontSize: 24 }} />
      </IconContainer>
      <CardContent>
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
            fontSize: '1em',
            textAlign: 'center',
            wordWrap: 'break-word',
          }}
        >
          {cropName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default CropCard;
