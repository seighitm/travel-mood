import React, { Dispatch, ReactNode } from 'react';
import { MAP_CENTER, MAP_DEFAULT_POSITION, MAP_MAX_BOUNDS } from './Constants';
import { MapContainer } from 'react-leaflet';
import '../MapStyles.css';

interface CustomMapContainerComponentProps {
  children: ReactNode;
  setMap: Dispatch<React.SetStateAction<any>>;
  fullScreen?: boolean;
}

function CustomMapContainer({
  children,
  setMap,
  fullScreen = true,
}: CustomMapContainerComponentProps) {
  return (
    <MapContainer
      style={{ width: '100%', borderRadius: '8px' }}
      fullscreenControl={fullScreen}
      whenCreated={setMap}
      defaultPosition={MAP_DEFAULT_POSITION}
      center={MAP_CENTER}
      zoom={3}
      scrollWheelZoom={true}
      minZoom={2}
      maxBounds={MAP_MAX_BOUNDS}
      keyboard={true}
      keyboardPanDelta={80}
    >
      {children}
    </MapContainer>
  );
}

export default CustomMapContainer;
