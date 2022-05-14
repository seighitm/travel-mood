import React, {useEffect} from 'react';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {useMap} from 'react-leaflet';

export const SearchField = () => {
  const provider = new OpenStreetMapProvider();
  const searchControl: any = GeoSearchControl({
    provider: provider,
    style: 'button',
    notFoundMessage: 'Sorry, that address could not be found.',
  });
  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, []);
  return null;
};
