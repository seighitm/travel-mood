import { TileLayer } from 'react-leaflet';
import React from 'react';
import '../MapStyles.css';

const layers = [
  {
    name: 'Osm Mapnik',
    attribution:
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>OpenStreetMap</a> contributors',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'CartoDB',
    attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a> contributors',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
  },
  {
    name: 'MapBox',
    attribution: '&copy; <a href="http://mapbox.com/attributions">MapBox</a> contributors',
    url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGlyaWQiLCJhIjoiY2t6bHBlbzJjMmc0NDJ2bnlkMmwzNTN1MyJ9.jyycnid2213OTovovGJC1A`,
  },
];

export const CustomTileLayer = () => {
  return (
    <TileLayer
      tileSize={512}
      zoomOffset={-1}
      noWrap={true}
      url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGlyaWQiLCJhIjoiY2t6bHBlbzJjMmc0NDJ2bnlkMmwzNTN1MyJ9.jyycnid2213OTovovGJC1A`}
    />
  );
};

export default CustomTileLayer;
