import React, { useEffect, useState } from "react";
import { API_query_extracts, API_query_vortices } from "../API/API";
import { LoadingPage } from "../LoadingPage";
import SubjectImage from "../SubjectImage";
import { Link } from "react-router-dom";
import { colors } from "../ShapeUtils/GeoUtils";
import { Extract, VortexDataType } from "../API/types";
import VortexColorDistribution from "./VortexColorDistribution";
import VortexSizeDistribution from "./VortexSizeDistribution";
import VortexLocationDistribution from "./VortexLocationDistribution";

export default function Vortex({ vortex_id }: { vortex_id: string }) {
    const [data, setData] = useState<VortexDataType | null>(null);
    const [extract_data, setExtractData] = useState<Extract[]>([]);
    const [loading_enabled, setLoading] = useState(true);
    const [subject_ids, setSubjectIds] = useState<number[]>([]);
    const [vortex_color, setColor] = useState("red");

    useEffect(() => {
        API_query_vortices("id=" + vortex_id).then((_data) =>
            setData(_data.rows[0]),
        );
        API_query_extracts("_size=max&vortex=" + vortex_id).then((_data) =>
            setExtractData(_data.rows),
        );
    }, [vortex_id]);

    useEffect(() => {
        if (data && extract_data.length > 0) {
            setLoading(false);
        }
    }, [data, extract_data]);

    useEffect(() => {
        if (extract_data.length > 0) {
            setSubjectIds(
                extract_data
                    .map((extract) => extract.subject_id)
                    .filter(
                        (value, index, array) => array.indexOf(value) === index,
                    ),
            );

            let arr = extract_data.map((extract) => extract.color);
            let _color = arr
                .sort(
                    (a, b) =>
                        arr.filter((v) => v === a).length -
                        arr.filter((v) => v === b).length,
                )
                .pop();

            setColor(colors[_color as keyof typeof colors]);
        }
    }, [extract_data]);

    return (
        <div className="container m-2 p-2 flex flex-col">
            <LoadingPage enabled={loading_enabled} text={"Loading"} />
            {extract_data.length > 0 && (
                <div className="flex flex-row [&>span]:mx-2 justify-evenly">
                    <span>Vortex: {vortex_id}</span>
                    <span>Perijove: {extract_data[0].perijove}</span>
                    <span># of classifications: {extract_data.length}</span>
                    <span># of subjects: {subject_ids.length}</span>
                </div>
            )}
            <div className="container p-2 flex flex-wrap min-h-96">
                <VortexColorDistribution extracts={extract_data} />

                <VortexSizeDistribution
                    extracts={extract_data}
                    color={vortex_color}
                />

                <VortexLocationDistribution
                    extracts={extract_data}
                    color={vortex_color}
                />
            </div>
            <div className="container p-2 grid grid-cols-6 gap-2">
                {subject_ids.map((subject_id) => {
                    const extract_sub = extract_data.filter(
                        (extract) => extract.subject_id === subject_id,
                    );
                    return (
                        <Link
                            key={subject_id}
                            to={"/subject/" + subject_id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-800 hover:text-primary-300 hover:[&>div]:bg-primary-600"
                        >
                            <SubjectImage
                                subject_id={String(subject_id)}
                                extracts={extract_sub}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
