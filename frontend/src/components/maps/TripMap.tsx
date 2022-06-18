import React, { useEffect, useRef, useState } from 'react';
import { GeoJSON as LeafletGeoJSON, Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { FeatureGroup, GeoJSON, LayersControl, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { apiFetchGeoJsonData } from '../../api/map/axios';
import CustomTileLayer from './UtilsComponent/CustomTileLayer';
import { Group, LoadingOverlay, Text } from '@mantine/core';
import { isEmptyArray } from '../../utils/primitive-checks';
import redIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-red.png';
import blueIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-blue.png';
import blueIconShadow from './UtilsComponent/svg-map-markers/img/marker-shadow.png';
import greenIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-green.png';
import './UtilsComponent/LeafletFullscreen/Leaflet.fullscreen.min';
import CustomMapContainer from './UtilsComponent/CustomMapContainer';
import './MapStyles.css';
import LeafletControlGeocoder from './UtilsComponent/LeafletControlGeocoder';

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const { destinations } = props;

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) {
      layer.clearLayers().addData(props.data);
    }
  }, [props.data, props.pathOptions, props.style]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let popupContent = '';
    let countryCode = '';
    if (feature.properties && feature.properties.admin) popupContent = feature.properties.admin;
    if (feature.properties && feature.properties.iso_a2) countryCode = feature.properties.iso_a2;

    if (destinations.includes(countryCode)) {
      layer.setStyle({
        fillColor: '#ff0b14',
        weight: 0.01,
        color: '#e50856',
      });
    }

    layer.bindPopup(popupContent);
    layer.on({
      mouseover: () => {
        layer.setStyle({
          weight: 2,
          color: '#8d8dff',
        });
      },
      click: () => {
        layer.bindPopup(popupContent);
      },
      mouseout: () => {
        layer.setStyle({
          weight: 0.01,
          color: 'rgba(255,255,255,0)',
        });
        layer.closePopup();
      },
    });
  };
  return <GeoJSON {...props} ref={geoJsonLayerRef} onEachFeature={handleOnEachFeature} />;
};

const MyMarkers = ({ markers }: any) => {
  const popupRef = useRef<any>(null);
  return markers.length > 0
    ? markers.map((marker: any, index: number) => {
        return (
          <Marker
            // @ts-ignore
            uniceid={index}
            key={index}
            position={marker.place}
            draggable={false}
            icon={
              new Icon({
                iconUrl: index == 0 ? redIcon : index == markers.length - 1 ? greenIcon : blueIcon,
                shadowUrl: blueIconShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })
            }
          >
            <Popup ref={popupRef}>
              <Group position={'center'}>
                <Text size={'sm'}>{marker.description}</Text>
              </Group>
            </Popup>
          </Marker>
        );
      })
    : null;
};

interface TripMapComponentProps {
  dbCountries: {
    code: string;
    name: string;
  }[];
  dbMarkers: {
    description: string;
    lon: string;
    lat: string;
    id: number;
  }[];
}

const TripMap = React.memo(({ dbCountries, dbMarkers }: TripMapComponentProps) => {
  const [geoDate, setGeoDate] = useState<any>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      await apiFetchGeoJsonData(setGeoDate);
    };
    if (geoDate == null) {
      fetchGeo();
    }
  }, []);

  return (
    <div className="map" style={{ borderRadius: '10px' }}>
      <CustomMapContainer setMap={setMap}>
        <LoadingOverlay visible={!geoDate} />
        <CustomTileLayer />
        <LeafletControlGeocoder position={'topleft'} />
        <LayersControl position="bottomleft">
          <LayersControl.Overlay checked name="Places">
            <FeatureGroup>
              <Polyline
                color={'#1971c2'}
                opacity={0.7}
                weight={5}
                positions={dbMarkers.map((item: any) => [item.lon, item.lat])}
              />
              {!isEmptyArray(dbMarkers) && (
                // @ts-ignore
                <MarkerClusterGroup>
                  <MyMarkers
                    markers={dbMarkers?.map((item: any) => ({
                      place: [item.lon, item.lat],
                      id: item.id,
                      description: item.description,
                    }))}
                  />
                </MarkerClusterGroup>
              )}
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Countries">
            <FeatureGroup>
              {geoDate && (
                <GeoJSONWithLayer
                  destinations={dbCountries?.map((item: any) => item.code)}
                  data={geoDate}
                  style={{ weight: 0.01, fillColor: 'rgba(255,255,255,0)' }}
                />
              )}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </CustomMapContainer>
    </div>
  );
});

export default TripMap;
