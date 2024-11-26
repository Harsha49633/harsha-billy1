import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Report } from '../types';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  reports: Report[];
}

const MapView: React.FC<MapViewProps> = ({ reports }) => {
  // Center on India
  const center = { lat: 20.5937, lng: 78.9629 };

  // Group reports by location to show clusters
  const locationCounts = reports.reduce((acc, report) => {
    const key = `${report.location.lat},${report.location.lng}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getMarkerColor = (count: number) => {
    if (count >= 5) return 'red';
    if (count >= 3) return 'orange';
    return 'blue';
  };

  const createClusterIcon = (count: number) => {
    const color = getMarkerColor(count);
    return divIcon({
      html: `<div class="cluster-marker" style="background-color: ${color};">${count}</div>`,
      className: 'custom-marker-cluster',
      iconSize: [40, 40]
    });
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
      <style>
        {`
          .cluster-marker {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border: 2px solid white;
          }
          .custom-marker-cluster {
            background: none;
            border: none;
          }
        `}
      </style>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(locationCounts).map(([coords, count]) => {
          const [lat, lng] = coords.split(',').map(Number);
          const reportsAtLocation = reports.filter(
            r => r.location.lat === lat && r.location.lng === lng
          );

          return (
            <Marker
              key={coords}
              position={[lat, lng]}
              icon={createClusterIcon(count)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold mb-2">
                    {count} {count === 1 ? 'Report' : 'Reports'}
                  </h3>
                  <ul className="space-y-2">
                    {reportsAtLocation.map(report => (
                      <li key={report.id}>
                        <p className="text-sm">
                          <span className="font-semibold">{report.bullyingType}</span>
                          <br />
                          Location: {report.location.address}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;