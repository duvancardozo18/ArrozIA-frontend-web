import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../config/AxiosInstance';
import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  text-align: left;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const StyledThead = styled.thead`
  background-color: #f4f4f4;
`;

const StyledTh = styled.th`
  padding: 12px;
  border-bottom: 2px solid #ddd;
`;

const StyledTbody = styled.tbody`
  background-color: #ffffff;
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid #ddd;

  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const StyledTd = styled.td`
  padding: 12px;
`;

const TablePermisos = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${user.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  if (!userData) {
    return <div>Cargando información del usuario...</div>;
  }

  return (
    <div>
      <h2>Gestión de Permisos</h2>
      <StyledTable>
        <StyledThead>
          <StyledTr>
            <StyledTh>Nombre</StyledTh>
            <StyledTh>Email</StyledTh>
            <StyledTh>Rol</StyledTh>
          </StyledTr>
        </StyledThead>
        <StyledTbody>
          <StyledTr>
            <StyledTd>{userData.nombre}</StyledTd>
            <StyledTd>{userData.email}</StyledTd>
            <StyledTd>
              {userData.roles.map((rol) => (
                <span key={rol.id}>{rol.nombre}</span>
              ))}
            </StyledTd>
          </StyledTr>
        </StyledTbody>
      </StyledTable>
    </div>
  );
};

export default TablePermisos;
