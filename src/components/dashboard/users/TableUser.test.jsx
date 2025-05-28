import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AreaTable from './TableUser';
import axiosInstance from '../../../config/AxiosInstance';

// Mocks
jest.mock('./TableUserAction', () => () => <div>Acciones</div>);
jest.mock('../../../config/AxiosInstance');
jest.mock('../../../css/AreaTable.css', () => ({}));

const mockAxios = axiosInstance;

describe('AreaTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra loading inicialmente', () => {
    mockAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<AreaTable refresh={false} />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('muestra encabezados de la tabla', async () => {
    mockAxios.get.mockResolvedValue({ data: [] });
    
    render(<AreaTable refresh={false} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Apellido')).toBeInTheDocument();
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Fincas')).toBeInTheDocument();
    expect(screen.getByText('Rol')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  test('muestra datos del usuario', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com'
    };

    mockAxios.get
      .mockResolvedValueOnce({ data: [mockUser] }) // users
      .mockResolvedValueOnce({ data: [{ nombre: 'Mi Finca' }] }) // farms
      .mockResolvedValueOnce({ data: { nombre: 'Admin' } }); // role

    render(<AreaTable refresh={false} />);

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@test.com')).toBeInTheDocument();
      expect(screen.getByText('Mi Finca')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  test('muestra "Sin finca" cuando no hay fincas', async () => {
    const mockUser = { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' };

    mockAxios.get
      .mockResolvedValueOnce({ data: [mockUser] })
      .mockResolvedValueOnce({ data: [] }) // sin fincas
      .mockResolvedValueOnce({ data: { nombre: 'Admin' } });

    render(<AreaTable refresh={false} />);

    await waitFor(() => {
      expect(screen.getByText('Sin finca')).toBeInTheDocument();
    });
  });

  test('muestra "Sin rol" cuando no hay rol', async () => {
    const mockUser = { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' };

    mockAxios.get
      .mockResolvedValueOnce({ data: [mockUser] })
      .mockResolvedValueOnce({ data: [{ nombre: 'Mi Finca' }] })
      .mockResolvedValueOnce({ data: null }); // sin rol

    render(<AreaTable refresh={false} />);

    await waitFor(() => {
      expect(screen.getByText('Sin rol')).toBeInTheDocument();
    });
  });

  test('maneja errores sin romper', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAxios.get.mockRejectedValue(new Error('Error de red'));

    render(<AreaTable refresh={false} />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});