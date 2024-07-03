import { useEffect, useState } from "react";
import { MapContainer, Popup, ImageOverlay, Polygon } from "react-leaflet";
import { CRS } from "leaflet";
import { API_query_vortices } from "./API";
import { get_points, convert_to_lonlat, round, radians, colors } from './shape_utils'

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
        API_query_vortices(
            "_size=max&num_extracts__gte=8&perijove=" + perijove
        ).then((data) => setVortices(data.rows));
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
                        <VortexEllipse vortex={vortex} key={vortex.id} />
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

function VortexPopup({ vortex }) {
    return (
        <Popup>
            <div className="flex flex-col container [&>span]:p-1">
                <span>
                    Sys III Lon/Lat: ({vortex.lon}, {vortex.lat})
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
                    <a href={"/vortex/" + vortex.id}>See more</a>
                </span>
            </div>
        </Popup>
    );
}
