import { Link } from "react-router-dom";
import { round } from "./GeoUtils";

const VortexPopup = ({ vortex, link_enabled = true }) => {
    return (
        <div className="flex flex-col container [&>span]:p-1">
            <strong>Vortex: {vortex.id}</strong>
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
            {
                link_enabled &&
                <span>
                    <Link to={"/vortex/" + vortex.id}>See more</Link>
                </span>
            }
        </div>
    );
}

export default VortexPopup;