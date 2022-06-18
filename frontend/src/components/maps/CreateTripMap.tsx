import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON as LeafletGeoJSON, Icon, latLng } from 'leaflet';
import { ActionIcon, Badge, Group, LoadingOverlay, Text } from '@mantine/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { apiFetchGeoJsonData } from '../../api/map/axios';
import CustomTileLayer from './UtilsComponent/CustomTileLayer';
import { GeoJSON, Marker, Polyline, Popup } from 'react-leaflet';
import CustomMapContainer from './UtilsComponent/CustomMapContainer';
import './UtilsComponent/LeafletFullscreen/Leaflet.fullscreen.min';
import blueIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-blue.png';
import greenIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-green.png';
import redIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-red.png';
import blueIconShadow from './UtilsComponent/svg-map-markers/img/marker-shadow.png';
import MarkerSetModal from '../trip/CreateTrip/MarkerSetModal';
import { isNullOrUndefined } from '../../utils/primitive-checks';
import LeafletControlGeocoder from './UtilsComponent/LeafletControlGeocoder';
import { Trash } from '../common/Icons';
import './MapStyles.css';

function isMarkerInsidePolygon(marker: any, poly: any) {
  let intersect, xj, yj, xi, yi, x, y, polyPoints;
  let inside = false;
  if (poly.type == 'Polygon') {
    polyPoints = poly.coordinates[0];
    for (let k = 0; k <= marker.length; k++) {
      x = marker[k]?.place[1];
      y = marker[k]?.place[0];
      for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        xi = polyPoints[i][0];
        yi = polyPoints[i][1];
        xj = polyPoints[j][0];
        yj = polyPoints[j][1];
        intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      if (inside) return true;
    }
  } else if (poly.type == 'MultiPolygon') {
    if (marker.length != 0 && !isNullOrUndefined(marker[0]))
      for (let a = 0; a < poly.coordinates.length; a++) {
        polyPoints = poly.coordinates[a][0];
        for (let k = 0; k <= marker.length; k++) {
          x = marker[k]?.place[1];
          y = marker[k]?.place[0];
          for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            xi = polyPoints[i][0];
            yi = polyPoints[i][1];
            xj = polyPoints[j][0];
            yj = polyPoints[j][1];
            intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
          }
          if (inside) return true;
        }
        if (inside) inside = !inside;
      }
  }
  return inside;
}

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) {
      layer.clearLayers().addData(props.data);
    }
  }, [props.data, props.pathOptions, props.style, props.geoIndex]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let popupContent = '';
    if (feature.properties && feature.properties.admin) {
      popupContent = feature.properties.admin;
    }

    if (isMarkerInsidePolygon(props.allMarkers, feature.geometry)) {
      layer.setStyle({
        fillColor: '#228be6',
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
        const { lat, lng } = e.latlng;
        props.setOpenedModal(true);
        props.setAuxPlace([lat, lng]);
        props.setGeoIndex((prev: any) => prev + 1);
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
  return (
    <GeoJSON
      {...props}
      key={props.geoIndex}
      onEachFeature={handleOnEachFeature}
      ref={geoJsonLayerRef}
    />
  );
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

const calculateTotalDistance = (setTotalDistance: any, allMarkers: any) => {
  let sum: any = 0;
  if (!isNullOrUndefined(allMarkers)) {
    for (let i = 1; i < allMarkers.length; i++) {
      let latlng1 = latLng(allMarkers[i - 1].place[0], allMarkers[i - 1].place[1]);
      let latlng2 = latLng(allMarkers[i].place[0], allMarkers[i].place[1]);
      let distance = latlng1.distanceTo(latlng2) / 1000;
      sum += distance;
    }
    setTotalDistance(sum);
  }
};

const MyMarkers = ({ setGeoIndex, map, setTotalDistance, allMarkers, setAllMarkers }: any) => {
  const popupRef = useRef<any>(null);
  calculateTotalDistance(setTotalDistance, allMarkers);

  return allMarkers.length > 0
    ? allMarkers.map((item: any, index: number) => {
        return (
          <Marker
            // @ts-ignore
            uniceid={index}
            key={index}
            position={item.place}
            draggable={true}
            icon={
              new Icon({
                iconUrl:
                  index == 0 ? redIcon : index == allMarkers.length - 1 ? greenIcon : blueIcon,
                shadowUrl: blueIconShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })
            }
            eventHandlers={{
              moveend(e: any) {
                setGeoIndex((prev: any) => prev + 1);
                const { lat, lng } = e.target.getLatLng();
                allMarkers[index].place = [lat, lng];
                setAllMarkers(allMarkers);
              },
              click(e: any) {
                setGeoIndex((prev: any) => prev + 1);
              },
              add(e: any) {
                setGeoIndex((prev: any) => prev + 1);
              },
            }}
          >
            <Popup ref={popupRef} closeOnEscapeKey={true} autoClose={true} closeOnClick={true}>
              <Group position={'center'} spacing={0}>
                <Text size={'sm'}>{item.description}</Text>
                <ActionIcon
                  color="red"
                  onClick={() => {
                    removeMarker(index, map, setAllMarkers);
                    setGeoIndex((prev: any) => prev + 1);
                    popupRef.current._closeButton.click();
                  }}
                >
                  <Trash size={15} />
                </ActionIcon>
              </Group>
            </Popup>
          </Marker>
        );
      })
    : null;
};

interface CreateTripMapComponentProps {
  setDestinations: Dispatch<React.SetStateAction<any>>;
  allMarkers: any[];
  setAllMarkers: Dispatch<React.SetStateAction<any>>;
}

const CreateTripMap = React.memo(
  ({ setDestinations, allMarkers, setAllMarkers }: CreateTripMapComponentProps) => {
    const [geoDate, setGeoDate] = useState<null | any>(null);
    const [map, setMap] = useState<any>(null);
    const [openedMarkerModal, setOpenedMarkerModal] = useState(false);
    const [currentMarker, setCurrentMarker] = useState<any>(null);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [geoIndex, setGeoIndex] = useState(1);

    useEffect(() => {
      const fetchGeo = async () => await apiFetchGeoJsonData(setGeoDate);
      if (geoDate == null) {
        fetchGeo();
      }
    }, []);

    const handlerCreateMarker = (desc: any) => {
      setAllMarkers((prev: any) => [...prev, { place: currentMarker, description: desc }]);
      setOpenedMarkerModal(false);
    };

    useEffect(() => {
      const array: any = [];
      for (let i = 0; i < geoDate?.features.length; i++) {
        if (isMarkerInsidePolygon(allMarkers, geoDate.features[i].geometry))
          array.push({
            countryName: geoDate.features[i].properties.admin,
            countryCode: geoDate.features[i]?.properties.iso_a2,
          });
      }
      setDestinations([...array]);
    }, [allMarkers, geoDate, geoIndex]);

    return (
      <>
        {useMemo(
          () => (
            <MarkerSetModal
              openedMarkerModal={openedMarkerModal}
              setOpenedMarkerModal={setOpenedMarkerModal}
              handlerCreateMarker={handlerCreateMarker}
            />
          ),
          [openedMarkerModal]
        )}
        <div className="map" id="map" style={{ borderRadius: '10px' }}>
          <CustomMapContainer setMap={setMap}>
            <LoadingOverlay visible={!geoDate} />
            <LeafletControlGeocoder position={'topleft'} />

            <CustomTileLayer />
            {geoDate && (
              <GeoJSONWithLayer
                setGeoIndex={setGeoIndex}
                geoIndex={geoIndex}
                setAuxPlace={setCurrentMarker}
                setOpenedModal={setOpenedMarkerModal}
                setDestinations={setDestinations}
                data={geoDate}
                auxMarker={currentMarker}
                allMarkers={allMarkers}
                style={{ weight: 0.01, fillColor: 'rgba(255,255,255,0)' }}
              />
            )}
            <>
              <MyMarkers
                setTotalDistance={setTotalDistance}
                setGeoIndex={setGeoIndex}
                map={map}
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
          </CustomMapContainer>
        </div>
        {totalDistance != 0 && (
          <Group mt={'md'} position={'center'}>
            <Badge variant={'outline'} size={'lg'}>
              {Math.floor(totalDistance)} km
            </Badge>
          </Group>
        )}
      </>
    );
  }
);

export default CreateTripMap;
