import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import React from "react";
import { convert_to_lonlat, sanitize_longitude } from "../ShapeUtils/GeoUtils";
import { Checkbox } from "../Inputs/Checkbox";
import VortexEllipse from "../Vortex/VortexEllipse";
import { useState, useEffect, useContext, useMemo } from "react";
import { API_query_extracts, API_query_vortices } from "../API/API";
import { SubjectMetadataContext } from "./Subject";
import { Extract } from "../API/types";
import { VortexDataType } from "../API/types";

export default function SubjectMap({}) {
    const [show_vortices, setShowVortices] = useState(false);
    const [show_extracts, setShowExtracts] = useState(false);
    const [vortices, setVortices] = useState<VortexDataType[]>([]);
    const [extracts, setExtracts] = useState<Extract[]>([]);
    const { subject_metadata } = useContext(SubjectMetadataContext);

    const perijove = subject_metadata?.perijove;

    const edge_pixels = [
        [-192, -192],
        [-192, 192],
        [192, 192],
        [192, -192],
        [-192, -192],
    ];
    const edge_lonlat = useMemo(() => {
        if (!subject_metadata) return [];

        return edge_pixels.map((pixel) =>
            convert_to_lonlat(
                pixel[0],
                pixel[1],
                sanitize_longitude(360 - subject_metadata.longitude),
                subject_metadata.latitude,
            ),
        );
    }, [subject_metadata]);

    useEffect(() => {
        if (!subject_metadata) return;
        API_query_extracts("subject_id=" + subject_metadata?.subject_id).then(
            (data) =>
                setExtracts(
                    data.rows.map((row) => {
                        return {
                            ...row,
                            x: 192 - row.x,
                            y: row.y - 192,
                            lon: subject_metadata.longitude,
                            lat: subject_metadata.latitude,
                            id: row.vortex,
                        };
                    }),
                ),
        );
    }, [subject_metadata]);

    useEffect(() => {
        if (extracts.length > 0) {
            const vortex_ids = extracts.map((extract) => extract.vortex);
            const unique_vortex_ids = vortex_ids.filter(
                (vort, index, arr) => arr.indexOf(vort) === index,
            );
            API_query_vortices("id__in=" + unique_vortex_ids.join(",")).then(
                (data) => setVortices(data.rows),
            );
        }
    }, [extracts]);

    return (
        <div className="w-full p-4 m-2 flex justify-center">
            <MapContainer
                center={[
                    subject_metadata?.latitude ? subject_metadata?.latitude : 0,
                    sanitize_longitude(
                        360 -
                            (subject_metadata?.longitude
                                ? subject_metadata?.longitude
                                : 0),
                    ),
                ]}
                zoom={5}
                scrollWheelZoom={true}
                className="!h-[800px]"
            >
                {vortices.length > 0 && (
                    <div className="w-96 absolute text-white right-10 top-10 bg-slate-500 z-[500] px-2 text-lg">
                        <Checkbox
                            value={show_vortices}
                            text={"Show vortices"}
                            name={"vortices"}
                            onChange={(e) => setShowVortices(!show_vortices)}
                        />
                        <Checkbox
                            value={show_extracts}
                            text={"Show classifications"}
                            name={"extracts"}
                            onChange={(e) => setShowExtracts(!show_extracts)}
                        />
                    </div>
                )}

                <TileLayer
                    minZoom={0}
                    maxZoom={5}
                    url={"/PJs/tiles/PJ" + perijove + "/{z}/{x}/{-y}.png"}
                    attribution=""
                />
                <Polyline
                    positions={edge_lonlat}
                    pathOptions={{ color: "black" }}
                    opacity={1}
                />

                {show_vortices &&
                    vortices.length > 0 &&
                    vortices.map((vortex) => (
                        <VortexEllipse
                            vortex={vortex}
                            key={vortex.id}
                            opacity={0.8}
                        />
                    ))}

                {show_extracts &&
                    extracts.length > 0 &&
                    extracts.map((vortex) => (
                        <VortexEllipse
                            vortex={{ id: vortex.vortex, ...vortex }}
                            key={"extract_" + vortex.vortex}
                            opacity={0.4}
                            filled={false}
                        />
                    ))}
            </MapContainer>
        </div>
    );
}
