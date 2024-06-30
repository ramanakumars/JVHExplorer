import vorticesdata from './media/vortices.json';
import { useRef } from "react";
import {
  MapContainer,
  Popup,
  ImageOverlay,
  Polygon,
} from "react-leaflet";
import { CRS } from "leaflet";

const flat = 0.06487;
const beta = 1 / (1 - flat);
const re = 71492e3;
const rp = re / beta;
const pixscale = 7000e3 / 384;

const colors = {
  red: "red",
  brown: "brown",
  white: "blue",
  dark: "black",
};

function get_points(ellipse_params) {
  const x = ellipse_params[0];
  const y = ellipse_params[1];
  const rx = ellipse_params[2];
  const ry = ellipse_params[3];
  const a = radians(ellipse_params[4]);

  const N = 30;
  const angles = [...Array(N).keys()].map(
    (number) => (number * 2 * Math.PI) / (N - 1)
  );
  const ellipse = angles.map((angle) => [
    rx * Math.cos(angle),
    ry * Math.sin(angle),
  ]);

  return ellipse.map((point) => ([point[0] * Math.cos(a) - point[1] * Math.sin(a) + x, point[0] * Math.sin(a) + point[1] * Math.cos(a) + y]));

}

const radians = (angle) => (angle * Math.PI) / 180;
const degrees = (angle) => (angle * 180) / Math.PI;

function convert_to_lonlat(x, y, x0, y0, lon0, lat0) {
  // find the distance in pixel coordinates from the center
  const dx = x - x0;
  const dy = y0 - y; // opposite to x because of image inversion

  // calculate the shape factors
  const rln = re / Math.sqrt(1 + ((rp / re) * Math.tan(radians(lat0))) ** 2);
  const rlt =
    rln /
    (Math.cos(radians(lat0)) *
      (Math.sin(radians(lat0)) ** 2 +
        ((re / rp) * Math.cos(radians(lat0))) ** 2));

  // difference between image center to pixel in degrees
  const dlat = degrees(dy * (pixscale / rlt));
  const dlon = degrees(dx * (pixscale / rln));

  return [lat0 + dlat, lon0 - dlon];
}

function Ellipse({ ellipse_params, x0, y0, lon0, lat0, color, children }) {
  const points = get_points(ellipse_params);

  const positions = points.map((point) =>
    convert_to_lonlat(point[0], point[1], x0, y0, lon0, lat0)
  );

  console.log(color);

  return (
    <Polygon positions={positions} pathOptions={{ color: color }} opacity={0.3}>
      {children}
    </Polygon>
  );
}

function VortexPopup({ vortex }) {
  return (
    <Popup>
      Position: ({vortex.lon}, {vortex.lat}). <br />
      Color: {vortex.color} <br />
      Perijove: {vortex.perijove}
    </Popup>
  );
}

export default function Perijove({ perijove }) {
  const vortices = vorticesdata.filter(
    (vortex) =>
      Number(vortex.perijove) === Number(perijove) && Number(vortex.sigma) < 0.4
  );

  return (
      <div className='w-full p-4 m-2 flex justify-center'>
        <MapContainer
          center={[0, 180]}
          zoom={2}
          scrollWheelZoom={true}
          crs={CRS.Simple}
        >
          <ImageOverlay
            bounds={[
              [90, 0],
              [-90, 360],
            ]}
            url={"/PJs/PJ" + perijove + "/globe_mosaic_highres.png"}
          />
          {vortices.map((vortex) => {
            var loni = 180 - vortex.lon;
            if (loni < 0) {
              loni += 360;
            }
            const ellipse_params = [
              vortex.x,
              vortex.y,
              vortex.rx,
              vortex.ry,
              vortex.angle,
            ];
            return (
              <Ellipse
                ellipse_params={ellipse_params}
                x0={0}
                y0={0}
                lon0={loni}
                lat0={vortex.lat}
                color={colors[vortex.color]}
              >
                <VortexPopup vortex={vortex} />
              </Ellipse>
            );
            // return (<Marker position={[vortex.lat, loni]}>
            //     <Popup>
            //         Position: ({vortex.lon}, {vortex.lat}). Color: {vortex.color}
            //     </Popup>
            // </Marker>)
          })}
        </MapContainer>
      </div>
  );
}
