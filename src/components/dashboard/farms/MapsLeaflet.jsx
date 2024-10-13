import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return <Marker position={position}></Marker>;
}

// Componente para centrar el mapa cada vez que la posición cambie
function CenterMap({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1, // Agregamos animación para mejorar el efecto de cambio
      });
    }
  }, [position, map]);

  return null;
}

export default function MapsLeaflet({ formData, setFormData }) {
  const defaultPosition = [2.941695288131047, -75.30014365074527];

  // Si hay latitud y longitud en formData, se usa como posición inicial
  const initialPosition = formData.latitud && formData.longitud
    ? [parseFloat(formData.latitud), parseFloat(formData.longitud)]
    : defaultPosition;

  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (formData.latitud && formData.longitud) {
      const newPosition = [parseFloat(formData.latitud), parseFloat(formData.longitud)];
      setPosition(newPosition);
    }
  }, [formData.latitud, formData.longitud]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    setFormData({
      ...formData,
      latitud: newPosition.lat.toString(),
      longitud: newPosition.lng.toString(),
    });
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: '160px', width: '100%', marginBottom: '20px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker position={position} setPosition={handlePositionChange} />
      <CenterMap position={position} />
    </MapContainer>
  );
}
