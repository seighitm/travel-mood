import React, {useEffect, useRef, useState} from 'react';
import {FeatureGroup, GeoJSON, LayersControl, MapContainer, Marker, Polyline, Popup} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {GeoJSON as LeafletGeoJSON, Icon} from 'leaflet';
import redIcon from '../../assets/svg-map-markers/img/marker-icon-2x-red.png';
import blueIcon from '../../assets/svg-map-markers/img/marker-icon-2x-blue.png';
import blueIconShadow from '../../assets/svg-map-markers/img/marker-shadow.png';
import {Group, LoadingOverlay, Text} from '@mantine/core';
import {fetchGeoJsonData} from '../../api/map/axios';
import CustomTileLayer from "./UtilsComponent/CustomTileLayer";
import {SearchField} from "./MapObjects";
// import {SearchField} from "./UtilsComponent/SearchComponent";

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const {destinations} = props;

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
    if (feature.properties && feature.properties.iso_a2) countryCode = feature.properties.iso_a2

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
  return <GeoJSON {...props} ref={geoJsonLayerRef} onEachFeature={handleOnEachFeature}/>;
};

const MyMarkers = ({markers}: any) => {
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
              iconUrl: index == 0 ? redIcon : blueIcon,
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

const TripMap = React.memo(({dbCountries, dbMarkers}: any) => {
  const [geoDate, setGeoDate] = useState<any>(null);

  useEffect(() => {
    if (geoDate == null) fetchGeoJsonData(setGeoDate);
  }, []);

  return (
    <div className="map" style={{borderRadius: '10px'}}>
      <MapContainer
        style={{borderRadius: '10px', width: '100%'}}
        // @ts-ignore
        fullscreenControl={true}
        defaultPosition={[38.82259, -2.8125]}
        center={[38.82259, -2.8125]}
        zoom={3}
        zoomControl={false}
        minZoom={2}
        maxBounds={[
          [84.67351256610522, -174.0234375],
          [-58.995311187950925, 174],
        ]}
      >
        <LoadingOverlay visible={!geoDate}/>
        <CustomTileLayer/>
        <LayersControl position="bottomleft">
          <LayersControl.Overlay checked name="Places">
            <FeatureGroup>
              <Polyline
                color={'#1971c2'}
                opacity={0.7}
                weight={5}
                positions={dbMarkers.map((item: any) => [item.lon, item.lat])}
              />
              {/*// @ts-ignore*/}
              <MarkerClusterGroup>
                <MyMarkers
                  markers={dbMarkers.map((item: any) => ({
                    place: [item.lon, item.lat],
                    id: item.id,
                    description: item.description,
                  }))}
                />
              </MarkerClusterGroup>
            </FeatureGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Countries">
            <FeatureGroup>
              {geoDate && (
                <GeoJSONWithLayer
                  destinations={dbCountries?.map((item: any) => item.code)}
                  data={geoDate}
                  style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
                />
              )}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <SearchField/>
      </MapContainer>
    </div>
  );
});

export default TripMap;
