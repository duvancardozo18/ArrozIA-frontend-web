import React from 'react';
import Button from '@mui/material/Button';

const MyButton = () => {
  const handleClick = () => {
    alert('¡Botón presionado!');
  };

  return (
    <Button sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        color="secondary" // Cambia 'secondary' por el color que prefieras
        onClick={handleClick}
        sx={{ backgroundColor: '#14B814' }} // Cambia el color hexadecimal por el que desees
      >
        Crear Usuario
      </Button>
    </Button>
  );
};

export default MyButton;
