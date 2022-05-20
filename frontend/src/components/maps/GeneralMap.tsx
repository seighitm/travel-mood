import React, {FC, useEffect, useRef, useState} from 'react';
import L from 'leaflet';

import {Group, LoadingOverlay, Text,} from '@mantine/core';
import {CustomLoader} from '../common/CustomLoader';
import {Link} from 'react-router-dom';

import {
  FeatureGroup,
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import '../../assets/map-utils/Leaflet.fullscreen.min';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import blueIcon from '../../assets/svg-map-markers/img/marker-icon-2x-blue.png';
import redIcon from '../../assets/svg-map-markers/img/marker-icon-2x-red.png';
import blueIconShadow from '../../assets/svg-map-markers/img/marker-shadow.png';
import {useGetAllMarkers, useGetTripsByMarkerId} from "../../api/map/queries";
import {fetchGeoJsonData} from "../../api/map/axios";
import CustomTileLayer from "./UtilsComponent/CustomTileLayer";
import LocationButton from "./UtilsComponent/LocationButton";
import {MAP_CENTER, MAP_MAX_BOUNDS} from './UtilsComponent/Constants';
// import {SearchField.tsx} from './MapObjects';
import 'leaflet-geosearch/dist/geosearch';
import useStore from "../../store/user.store";
// import {SearchField.tsx} from './UtilsComponent/SearchComponent';

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const {data, style, destinations, type, pathOptions} = props;

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) layer.clearLayers().addData(data);
  }, [data, pathOptions, style, destinations]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let popupContent = '';
    if (feature.properties && feature.properties.admin) popupContent = feature.properties.admin;

    const findLocation = destinations.find((item: any) => item.name == popupContent);
    const countMentions = findLocation?.[type]?.length;

    if (findLocation != undefined) {
      if (countMentions == 1) {
        layer.setStyle({
          fillColor: '#be9f4f',
          weight: 0.01,
          color: 'rgba(255,255,255,0)',
        });
      } else if (countMentions <= 3 && countMentions > 1) {
        layer.setStyle({
          fillColor: '#50ff0b',
          weight: 0.01,
          color: 'rgba(255,255,255,0)',
        });
      } else if (countMentions <= 10 && countMentions > 4) {
        layer.setStyle({
          fillColor: '#be3ec4',
          weight: 0.01,
          color: 'rgba(255,255,255,0)',
        });
      }
    }
    // layer.bindTooltip(, {direction: 'bottom'});
    layer.bindPopup(popupContent + ' ' + (countMentions ? '[' + countMentions + ']' : ''), {
      autoClose: true,
      closeButton: false,
      closeOnEscapeKey: true,
    });
    layer.on({
      mouseover: () => {
        layer.setStyle({
          weight: 2,
          color: '#8d8dff',
        });
      },
      click: () => {
        // layer.bindTooltip(popupContent + ' ' + (countMentions ? '[' + countMentions + ']' : ''));
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
  return <GeoJSON {...props} onEachFeature={handleOnEachFeature} ref={geoJsonLayerRef}/>;
};

const ShowMarkers = ({markers, selectedMarker, setSelectedMarker, tripIdAndTitle}: any) => {
  const popupRef = useRef<any>(null);

  return markers.map((marker: any, index: Element) => {
    return (
      <Marker
        // @ts-ignore
        key={index}
        uniceid={index}
        position={marker.latlon}
        draggable={false}
        style={{filter: 'hue-rotate(120deg)!important'}}
        className={'marker-color-red'}
        icon={
          new L.Icon({
            iconUrl: marker.id == selectedMarker ? redIcon : blueIcon,
            shadowUrl: blueIconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        }
        eventHandlers={{
          click(e: any) {
            setSelectedMarker(marker.id)
            // const location = e.target.getLatLng();
            // map.flyToBounds([location], {maxZoom: 7});
          },
        }}
      >
        <Popup ref={popupRef}>
          <Group position={'center'} direction={'column'} spacing={'xs'}>
            <Text size={'sm'}>{marker.description}</Text>
            <Text component={Link} to={'/trip/' + tripIdAndTitle.id}>
              Go
            </Text>
          </Group>
        </Popup>
      </Marker>
    );
  });
};

const MyMarkers: FC<any> = ({
                              map,
                              marker,
                              setMarker,
                              color,
                              selectedMarker,
                              setSelectedMarker,
                              tripIdAndTitle
                            }: any) => {
  useEffect(() => {
    if (!map) return;
    if (setMarker)
      map.on('click', (e: any) => {
        const {lat, lng} = e.latlng;
        setMarker((mar: any) => [...mar, [lat, lng]]);
      });
  }, [map]);

  return marker.length > 0 ? (
    <ShowMarkers
      tripIdAndTitle={tripIdAndTitle}
      map={map}
      color={color}
      markers={marker}
      setSelectedMarker={setSelectedMarker}
      selectedMarker={selectedMarker}
    />
  ) : null;
};

function ClickOutsideOfMarker({setSelectedMarker}: any) {
  useMapEvents({
    click() {
      setSelectedMarker(-1)
    }
  })
  return <></>
}

const GeneralMap: React.FC<any> = ({setDestinations, setPlaces}: any) => {
  const [map, setMap] = useState<any>(null);
  const [geoDate, setGeoDate] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(-1)
  const {user, onlineUsers} = useStore((state: any) => state);

  const {data: locations, isFetching} = useGetAllMarkers();
  const {data: tripMarkers, refetch} = useGetTripsByMarkerId(selectedMarker)

  useEffect(() => {
    if (geoDate == null) fetchGeoJsonData(setGeoDate);
  }, []);

  useEffect(() => {
    if (tripMarkers?.places?.find((marker: any) => marker.id == selectedMarker) == undefined)
      refetch()
  }, [selectedMarker])

  if (isFetching) return <CustomLoader/>;

  // @ts-ignore
  return <div className="map" style={{
    // top: 62, left: 0, position: "fixed",
    height: '87vh',
    borderRadius: '2px'
  }}>
    <MapContainer
      style={{width: '100%', borderRadius: '2px'}}
      // @ts-ignore
      fullscreenControl={true}
      // @ts-ignore
      whenCreated={(map) => setMap(map)}
      // whenCreated={setMap}
      // defaultPosition={MAP_DEFAULT_POSITION}
      center={MAP_CENTER}
      zoom={3}
      scrollWheelZoom={true}
      minZoom={2}
      maxBounds={MAP_MAX_BOUNDS}
      keyboard={true}
      keyboardPanDelta={80}
    >
      {/*<ActionIcon radius={0}*/}
      {/*            onClick={openSpotlight}*/}
      {/*            variant={'filled'}*/}
      {/*            style={{*/}
      {/*              zIndex: 400,*/}
      {/*              top: '170px',*/}
      {/*              left: '11px',*/}
      {/*              backgroundColor: '#fff',*/}
      {/*              border: '2px solid rgba(0.2, 0.2, 0.2, 0.3)',*/}
      {/*            }}*/}
      {/*            styles={{*/}
      {/*              root: {*/}
      {/*                height: '33px!important',*/}
      {/*                width: '33px!important'*/}
      {/*              }*/}
      {/*            }}*/}
      {/*>*/}
      {/*  <Search size={15} color={'gray'}/>*/}
      {/*</ActionIcon>*/}

      {/*<SpotlightControl />*/}

      <ClickOutsideOfMarker setSelectedMarker={setSelectedMarker}/>
      <LoadingOverlay visible={!geoDate || isFetching}/>
      <CustomTileLayer/>
      {/*<SearchField.tsx/>*/}
      {/*{map &&*/}
      {/*  <SearchField.tsx/>*/}
      {/*}*/}
      {/*<Search provider={new OpenStreetMapProvider()} />*/}
      {/*<LocationButton customStyles='margin-top: 93px;'/>*/}
      <LocationButton customStyles='margin-top: 47px'/>
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name="InterestedInBy">
          <FeatureGroup pathOptions={{color: 'purple'}}>
            {geoDate && !isFetching && (
              <GeoJSONWithLayer
                style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
                type={'interestedInBy'}
                destinations={locations.destinations}
                setDestinations={setDestinations}
                data={geoDate}
              />
            )}
          </FeatureGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Visited">
          <FeatureGroup pathOptions={{color: 'purple'}}>
            {geoDate && !isFetching && (
              <GeoJSONWithLayer
                style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
                type={'visitedBy'}
                destinations={locations.destinations}
                setDestinations={setDestinations}
                data={geoDate}
                setSelectedMarker={setSelectedMarker}
                selectedMarker={selectedMarker}
              />
            )}
          </FeatureGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="DissableLayer">
          <FeatureGroup pathOptions={{color: 'purple'}}></FeatureGroup>
        </LayersControl.BaseLayer>
        {locations &&
          <LayersControl.Overlay name="Markers">
            <FeatureGroup>
              {(tripMarkers?.places && selectedMarker != -1) &&
                <Polyline
                  color={'#1971c2'}
                  opacity={0.7}
                  weight={5}
                  positions={tripMarkers?.places.map((item: any) => [item.lon, item.lat])}
                />
              }
              {/*// @ts-ignore*/}
              <MarkerClusterGroup>
                <MyMarkers
                  tripIdAndTitle={{id: tripMarkers?.id, title: tripMarkers?.title}}
                  setSelectedMarker={setSelectedMarker}
                  selectedMarker={selectedMarker}
                  map={map}
                  setMarker={setPlaces}
                  color={redIcon}
                  marker={locations?.places?.filter((i: any) => i.trip?.length != 0)
                    .map((item: any) => ({
                      id: item.id,
                      latlon: [item.lon, item.lat],
                      description: item.description
                    }))}
                />
              </MarkerClusterGroup>
            </FeatureGroup>
          </LayersControl.Overlay>
        }
      </LayersControl>
    </MapContainer>
  </div>
}

export default GeneralMap;
