import {control, DomUtil} from "leaflet";

const colors = ['fe4848', 'fe6c58', 'fe9068', 'feb478', 'fed686'];
const labels = ['2-12.5', '12.6-16.8', '16.9-20.9', '21-25.9', '26-plus'];

const LegendComponent = ({ map }: any) => {
  // @ts-ignore
  const legend = control({ position: 'bottomleft' });

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
  return null;
};

export default LegendComponent
