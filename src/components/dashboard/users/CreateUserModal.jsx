import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../../config/AxiosInstance";
import SuccessModal from "../modal/SuccessModal";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar iconos de ojito

// Estilos del modal y formulario
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ff6b6b;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const SmallErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
  font-weight: bold;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 16px;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:focus {
      box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
      transform: translateY(-3px);
      outline: none;
    }
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* Espacio para el ícono */
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:focus {
    box-shadow: 0px 0px 8px 2px rgba(39, 174, 96, 0.3);
    transform: translateY(-3px);
    outline: none;
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
  color: #333;
`;

const FormGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Column = styled.div`
  flex: 1;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #218838;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const NewUser = ({ closeModal, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol_id: "",
    finca_id: "",
  });

  const [roles, setRoles] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailInUse, setIsEmailInUse] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [charLimitReached, setCharLimitReached] = useState({
    nombre: false,
    apellido: false,
    email: false,
  });

  useEffect(() => {
    const fetchRolesAndFincas = async () => {
      try {
        const rolesResponse = await axiosInstance.get("/roles");
        setRoles(rolesResponse.data.roles || []);

        const fincasResponse = await axiosInstance.get("/farms");
        setFincas(fincasResponse.data || []);
      } catch (error) {
        console.error("Error fetching roles and fincas:", error);
        setErrorMessage("Error al cargar roles y fincas. Intente nuevamente.");
      }
    };

    fetchRolesAndFincas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length <= 50) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    // Mostrar el mensaje si se llega al límite de caracteres
    setCharLimitReached((prevState) => ({
      ...prevState,
      [name]: value.length === 50,
    }));

    if (name === "email") {
      setIsEmailInUse(false);
    }

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const numberPattern = /\d.*\d/;
    if (password.length >= minLength && numberPattern.test(password)) {
      setPasswordError("");
    } else {
      setPasswordError("La contraseña debe tener al menos 6 caracteres y 2 números.");
    }
  };

  const checkIfEmailExists = async (email) => {
    try {
      const response = await axiosInstance.get(`/users/check-email?email=${email}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");

      if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.rol_id) {
        throw new Error("Todos los campos son obligatorios.");
      }

      if (passwordError) {
        throw new Error(passwordError);
      }

      const emailExists = await checkIfEmailExists(formData.email);

      if (emailExists) {
        setIsEmailInUse(true);
        throw new Error("Este Email ya está en uso, ingrese otro.");
      }

      const userResponse = await axiosInstance.post("/users/register", {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
      });

      const userId = userResponse.data.id;

      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      const roleResponse = await axiosInstance.post("/user-roles/register", {
        usuario_id: parseInt(userId, 10),
        rol_id: parseInt(formData.rol_id, 10),
      });

      if (roleResponse.status !== 200 && roleResponse.status !== 201) {
        throw new Error("Error al asignar el rol al usuario.");
      }

      if (formData.finca_id) {
        const dataToSend = {
          usuario_id: parseInt(userId, 10),
          rol_id: parseInt(formData.rol_id, 10),
          finca_id: parseInt(formData.finca_id, 10),
        };

        if (isNaN(dataToSend.finca_id)) {
          throw new Error("La finca seleccionada no es válida.");
        }

        const farmResponse = await axiosInstance.post("/user-farm", dataToSend);

        if (farmResponse.status !== 200 && farmResponse.status !== 201) {
          throw new Error("Error al establecer la relación usuario-finca-rol.");
        }
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.message || "Error creando el usuario.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
    onSave();
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Crear Usuario
          </h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <Column>
                <InputGroup>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    maxLength="50"
                    required
                  />
                  {charLimitReached.nombre && (
                    <SmallErrorMessage>Haz llegado al tope de caracteres.</SmallErrorMessage>
                  )}
                </InputGroup>
                <InputGroup>
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    maxLength="50"
                    required
                  />
                  {charLimitReached.apellido && (
                    <SmallErrorMessage>Haz llegado al tope de caracteres.</SmallErrorMessage>
                  )}
                </InputGroup>
                <InputGroup>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength="50"
                    required
                  />
                  {isEmailInUse && (
                    <ErrorMessage>Este Email ya está en uso, ingrese otro.</ErrorMessage>
                  )}
                  {charLimitReached.email && (
                    <SmallErrorMessage>Haz llegado al tope de caracteres.</SmallErrorMessage>
                  )}
                </InputGroup>
              </Column>

              <Column>
                <InputGroup>
                  <label>Contraseña</label>
                  <PasswordWrapper>
                    <PasswordInput
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                  </PasswordWrapper>
                  {passwordError && (
                    <SmallErrorMessage>{passwordError}</SmallErrorMessage>
                  )}
                </InputGroup>
                <InputGroup>
                  <label>Finca</label>
                  <select
                    name="finca_id"
                    value={formData.finca_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una finca</option>
                    {fincas.map((finca) => (
                      <option key={finca.id} value={finca.id}>
                        {finca.nombre}
                      </option>
                    ))}
                  </select>
                </InputGroup>
                <InputGroup>
                  <label>Rol</label>
                  <select
                    name="rol_id"
                    value={formData.rol_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </InputGroup>
              </Column>
            </FormGrid>
            <SubmitButton type="submit">
              Crear
            </SubmitButton>
          </form>
        </ModalContent>
      </ModalOverlay>
      {showSuccessModal && (
        <SuccessModal
          onClose={handleCloseSuccessModal}
          message="¡Usuario Creado!"
        />
      )}
    </>
  );
};

NewUser.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default NewUser;
