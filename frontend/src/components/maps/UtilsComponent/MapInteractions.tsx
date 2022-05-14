import {useMapEvent} from "react-leaflet";

function SetViewOnClick({ animateRef }: any) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });
  return null;
}
