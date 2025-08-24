"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";

// Use public/leaflet/ images for marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  lat: number;
  lng: number;
  imageUrl?: string;
  title: string;
  description?: string;
}

const INITIAL_MAP_CENTER: [number, number] = [20.5937, 78.9629];
const INITIAL_MAP_ZOOM = 5;

export default function OpenStreetMap({
  lat,
  lng,
  title,
  imageUrl,
  description,
}: MapProps) {
  // Fix: Ensure each map instance has a unique id to avoid container reuse error
  const mapIdRef = useRef(`map-${lat}-${lng}-${Math.random()}`);

  return (
    <div id={mapIdRef.current} style={{ height: "450px", width: "100%" }}>
      <MapContainer
        // --- 2. Use the initial, zoomed-out coordinates to first render the map ---
        center={INITIAL_MAP_CENTER}
        zoom={INITIAL_MAP_ZOOM}
        scrollWheelZoom={false}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <ChangeView center={[lat, lng]} zoom={14} />
          <Popup>
            <div className="w-48">
              {imageUrl && (
                <div className="mb-2 rounded-md overflow-hidden w-full h-24 relative">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority={false}
                  />
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
