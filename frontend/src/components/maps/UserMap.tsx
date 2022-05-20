import React, {useEffect, useRef, useState} from 'react';
import {ActionIcon, Badge, Box, Button, Group, LoadingOverlay, Modal, Switch,} from '@mantine/core';
import {CheckIcon, Cross2Icon, TrashIcon,} from '@modulz/radix-icons';
import {GeoJSON, MapContainer, Marker, useMap} from 'react-leaflet';
import L, {control, DomUtil, GeoJSON as LeafletGeoJSON, Icon} from 'leaflet';
import blueIconShadow from '../../assets/svg-map-markers/img/marker-shadow.png';
import useStore from '../../store/user.store';
import {fetchGeoJsonData} from "../../api/map/axios";
import LocationButton from './UtilsComponent/LocationButton';
// import {SearchField} from "./UtilsComponent/SearchComponent";
import CustomTileLayer from "./UtilsComponent/CustomTileLayer";
import {SearchField} from "./MapObjects";

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const {data, pathOptions, style, visCountries, intCountries, setAuxCountry, setOpenedModal} = props

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) {
      layer.clearLayers().addData(data);
    }
  }, [data, pathOptions, style, visCountries, intCountries]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let popupContent = '';
    let countryCode = '';

    if (feature.properties && feature.properties.admin) popupContent = feature.properties.admin;
    if (feature.properties && feature.properties.iso_a2) countryCode = feature.properties.iso_a2

    const findLocationVisited = visCountries.find((item: any) => item == countryCode);
    const findLocationInterested = intCountries.find((item: any) => item == countryCode);

    if (findLocationVisited != undefined && findLocationInterested === undefined) {
      layer.setStyle({
        fillColor: '#50ff0b',
        weight: 0.01,
        color: '#1ee508',
      });
    } else if (findLocationVisited === undefined && findLocationInterested != undefined) {
      layer.setStyle({
        fillColor: '#b92222',
        weight: 0.01,
        color: '#ab2626',
      });
    } else if (findLocationVisited != undefined && findLocationInterested != undefined) {
      layer.setStyle({
        fillColor: '#9517b0',
        weight: 0.01,
        color: '#7b328f',
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
        if (props.isEditMode) {
          setAuxCountry(countryCode);
          setOpenedModal(true);
        }
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

  return <GeoJSON {...props} ref={geoJsonLayerRef} onEachFeature={handleOnEachFeature}/>;
};

const ShowMarkers = ({markers, sidebar, map, setSelectedMarker, color}: any) => {
  const [sel, setSel] = useState<any>(null);
  return markers.map((marker: any, index: Element) => {
    return (
      <Marker
        // @ts-ignore
        key={index}
        icon={
          new Icon({
            iconUrl: color,
            shadowUrl: blueIconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        }
        uniceid={index}
        position={marker.latlon}
        draggable={false}
        eventHandlers={{
          click(e: any) {
            setSelectedMarker(marker.id);
            sidebar.addTo(map);
            setTimeout(function () {
              setSelectedMarker(marker.id);
              setSel(marker.id);
              if (sel == null) sidebar.open('home');
              else if (sel != marker.id) sidebar.open('home');
              else {
                setSel(null);
                sidebar.close();
              }
              const location = e.target.getLatLng();
              map.flyToBounds([location], {maxZoom: 6});
            }, 50);
          },
        }}
        style={{filter: 'hue-rotate(120deg)!important'}}
        className={'marker-color-red'}
      />
    );
  });
};

const MyMarkers = ({map, marker, setMarker, sidebar, setSelectedMarker, color}: any) => {
  useEffect(() => {
    if (!map) return;
    // @ts-ignore
    const legend = control({position: 'bottomleft'});

    const info = DomUtil.create('div', 'legend');

    legend.onAdd = () => {
      info.textContent = `click on the map, move the marker, click on the marker`;
      return info;
    };

    if (setMarker)
      map.on('click', (e: any) => {
        const {lat, lng} = e.latlng;
        setMarker((mar: any) => [...mar, [lat, lng]]);
      });
  }, [map]);

  return marker.length > 0 ? (
    <ShowMarkers
      map={map}
      color={color}
      setSelectedMarker={setSelectedMarker}
      sidebar={sidebar}
      markers={marker}
    />
  ) : null;
};

function UserMap({
                   mutateSelectCountries,
                   isLoading,
                   visCountries,
                   intCountries,
                   setVisitedCountries,
                   setinterestedCountries,
                   userId,
                 }: any) {
  const [map, setMap] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState<any>(false);
  const [geoDate, setGeoDate] = useState<any>(null);
  const [openedModal, setOpenedModal] = useState(false);
  const [auxCountry, setAuxCountry] = useState('');
  const [initVisitedCountries, setInitVisitedCountries] = useState<any>([]);
  const [initInterestedCountries, setInitInterestedCountries] = useState<any>([]);

  const {user} = useStore((state: any) => state);

  useEffect(() => {
    if (geoDate == null) fetchGeoJsonData(setGeoDate);
  }, []);

  useEffect(() => {
    setInitVisitedCountries(visCountries);
    setInitInterestedCountries(intCountries);
  }, [map]);

  const handlerSaveSelectedCountries = () => {
    mutateSelectCountries({
      interestedInCountries: intCountries,
      visitedCountries: visCountries,
    });
    setIsEditMode(false);
    setInitInterestedCountries(intCountries);
    setInitVisitedCountries(visCountries);
  }

  const handlerCancelSelection = () => {
    setIsEditMode(false);
    setinterestedCountries(initInterestedCountries);
    setVisitedCountries(initVisitedCountries);
  }

  return <Box mb={20}>
    <Modal
      opened={openedModal}
      onClose={() => setOpenedModal(false)}
      centered
      withCloseButton={false}
    >
      <Group position={'center'} mb={10}>
        <Badge>{auxCountry}</Badge>
      </Group>
      <Group position={'center'}>
        <Button
          color={'orange'}
          leftIcon={intCountries.includes(auxCountry) ? <TrashIcon/> : <CheckIcon/>}
          style={{width: '48%'}}
          onClick={() => {
            if (intCountries.includes(auxCountry)) {
              for (let i = 0; i < intCountries.length; i++)
                if (intCountries[i] === auxCountry)
                  setinterestedCountries((prev: any) =>
                    prev.filter((item: any) => item != auxCountry)
                  );
            } else {
              setinterestedCountries((prev: any) => [...prev, auxCountry]);
            }
            setOpenedModal(false);
          }}
        >
          {intCountries.includes(auxCountry) ? 'Delete from interested' : 'Interested'}
        </Button>
        <Button
          color={'green'}
          leftIcon={visCountries.includes(auxCountry) ? <TrashIcon/> : <CheckIcon/>}
          style={{width: '48%'}}
          onClick={() => {
            if (visCountries.includes(auxCountry)) {
              for (let i = 0; i < visCountries.length; i++)
                if (visCountries[i] === auxCountry)
                  setVisitedCountries((prev: any) =>
                    prev.filter((item: any) => item != auxCountry)
                  );
            } else {
              setVisitedCountries((prev: any) => [...prev, auxCountry]);
            }
            setOpenedModal(false);
          }}
        >
          {visCountries.includes(auxCountry) ? 'Delete from visited' : 'Visited'}
        </Button>
      </Group>
    </Modal>
    <Group position={'apart'} mb={5} mt={5}>
      <Box> </Box>
      <Box>
        {user?.id == userId &&
          !(
            [...initVisitedCountries, ...initInterestedCountries].length !=
            [...visCountries, ...intCountries].length && map
          ) && (
            <Switch
              size="md"
              offLabel="Edit"
              checked={isEditMode}
              onChange={(event: any) => setIsEditMode(event.currentTarget.checked)}
            />
          )}
      </Box>
      <Group>
        {[...initVisitedCountries, ...initInterestedCountries].length !=
          [...visCountries, ...intCountries].length && map &&
          <>
            <ActionIcon
              color="blue"
              radius="xl"
              variant="filled"
              onClick={handlerSaveSelectedCountries}
            >
              <CheckIcon/>
            </ActionIcon>
            <ActionIcon
              color="red"
              radius="xl"
              variant="filled"
              onClick={handlerCancelSelection}
            >
              <Cross2Icon/>
            </ActionIcon>
          </>
        }
      </Group>
    </Group>
    <div className="map" style={{borderRadius: '10px', width: '100%'}}>
      <MapContainer
        style={{borderRadius: '10px', width: '100%'}}
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
        {/*<LocationButton/>*/}
        {/*<LoadingOverlay visible={isLoading || !geoDate}/>*/}
        <CustomTileLayer/>
        {/*<SearchField/>*/}
        {!isEditMode && geoDate && !openedModal && (
          <GeoJSONWithLayer
            setOpenedModal={setOpenedModal}
            data={geoDate}
            isEditMode={isEditMode}
            setAuxCountry={setAuxCountry}
            visCountries={visCountries}
            intCountries={intCountries}
            setVisitedCountries={setVisitedCountries}
            setInterestedCountries={setinterestedCountries}
            style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
          />
        )}
        {isEditMode && geoDate && !openedModal && (
          <GeoJSONWithLayer
            style={{weight: 0.01, fillColor: 'rgba(255,255,255,0)'}}
            setOpenedModal={setOpenedModal}
            data={geoDate}
            isEditMode={isEditMode}
            setAuxCountry={setAuxCountry}
            visCountries={visCountries}
            intCountries={intCountries}
            setVisitedCountries={setVisitedCountries}
            setInterestedCountries={setinterestedCountries}
          />
        )}
      </MapContainer>
    </div>
  </Box>
}

export default UserMap;
