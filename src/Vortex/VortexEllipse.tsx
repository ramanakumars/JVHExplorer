import { radians } from "../ShapeUtils/GeoUtils";
import VortexPopup from "./VortexPopup";
import React from "react";
import { VortexDataType } from "../API/types";
import { Popup } from "react-leaflet";
import Ellipse from "../ShapeUtils/Ellipse";

interface VortexEllipseProps {
    vortex: VortexDataType;
    opacity: number;
    filled?: boolean;
}

export default function VortexEllipse({
    vortex,
    opacity,
    filled = true,
}: VortexEllipseProps) {
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
        color: vortex.color,
    };
    return (
        <Ellipse
            ellipse_params={ellipse_params}
            lon0={loni}
            lat0={vortex.lat}
            opacity={opacity}
            filled={filled}
        >
            <Popup>
                <VortexPopup vortex={vortex} />
            </Popup>
        </Ellipse>
    );
}
