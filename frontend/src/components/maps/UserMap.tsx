import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { ActionIcon, Badge, Box, Button, Group, Image, Modal, Switch } from '@mantine/core';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { apiFetchGeoJsonData } from '../../api/map/axios';
import CustomTileLayer from './UtilsComponent/CustomTileLayer';
import { GeoJSON } from 'react-leaflet';
import useStore from '../../store/user.store';
import { Check, Trash, X } from '../common/Icons';
import CustomMapContainer from './UtilsComponent/CustomMapContainer';
import './UtilsComponent/LeafletFullscreen/Leaflet.fullscreen.min';
import { useMutateUserProfileUpdateMap } from '../../api/users/mutations';
import LeafletControlGeocoder from './UtilsComponent/LeafletControlGeocoder';
import './MapStyles.css';

const GeoJSONWithLayer = (props: any) => {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const { data, pathOptions, style, visCountries, intCountries, setAuxCountry, setOpenedModal } =
    props;

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
    if (feature.properties && feature.properties.iso_a2) countryCode = feature.properties.iso_a2;

    const findLocationVisited = visCountries.find((item: any) => item.code == countryCode);
    const findLocationInterested = intCountries.find((item: any) => item.code == countryCode);

    if (findLocationVisited != undefined && findLocationInterested === undefined) {
      layer.setStyle({
        fillColor: '#40c057',
        weight: 0.01,
        color: '#40c057',
      });
    } else if (findLocationVisited === undefined && findLocationInterested != undefined) {
      layer.setStyle({
        fillColor: '#fd7e14',
        weight: 0.01,
        color: '#fd7e14',
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
          setAuxCountry({ code: countryCode, name: popupContent });
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

  return (
    <GeoJSON
      {...props}
      ref={geoJsonLayerRef}
      onEachFeature={handleOnEachFeature}
      index={props.geoIndex}
      key={props.geoIndex}
    />
  );
};

interface UserMapComponentProps {
  visCountries: {
    code: string;
    name: string;
  }[];
  intCountries: {
    code: string;
    name: string;
  }[];
  setVisitedCountries: Dispatch<React.SetStateAction<any>>;
  setInterestedCountries: Dispatch<React.SetStateAction<any>>;
  userId: string | undefined;
}

function UserMap({
  visCountries,
  intCountries,
  setVisitedCountries,
  setInterestedCountries,
  userId,
}: UserMapComponentProps) {
  const [map, setMap] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState<any>(false);
  const [geoDate, setGeoDate] = useState<any>(null);
  const [openedModal, setOpenedModal] = useState(false);
  const [auxCountry, setAuxCountry] = useState<any>({ name: '', code: '' });
  const [initVisitedCountries, setInitVisitedCountries] = useState<any>([]);
  const [initInterestedCountries, setInitInterestedCountries] = useState<any>([]);
  const [geoIndex, setGeoIndex] = useState<any>(0);

  const { mutate: mutateUpdateUserCountries } = useMutateUserProfileUpdateMap();
  const { user } = useStore((state: any) => state);

  const checkIfInterestedCountryExist =
    intCountries.find((prev: any) => prev.code == auxCountry.code) == undefined;
  const checkIfVisitedCountryExist =
    visCountries.find((prev: any) => prev.code == auxCountry.code) == undefined;

  useEffect(() => {
    const fetchGeo = async () => {
      await apiFetchGeoJsonData(setGeoDate);
    };
    if (geoDate == null) {
      fetchGeo();
    }
  }, []);

  useEffect(() => {
    setInitVisitedCountries(visCountries);
    setInitInterestedCountries(intCountries);
  }, [map]);

  const handlerSaveSelectedCountries = () => {
    mutateUpdateUserCountries({
      interestedInCountries: intCountries.map((c: any) => c.code),
      visitedCountries: visCountries.map((c: any) => c.code),
    });
    setIsEditMode(false);
    setInitInterestedCountries(intCountries);
    setInitVisitedCountries(visCountries);
  };

  const handlerCancelSelection = () => {
    setIsEditMode(false);
    setInterestedCountries(initInterestedCountries);
    setVisitedCountries(initVisitedCountries);
  };

  const handlerAddNewCountry = (type: string) => {
    if (type == 'interested') {
      if (intCountries.find((prev: any) => prev.code == auxCountry.code) !== undefined)
        for (let i = 0; i < intCountries.length; i++) {
          if (intCountries[i].code === auxCountry.code) {
            setInterestedCountries((prev: any) =>
              prev.filter((item: any) => item.code != auxCountry.code)
            );
          }
        }
      else {
        setInterestedCountries((prev: any) => [...prev, auxCountry]);
      }
    } else if (type == 'visited') {
      if (visCountries.find((prev: any) => prev.code == auxCountry.code) !== undefined)
        for (let i = 0; i < visCountries.length; i++) {
          if (visCountries[i].code === auxCountry.code) {
            setVisitedCountries((prev: any) =>
              prev.filter((item: any) => item.code != auxCountry.code)
            );
          }
        }
      else {
        setVisitedCountries((prev: any) => [...prev, auxCountry]);
      }
    }
    setOpenedModal(false);
  };

  useEffect(() => {
    setGeoIndex((prev: any) => prev + 1);
  }, [isEditMode]);

  return (
    <Box mb={'xs'}>
      <Modal
        opened={openedModal}
        onClose={() => setOpenedModal(false)}
        centered
        withCloseButton={false}
      >
        <Group position={'center'} mb={10}>
          <Badge
            size={'lg'}
            variant={'outline'}
            leftSection={
              <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                <Image
                  width={15}
                  withPlaceholder
                  styles={() => ({ image: { marginBottom: '0px!important' } })}
                  src={`${
                    import.meta.env.VITE_API_URL
                  }uploads/flags/${auxCountry.code.toLowerCase()}.svg`}
                />
              </ActionIcon>
            }
          >
            {auxCountry?.name}
          </Badge>
        </Group>
        <Group position={'center'}>
          <Button
            compact
            color={'orange'}
            leftIcon={checkIfInterestedCountryExist ? <Check size={17} /> : <Trash size={17} />}
            style={{ width: '45%' }}
            onClick={() => handlerAddNewCountry('interested')}
            variant={checkIfInterestedCountryExist ? 'outline' : 'filled'}
          >
            {checkIfInterestedCountryExist ? 'Interested' : 'Delete from interested'}
          </Button>
          <Button
            compact
            color={'green'}
            leftIcon={checkIfVisitedCountryExist ? <Check size={17} /> : <Trash size={17} />}
            style={{ width: '45%' }}
            variant={checkIfVisitedCountryExist ? 'outline' : 'filled'}
            onClick={() => handlerAddNewCountry('visited')}
          >
            {checkIfVisitedCountryExist ? 'Visited' : 'Delete from visited'}
          </Button>
        </Group>
      </Modal>
      <Group position={'center'} my={5}>
        {user?.id == userId && !isEditMode && (
          <Switch
            size="md"
            offLabel="Edit"
            checked={isEditMode}
            onChange={(event: any) => setIsEditMode(event.currentTarget.checked)}
          />
        )}
      </Group>
      {isEditMode && (
        <Group mb={10} position={'center'}>
          <Button
            compact
            color="blue"
            radius="xl"
            size={'xs'}
            variant="filled"
            onClick={handlerSaveSelectedCountries}
            leftIcon={<Check size={15} />}
          >
            Save
          </Button>
          <Button
            compact
            color="red"
            radius="xl"
            size={'xs'}
            variant="filled"
            onClick={handlerCancelSelection}
            leftIcon={<X size={15} />}
          >
            Close
          </Button>
        </Group>
      )}
      <div className="map" style={{ height: '400px', borderRadius: '10px', width: '100%' }}>
        <CustomMapContainer fullScreen={false} setMap={setMap}>
          <LeafletControlGeocoder position={'topright'} />
          <CustomTileLayer />
          {geoDate && !openedModal && (
            <GeoJSONWithLayer
              geoIndex={geoIndex}
              setOpenedModal={setOpenedModal}
              data={geoDate}
              isEditMode={isEditMode}
              setAuxCountry={setAuxCountry}
              visCountries={visCountries}
              intCountries={intCountries}
              setVisitedCountries={setVisitedCountries}
              setInterestedCountries={setInterestedCountries}
              style={{ weight: 0.01, fillColor: 'rgba(255,255,255,0)' }}
            />
          )}
        </CustomMapContainer>
      </div>
    </Box>
  );
}

export default UserMap;
