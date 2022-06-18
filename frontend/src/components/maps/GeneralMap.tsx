import React, { FC, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Text,
} from '@mantine/core';
import { CustomLoader } from '../common/CustomLoader';
import { Link, useNavigate } from 'react-router-dom';
import {
  FeatureGroup,
  GeoJSON,
  LayersControl,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import blueIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-blue.png';
import redIcon from './UtilsComponent/svg-map-markers/img/marker-icon-2x-red.png';
import blueIconShadow from './UtilsComponent/svg-map-markers/img/marker-shadow.png';
import { useGetAllMarkers, useGetTripsByMarkerId } from '../../api/map/queries';
import { apiFetchGeoJsonData } from '../../api/map/axios';
import CustomTileLayer from './UtilsComponent/CustomTileLayer';
import LocationButton from './UtilsComponent/LocationButton';
import './UtilsComponent/LeafletFullscreen/Leaflet.fullscreen.min';
import useStore from '../../store/user.store';
import { ROLE } from '../../types/enums';
import LeafletControlGeocoder from './UtilsComponent/LeafletControlGeocoder';
import CustomMapContainer from './UtilsComponent/CustomMapContainer';
import './MapStyles.css';
import CustomPaper from '../common/CustomPaper';
import { customNavigation, getFullUserName, userPicture } from '../../utils/utils-func';
import { ChevronRight } from '../common/Icons';

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const { data, style, destinations, type, pathOptions, setIsOpenedModal, setSelectedCountry } =
    props;

  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) layer.clearLayers().addData(data);
  }, [data, pathOptions, style, destinations]);

  const handleOnEachFeature = (feature: any, layer: any) => {
    let countryCode = '';
    let countryName = '';
    if (feature.properties && feature.properties.iso_a2) countryCode = feature.properties.iso_a2;
    if (feature.properties && feature.properties.admin) countryName = feature.properties.admin;

    const findLocation = destinations.find((item: any) => item.code == countryCode);
    const countMentions = findLocation?.[type]?.length;

    // if (findLocation != undefined) {
    //   if (countMentions == 1) {
    //     layer.setStyle({
    //       fillColor: type == 'visitedBy' ? 'rgba(190,159,78,100)' : 'rgb(142,180,183)',
    //       weight: 0.01,
    //       color: 'rgba(255,255,255,0)',
    //     });
    //   } else if (countMentions <= 5 && countMentions > 1) {
    //     layer.setStyle({
    //       fillColor: type == 'visitedBy' ? 'rgb(138 111 40)' : 'rgb(67,144,152)',
    //       weight: 0.01,
    //       color: 'rgba(255,255,255,0)',
    //     });
    //   } else if (countMentions <= 100000 && countMentions > 6) {
    //     layer.setStyle({
    //       fillColor: type == 'visitedBy' ? 'rgb(109 85 21)' : 'rgb(29,129,140)',
    //       weight: 0.01,
    //       color: 'rgba(255,255,255,0)',
    //     });
    //   }
    // }
    if (findLocation != undefined && countMentions !== 0) {
      layer.setStyle({
        fillColor: type == 'visitedBy' ? 'rgb(64, 192, 87)' : 'rgb(253, 126, 20)',
        weight: 0.01,
        color: 'rgba(255,255,255,0)',
      });
    }
    // layer.bindTooltip(, {direction: 'bottom'});

    if (
      findLocation != undefined &&
      (findLocation?.visitedBy?.length >= 1 || findLocation?.interestedInBy?.length >= 1)
    ) {
      let btnLabel = document.createElement('div');
      btnLabel.innerHTML = countryName;

      let btnEdit = document.createElement('button');
      btnEdit.innerHTML = `Users (${countMentions})`;
      btnEdit.className = 'popover-button';
      btnEdit.onclick = function () {
        setSelectedCountry({ ...findLocation, type: type });
        setIsOpenedModal(true);
      };

      let btnDiv = document.createElement('div');
      btnDiv.style.display = 'flex';
      btnDiv.style.flexDirection = 'column';
      btnDiv.style.alignItems = 'center';
      btnDiv.append(btnLabel);
      btnDiv.append(btnEdit);

      layer.bindPopup(btnDiv, {
        // autoClose: true,
        autoPan: true,
        closeButton: true,
        closeOnEscapeKey: true,
      });
    } else {
      // layer.bindPopup(popupContent + ' ' + (countMentions ? '[' + countMentions + ']' : ''), {
      layer.bindPopup(countryName, {
        autoClose: true,
        closeButton: false,
        closeOnEscapeKey: true,
      });
    }
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
        // layer.closePopup();
      },
    });
  };
  return <GeoJSON {...props} onEachFeature={handleOnEachFeature} ref={geoJsonLayerRef} />;
};

const ShowMarkers = ({ markers, selectedMarker, setSelectedMarker, tripIdAndTitle }: any) => {
  const popupRef = useRef<any>(null);
  const { user } = useStore((state: any) => state);

  return markers.map((marker: any, index: Element) => {
    return (
      <Marker
        // @ts-ignore
        key={index}
        uniceid={index}
        position={marker.latlon}
        draggable={false}
        style={{ filter: 'hue-rotate(120deg)!important' }}
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
            setSelectedMarker(marker.id);
          },
        }}
      >
        <Popup ref={popupRef}>
          <Group position={'center'} direction={'column'} spacing={'xs'}>
            {marker?.description != '' && <Text size={'sm'}>{marker.description}</Text>}
            <Text
              component={Link}
              to={(user?.role == ROLE.ADMIN ? '/admin/trips/' : '/trips/') + tripIdAndTitle.id}
            >
              Open
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
  tripIdAndTitle,
}: any) => {
  useEffect(() => {
    if (!map) return;
    if (setMarker)
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
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

function ClickOutsideOfMarker({ setSelectedMarker }: any) {
  useMapEvents({
    click() {
      setSelectedMarker(-1);
    },
  });
  return <></>;
}

const GeneralMap = () => {
  const [map, setMap] = useState<any>(null);
  const [geoDate, setGeoDate] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | string>(-1);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const { user } = useStore((state: any) => state);

  const { data: locations, isFetching } = useGetAllMarkers();
  const { data: tripMarkers, refetch, isLoading } = useGetTripsByMarkerId(selectedMarker);

  const navigate = useNavigate();

  useEffect(() => {
    if (geoDate == null) {
      apiFetchGeoJsonData(setGeoDate);
    }
  }, []);

  useEffect(() => {
    if (tripMarkers?.places?.find((marker: any) => marker.id == selectedMarker) == undefined) {
      refetch();
    }
  }, [selectedMarker]);

  if (isFetching) return <CustomLoader />;

  return (
    <>
      <Modal
        opened={isOpenedModal}
        onClose={() => setIsOpenedModal(false)}
        centered
        title={selectedCountry?.name}
      >
        <ScrollArea pr={'md'} offsetScrollbars style={{ height: 400 }}>
          {selectedCountry?.[selectedCountry?.type]?.length != 0 && (
            <div>
              <Divider
                my={'lg'}
                labelPosition="center"
                style={{ width: '100%' }}
                label={<Text>INTERESTED BY:</Text>}
              />
              {selectedCountry?.[selectedCountry?.type]?.map((item: any) => (
                <CustomPaper key={item?.id}>
                  <Group
                    pl={'sm'}
                    my={5}
                    noWrap
                    align={'center'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => customNavigation(user?.role, navigate, `/users/${item?.id}`)}
                  >
                    <Avatar size={'md'} radius={'xl'} src={userPicture(item)} />
                    <Box style={{ width: '70%' }}>
                      <Text lineClamp={1}>{getFullUserName(item)}</Text>
                    </Box>
                    <ActionIcon>
                      <ChevronRight />
                    </ActionIcon>
                  </Group>
                </CustomPaper>
              ))}
            </div>
          )}

          {selectedCountry?.[selectedCountry?.type !== 'visitedBy' ? 'visitedBy' : 'interestedInBy']
            ?.length != 0 && (
            <div>
              <Divider
                my={'lg'}
                labelPosition="center"
                style={{ width: '100%' }}
                label={<Text>VISITED BY:</Text>}
              />
              {selectedCountry?.[
                selectedCountry?.type !== 'visitedBy' ? 'visitedBy' : 'interestedInBy'
              ]?.map((item: any) => (
                <CustomPaper key={item?.id}>
                  <Group
                    pl={'sm'}
                    my={5}
                    noWrap
                    align={'center'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => customNavigation(user?.role, navigate, `/users/${item?.id}`)}
                  >
                    <Avatar size={'md'} radius={'xl'} src={userPicture(item)} />
                    <Box style={{ width: '70%' }}>
                      <Text lineClamp={1}>{getFullUserName(item)}</Text>
                    </Box>
                    <ActionIcon>
                      <ChevronRight />
                    </ActionIcon>
                  </Group>
                </CustomPaper>
              ))}
            </div>
          )}
        </ScrollArea>
      </Modal>
      <div
        className="map"
        style={{
          height: '86vh',
          borderRadius: '8px',
        }}
      >
        <LoadingOverlay visible={isLoading} />
        <CustomMapContainer fullScreen={false} setMap={setMap}>
          <ClickOutsideOfMarker setSelectedMarker={setSelectedMarker} />
          <LoadingOverlay visible={!geoDate || isFetching} />
          <CustomTileLayer />
          <LocationButton />
          <LeafletControlGeocoder position={'topleft'} />
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer name="InterestedInBy">
              <FeatureGroup pathOptions={{ color: 'purple' }}>
                {geoDate && !isFetching && (
                  <GeoJSONWithLayer
                    setIsOpenedModal={setIsOpenedModal}
                    setSelectedCountry={setSelectedCountry}
                    style={{ weight: 0.01, fillColor: 'rgba(255,255,255,0)' }}
                    type={'interestedInBy'}
                    destinations={locations.destinations}
                    data={geoDate}
                  />
                )}
              </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Visited">
              <FeatureGroup pathOptions={{ color: 'purple' }}>
                {geoDate && !isFetching && (
                  <GeoJSONWithLayer
                    setSelectedCountry={setSelectedCountry}
                    setIsOpenedModal={setIsOpenedModal}
                    style={{ weight: 0.01, fillColor: 'rgba(255,255,255,0)' }}
                    type={'visitedBy'}
                    destinations={locations.destinations}
                    data={geoDate}
                    setSelectedMarker={setSelectedMarker}
                    selectedMarker={selectedMarker}
                  />
                )}
              </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name="DisableLayer">
              <FeatureGroup pathOptions={{ color: 'purple' }}></FeatureGroup>
            </LayersControl.BaseLayer>
            {locations && (
              <LayersControl.Overlay name="Markers">
                <FeatureGroup>
                  {tripMarkers?.places && selectedMarker != -1 && (
                    <Polyline
                      color={'#1971c2'}
                      opacity={0.7}
                      weight={5}
                      positions={tripMarkers?.places.map((item: any) => [item.lon, item.lat])}
                    />
                  )}
                  {/*// @ts-ignore*/}
                  <MarkerClusterGroup>
                    <MyMarkers
                      tripIdAndTitle={{ id: tripMarkers?.id, title: tripMarkers?.title }}
                      setSelectedMarker={setSelectedMarker}
                      selectedMarker={selectedMarker}
                      map={map}
                      color={redIcon}
                      marker={locations?.places
                        ?.filter((i: any) => i.trip?.length != 0)
                        .map((item: any) => ({
                          id: item.id,
                          latlon: [item.lon, item.lat],
                          description: item.description,
                        }))}
                    />
                  </MarkerClusterGroup>
                </FeatureGroup>
              </LayersControl.Overlay>
            )}
          </LayersControl>
        </CustomMapContainer>
      </div>
    </>
  );
};

export default GeneralMap;
