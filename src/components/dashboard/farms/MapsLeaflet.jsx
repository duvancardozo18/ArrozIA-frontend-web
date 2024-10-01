import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Actualiza la posición al hacer clic en el mapa
    },
  });

  // Renderiza el marcador en la posición actual
  return <Marker position={position}></Marker>;
}

export default function MapsLeaflet({ formData, setFormData }) {
  // Define la posición inicial
  const initialPosition = [2.941695288131047, -75.30014365074527];
  const [position, setPosition] = useState(initialPosition);

  // Actualiza el estado de formData cuando cambie la posición
  const handlePositionChange = (newPosition) => {
    // console.log('Nueva posición:', newPosition);
    setPosition(newPosition);
    setFormData({
      ...formData,
      latitud: newPosition.lat.toString(),
      longitud: newPosition.lng.toString(),
    });
  };

  return (
    <MapContainer center={initialPosition} zoom={8} style={{ height: '160px', width: '100%', marginBottom: '20px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker position={position} setPosition={handlePositionChange} />
    </MapContainer>
  );
}
