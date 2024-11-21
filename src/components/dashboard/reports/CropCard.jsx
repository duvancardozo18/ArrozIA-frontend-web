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
  transform: ${({ isSelected }) => (isSelected ? 'translateZ(15px) scale(1.05)' : 'scale(1)')};
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? '0 8px 16px rgba(0, 128, 0, 0.5), 0 12px 24px rgba(0, 128, 0, 0.3)'
      : '0px 2px 10px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: ${({ isSelected }) => (isSelected ? 'translateZ(20px) scale(1.08)' : 'scale(1.03)')};
    box-shadow: 0 8px 16px rgba(0, 128, 0, 0.4), 0 12px 24px rgba(0, 128, 0, 0.3);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px;
    align-items: flex-start;
    text-align: left;
  }

  @media (max-width: 480px) {
    padding: 10px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transform: ${({ isSelected }) => (isSelected ? 'scale(1.02)' : 'scale(1)')};
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

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    margin: 0 auto 10px;
  }
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
