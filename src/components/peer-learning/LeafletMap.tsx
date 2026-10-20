import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PeerClassmate } from '../../types';

interface LeafletMapProps {
  classmates: PeerClassmate[];
  selectedClassmate: PeerClassmate | null;
  onSelectClassmate: (classmate: PeerClassmate) => void;
}

// Controller component to smoothly pan map when selected classmate changes
const MapController: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15, { animate: true });
    }
  }, [coords, map]);
  return null;
};

// Create custom DOM icon for classmate markers
const createCustomMarker = (peer: PeerClassmate, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-peer-marker',
    html: `
      <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
        ${isSelected ? '<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: rgba(0, 138, 98, 0.3); animation: pulse 1.5s infinite;"></div>' : ''}
        <div style="width: 36px; height: 36px; border-radius: 9999px; overflow: hidden; border: 2.5px solid ${isSelected ? '#008A62' : '#FFFFFF'}; box-shadow: 0 4px 6px -1px rgba(0, 63, 64, 0.2); background: white;">
          <img src="${peer.avatar}" alt="${peer.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; border-radius: 9999px; background: #008A62; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 8px; color: white;">
          ★
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  classmates,
  selectedClassmate,
  onSelectClassmate,
}) => {
  const center: [number, number] = [19.0760, 72.8777]; // Center near school campus

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-xl overflow-hidden border border-brand-border shadow-subtle">
      <MapContainer
        center={selectedClassmate ? selectedClassmate.coordinates : center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController coords={selectedClassmate ? selectedClassmate.coordinates : null} />

        {/* Markers for each classmate */}
        {classmates.map((peer) => {
          const isSelected = selectedClassmate?.id === peer.id;
          return (
            <Marker
              key={peer.id}
              position={peer.coordinates}
              icon={createCustomMarker(peer, isSelected)}
              eventHandlers={{
                click: () => onSelectClassmate(peer),
              }}
            >
              <Popup>
                <div className="p-1 text-center min-w-[140px]">
                  <div className="font-bold text-xs text-brand-dark">{peer.name}</div>
                  <div className="text-[10px] text-gray-500">{peer.class} • {peer.distance}</div>
                  <div className="mt-1 flex flex-wrap gap-1 justify-center">
                    {peer.subjects.map((sub, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-brand-cyanBg text-brand-dark text-[9px] rounded font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectClassmate(peer)}
                    className="mt-2 w-full px-2 py-1 bg-brand-emerald text-white rounded text-[10px] font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-brand-border shadow-sm text-[10px] text-brand-textSecondary flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
        <span>Anonymized Cluster Coordinates (Privacy Protected)</span>
      </div>
    </div>
  );
};
