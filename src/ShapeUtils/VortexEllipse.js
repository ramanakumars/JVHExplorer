import { get_points, convert_to_lonlat, radians, colors } from "./GeoUtils";
import { Polygon, Polyline, Popup } from "react-leaflet";
import VortexPopup from "./VortexPopup";

export default function VortexEllipse({ vortex, opacity, filled = true }) {
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
            <Popup>
                <VortexPopup vortex={vortex} />
            </Popup>
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
