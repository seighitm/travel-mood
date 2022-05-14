import React, {useEffect} from 'react';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {MapContainer, TileLayer, useMap, useMapEvent} from 'react-leaflet';
import {LoadingOverlay} from '@mantine/core';
import {control, DomUtil} from 'leaflet';

export const Search = (props: any) => {
  const map = useMap() // access to leaflet map
  const {provider} = props

  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider,
    })

    map.addControl(searchControl) // this is how you add a control in vanilla leaflet
    return () => map.removeControl(searchControl)
  }, [props])

  return null // don't want anything to show up from this comp
}


export const SearchField = () => {
  const provider = new OpenStreetMapProvider();
  const searchControl: any = GeoSearchControl({
    provider: provider,
    style: 'button',
    notFoundMessage: 'Sorry, that address could not be found.',
  });

  // console.log(map)
  // console.log(useMap())
  const map = useMap();
  useEffect(() => {
    if (map.addControl) {
      map.addControl(searchControl);
      return () => {
        map.removeControl(searchControl);
      };
    }
  }, [map]);
  return <></>
};


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

export const CustomMapContainer = ({geoDate, children, setMap}: any) => {
  return (
    <>
      <div className="map">
        <MapContainer
          // @ts-ignore
          fullscreenControl={true}
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
          {children}
          <SearchField/>
        </MapContainer>
      </div>
    </>
  );
};

const colors = ['fe4848', 'fe6c58', 'fe9068', 'feb478', 'fed686'];
const labels = ['2-12.5', '12.6-16.8', '16.9-20.9', '21-25.9', '26-plus'];

const Legend = ({map}: any) => {
  // useEffect(() => {
  // if (!map) return;

  // @ts-ignore
  const legend = control({position: 'bottomleft'});

  const rows: any = [];
  legend.onAdd = () => {
    const div = DomUtil.create('div', 'legend');
    colors.map((color: any, index: any) => {
      return rows.push(`
            <div class="row">
              <i style="background: #${color}"></i>${labels[index]}
            </div>
          `);
    });
    div.innerHTML = rows.join('');
    return div;
  };

  legend.addTo(map);
  // }, [map]);

  return null;
};

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

//#################
//<SetViewOnClick animateRef={animateRef}/>
//#################
function SetViewOnClick({animateRef}: any) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });

  return null;
}

function useLeaflet(): { map: any; } {
  throw new Error('Function not implemented.');
}

