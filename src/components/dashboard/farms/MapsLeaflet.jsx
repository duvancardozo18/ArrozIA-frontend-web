import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function LocationMarker({ position, setPosition, updateLocationData }) {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      updateLocationData(newPosition); // Llamada para actualizar departamento y ciudad
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

// Custom hook para centrar el mapa
function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && map) {
      map.setView(position, map.getZoom()); // Centra el mapa en la nueva posición
    }
  }, [position, map]);

  return null;
}

export default function MapsLeaflet({ formData, setFormData }) {
  // Posición predeterminada
  const defaultPosition = [2.941695288131047, -75.30014365074527];

  // Estado para la posición actual
  const [position, setPosition] = useState(defaultPosition);

  // Actualiza la posición cuando cambian latitud y longitud en formData
  useEffect(() => {
    const lat = parseFloat(formData.latitud);
    const lng = parseFloat(formData.longitud);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    } else {
      setPosition(defaultPosition);
    }
  }, [formData.latitud, formData.longitud]);

  // Función para realizar la geocodificación inversa y actualizar los campos de departamento y ciudad
  const updateLocationData = async (newPosition) => {
    try {
      const [lat, lon] = newPosition;
      console.log(`Fetching data for coordinates: Latitude ${lat}, Longitude ${lon}`);
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const address = response.data.address;

      console.log("Response from Nominatim:", response.data); // Verificar toda la respuesta
      console.log("City:", address.city || address.town || address.village);
      console.log("State:", address.state);

      setFormData((prevData) => ({
        ...prevData,
        latitud: lat.toString(),
        longitud: lon.toString(),
        departamento: address.state || "",
        ciudad: address.city || address.town || address.village || "",
      }));
    } catch (error) {
      console.error("Error al obtener la ciudad y el departamento:", error);
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={{ height: '160px', width: '100%', marginBottom: '20px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker
        position={position}
        setPosition={setPosition}
        updateLocationData={updateLocationData} // Pasa la función para actualizar ubicación
      />
      <CenterMap position={position} /> {/* Centra el mapa en la posición actual */}
    </MapContainer>
  );
}
