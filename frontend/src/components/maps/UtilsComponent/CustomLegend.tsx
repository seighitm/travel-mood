import L from "leaflet";
import { useEffect } from "react";

const CustomLegend = ({map}: any) => {
  console.log(map);

  useEffect(() => {
    // get color depending on population density value
    const getColor = (d: any) => {
      return d > 1000
        ? "#800026"
        : d > 500
          ? "#BD0026"
          : d > 200
            ? "#E31A1C"
            : d > 100
              ? "#FC4E2A"
              : d > 50
                ? "#FD8D3C"
                : d > 20
                  ? "#FEB24C"
                  : d > 10
                    ? "#FED976"
                    : "#FFEDA0";
    };

    // @ts-ignore
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div: any = L.DomUtil.create("div", "info legend");
      const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
      let labels: any = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
          getColor(from + 1) +
          '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels;
      return div;
    };

    legend.addTo(map);
  });
  return null;
};

export default CustomLegend;
