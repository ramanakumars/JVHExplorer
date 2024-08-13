import { get_points, convert_to_lonlat, round, radians, colors } from "./GeoUtils";
import { Link } from "react-router-dom";
import { Polygon, Polyline, Popup } from "react-leaflet";

export default function VortexEllipse({ vortex, opacity, filled=true }) {
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
            opacity={opacity}
            filled={filled}
        >
            <VortexPopup vortex={vortex} />
        </Ellipse>
    );
};

const Ellipse = ({ ellipse_params, lon0, lat0, color, opacity, filled, children }) => {
    const points = get_points(ellipse_params);

    const PathComponent = filled ? Polygon : Polyline;

    const positions = points.map((point) =>
        convert_to_lonlat(point[0], point[1], lon0, lat0)
    );

    return (
        <PathComponent positions={positions} pathOptions={{ color: color }} opacity={opacity} weight={2}>
            {children}
        </PathComponent>
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
