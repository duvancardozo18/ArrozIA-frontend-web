import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditModal from './EditUserModal';

// Mock del axiosInstance
jest.mock('../../../config/AxiosInstance', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

// Mock del modal de éxito
jest.mock('../modal/SuccessModal', () => {
  return function MockSuccessModal({ show, onClose, message }) {
    return show ? (
      <div data-testid="success-modal">
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    ) : null;
  };
});

const mockUser = {
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com',
  rol_id: 2,
  finca_id: 1,
};

const mockRoles = [
  { id: 1, nombre: 'Admin' },
  { id: 2, nombre: 'Usuario' },
];

const mockFincas = [
  { id: 1, nombre: 'Finca 1' },
  { id: 2, nombre: 'Finca 2' },
];

describe('EditModal', () => {
  const mockCloseModal = jest.fn();
  const mockOnSave = jest.fn();
  let axiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance = require('../../../config/AxiosInstance');
    
    // Configurar los mocks para que devuelvan promesas resueltas
    axiosInstance.get.mockImplementation((url) => {
      if (url === '/roles') {
        return Promise.resolve({ data: { roles: mockRoles } });
      }
      if (url === '/farms') {
        return Promise.resolve({ data: mockFincas });
      }
      return Promise.reject(new Error('URL no encontrada'));
    });
    
    axiosInstance.put.mockResolvedValue({ data: {} });
  });

  test('no se renderiza cuando show es false', () => {
    render(
      <EditModal
        show={false}
        closeModal={mockCloseModal}
        user={mockUser}
        onSave={mockOnSave}
      />
    );
    
    expect(screen.queryByText('Editar usuario')).not.toBeInTheDocument();
  });

  test('se renderiza correctamente cuando show es true', async () => {
    await act(async () => {
      render(
        <EditModal
          show={true}
          closeModal={mockCloseModal}
          user={mockUser}
          onSave={mockOnSave}
        />
      );
    });

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Editar usuario')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument();
  });

  test('cierra el modal al hacer clic en el botón cerrar', async () => {
    await act(async () => {
      render(
        <EditModal
          show={true}
          closeModal={mockCloseModal}
          user={mockUser}
          onSave={mockOnSave}
        />
      );
    });

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  test('actualiza los campos del formulario', async () => {
    await act(async () => {
      render(
        <EditModal
          show={true}
          closeModal={mockCloseModal}
          user={mockUser}
          onSave={mockOnSave}
        />
      );
    });

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    });

    const nombreInput = screen.getByDisplayValue('Juan');
    
    await act(async () => {
      fireEvent.change(nombreInput, { target: { value: 'Carlos' } });
    });
    
    expect(screen.getByDisplayValue('Carlos')).toBeInTheDocument();
  });

  test('envía el formulario correctamente', async () => {
    await act(async () => {
      render(
        <EditModal
          show={true}
          closeModal={mockCloseModal}
          user={mockUser}
          onSave={mockOnSave}
        />
      );
    });

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    });

    // Cambiar el nombre para que se detecte una actualización
    const nombreInput = screen.getByDisplayValue('Juan');
    await act(async () => {
      fireEvent.change(nombreInput, { target: { value: 'Carlos' } });
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Guardar Cambios');
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verificar que se llamaron las funciones esperadas
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(`/users/update/${mockUser.id}`, {
        nombre: 'Carlos',
        apellido: 'Pérez',
        email: 'juan@example.com'
      });
    });

    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalled();
  });

  test('maneja errores de carga de datos', async () => {
    // Configurar mock para que falle
    axiosInstance.get.mockRejectedValue(new Error('Error de red'));

    await act(async () => {
      render(
        <EditModal
          show={true}
          closeModal={mockCloseModal}
          user={mockUser}
          onSave={mockOnSave}
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error al cargar roles y fincas. Intente nuevamente.')).toBeInTheDocument();
    });
  });
});