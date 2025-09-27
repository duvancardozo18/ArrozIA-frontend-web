# ArrozIA-frontend-web

La trazabilidad en el cultivo de arroz es un factor clave para garantizar la calidad, seguridad y eficiencia en la producción agrícola. Sin embargo, el monitoreo manual de enfermedades, plagas, malezas y deficiencias nutricionales presenta limitaciones en precisión y tiempo de respuesta.

Este proyecto propone el desarrollo de una plataforma de trazabilidad basada en inteligencia artificial, que permita a los agricultores monitorear y gestionar en tiempo real la evolución de sus cultivos, optimizando la toma de decisiones y reduciendo pérdidas.

**Metodología**
El desarrollo del sistema sigue la metodología ágil Scrum y los estándares de requerimientos ISO/IEC/IEEE 29148:2018. Se diseña una arquitectura basada en FastAPI y React, con pruebas bajo la normativa ISO 25010. 

**Tecnologías Utilizadas**
El sistema está compuesto por un backend y un frontend independientes, lo que permite una arquitectura escalable y eficiente.

🖥️ Backend – ArrozIA-backend
- Desarrollado con FastAPI, garantizando un rendimiento rápido y eficiente.
- Implementación de modelos de inteligencia artificial para la detección de enfermedades y plagas en los cultivos.
- Base de datos en PostgreSQL, optimizada para el almacenamiento de registros agrícolas.
> Enlace del Repositorio: [Click aqui](https://github.com/duvancardozo18/ArrozIA-backend)

📌 Frontend – ArrozIA-frontend
- Desarrollado con React, proporcionando una interfaz intuitiva y dinámica.
- Uso de Redux para la gestión del estado y optimización del rendimiento.
- Integración con el backend a través de APIs REST para una experiencia fluida.
- Diseño responsive para acceso desde dispositivos móviles y computadoras.


## 🛠️   Instalación  

### Requisitos 
Tener instalado las siguientes herramientas: 
- **Node js 18.20**
- **Docker** (opcional, para despliegue en contenedores)


---

### Instrucciones  
1. **Clonar o descargar** el repositorio del proyecto.  
2. **Establecer variables de entorno.**  
   - Copiar `.env.example` y renombrar como `.env`
   - Abrir una nueva terminal en el proyecto raiz del **Backend** y levantar servidor, posteriormente copiar la url del servidor corriendo, ejemplo: http://127.0.0.1:8000/
   - Establecer la **Conexion del Frontend con el Backend** en el archivo `.env` estructura de ejemplo: VITE_API_BASE_URL=http://127.0.0.1:8000/
#remplazar de acuerdo a la url del backend corriendo.
4. **Instalar Dependencias**  
   Abrir una terminal en el directorio raíz del proyecto y ejecute:  
   ```bash
   npm install
4. **Levantar servidor**  
   ```bash
   npm run dev
---
## 🚀 Credenciales

- **Correo:** `juan.perez@example.com`  
- **Contraseña:** `Usco2024.` 
---


### Login
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Login.png>)

### Roles
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Roles.png>)

### Usuarios
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Usuarios.png>)

### Fincas
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Fincas.png>)

### Cultivos
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Cultivo.png>)

### Gestion Agricola
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Gestion_Agricola.png>)

### Labores Culturales
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Labores_culturales.png>)

### Tarea - Labor Cultural
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Tareas.png>)

### Diagnostico Fitosanitario
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Diagnostico_Fitosanitario.png>)

### Analisis Edafologico
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Analisis_edafologico.png>)

### Monitoreos
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Monitoreos.png>)

### Datos Meteorologicos
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Datos_Meteorologicos.png>)

### Reportes
![](<https://raw.githubusercontent.com/duvancardozo18/ArrozIA-frontend-web/refs/heads/main/resources/images/Reportes.png>)


