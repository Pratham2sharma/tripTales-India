"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Use public/leaflet/ images for marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function OpenStreetMap({ lat, lng, title }: MapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
