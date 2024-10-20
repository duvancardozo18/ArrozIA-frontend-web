// MapsLeaflet.js
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
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

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    setFormData({
      ...formData,
      latitud: newPosition[0].toString(),
      longitud: newPosition[1].toString(),
    });
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
      <LocationMarker position={position} setPosition={handlePositionChange} />
      <CenterMap position={position} /> {/* Centra el mapa en la posición actual */}
    </MapContainer>
  );
}
