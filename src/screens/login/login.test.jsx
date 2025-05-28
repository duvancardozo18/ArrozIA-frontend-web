import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../config/AuthProvider';
import Login from './Login';
import axiosInstance from '../../config/AxiosInstance';

// Mock the necessary dependencies
jest.mock('../../config/AxiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock images to avoid issues with Jest
jest.mock('../../assets/images/logo.png', () => 'logo-mock');
jest.mock('../../assets/images/background.webp', () => 'background-mock');

const renderLoginWithContext = (contextValue = { login: jest.fn() }) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    renderLoginWithContext();
    
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    expect(screen.getByText('Arroz IA')).toBeInTheDocument();
  });

  test('updates email and password inputs correctly', () => {
    renderLoginWithContext();
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('displays error message when login fails', async () => {
    renderLoginWithContext();
    
    axiosInstance.post.mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Invalid credentials' }
      }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { 
      target: { value: 'wrong@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { 
      target: { value: 'wrongpassword' } 
    });
    
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    
    await waitFor(() => {
      expect(screen.getByText('Correo o contraseña incorrectos')).toBeInTheDocument();
    });
  });

  test('handles successful login correctly', async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();
    
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    
    renderLoginWithContext({ login: mockLogin });
    
    axiosInstance.post.mockResolvedValue({
      data: {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        user_name: 'Test User'
      }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test-access-token');
      expect(mockNavigate).toHaveBeenCalledWith('/task');
      expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
      expect(localStorage.getItem('userName')).toBe('Test User');
    });
  });
  
  test('redirects to change password page when required', async () => {
    const mockNavigate = jest.fn();
    
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    
    renderLoginWithContext();
    
    axiosInstance.post.mockRejectedValue({
      response: {
        status: 403,
        data: {
          change_password_required: true,
          access_token: 'temp-access-token',
          refresh_token: 'temp-refresh-token'
        }
      }
    });
    
    fireEvent.click(screen.getByText('Iniciar Sesión'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/change-password-first', {
        state: { 
          accessToken: 'temp-access-token', 
          refreshToken: 'temp-refresh-token' 
        }
      });
    });
  });
  
  test('navigates to reset password page', () => {
    const mockNavigate = jest.fn();
    
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    
    renderLoginWithContext();
    
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
  });
});