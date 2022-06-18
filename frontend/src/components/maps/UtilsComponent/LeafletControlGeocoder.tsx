import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { Control } from 'leaflet';
import '../MapStyles.css';

export default function LeafletControlGeocoder({ position }: { position: string }) {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    let geocoder = Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== 'undefined' && location.search) {
      const params = new URLSearchParams(location.search);
      const geocoderString = params.get('geocoder');
      // @ts-ignore
      if (geocoderString && Control.Geocoder[geocoderString]) {
        // @ts-ignore
        geocoder = Control.Geocoder[geocoderString]();
      } else if (geocoderString) {
        console.warn('Unsupported geocoder', geocoderString);
      }
    }
    // @ts-ignore
    Control.geocoder({
      position: position ?? 'topleft',
      query: '',
      placeholder: 'Search here...',
      defaultMarkGeocode: false,
      geocoder,
    })
      .on('markgeocode', function (e: any) {
        map.fitBounds(e.geocode.bbox, { animate: true, duration: 5.0 });
      })
      .addTo(map);
  }, []);

  return null;
}
