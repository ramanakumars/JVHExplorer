import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { API_query_vortices } from "../API";
import VortexEllipse from "../ShapeUtils/VortexEllipse";

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
                    center={[0, 0]}
                    zoom={2}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        minZoom={0}
                        maxZoom={5}
                        url={"/PJs/tiles/PJ" + perijove + "/{z}/{x}/{-y}.png"}
                        attribution=""
                    />

                    {vortices.map((vortex) => (
                        <VortexEllipse vortex={vortex} key={vortex.id} opacity={0.5}/>
                    ))}
                </MapContainer>
            </div>
        );
    }
}