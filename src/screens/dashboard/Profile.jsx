import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../config/AuthProvider";
import { AreaTop } from "../../components";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import axiosInstance from "../../config/AxiosInstance";

const ProfileForm = () => {
  const { userId } = useContext(AuthContext); // Obtener el userId desde el AuthContext
  const [user, setUser] = useState({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    primer_login: false,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Para controlar si el usuario está editando la información
  const [changePassword, setChangePassword] = useState(false); // Para habilitar cambio de contraseña
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña vacía
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/users/${userId}`)
        .then((response) => {
          const { id, nombre, apellido, email, password, primer_login } =
            response.data;
          setUser({
            id: id,
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password,
            primer_login: primer_login,
          });
          setLoading(false);
        })
        .catch((error) => {
          setError("Error al obtener la información del usuario.");
          setLoading(false);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value); // Almacenar la nueva contraseña
  };

  const handleEdit = () => {
    setIsEditing(true); // Activar modo edición
  };

  const handleSave = () => {
    axiosInstance
      .put(`/users/update/${userId}`, user)
      .then((response) => {
        setIsEditing(false);
        alert("Información actualizada con éxito");
      })
      .catch((error) => {
        setError("Error al actualizar la información del usuario.");
      });
  };

  const handleSavePassword = () => {
    axiosInstance
      .put(`/users/update-password/${userId}`, { password: newPassword })
      .then((response) => {
        setChangePassword(false); // Ocultar el campo de contraseña después de guardarla
        setNewPassword(""); // Limpiar el campo de la nueva contraseña
        alert("Contraseña actualizada con éxito");
      })
      .catch((error) => {
        setError("Error al actualizar la contraseña.");
      });
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword); // Habilitar o deshabilitar cambio de contraseña
    setNewPassword(""); // Limpiar el campo al habilitarlo
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <div className="content-area">
        <AreaTop title="Perfil" />
      </div>
      {loading ? (
        <Typography align="center">Cargando...</Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Card de perfil a la izquierda */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 0px 6px 0px rgba(105, 105, 105, .3)",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{ width: 80, height: 80, marginBottom: "5px" , margin: "0 auto" }}
                  alt={user.nombre}
                />
                <Typography variant="h6">
                  {user.nombre} {user.apellido}
                </Typography>

                {/* Botones para editar información y cambiar contraseña */}
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    sx={{
                      color: "#ffffff", // Color del texto
                      borderColor: "#14B814", // Color del borde
                      backgroundColor: "#14B814", // Color del borde
                      mb: 1,
                    }}
                  >
                    Editar Información
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={toggleChangePassword}
                    sx={{
                      color: "#14B814", // Color del texto
                      borderColor: "#14B814", // Color del borde
                    }}
                  >
                    {changePassword
                      ? "Cancelar Cambio de Contraseña"
                      : "Cambiar Contraseña"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información editable a la derecha */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 0px 6px 0px rgba(105, 105, 105, .3)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información del Usuario
                </Typography>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={user.nombre}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing} // Desactivar si no está en modo edición
                />
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={user.apellido}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />

                {/* Botones para guardar cambios */}
                {isEditing && !changePassword && (
                  <Box mt={2} display="flex" justifyContent="flex-start">
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        color: "#ffffff",
                        borderColor: "#14B814",
                        backgroundColor: "#14B814",
                        mb: 1,
                      }}
                    >
                      Guardar Cambios
                    </Button>
                  </Box>
                )}

                {/* Opcional: Habilitar cambio de contraseña */}
                {changePassword && (
                  <>
                    <TextField
                      label="Nueva Contraseña"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      margin="normal"
                      type="password"
                    />
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        onClick={handleSavePassword}
                        sx={{
                          color: "#ffffff", // Color del texto
                          borderColor: "#14B814", // Color del borde
                          backgroundColor: "#14B814", // Color del borde
                          mb: 1,
                        }}
                      >
                        Guardar Contraseña
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default ProfileForm;
