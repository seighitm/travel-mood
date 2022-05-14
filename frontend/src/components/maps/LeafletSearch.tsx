import {useEffect} from "react";
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {useMap} from "react-leaflet";

function LeafletGeoSearch() {
  const map = useMap();
  const provider = new OpenStreetMapProvider();
  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider,
    showMarker: false,
    searchLabel: "Buscar dirección",
    style: "bar"
  });
  // @ts-ignore
  useEffect(() => {
    map.addControl(searchControl);
    // clic on map after loss focus because search
    const inputContent : any= document.querySelector(".glass ");
    const mapContainer: any = document.getElementById('mapContainer');
    inputContent.onblur = function () {
      mapContainer.click();
    };

    return () => map.removeControl(searchControl);
  });
  return null;
}

export default LeafletGeoSearch
