import React = require("react");
import { EllipseType } from "../API/types";
import { get_points, convert_to_lonlat } from "./GeoUtils";
import { Polygon, Polyline } from "react-leaflet";
import { colors } from "./GeoUtils";

interface EllipseProps {
    ellipse_params: EllipseType;
    lon0: number;
    lat0: number;
    opacity: number;
    filled: boolean;
    children: React.ReactNode;
}

const Ellipse = ({
    ellipse_params,
    lon0,
    lat0,
    opacity,
    filled,
    children,
}: EllipseProps) => {
    const points = get_points(ellipse_params);

    const PathComponent = filled ? Polygon : Polyline;

    const positions = points.map((point) =>
        convert_to_lonlat(point[0], point[1], lon0, lat0),
    );

    return (
        <PathComponent
            positions={positions}
            pathOptions={{
                color: colors[ellipse_params.color],
                opacity: opacity,
                weight: 2,
            }}
        >
            {children}
        </PathComponent>
    );
};

export default Ellipse;
