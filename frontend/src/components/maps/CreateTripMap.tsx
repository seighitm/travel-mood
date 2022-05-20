import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActionIcon, Box, Group, LoadingOverlay, SegmentedControl, Text,} from '@mantine/core';
import {DrawingPinFilledIcon, GlobeIcon, TrashIcon,} from '@modulz/radix-icons';
import {GeoJSON, MapContainer, Marker, Polyline, Popup} from 'react-leaflet';
import L, {GeoJSON as LeafletGeoJSON, Icon} from 'leaflet';
import {fetchGeoJsonData} from '../../api/map/axios';

import blueIcon from '../../assets/svg-map-markers/img/marker-icon-2x-blue.png';
import redIcon from '../../assets/svg-map-markers/img/marker-icon-2x-red.png';
import blueIconShadow from '../../assets/svg-map-markers/img/marker-shadow.png';
import MarkerSetModal from "../trip/CreateTrip/MarkerSetModal";
import CustomTileLayer from "./UtilsComponent/CustomTileLayer";
// import {SearchField.tsx} from "./UtilsComponent/SearchComponent";

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const {setDestinations, destinations} = props;

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) layer.clearLayers().addData(props.data);
  }, [props.data, props.pathOptions, props.style, destinations]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let popupContent = '';
    let countryCode = '';
    if (feature.properties && feature.properties.admin) {
      popupContent = feature.properties.admin;
    }

    if (feature.properties && feature.properties.iso_a2) {
      countryCode = feature.properties.iso_a2;
    }

    const findLocation = destinations.find((item: any) => item.countryCode == countryCode);
    if (findLocation != undefined) {
      layer.setStyle({
        fillColor: '#5c9b3d',
        weight: 0.01,
        color: 'rgba(255,255,255,0)',
      });
    }
    if (destinations.find((item: any) => item.countryCode == countryCode) != undefined) {
      for (let i = 0; i < destinations.length; i++)
        if (destinations[i].countryCode === countryCode)
          layer.setStyle({
            fillColor: '#5c9b3d',
            weight: 0.01,
            color: 'rgba(255,255,255,0)',
          });
    }

    layer.bindPopup(popupContent);
    layer.on({
      mouseover: (e: any) => {
        layer.setStyle({
          weight: 2,
          color: '#8d8dff',
        });
      },
      click: (e: any) => {
        layer.bindPopup(popupContent);
        if (destinations.find((item: any) => item.countryCode == countryCode) != undefined) {
          for (let i = 0; i < destinations.length; i++)
            if (destinations[i].countryCode === countryCode) destinations.splice(i, 1);
        } else {
          destinations.push({countryCode: countryCode, countryName: popupContent});
        }
        if (setDestinations) setDestinations([...destinations]);
      },
      mouseout: (e: any) => {
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

const removeMarker = (index: any, map: any, setAllMarkers: any) => {
  map.eachLayer((layer: any) => {
    if (layer.options && layer.options.pane === 'markerPane') {
      if (layer.options.uniceid === index) {
        setAllMarkers((prev: any) => prev.filter((item: any, i: any) => i != index));
      }
    }
  });
};

const ShowMarkers = ({mapContainer, allMarkers, setAllMarkers, setRefresh}: any) => {
  const popupRef = useRef<any>(null);
  let latlng1 = L.latLng(allMarkers[0].place[0], allMarkers[0].place[1]);
  if (allMarkers[1]) {

    let latlng2 = L.latLng(allMarkers[1].place[0], allMarkers[1].place[1]);
    let distance = latlng1.distanceTo(latlng2) / 1000
  }
  return allMarkers.map((item: any, index: number) => {
    return (
      <Marker
        // @ts-ignore
        uniceid={index}
        key={index}
        position={item.place}
        draggable={true}
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
        eventHandlers={{
          moveend(e: any) {
            setRefresh((prev: any) => !prev)
            const {lat, lng} = e.target.getLatLng();
            allMarkers[index].place = [lat, lng];
            setAllMarkers(allMarkers);
          },
        }}
      >
        <Popup ref={popupRef} closeOnEscapeKey={true} autoClose={true} closeOnClick={true}>
          <Group position={'center'} spacing={0}>
            <Text size={'sm'}>{item.description}</Text>
            <ActionIcon
              color="red"
              onClick={() => {
                removeMarker(index, mapContainer, setAllMarkers);
                popupRef.current._closeButton.click();
              }}
            >
              <TrashIcon/>
            </ActionIcon>
          </Group>
        </Popup>
      </Marker>
    );
  });
};


const MyMarkers = ({
                     map,
                     setAuxPlace,
                     allMarkers,
                     setAllMarkers,
                     setOpenedModal,
                     setRefresh
                   }: any) => {
  useEffect(() => {
    if (!map) return;
    map.on('click', (e: any) => {
      const {lat, lng} = e.latlng;
      setOpenedModal(true);
      setAuxPlace([lat, lng]);
    });
  }, [map]);

  return allMarkers.length > 0 ? (
    <ShowMarkers
      setRefresh={setRefresh}
      map={map}
      mapContainer={map}
      allMarkers={allMarkers}
      setAllMarkers={setAllMarkers}
    />
  ) : null;
};

const CreateTripMap = React.memo(
  ({
     setDestinations,
     destinations,
     allMarkers,
     setAllMarkers,
   }: any) => {
    const [geoDate, setGeoDate] = useState<null | any>(null);
    const [segmentControl, setSegmentControl] = useState<string>('markers');
    const [map, setMap] = useState<any>(null);
    const [openedMarkerModal, setOpenedMarkerModal] = useState(false);
    const [currentMarker, setCurrentMarker] = useState<any>(null);
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {
      if (geoDate == null) fetchGeoJsonData(setGeoDate);
    }, []);

    useEffect(() => {
      if (segmentControl == 'markers') setOpenedMarkerModal(false)
    }, [segmentControl])

    const handlerCreateMarker = (desc: any) => {
      setAllMarkers((prev: any) => [
        ...prev, {place: currentMarker, description: desc},
      ]);
      setOpenedMarkerModal(false);
    }

    return (
      <>
        {useMemo(() =>
          <MarkerSetModal openedMarkerModal={openedMarkerModal}
                          setOpenedMarkerModal={setOpenedMarkerModal}
                          segmentControl={segmentControl}
                          handlerCreateMarker={handlerCreateMarker}
          />, [openedMarkerModal])
        }
        <SegmentedControl
          fullWidth
          value={segmentControl}
          onChange={setSegmentControl}
          data={[
            {
              label: (
                <Group position={'center'}>
                  <DrawingPinFilledIcon/>
                  <Box ml={10}>Markers</Box>
                </Group>
              ),
              value: 'markers',
            },

            {
              label: (
                <Group position={'center'}>
                  <GlobeIcon/>
                  <Box ml={10}>Countries</Box>
                </Group>
              ),
              value: 'countries',
            },
          ]}
        />

        <div className="map" id="map">
          <MapContainer
            style={{borderRadius: '10px', width: '100%'}}
            className="map"
            // @ts-ignore
            fullscreenControl={false}
            whenCreated={setMap}
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
            {segmentControl == 'markers' &&
              <>
                <MyMarkers
                  setRefresh={setRefresh}
                  map={map}
                  segmentControl={segmentControl}
                  allMarkers={allMarkers}
                  setAllMarkers={setAllMarkers}
                  setOpenedModal={setOpenedMarkerModal}
                  setAuxPlace={setCurrentMarker}
                />
                <Polyline
                  color={'#1971c2'}
                  opacity={0.6}
                  weight={5}
                  positions={allMarkers.map((item: any) => item.place)}
                />
              </>
            }
            {segmentControl == 'countries' && geoDate && (
              <GeoJSONWithLayer
                setDestinations={setDestinations}
                destinations={destinations}
                data={geoDate}
                style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
              />
            )}
            {/*<SearchField.tsx/>*/}
          </MapContainer>
        </div>
      </>
    );
  }
);

export default CreateTripMap;
