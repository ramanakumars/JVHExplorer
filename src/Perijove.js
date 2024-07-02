import { useEffect, useState } from "react";
import { MapContainer, Popup, ImageOverlay, Polygon } from "react-leaflet";
import { CRS } from "leaflet";
import vortexdata from './media/vortices.json';

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

const round = (number) => Math.round(number * 100) / 100;

function get_points(ellipse_params) {
  const N = 30;
  const angles = [...Array(N).keys()].map(
    (number) => (number * 2 * Math.PI) / (N - 1)
  );
  const ellipse = angles.map((angle) => [
    ellipse_params.rx * Math.cos(angle),
    ellipse_params.ry * Math.sin(angle),
  ]);

  return ellipse.map((point) => [
    point[0] * Math.cos(ellipse_params.angle) -
      point[1] * Math.sin(ellipse_params.angle),
    point[0] * Math.sin(ellipse_params.angle) +
      point[1] * Math.cos(ellipse_params.angle),
  ]);
}

const radians = (angle) => (angle * Math.PI) / 180;
const degrees = (angle) => (angle * 180) / Math.PI;

function convert_to_lonlat(x, y, lon0, lat0) {
  // find the distance in pixel coordinates from the center
  const dx = x;
  const dy = -y; // opposite to x because of image inversion

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

function Ellipse({ ellipse_params, lon0, lat0, color, children }) {
  const points = get_points(ellipse_params);

  const positions = points.map((point) =>
    convert_to_lonlat(point[0], point[1], lon0, lat0)
  );

  return (
    <Polygon positions={positions} pathOptions={{ color: color }} opacity={0.3}>
      {children}
    </Polygon>
  );
}

export default function Perijove({ perijove }) {
  const [vortices, setVortices] = useState([]);

  useEffect(() => {
    console.log(vortexdata.length);
    setVortices(
      vortexdata.filter(
        (vortex) =>
          Number(vortex.perijove) === Number(perijove) &&
          Number(vortex.num_extracts) > 8
      )
    );
  }, []);

  if (vortices.length > 0) {
    return (
      <div className="w-full p-4 m-2 flex justify-center">
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
            interactive={true}
          />
          {vortices.map((vortex) => (
            <VortexEllipse vortex={vortex} key={vortex.lon + vortex.lat} />
          ))}
        </MapContainer>
      </div>
    );
  }
}

const VortexEllipse = ({ vortex }) => {
  var loni = 180 - vortex.lon;
  if (loni < 0) {
    loni += 360;
  }
  const ellipse_params = {
    rx: vortex.rx,
    ry: vortex.ry,
    angle: radians(vortex.angle),
  };
  return (
    <Ellipse
      ellipse_params={ellipse_params}
      lon0={loni}
      lat0={vortex.lat}
      color={colors[vortex.color]}
    >
      <VortexPopup vortex={vortex} />
    </Ellipse>
  );
};

function VortexPopup({ vortex }) {
  return (
    <Popup>
      <div className="flex flex-col container [&>span]:p-1">
        <span>
          Sys III Lon/Lat: ({vortex.lon}, {vortex.lat})
        </span>
        <span>
          Color: {vortex.color} ({round(vortex.colors[vortex.color] * 100)}%)
        </span>
        <span>Perijove: {vortex.perijove}</span>
        <span>
          Size: {round(vortex.physical_width / 1000)} km x{" "}
          {round(vortex.physical_height / 1000)} km{" "}
        </span>
        <span># of classifications: {vortex.num_extracts} </span>
        <span>Vortex size confidence: {round(vortex.probability * 100)}% </span>
        <span>
          <a href={"/vortex/" + vortex.id}>See more</a>
        </span>
      </div>
    </Popup>
  );
}
