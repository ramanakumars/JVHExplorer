import { Polygon, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const flat = 0.06487;
const beta = 1 / (1 - flat);
const re = 71492e3;
const rp = re / beta;
const pixscale = 7000e3 / 384;

export const round = (number) => Math.round(number * 100) / 100;

export const radians = (angle) => (angle * Math.PI) / 180;
export const degrees = (angle) => (angle * 180) / Math.PI;

export const colors = {
    red: "red",
    brown: "brown",
    white: "dodgerblue",
    dark: "#555",
    "white-brown": "sienna",
    "brown-white": "sienna",
    "white-red": "salmon",
    "red-white": "salmon",
    "brown-red": "tomato",
    "red-brown": "tomato"
};


export function get_points(ellipse_params) {
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
        point[1] * Math.sin(ellipse_params.angle) + ellipse_params.x,
        point[0] * Math.sin(ellipse_params.angle) +
        point[1] * Math.cos(ellipse_params.angle) + ellipse_params.y,
    ]);
}

export function convert_to_lonlat(x, y, lon0, lat0) {
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

export function lonlat_to_pixel(lon, lat, x0, y0, lon0, lat0) {
    const rln = re / Math.sqrt(1 + ((rp / re) * Math.tan(radians(lat0))) ** 2);
    const rlt =
        rln /
        (Math.cos(radians(lat0)) *
            (Math.sin(radians(lat0)) ** 2 +
                ((re / rp) * Math.cos(radians(lat0))) ** 2));

    // difference between image center to pixel in degrees
    let dlat = lat0 - lat;
    let dlon = lon0 - lon;

    if(dlon > 180) {
        dlon = dlon - 360;
    } else if (dlon < -180) {
        dlon = dlon + 360;
    }

    const dy = radians(dlat) / (pixscale / rlt);
    const dx = radians(dlon) / (pixscale / rln);

    return [dx + x0, y0 + dy];
}

export function Ellipse({ ellipse_params, lon0, lat0, color, children }) {
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


export const VortexEllipse = ({ vortex }) => {
    var loni = 360 - vortex.lon;
    if (loni < -180) {
        loni += 360;
    }
    if (loni > 180) {
        loni -= 360;
    }
    const ellipse_params = {
        x: vortex.x,
        y: vortex.y,
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

export function VortexPopup({ vortex }) {
    return (
        <Popup>
            <div className="flex flex-col container [&>span]:p-1">
                <span>
                    Sys III Lon/Lat: ({round(vortex.lon)}, {round(vortex.lat)})
                </span>
                <span>Color: {vortex.color}</span>
                <span>Perijove: {vortex.perijove}</span>
                <span>
                    Size: {round(vortex.physical_width / 1000)} km x{" "}
                    {round(vortex.physical_height / 1000)} km{" "}
                </span>
                <span># of classifications: {vortex.num_extracts} </span>
                <span>Vortex size confidence: {round(vortex.probability * 100)}% </span>
                <span>
                    <Link to={"/vortex/" + vortex.id}>See more</Link>
                </span>
            </div>
        </Popup>
    );
}