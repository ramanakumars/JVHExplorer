import { get_points, convert_to_lonlat, round, radians, colors } from "./GeoUtils";
import { Link } from "react-router-dom";
import { Polygon, Popup } from "react-leaflet";

export default function VortexEllipse ({ vortex, opacity=0.3 }) {
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
            <VortexPopup vortex={vortex} opacity={opacity}/>
        </Ellipse>
    );
};

const Ellipse = ({ ellipse_params, lon0, lat0, color, opacity, children }) => {
    const points = get_points(ellipse_params);

    const positions = points.map((point) =>
        convert_to_lonlat(point[0], point[1], lon0, lat0)
    );

    return (
        <Polygon positions={positions} pathOptions={{ color: color }} opacity={opacity}>
            {children}
        </Polygon>
    );
}

const VortexPopup = ({ vortex }) => {
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
