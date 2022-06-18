import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import '../MapStyles.css';

const LocationButton = () => {
  const map = useMap();

  useEffect(() => {
    const customControl = L.Control.extend({
      options: {
        position: 'topleft',
        className: `locateButton leaflet-bar`,
        html: '<svg color="#4a4141" width="17" height="17" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.80687C10.6922 2.0935 12.8167 4.28012 13.0068 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.9888C12.7094 10.6244 10.6244 12.7094 8 12.9888V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V13.0068C4.28012 12.8167 2.0935 10.6922 1.80687 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H1.78886C1.98376 4.21166 4.21166 1.98376 7 1.78886V0.5C7 0.223858 7.22386 0 7.5 0ZM8 12.0322V9.5C8 9.22386 7.77614 9 7.5 9C7.22386 9 7 9.22386 7 9.5V12.054C4.80517 11.8689 3.04222 10.1668 2.76344 8H5.5C5.77614 8 6 7.77614 6 7.5C6 7.22386 5.77614 7 5.5 7H2.7417C2.93252 4.73662 4.73662 2.93252 7 2.7417V5.5C7 5.77614 7.22386 6 7.5 6C7.77614 6 8 5.77614 8 5.5V2.76344C10.1668 3.04222 11.8689 4.80517 12.054 7H9.5C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8H12.0322C11.7621 10.0991 10.0991 11.7621 8 12.0322Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>',
        style:
          'align-items: center; width: 20px; height: 20px; left: 0; margin-top: 0; display: flex; cursor: pointer; justify-content: center; font-size: 2rem; ',
      },
      onAdd: function (map: any) {
        // @ts-ignore
        this._map = map;
        const button = L.DomUtil.create('div');
        L.DomEvent.disableClickPropagation(button);
        button.title = 'locate';
        button.innerHTML = this.options.html;
        button.className = this.options.className;
        button.setAttribute('style', this.options.style);
        L.DomEvent.on(button, 'click', this._clicked, this);
        return button;
      },
      _clicked: function (e: any) {
        L.DomEvent.stopPropagation(e);
        this._checkLocate();
        return;
      },
      _checkLocate: function () {
        return this._locateMap();
      },
      _locateMap: function () {
        const locateActive: any = document.querySelector('.locateButton');
        const locate = locateActive.classList.contains('locateActive');
        locateActive.classList[locate ? 'remove' : 'add']('locateActive');
        if (locate) {
          this.removeLocate();
          // @ts-ignore
          this._map.stopLocate();
          return;
        }
        // @ts-ignore
        this._map.on('locationfound', this.onLocationFound, this);
        // @ts-ignore
        this._map.on('locationerror', this.onLocationError, this);
        // @ts-ignore
        this._map.locate({ setView: true, enableHighAccuracy: true });
      },
      onLocationFound: function (e: any) {
        this.addCircle(e).addTo(this.featureGroup()).addTo(map);
        this.addMarker(e).addTo(this.featureGroup()).addTo(map);
      },
      onLocationError: function (e: any) {
        this.addLegend('Location access denied.');
      },
      featureGroup: function () {
        return new L.FeatureGroup();
      },
      addLegend: function (text: string) {
        const checkIfDescriotnExist = document.querySelector('.description');
        if (checkIfDescriotnExist) {
          checkIfDescriotnExist.textContent = text;
          return;
        }
        // @ts-ignore
        const legend = L.control({ position: 'bottomleft' });
        legend.onAdd = function () {
          let div = L.DomUtil.create('div', 'description');
          L.DomEvent.disableClickPropagation(div);
          div.insertAdjacentHTML('beforeend', text);
          return div;
        };
        // @ts-ignore
        legend.addTo(this._map);
      },
      addCircle: function ({
        accuracy,
        latitude,
        longitude,
      }: {
        latitude: number;
        longitude: number;
        accuracy: number;
      }) {
        return L.circle([latitude, longitude], accuracy / 2, {
          className: 'circle-test',
          weight: 2,
          stroke: false,
          fillColor: '#136aec',
          fillOpacity: 0.15,
        });
      },
      addMarker: function ({ latitude, longitude }: { latitude: number; longitude: number }) {
        return L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'locatedAnimation',
            iconSize: L.point(17, 17),
            popupAnchor: [0, -15],
          }),
        }).bindPopup('Your are here :)');
      },
      removeLocate: function () {
        // @ts-ignore
        this._map.eachLayer(function (layer: any) {
          if (layer instanceof L.Marker) {
            const { icon } = layer.options;
            if (icon?.options.className === 'locatedAnimation') {
              map.removeLayer(layer);
            }
          }
          if (layer instanceof L.Circle) {
            if (layer.options.className === 'circle-test') {
              map.removeLayer(layer);
            }
          }
        });
      },
    });
    map.addControl(new customControl());
  }, [map]);
  return null;
};

export default LocationButton;
