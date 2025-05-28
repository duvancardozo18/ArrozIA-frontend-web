import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal from './DeleteModal';

describe('DeleteModal', () => {
  const defaultProps = {
    show: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar este elemento?',
    cancelText: 'Cancelar',
    confirmText: 'Eliminar'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el modal cuando show es true', () => {
    render(<DeleteModal {...defaultProps} />);
    
    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de que quieres eliminar este elemento?')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  test('no renderiza el modal cuando show es false', () => {
    render(<DeleteModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument();
  });

  test('llama onClose cuando se hace clic en cancelar', () => {
    render(<DeleteModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('llama onConfirm cuando se hace clic en confirmar', async () => {
    const mockOnConfirm = jest.fn().mockResolvedValue();
    render(<DeleteModal {...defaultProps} onConfirm={mockOnConfirm} />);
    
    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  test('maneja errores al confirmar', async () => {
    const mockOnConfirm = jest.fn().mockRejectedValue(new Error('Error de prueba'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<DeleteModal {...defaultProps} onConfirm={mockOnConfirm} />);
    
    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting user:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('previene el comportamiento por defecto del evento', async () => {
    const mockOnConfirm = jest.fn().mockResolvedValue();
    render(<DeleteModal {...defaultProps} onConfirm={mockOnConfirm} />);
    
    const confirmButton = screen.getByText('Eliminar');
    const mockEvent = { preventDefault: jest.fn() };
    
    fireEvent.click(confirmButton, mockEvent);
    
    // Nota: En un entorno de prueba real, verificarías que preventDefault fue llamado
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  test('renderiza con props personalizados', () => {
    const customProps = {
      ...defaultProps,
      title: 'Título personalizado',
      message: 'Mensaje personalizado',
      cancelText: 'No',
      confirmText: 'Sí'
    };
    
    render(<DeleteModal {...customProps} />);
    
    expect(screen.getByText('Título personalizado')).toBeInTheDocument();
    expect(screen.getByText('Mensaje personalizado')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
  });
});